---
layout: post
title: 'Ranking Algorithm Unveiled: How Algolia Makes Search Better'
author:
  login: nicolas
  email: nicolas@algolia.com
  display_name: nicolas
  first_name: Nicolas
  last_name: Dessaigne
---

Most search engines rank results based on a unique float value that is hard,
if not impossible, to decipher. This is because their ranking algorithm has
been designed for document search. They take into account the number of
occurrences of query words in matching documents to determine their relevance,
usually using a [tf-idf](http://en.wikipedia.org/wiki/Tf%E2%80%93idf) based
scoring.

We designed Algolia with database search as our main use-case. The foremost
impact of this design decision is that we don't care about the number of
occurrences of query words. Instead of assigning a global float score to each
result, our ranking algorithm rates each matching record on several criteria
(such as the number of typos or the geo-distance), to which we individually
assign a integer value score.

You even have the option to assign a custom criterium, allowing you to
consider additional factors for your ranking, instead of applying a
superficial boost has nothing to do with the ranking and that can seriously
muddy your results.

Here is how it works:

  * All the matching records are sorted according to the first criterion.
  * If any records are tied, those records are then sorted according the second criterion.
  * If there are still records that are tied, those are then sorted according to the third criterion
  * and so on, until each record in the search results has a distinct position.

A record’s score on each criterium is explicitly listed in the search results
(see _rankingInfo  below for the query "the rains"), so you can understand why
one record ranked higher than another one. We will explain each of these
criteria in this article.

    
    "hits": [
    {
        "name": "The Rains Came",
        "url": "/title/tt0031835/",
        "rating": 6.8,
        "year": "(1939)",
        "nb_voters": 881,
        "rank": 16232,
        "objectID": "24324",
        "_highlightResult": {
            "name": {
                "value": "<em>The</em> <em>Rains</em> Came",
                "matchLevel": "full"
            },
            "year": {
                "value": "(1939)",
                "matchLevel": "none"
            }
        },
        "_rankingInfo": {
            "nbTypos": 0,
            "firstMatchedWord": 0,
            "proximityDistance": 1,
            "userScore": 2379657,
            "geoDistance": 0,
            "geoPrecision": 1,
            "nbExactWords": 2
        }
    },
    ...

## Search-as-you-type

Before diving into our "secret sauce", you first need to understand that
Algolia searches for matching prefixes, not matching whole-words. For example,
if you are searching for “Joe B”, we would consider all the following records
as matches:

  * **Joe B**lack
  * **Joe B**enson
  * **Joe B**olick

Prefix matching is what enables us to return relevant results even when a user
has only typed a single letter. When Google introduced instant search, they
claimed that showing results before you finish typing can save 2-5 seconds per
search.

Note: By default, when the query contains multiple terms, Algolia only uses
the last term as a prefix. This is because when searching, say, for a person
by name, it's quite normal to type their entire first name but not their last
(e.g George Cloo). Not so for the reverse (e.g. Geo Clooney). You can override
this behavior by setting  queryType=prefixAll .

## Ranking algorithm criteria

By default, Algolia ranks every matching record by using the following
criteria, in the order listed below. The higher up the criterion on the list,
the more importance it has on ranking. You can easily change this order if you
want, but we have found that this default order is the best one in 90% of the
use cases.

  1. Typos
  2. Geo-location (if applicable)
  3. Proximity
  4. Attributes
  5. Exact
  6. Custom

Let's understand each one of these criteria by applying them to an example:

    
    [
      {
        "objectID": 1,
        "name": "Jo Blak",
        "company": "Utility Trailer Sales",
        "nbCalls": 4
      },
      {
        "objectID": 2,
        "name": "Jo T. Black",
        "company": "Steritek Inc",
        "nbCalls": 45
      },
      {
        "objectID": 3,
        "name": "Joe Black",
        "company": "Pip Printing",
        "nbCalls": 9
      },
      {
        "objectID": 4,
        "name": "Joe Thompson",
        "company": "Black Birds inc",
        "nbCalls": 9
      },
      {
        "objectID": 5,
        "name": "Deanna Gerbi",
        "company": "Thompson, Joey & Blackburn ltd",
        "nbCalls": 7
      }
    ]

### 1. Typos

Are there words that start (that is, are prefixed) with a term typed by the
user? And if so, do they match exactly the query?

  * 0 points means there are prefixes that exactly match all the terms in the query.
  * 1 point means there is a 1-character discrepancy between the matching prefixes and the query terms.
  * 2 points means there is a 2-character discrepancy, and so on.

Example: for the query “joe black”, here is how each result would rank for
typos only (joey is considered as a typo as only the last word of the query is
searched as a prefix):

**Rank**

**Record**

**Score**

**Why**

1

record 3

0

**joe** **black**

1

record 4

0

**joe** thompson **black** birds inc** **

1

record 5

1

thompson,** joe_** & **black**burn ltd

2

record 2

1

**jo**_ t. **black**

3

record 1

2

**jo**_ **bla**_**k**

Note: By default, Algolia accepts 1 typo for words having at least 3
characters and 2 typos for words having at least 7 characters (this behavior
can be configured withminWordSizefor1Typo  andminWordSizefor2Typos  query
parameters). This means that the query "ab" only matches words starting with
"ab", while the query "abc" matches words starting by "abc" but also "aba",
"abb", "aac", etc.  A typo is defined by an insertion, deletion, or
substitution of a single character, or a transposition of two adjacent
characters ([Damerau–Levenshtein
distance](http://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance)).
As it is extremely unusual to mistype the first character of a word, a typo on
the first character counts for 2 points instead of 1.

### 2. Geo-location (if using)

Is the record found within a certain radius of the specified location? And if
so, how far from it? The geoDistance  score is expressed in meters, the
shorter the better.

However, you may want to consider results "100m distant" and "102m distant"
equal for ranking consideration. To do so, you can use the aroundPrecision
query parameter. For example, with aroundPrecision=10 , two results up to 10
meters close will be considered equal.

We don't use geo-location in our example, but you can find a dedicated
[guide](https://www.algolia.com/doc#Geo-Search) in our documentation.

### 3. Proximity

For a query that contains two or more words, how physically near are those
words in the matching record?

Algolia adds 1 point for each word in between query words, with a maximum of 8
points.

  * 0 points means no proximity: there was only one word in the query.
  * 1 point means the best possible match: the words are next to each other.
  * 2 points means there is one word between the matched query words.
  * and so on.

When words are in different attributes they get automatically the maximum of 8
points per new attribute. So if three query words are in three different
attributes, the score is 16. If three words are in two different attributes,
the score is 8.

In our example, we have a 3-way tie between records 1, 3 and 5 ('&' is
considered as a separator and is not taken into account). Record 2 has a word
in between the matched query words (Jo T. Black), while record 4 matches in
two different attributes:

**Rank**

**Record**

**Score**

1

record 1

1

1

record 3

1

1

record 5

1

1

record 2

2

2

record 4

8

### 4. Attributes

This is the order of the attributes (fields) Algolia will follow to search
inside a record. Records where there is a match in the 1st listed attribute
rank higher (that is, gets fewer points) than records with a match in an
attribute that’s lower on the list.

Depending of the first matching attribute, results will get a score in a
specific range:

  * 1st attribute: 0-999 points
  * 2nd attribute: 1000-1999 points
  * 3rd attribute: 2000-2999 points
  * and so on.

The exact number of points are determined by the position of the first
matching word in the attribute:

  * 1st word in attribute: 0 
  * 2nd word in attribute: 1
  * 3rd workd in attribute: 2

In our example, say we consider the name as more important than the company.
We would then use the setting attributesToIndex:["name", "company"] to
indicate that we want to index, i.e. search in, the attributes "name" then
"company", in this specific order of importance.

**Rank**

**Record**

**Score**

1

record 1

0

1

record 2

0

1

record 3

0

1

record 4

0

2

record 5

1001

Lastly, matching text at the beginning of a given attribute will be considered
more important than matching text further in this attribute. You can disable
this behavior if you add your attribute inside unordered(AttributeName). If we
considered the position of the match not relevant for the attribute "company",
we would use the setting attributesToIndex:["name", "unordered(company)"] . In
that case the "attribute score" of record 5 would be 1000 and not 1001.

### 5. Exact

Records with words (not just prefixes) that exactly match the query terms rank
higher. A record gets 1 point for every word that is exactly matched.

Here is how our records would rank based on exact-matching alone for the query
"joe black":

**Rank**

**Record**

**Score**

**Why**

1

record 3

2

**joe** **black**

1

record 4

2

**joe** tompson** black **bird inc

2

record 2

1

jo t. **black**

3

record 1

0

3

record 5

0

### 6. Custom / Business metrics

At this stage, the previous five criteria have ascertained a record's
relevance for a user's search query. Now you can specify additional criteria.

A common approach is to use one or several business metrics that express the
popularity of a record. With other search engines, you have to choose between
sorting the results according to their relevance to the user's query, or
according to their popularity (number of visits, ratings, sales, etc). You
just cannot do both. This means users may get results that are outrageously
popular, but completely irrelevant to their search.

With Algolia, you can integrate popularity (or anything else, like population,
or the last date of update) into the relevance calculation. To us, it is just
an additional criterium so it will not outweigh classic relevance criteria.
The ranking will just make additional sense.

In our example, we may consider people with whom we had many calls more
popular than others. For people having the same number of calls, we can just
order them by alphabetical order. We would then use the setting:
customRanking:["desc(nbCalls)", "asc(name)"]

For this criterium alone, here's how our example records rank:

**Rank**

**Record**

**Score**

**Why**

1

record 2

4

nbCalls=45

2

record 3

3

nbCalls=9, "Joe B"  < "Joe T"

3

record 4

2

nbCalls=9

4

record 5

1

nbCalls=7

5

record 1

0

nbCalls=4

The score is actually the order of entries in the index (biggest score being
first). There is never equal scores for this criterium. Therefore, custom
should always be the last criterium of your ranking as no subsequent criterium
would ever be checked.

Note: Custom ranking is computed at index time (for performance reasons) and
cannot be changed dynamically with each query. If you need to change the
ranking depending on context, you need to create one index per desired ranking
formula. Algolia proposes a master/slave feature to ease the task of keeping
several indices in sync. You only need to push your updates to the master and
they are automatically replicated to the slave indices (see the slaves
parameter in [index
settings](https://www.algolia.com/doc/rest_api#GetSettings)).

## Determining the overall rank

Let us know determine the exact ranking of our query "joe black".

**1. Typos**: After looking at typos, we can already rank record 1 as last. Since record 3 and 4, as well as record 2 and 5, are tied, we need to compare them to the next criterion.

**Typos**

Record 3

0

Record 4

0

Record 2

1

Record 5

1

Record 1

2

**2. Geo**:  Not applicable. All records have a score of 0. Next!

**Typos**

**Geo-distance**

Record 3

0

0

Record 4

0

0

Record 2

1

0

Record 5

1

0

Record 1

2

**3. Proximity**: Record 4 matches in two distinct attributes is thus scored less that record 3. Record 2 has a word (T.) between query terms and thus scores less than record 5.

**Typos**

**Geo-distance**

**Proximity**

Record 3

0

0

1

Record 4

0

0

8

Record 5

1

0

1

Record 2

1

0

2

Record 1

2

Since each record now has a distinct rank, in this example there’s no need to
go through another round and compare scores for the Attributes, Exact and
Custom criteria.

## A second example

Before jumping to our conclusion, let's now look at what would be the result
for the query composed of the single character 'j':

**Typo**

**Geo-distance**

**Proximity**

**Attributes**

**Exact**

**Custom**

Record 2

0

0

0

0

0

4

Record 3

0

0

0

0

0

3

Record 4

0

0

0

0

0

2

Record 1

0

0

0

0

0

1

Record 5

0

0

0

1001

With such a simple query, we obtain a 4-way tie before checking the custom
score that will finally consider record 2 as the best one because of the
important number of calls it received.

## Conclusion

The advantage of prefix matching in our ranking algorithm is that Algolia
initially casts a wide net of results that are already relevant and literally
gets closer to the mark as you type each additional letter. Again, these are
the results you get out of the box.

You can easily configure ranking calculations by:

  * changing criteria order (see ranking  in the [settings](https://www.algolia.com/doc/rest_api#GetSettings))
  * changing the order of the attributes (see attributesToIndex  in the [settings](https://www.algolia.com/doc/rest_api#GetSettings))
  * defining a custom criterion (see customRanking  in the [settings](https://www.algolia.com/doc/rest_api#GetSettings))
  * changing your geographic precision (see aroundPrecision  in the [search parameters](https://www.algolia.com/doc/rest_api#QueryIndex))

