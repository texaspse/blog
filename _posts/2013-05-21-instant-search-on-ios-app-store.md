---
layout: post
title: Instant Search through the iOS App Store
author:
  login: julien
  email: julien.lemoine@algolia.com
  display_name: julien
  first_name: Julien
  last_name: Lemoine
---

[![App Store](assets/appstore.jpg)](http://www.algolia.com/demo/appstore/)If
you have an iOS device you probably search the App Store regularly for apps
you have heard about. Following the recent AppGratis ousting from the
AppStore, there were claims that the App Store search function is broken. That
was our trigger to try something ourselves that could serve both as a good
demo and help us to explore new use-cases! [Check it
out!](http://www.algolia.com/demo/appstore/)

## Obtaining the data

So first, we needed to obtain the data. Apple provides an API to accredited
developers, but given that this can be fairly difficult to attain, we
considered other solutions. Crawling was our second option, but that approach
has its own caveats: you need to play nice with their servers or you get
banned (very) quickly. We didn't want to spend days implementing our own
distributed crawler and definitely didn't have the time to do a sequential and
polite crawling. It is in these moments that you are glad to have an external
team to do the job for you.

We chose to perform the crawling with [grepsr](http://www.grepsr.com), a
service we found via a simple Google search. After a few exchanges we were
confident that they were up to the job, and they ended up exceeding our
expectations. Not only did they crawl the pages, but they also scraped the
apps' attributes to provide us with a clean dataset. After a few days we had
our full dataset ready for indexing.

## Indexing

Indexing was actually the easiest part. We uploaded the data in JSON format to
our backend and used these simple settings:

    
    {
    "attributesToIndex": ["name", "author", "category"],
    "attributesToHighlight": ["name", "author","category", "description"],
    "customRanking": ["desc(score)", "asc(name)"]
    }

Our dataset included the 630k applications currently published in the US app
store. For each of them we index the name, author and category, but also
include their icon, score, and description for display and sorting.

The score is a simple computation between the number of comments and the
average ranking: `rating * log2(nbComments) * 10000`.

## Searching

Similar to our [CrunchBase demo](http://blog.algolia.com/instant-search-on-
crunchbase/), we trigger a query directly after page load and again after each
keystroke. Additional queries are automatically triggered when scrolling to
the bottom of the page.

[Guillaume Esquevin](http://platypus-creation.com) did the front-end for us
and a first version of the demo was up and ready in no time. Take a look at
how simple and fast it is to search for an app!

In the end we did receive access to the Apple API, which we may use later on
to keep the data in sync.

