---
title: Retrofitting Async/Await in Go 1.18
date: 2022-02-20T09:31:43Z
description: It is idiomatic to use channels in Go, so why do we need async/await?
---

> TL; DR: Why I think async/await might have a place in Golang, and we don't even need a new syntax.

# A mistake

Let me start this blog by observing one common mistake I found among people who are new to Golang, say if we have an API that sets some data from a data store:

```go
func SetKeyValue(key string, value string) error
```

And you want to write to the data store unblockingly in your program. What do you do? Like this?

```go
go SetKeyValue("hello", "world") 
```

It seems natural, right? Yeah, I have seen this in actual production code. But this irritates me a bit because we ignore potential errors that this function might return. Shouldn't we at least log the error if we ever encounter any? This requires us to wrap the above call into an [IIFE](https://golangbyexample.com/immediately-invoked-function-go/).

```go
go func() {
   err := setKeyValue("hello", "world")
   if err != nil {
       logs.Error("error happened: %v", err) 
   } 
}()
```

So here is the mistake: I rarely think it is okay to call a function with just a `go` keyword. In the real world of a backend engineer, you are almost always calling a function that might return an error. We need to treat them with respect.

# Getting Data Asyncly

Now, what about getting data from some data store? For example, if you need to query two or three data sources, you typically do not want to write sync code that reads them one by one. Instead, you use goroutine to help you parallelise the queries. 

```go
// signature of the get data api
func GetDataAsInt(key string) (int, error)

// Sync code
hello, err := GetDataAsInt("hello")
if err != nil {
  // logging error 
}
foo, err := GetDataAsInt("foo")
if err != nil {
  // logging error
}
```

And to make this block of code async we usually do:

```go
resultChan := make(chan int)
errChan := make(chan error)

var wg sync.WaitGroup()
wg.Add(2)

go func() {
  defer wg.Done()
  hello, err := GetDataAsInt("hello")
  resultChan <- hello
  errChan <- err
}()

go func() {
  defer wg.Done()
  foo, err := GetDataAsInt("foo")
  resultChan <- foo
  errChan <- err
}()

wg.Wait()
```

This is a simplification. I have left out the code that reads the errors and results out of the channels. But you can already see this is quite a bit more complex than the sync version. There is a lot of syntactic noise, we need to wrap the function we want to call in an IIFE or a function, we need to attach the go keyword to indicate we want to call this function asyncly, and then we need to use channels to collect the result. On top of this, we need to add a WaitGroup so we are sure both goroutines finished their work. 

Wait, wait... getting data asyncly should be easy right? This pattern is so common that some other languages have a special syntax for it -- async/await! The equivalent of the above program in Javascript will look like this:

```javascript
async function GetDataAsIntAsync(key) {
  ...
}

// inside an async function
hello = await GetDataAsIntAsync("hello")
foo = await GetDataAsIntAsync("hello")
```

I feel this is much cleaner. Can we have this in Golang? Probably not before Golang 1.18, but with the introduction of Go Generics, I feel we might be onto something. We've already [talked about](https://csgrinding.xyz/go-result-1/) the `Result` type in Golang, but can we take it further? Luckily someone already did! I recently found this [repo](https://github.com/nkcmr/async) and I think it is promising.

# Aync/Awit in Go

Let's first look at some examples:

```go
import (
    "context"
    "code.nkcmr.net/async"
)

type MyData struct {/* ... */}

func AsyncFetchData(ctx context.Context, dataID int64) async.Promise[MyData] {
    return async.NewPromise(func() (MyData, error) {
        /* ... */
        return myDataFromRemoteServer, nil
    })
}

func DealWithData(ctx context.Context) {
    myDataPromise := AsyncFetchData(ctx, 451)
    // do other stuff while operation is not settled
    // once your ready to wait for data:
    myData, err := myDataPromise.Await(ctx)
    if err != nil {/* ... */}
}
```

So this library introduced a new interface `Promise` and a function, `NewPromise`, to turn a sync function to a promise which can be awaited. Using these tools we can turn the above code of ours to:

```go
func AsyncGetDataAsInt(ctx context.Context, key string) async.Promise[int] {
  return async.NewPromise(func() (int, error) {
    return GetDataAsInt(key)
  })
}

helloPromise := AsyncGetDataAsInt(ctx, "hello")
fooPromise := AsyncGetDataAsInt(ctx, "foo")

hello, err := helloPromise.Await(ctx)
if err != nil { /* ... */ }
foo, err := fooPromise.Await(ctx)
if err != nil { /* ... */ }
```

Obviously, this is less verbose than the channel version. How does this work? Internally the `NewPromise` function is actually calling our function asyncly, and everything is stored in a internal type called `syncPromise`:

```go
// Taken from: https://github.com/nkcmr/async/blob/main/async.go
// NewPromise wraps a function in a goroutine that will make the result of that
// function deliver its result to the holder of the promise.
func NewPromise[T any](fn func() (T, error)) Promise[T] {
	c := &syncPromise[T]{
		done: make(chan struct{}),
	}
	go func() {
		c.v, c.err = fn()
		close(c.done)
	}()
	return c
}
```

Definition of `syncPromise`:

```go
// Taken from: https://github.com/nkcmr/async/blob/main/async.go

type syncPromise[T any] struct {
	done chan struct{}
	v    T
	err  error
}

func (s *syncPromise[T]) Await(ctx context.Context) (T, error) {
	select {
	case <-ctx.Done():
		var zerov T
		return zerov, ctx.Err()
	case <-s.done:
		return s.v, s.err
	}
}

func (s *syncPromise[T]) Settled() bool {
	select {
	case <-s.done:
		return true
	default:
		return false
	}
}
```

Note that when the function finished its work, it close the channel `c.done`. This will mean `c.done` is immediately ready for communication. Thus the `select` statements in `Await` and `Settled` will be using the clause in `case <-s.done`.

# Conclusion

Although this library is still experimental, I feel it has great potential. I will invest time to play around it. And I hope one day its usage will be common in Golang's world. 