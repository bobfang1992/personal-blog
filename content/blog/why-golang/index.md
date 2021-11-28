---
title: Why Go?
date: 2021-11-28T11:58:37Z
description: Why would you choose Golang for your company?
---

> 💡 I am going to use Golang to refer to what is known as the Go programming language, simply because it is more search engine friendly. 

There are two **new** languages[^1], that comes out of the 2010s era as strong winners, [Golang](https://go.dev/) and [Rust](https://rust-lang.org/). While Rust is apparently the new lover of the developer community, I think Golang has enjoyed more commercial success. For example some of the biggest unicorns coming out of this age are using Golang as their main language: Coinbase, Twitch, Uber and where I work: Tiktok.

But why? Why Golang? Obviously Golang is very opinionated language, and one has to admit that some choices made are not not appealing to everyone. Some problems are mentioned repeatably, which I will nonetheless mention again here as I personally find them hard to swallow as well.

# Generics

Supporting generics is so essential in building modern software, but Golang only starts to support them in the upcoming release, 1.18. That is almost a decade after its initial release. I think no one enjoys writing the following code when other languages can provide similar functionality easily with parametric polymorphism. (It is a humor piece, I know.)

![](golang-generic.gif)

# Error handling

I am not going to say that exception is a wonderful thing, and every language should have them. Also `Option` or `Maybe`types have their own pros and cons, and may not be suitable for every scenario. But Golang community's choice of using `if err != nil` just seems pretty primitive these days. I think the Golang community even tried to compensate the lack of proper error handling by inventing a new coding style, called ["the happy path"](https://maelvls.dev/go-happy-line-of-sight/). It is a nice try, and maybe to some extend it make sense, but still I would prefer we are not forced to check error codes for every single function call...

# No default or optional arguments

So people start using pointers to represent an optional argument. I think I have seen and even written a number of functions that looks like this:

```go
func doSomething(..., int* mode) {
    if mode == nil {
        mode = 1    
    }
    ...
}
```

Just so that the caller can optionally choose to not pass in a parameter, but still this is unsatisfying,  user still need to pass `nil` for `mode` here to actually make their code compiles, but this is already much better than other options listed in this [SO answer](https://stackoverflow.com/questions/2032149/optional-parameters-in-go), like making your function to accept variadic args, an map of `interface{}` or a special `struct`.

# No dedicated enum types

Again, Golang community will come up (or has already come up) with all sorts of excuses that why this is not needed. But I think [this example](https://debugged.it/blog/go-is-terrible/#no-enums) has perfectly summed up the problem with not having a syntax construct for defining "clean" enums. I just cannot understand why we still need to leave with C-style unscoped enums in 2021.

# Arrogant library design

 Can you guess what does this line do?

```go
fmt.Println(t.Format("20060102150405"))
```

It formats a `datetime` object to `yyyyMMddHHmmss` format. But what is the deal with that special number? It seems that Golang core team has decided a specific time point, `"2006-01-02T15:04:05Z07:00"` is more readable than universal `"yyyyMMddHHmmss"` as a time format directive. Why? I can hardly imagine. But I can only underestimate how much energy are wasted to adopt to this style, which are forced upon many programmers through the standard library.

---

The list can go on, but let me stop here, as no programming language is perfect. I think you got the idea, Golang has some real issues it needs to deal with, but still it has become very successful. So why? What's the benefit? Why people like/still uses it despite its flaws?

---

# Money

One factor that should not go unnoticed it that it has a trillion-dollar company's backing. I think it should be universally acknowledged by now that not every language are created equal. Apple has `Objective-c/Swift`, and Google itself has backed `Kotlin` and `Dart`. These languages all enjoyed some level of popularity. Are they the best languages? Maybe, maybe not. But if you want a language that are well maintained, and has the possibility of evolving, you would choose one that has some commercial backing, right? 

# Concurrency

Some would argue that Golang has been successful for concurrency. The appeal comes from being able to launch thousands of goroutines, each serving one user, without running into major memory or CPU limitations. In the beginning of the decade the industry were facing the [C10k problem](https://en.wikipedia.org/wiki/C10k_problem). Golang cleverly provided an escape from this, by providing a new primitive, goroutines, that:

* are fast to launch, usually an order of magnitude faster than OS-level threads

* have smaller memory foot-print, only 4k stack size initially but can grow as needed

* have little need for manual control: users are not required to manually join a goroutine, GC will take care of most of the work when a goroutine finishes its work.

These options, when provided in the early 2010s, are much better than the alternatives, where the only option to get some kind of concurrency is to use low-level OS threads, possibly forcing you to implement a thread-pool so your service does not blow up the memory usage when there are many connections.

But are goroutines so special that it makes Golang the only scalable language? I think not. Recent years has seen the rise of async programming, notably first in `node.js` but later in `Python` and `C++`. More and more languages are incorporating coroutines natively and goroutines are nothing but just another type of them, see below excerpt from [the Golang doc](https://go.dev/doc/faq#goroutines).

> Goroutines are part of making concurrency easy to use. The idea, which has been around for a while, is to multiplex independently executing functions—coroutines—onto a set of threads. When a coroutine blocks, such as by calling a blocking system call, the run-time automatically moves other coroutines on the same operating system thread to a different, runnable thread so they won't be blocked. The programmer sees none of this, which is the point. The result, which we call goroutines, can be very cheap: they have little overhead beyond the memory for the stack, which is just a few kilobytes.
> 
> To make the stacks small, Go's run-time uses resizable, bounded stacks. A newly minted goroutine is given a few kilobytes, which is almost always enough. When it isn't, the run-time grows (and shrinks) the memory for storing the stack automatically, allowing many goroutines to live in a modest amount of memory. The CPU overhead averages about three cheap instructions per function call. It is practical to create hundreds of thousands of goroutines in the same address space. If goroutines were just threads, system resources would run out at a much smaller number.

So IMO basically Golang is just one step ahead of other language on this front, by providing a cheap and easy-to-use coroutine primitive that none other languages were providing. And there is no deny that Golang's goroutine implementation is outstanding, the goroutine scheduler works like a charm specially. I think this is the reason that Golang has won a large user base who has the need to write concurrent code, especially for things like networking or distributed systems. It is then no wonder that this is the area where Golang has enjoyed a great success, building cloud native infra like `docker`, `kubernetes` and online real-time services like `Uber`, `Twitch` or `Tiktok`.

Many would argue that first class channels, or the general adoption of [CSP](https://en.wikipedia.org/wiki/Communicating_sequential_processes) has made writing concurrent code easier in Golang, I am not going to say that I disagree, because I do not think I have enough experience against the claim. But I would not say I support it either. For two major reasons:

1. We are still using a fair bit share-memory communication in Golang still. The `sync` package can be seen used very commonly in any Golang repo, where people use concurrency primitives like `Lock` or `Waitgroup` to coordinate goroutines.

2. For myself, when using a goroutine, the most common use case would be to fetch something from a remote http/rpc service, so there is not much need to do inter-goroutine coordination using channels as no data is shared. Usually we just need to use one channel to get the result back. So I have not faced a scenario where I can use channels to simply the logic. And often in this case I will miss more widely adopted `async/await` pattern where the result can be just returned by the goroutine like a normal function.

So I am not convinced that channels make everything better. I see why they are useful, but I do not see why they cannot be implemented as libraries in other languages.

# Build, Performance and Deployment

Golang's compiler is unreasonably fast. Compiling a project with 131 files and more than 26k lines of code only take less than 5 seconds on my local machine. This is much much better than any C++ compilers out there, and although I am not a Java™ user I am pretty certain that none of the Java compilers can achieve the same level of performance either. 

How about interpreted language, you ask, as they do not need to be compiled. Well, that's true but they have a much slower run-time performance, and larger memory foot-print. I am not going to bore you with just another benchmark which make no sense in real world, but from my experience Golang do have an edge here.

Golang has another advantage over interpreted languages which is when deploying, you often just need to send one binary file to the server, without needing to install a number of dependencies first. This may seems trivial but if you have tried package a Python service into a docker container, you will often be amazed the (large) disk space you need.

# Conclusion

I have some mixed feeling of Golang at this moment, on the one hand it is really primitive. Using it feels like using a knife in a battle field when everyone else are already using laser guns. But it do has something that other language cannot offer at this moment: a fast compiler, a very performant coroutine implementation (special call out to its [GMP scheduler](https://docs.google.com/document/d/1TTj4T2JO42uD5ID9e89oa0sLKhJYD0Y_kqxDv3I3XMw/edit)), an active community and a few killer apps like `docker` and `k8s`.

I guess ultimately the big question is that if I am just building a web service that does not need to serve millions of users at the same time, will I choose Golang? Probably not as then Python is much more ergonomic (with its async support) and I am pretty sure the developer productivity boost will outweigh the run-time performance degradation. But if you are a large company and you do need to think about the money saved on using less memory and CPU? Maybe, just maybe, Golang will make it worthwhile for you. 

[^1]: Some may argue the most successful language of this era is Python, because of the rise of machine learning and data science. But remember Python is an "old" language, it just celebrated its 30th birthday. Here we emphasis the real new languages of the past decade.
