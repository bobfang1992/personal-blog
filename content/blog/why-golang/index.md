---
title: Why Go?
date: 2021-11-28T11:58:37Z
description: Why would you choose Golang for your company?
---

There are two **new** languages[^1], that comes out of the 2010s era as strong winners, [Golang](https://go.dev/) and [Rust](https://rust-lang.org/). While Rust is appreantly the new lover of the developer community, I think Golang has enjoyed more commercial success. For example some of the biggest unicorns coming out of this age are using Golang as their main language: Coinbase, Twitch, Uber and where I work: Tiktok.

But why? Why Golang? Apperantly Golang is very opinionated language, and one has to admit that some choices made are not not appealing to everyone. Some problems are mentioned repeatly, which I will notheless mention again here as I personally find them hard to swallow as well.

# Generics

Supporting generics is so essential in building software, but Golang only starts to support them in the upcomping release, 1.18. That is almost a decade after its initial release. I think no one enjoys writing the following code when other languages can provide similiar functionality easily with parametric polymorphism. (It is a humor piece, I know.)
![](golang-generic.gif)

# Error handling, or the lack of it

I am not going to say that exception is a wonderful thing, and every language should have them. Also `Option` or `Maybe`types may have their own pros and cons, and may not be suitable for every scenario. But Golang community's choice of using `if err != nil` just seems pretty primitive these days. 



# No default arguments



[^1]: Some may argue the most successful language of this era is Python, because of the rise of machine learning and data science. But remember Python is an "old" language, it just celebrated its 30th birthday. Here we emphasis the real new languages of the past decade.
