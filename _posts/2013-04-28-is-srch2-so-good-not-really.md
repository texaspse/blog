---
layout: post
title: Draft
author:
  login: nicolas
  email: nicolas@algolia.com
  display_name: nicolas
  first_name: Nicolas
  last_name: Dessaigne
---

[![Stopwatch](assets/Stopwatch-lowres-300x225.jpg)](https://blog.algolia.com
/wp-content/uploads/2013/04/Stopwatch-lowres.jpg)Srch2 has got some good press
coverage last week with their product launch. They were quite vocal in their
attack on Lucene and derivative products: "31 times faster than lucene 4.1",
"Srch2 wins. Period." But wait, are they really comparable? In some cases yes,
but they only cover a part of Elastic Search features (no faceting for
example). We didn't see any way to build a highly available search either.

They however have a positioning that is similar to Algolia: instant type
forward, error correction, geo-search, etc. We've been working with Algolia
for some time and were wondering how they compared. After taking a look we
discovered that if Srch2 has put emphasis on communication, Algolia has a
technological lead with:

  * A mature on-device SDK for mobile (iOS, Android, Windows Phone) and desktop (Windows, OS X) platforms already in use on on more than 1 millions devices.
  * A highly available backend as a service with automatic scaling.
  * An automatic distribution on multiple datacenters spread around the world. As Srch2 says in their white paper, "100ms is an upper limit for instant type forward to be effective". A close datacenter is thus mandatory since inter-continental latency is already much slower than that.

What about performance? We wanted to have a clear idea and built a small
benchmark.

## Benchmark settings

We chose to compare Srch2 and Algolia with a typical scenario: fuzzy queries
searching for small objects. We used a dump of cities downloaded from
geonames: 3M cities with the following info: name, country, admin codes,
population. The uncompressed dump was 250MB. Here are the compressed version
of the batches for Srch2 and Algolia.

Results may be different in other contexts, like web page indexing or big
document search. But it should be similar for most business applications
(e-commerce, travel, etc.)

We performed our tests on a Xeon E3-1230 with 16GB of RAM and 240GB of SSD, a
similar machine to what Algolia reported using.

We used nearly out-of-the-box settings for both products. We just indicated in
Srch2 conf file the list of fields to index. In Algolia settings, we reduced
the number of hits per page and changed the fuzzy settings to be closer to
Srch2.

## Indexing

In both cases, indexing is straitforward.

**Srch2**
**Algolia**

**Indexation time**
187s

 55s

**Index size**
640MB

 630MB

Algolia was more than 3 times faster to index with a very similar index size.

## Searching

Here are the response times we observed. We actually report the server time as
reported by each product to discard any difference in latency to the servers.
We also added a column for Algolia to have comparable results. By default,
fuzzy search in Algolia tolerates 1 typo when words have between 3 and 6
characters, and 2 typos for 7 characters and more. With a setting at 4/8, we
obtain a similar behavior to Srch2.

**Srch2**
**Algolia**
**Algolia (at 4/8)**

**s**
237ms

1ms

1ms

**sa**
46ms

1ms

1ms

**s f**
41ms

7ms

7ms

**san**
10ms

1ms

1ms

**san frqncisco**
4ms

16ms

6ms

**sqn frqncisco**
**no result** (3ms)
6ms

**no result** (1ms)

**los ang**
2ms

13ms

1ms

**los angeles**
1ms

15ms

1ms

**loz angeles**
**no result** (2ms)
14ms

**no result** (1ms)

Response times are really impressive with both products. Out of  very short
queries (one or two characters) where Algolia is much faster, latency will
actually be the key factor in response time.

## Out-of-the-box Relevance

Response time is important, but relevance is even much more important and they
have radically different approaches. From our understanding, Srch2 use a
classic lucene like approach. While it is suitable for document search it has
many pitfalls for small objects search.

In short, the score of a hit is a float resulting of a tf.idf calculation. You
can influence it by boosting specific attributes. The major problem of this
approach is the use of a float. What if you want to first retreive results by
city name and then by country? You need to spend time to determine the value
of each boost.

And it may get worse. What if you want to sort your resulting cities by their
population? You cannot mix it with relevance. Worse, the typo tolerance
influence only the relevance, so if for example you search for the city
"Pablo" in Montana, you would get "Sao Paulo" as first result as its
population its greater.

A last concern is about proximity of query words in the hit. It seems there is
no boost for that. The query "s f" for example retrieve hits with a matching
prefixes "s" and "f" in different attribute before to retrieve the expected
"San Francisco".

Algolia took a very different approach. They don't use any float and ranking
is determined by a set of criteria that you can reorder. By default, criteria
are in this decreasing order of importance:

  * The number of typos corrected to match the entries. The less typos, the better the result.
  * The geographical distance when retrieving objects around a specific position.
  * The position of the first matched word. If your query matches the first word of the first attribute this is better than following words.
  * A user defined score (here population)

You thus get an excellent out-of-the-box relevance that mixes many criteria
while still being able to customize it. There is just one case when the tf.idf
approach is better: when you search for documents with a lot of content.

There is one case in which Srch2 may have a better relevance than Algolia:
search for documents with a lot of content. We wonder if Elastic Search may
not be a better option in that case however as it comes with many additional
features.

## Ease of use

Srch2 has been done with the same mind-set as Lucene. A drawback is that
configuration requires expertise and a lot of iterations to be correctly
defined.

Algolia offers a backend as a service and not a on-premise software. Settings
are only used when necessary and represent a few lines of JSON at max. A few
minutes are enough to start indexing.

## Conclusion

It sounds like the search space is heating up. Srch2 and Algolia share similar
belief that instant search is of crucial importance for applications. And we
share the same belief too!

Of course, we did this benchmark with no intrinsic knowkedge of either product
and we may obtain different results with expert tuning. We welcome comments
and would be happy to rerun the tests.

Algolia seems to be a clear winner in tech. They however don't seem to have
the same ability to communicate about their products. Hope they'll progress
quickly on that point.

