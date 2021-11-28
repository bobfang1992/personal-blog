---
title: Why Go?
date: 2021-11-28T11:58:37Z
description: Why would you choose Golang for your company?
---

There are two **new** languages[^1], that comes out of the 2010s era as strong winners, [Golang](https://go.dev/) and [Rust](https://rust-lang.org/). While Rust is apparently the new lover of the developer community, I think Golang has enjoyed more commercial success. For example some of the biggest unicorns coming out of this age are using Golang as their main language: Coinbase, Twitch, Uber and where I work: Tiktok.

But why? Why Golang? Obviously Golang is very opinionated language, and one has to admit that some choices made are not not appealing to everyone. Some problems are mentioned repeatably, which I will nonetheless mention again here as I personally find them hard to swallow as well.

# Generics

Supporting generics is so essential in building modern software, but Golang only starts to support them in the upcoming release, 1.18. That is almost a decade after its initial release. I think no one enjoys writing the following code when other languages can provide similar functionality easily with parametric polymorphism. (It is a humor piece, I know.)
![](golang-generic.gif)

# Error handling

I am not going to say that exception is a wonderful thing, and every language should have them. Also `Option` or `Maybe`types have their own pros and cons, and may not be suitable for every scenario. But Golang community's choice of using `if err != nil` just seems pretty primitive these days. I think the Golang community even tried to compensated the lack of proper error handling by inventing a new coding style, called ["the happy path"]([Go Happy Path: the Unindented Line of Sight | maelvls dev blog](https://maelvls.dev/go-happy-line-of-sight/)). It is a nice try, and maybe to some extend it make sense, but still I would prefer we are not forced to check error codes for every single function call...

# No default or optional arguments

So people start using pointers to represent an optional argument. I think I have seen written a number of code that looks like this:

```go
func doSomething(..., int* mode) {
    if mode == nil {
        mode = 1    
    }
    ...
}
```

Just so that the caller can optionally choose to not pass in a parameter, but still this is unsatisfying,  user still need to pass `nil` for `mode` here to actually make their code compiles, but this is already much better than other options like making your function to accept variadic args, an map of `interface{}` or use a special `struct` for your function's input listed in this [SO answer]([overloading - Optional Parameters in Go? - Stack Overflow](https://stackoverflow.com/questions/2032149/optional-parameters-in-go))

# No dedicated enum types

Again, Golang community will come up with all sorts of excuses that why this is not needed. But I think [this example]([Go is a terrible language | Have you Debugged.IT?](https://debugged.it/blog/go-is-terrible/#no-enums)) has perfectly summed up the problem with not having a syntax construct for defining "clean" enums. I just cannot understand why we still need to leave with C-style unscoped enums in 2021.











[^1]: Some may argue the most successful language of this era is Python, because of the rise of machine learning and data science. But remember Python is an "old" language, it just celebrated its 30th birthday. Here we emphasis the real new languages of the past decade.
