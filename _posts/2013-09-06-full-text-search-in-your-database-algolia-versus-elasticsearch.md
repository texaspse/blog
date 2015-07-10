---
layout: post
title: 'Full Text Search in your Database: Algolia vs Elasticsearch'
author:
  login: julien
  email: julien.lemoine@algolia.com
  display_name: julien
  first_name: Julien
  last_name: Lemoine
---

Most applications and websites are built on top of a database. It can be a
traditional relational database like MySQL or a NoSQL database like MongoDB.
The problem is that none of these databases offer a satisfying full text
search feature. Although they often have similar features (using LIKE operand
in MySQL, using text index in MongoDB), these are poor alternatives, as all
developers have experienced.

Algolia was built to answer the shortcomings of database full-text search. It
is a SaaS API dedicated to solving application and website developers'
struggles in providing end users with a fast, reliable, and relevant search
feature.

Until now, Elasticsearch has been the fall-back solution for developers.
Although a beautiful product for big data analysis or document search, it
hasn’t been designed for object searches. Algolia has. The purpose of this
blog post is to answer a question we’re frequently asked: If Algolia brings a
specific answer when Elasticsearch offers a broad set of tools, how do they
compare for database search?

We decided to put both to the test. Using the IMDB database of 400k actors and
2M movies/TV series, we decided to build and measure the performance of both
search services keeping everything else constant. We didn't limit our test to
crude keyword search but aimed at building a first-class user experience,
returning instant results after each keystroke, factoring popularity in the
ranking, and tolerating user mistakes gracefully.

# What we learned

In this first section, we sum up our findings. Technical details about the
test are described in the second part of this article.

## Raw performance

In the benchmark below, you can see Algolia consistently performing between 12
and 200 times faster than Elasticsearch_ – _for every search query we
performed.__

Query Algolia 1 Shard Algolia 5 Shards ES 1 Shard ES 5 Shards

geo

< 1ms

2ms

101ms

36ms

george clo

2ms

3ms

121ms

51ms

b

< 1ms

2ms

147ms

60ms

batman

2ms

2ms

94ms

29ms

world w

5ms

2ms

134ms

68ms

e

< 1ms

2ms

202ms

81ms

emilia

< 1ms

2ms

102ms

31ms

alexandre b

18ms

9ms

243ms

109ms

We understand however that it’s not all about performance, and here’s why: do
we want to give the user a search result in the quickest possible time or do
we want to give the user _what they are looking for_ in the quickest possible
time? We decided for the latter.

## User Experience

There are a lot of things that should happen “behind the scenes” that result
in the user quickly finding what it is they are looking for:

  1. **Instant Search**. Users have been used to search engines auto-completing queries, instead of suggesting actual results. Here we want to go a step further: index-wide results are presented and updated every time a key is entered, in real time. Type a letter and get the best result immediately.
  2. **Balance Relevance and Popularity**. In the IMDB example, if we search for “geor”, then we want all results where the actor’s name is ‘George’ (i.e. relevance) and we want ‘George Clooney’ to be top of that list because he is the most popular (defined by how many times users have visited his page/looked him up on IMDB). While straightforward with Algolia, mixing relevance and popularity is nothing short of impossible in Elasticsearch. Either you sort by relevance or by using a popularity attribute, you cannot mix both.
  3. **Handle Typos Intelligently**. Users often mistype when entering search queries. A good user experience would be to find ‘George Clooney’ when searching for ‘gorge cloney’ for example. Algolia provides out-of-the-box typo-tolerance that works on both words and prefixes, and intelligently highlights the results. This allows end-users to understand search results even with typos. Unfortunately, Elasticsearch fuzzy matching does not work out of the box, is complex to customize, and does not provide the ability to highlight prefixes.

## Performance or User Experience? Both.

By doing a terrific job on database full-text search, having intuitive
configuration of both relevance and matching and by having robust typo
tolerance that works out of the box, Algolia helps the user get what they are
looking for in the quickest time possible. On desktop but on mobile in
particular, this makes a huge difference on time spent executing a search.

Elasticsearch is a great toolbox that can be used to build both intranet
search and big data analytics. However, addressing such diverse use cases
leads to a difficult integration. One size doesn’t fit all. Algolia’s focus on
object search makes it much better for this purpose: faster integration,
better performance, superior user experience. And don’t forget you also need
to host your Elasticsearch somewhere.

# Under the hood

That's all good but the most technical of you may want to know more about the
actual implementation of this benchmark. Here we go.

In order to have a point of reference, we used the same hardware: a Xeon E3
1245v2 (Quad-core 3.4Ghz) with 32GB of RAM and 240GB of SSD (2 SSD in raid 0).
We did a test with 1 shard and another with 5 shards, and used Elasticsearch
version 0.90.2 which is based on Lucene 4.3.1. Note that the number of shards
is not exposed in the Algolia API since it is automatically determined in the
back-end for scalability and is not triggered for small datasets.

## Data Set

At the end of July 2013, we extracted from IMDB a list of 400k
actors/actresses and 2M movies/TV series. In order to factor popularity in the
relevance, we computed an integer rank for each object with the following
approaches:

  * Actors: We used the weekly ranking of IMDB at the end of July for actors and actresses. The result was a rank of 1 for the best male or female actor and then an increasing value according to the IMDB weekly rank.
  * Movies: We sorted movies according to the following formula: log(nb_voters) * rating. We then chose to use the position of movie in the sorted vector as a rank (1 for the best movie).

At this step, we had a set of 2.4M entries from IMDB containing actors and
movies with a indication of relevance. Check out the data set with [all
objects and ranks in JSON](http://demos.algolia.com/imdb/imdb.json.bz2).

Here is an example of a movie:

    
    {
        "name": "The Shawshank Redemption",
        "url": "/title/tt0111161/",
        "rating": 9.3,
        "year": "(1994)",
        "nb_voters": 1010572,
        "rank": 1
    }

An example of a TV Series:

    
    {
        "name": "Game of Thrones",
        "url": "/title/tt2178784/",
        "rating": 9.8,
        "year": "(2011 TV Series)",
        "nb_voters": 13312,
        "episode": "The Rains of Castamere",
        "rank": 330
    }

And an example of an actor:

    
    {
        "name": "George Clooney",
        "url": "/name/nm0000123/",
        "rank": 109
    }

To have a relevant search, we wanted to search first in the 'name', then in
the 'year' and finally in the 'episode' attribute. We also wanted queries to
match across the three attributes to be able to answer searches like
'Shawshank Redemption 1994' or 'Game of Thrones rains of castamere'

## Indexing

Algolia and Elasticsearch are schema less and directly support indexing of our
objects. To do the indexing on Algolia we used its [ruby
client](https://github.com/algolia/algoliasearch-client-ruby) with the
following code:

    
    index = Algolia::Index.new("imdb")
    batch = JSON.parse(File.read("imdb.json"))
    index.add_objects(batch)

For Elasticsearch, we converted our objects in the bulk indexing format. We
wrote a small ruby script to split data in several files and then imported
them with CURL.

    
    require 'json'
    
    count = 0
    output_count = 1
    output = File.open("final-es-bulk-1.txt", "w")
    File.open("imdb.json", "r:utf-8") do |input|
        imdb = JSON.parse(input.read);
        imdb.each do |entry|
            count += 1
            if ((count % 200000) == 0) then
                output.close
                output_count += 1
                output = File.open("final-es-bulk-" + output_count.to_s + ".txt", "w")
            end
            meta = {}
            meta["index"] = {}
            meta["index"]["_index"] = "imdb"
            meta["index"]["_type"] = "imdb"
            meta["index"]["_id"] = count.to_s
            output.write(meta.to_json)
            output.write("n")
            output.write(entry.to_json)
            output.write("n")
        end
    end
    output.close

To assess performance, we directly imported data locally on the indexing host.
Here were the indexing times:

1 Shard 5 Shards

Algolia

82s

38s

ElasticSearch

148s

68s

**Sidenote: Why we didn't use a suggest plugin for Elasticsearch  
**A shortcut to providing instant search in Elasticsearch is to use the [autocomplete feature]( http://www.elasticsearch.org/guide/reference/api/search/completion-suggest/) or[ suggest plugin](https://github.com/spinscale/elasticsearch-suggest-plugin). These modules, much faster than standard search, are used in several sites such as [SoundCloud](https://soundcloud.com/). They however don't support multi attributes search and thus cannot be used in our situation. What's more, they may hinder the user experience. In SoundCloud for example, you can get a suggestion for "Pink Floy The Dark Side of the moon" if you enter the text in that exact order, but if you enter "Dark side of the moon Pink Floyd", you won't get any result. Annoying.

## First Query

Indexing is actually very easy with the two solutions!

With Algolia, a single line of ruby was enough to perform our first search:

    
    res = index.search("batman")

For ElasticSearch, we selected the [tire ruby
client](https://github.com/karmi/tire) and our query translated in:

    
    s = Tire.search "imdb" do
        query do
            string "batman"
        end
    end

## Searchable content

Now that we had indexed all our data, we wanted to specify in which attribute
to search. As explained before, we wanted to search in these three attributes:
'name', then 'year' and finally 'episode'. Other attributes should not be used
for search.

With Algolia, we can specify the list of fields in the index settings via the
« attributesToIndex » parameters, they are sorted by decreasing order of
importance so you do not need any to set any boost. A single line of code was
enough to change them:

    
    index.set_settings({"attributesToIndex" => ["name", "year", "episode"]})

With Elasticsearch, we can specify fields directly in the query and use boosts
for each of them. The choice of the boost value is important as it directly
impacts the "_score" value. It is, however, an opaque value that requires a
trial and error process to get right.

    
    s = Tire.search "imdb" do
        query do
            string "batman", :fields => ["name^5", "year^2", "episode"]
        end
    end

## Customize ranking

Here, the first difficulties started. As a reminder, we wanted to take into
account the popularity of actors and movies, so that the query ‘geo’ would
return ‘George Clooney’ as first result since it is the most famous actor
starting with ‘geo’. To do so, we used the rank value that we computed.

In Algolia, we simply changed the customRanking setting:

    
    index.set_settings({"customRanking" => ["asc(rank)"]})

To add a sort criteria in the query of ElasticSearch, we modified the query
directly:

    
    s = Tire.search "imdb" do
        query do
            string "the rains", 
            :fields => ["name^5", "year^2", "episode"],
            :default_operator => "AND"
        end 
        sort do 
            by :rank, "asc" 
            by :_score 
        end 
    end

This sorting configuration might seem pretty explicit, but it is in fact quite
dangerous as it conflicts with the boost on fields. To better understand the
problem, let's look at the query 'the rains':

    
    "hits": [
    {
        "_index": "imdb",
        "_type": "imdb",
        "_id": "330",
        "_score": 1.5647705,
        "_source": {
            "name": "Game of Thrones",
            "url": "/title/tt2178784/",
            "rating": 9.8,
            "year": "(2011 TV Series)",
            "nb_voters": 13312,
            "episode": "The Rains of Castamere",
            "rank": 330
        },
        "sort": [
            330,
            1.5647705
        ]
    },
    {
        "_index": "imdb",
        "_type": "imdb",
        "_id": "21986",
        "_score": 7.3712673,
        "_source": {
             "name": "Before the Rains",
             "url": "/title/tt0870195/",
             "rating": 6.6,
             "year": "(2007)",
             "nb_voters": 1299,
             "rank": 15188
        },
        "sort": [
            15188,
            7.3712673
        ]
    },
    {
        "_index": "imdb",
        "_type": "imdb",
        "_id": "24324",
        "_score": 7.371266,
        "_source": {
            "name": "The Rains Came",
            "url": "/title/tt0031835/",
            "rating": 6.8,
            "year": "(1939)",
            "nb_voters": 881,
            "rank": 16232
        },
        "sort": [
            16232,
            7.371266
        ]
    },
    ...

It might be counterintuitive that the result that matches in the "episode"
attribute is found before results in the "name" attribute without respecting
the boost. The boost has an impact on the "_score" float value that is smaller
when it matches the episode attribute and not the name. The problem here is
that merging the user defined "rank" with the floating value "_score" is
complex:

  * If  "_score" is before "rank" in the sort criteria, "rank" is not used since each hit has a different float value for "_score".
  * If "rank" is before "_score" in the sort criteria, attribute order is not taken into account.

In Algolia the ranking is handled differently. Instead of having a unique
float value for ranking, we compute a set of integer values that are explicit
and easy to understand. You can see them on the first three results of the
query 'the rains':

    
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
    {
        "name": "The Rains of Ranchipur",
        "url": "/title/tt0048538/",
        "rating": 5.7,
        "year": "(1955)",
        "nb_voters": 495,
        "rank": 25569,
        "objectID": "62175",
        "_highlightResult": {
            "name": {
                 "value": "<em>The</em> <em>Rains</em> of Ranchipur",
                 "matchLevel": "full"
            },
            "year": {
                "value": "(1955)",
                "matchLevel": "none"
            }
        },
        "_rankingInfo": {
            "nbTypos": 0,
            "firstMatchedWord": 0,
            "proximityDistance": 1,
            "userScore": 2323136,
            "geoDistance": 0,
            "geoPrecision": 1,
            "nbExactWords": 2
        }
    },
    {
        "name": "Before the Rains",
        "url": "/title/tt0870195/",
        "rating": 6.6,
        "year": "(2007)",
        "nb_voters": 1299,
        "rank": 15188,
        "objectID": "21986",
        "_highlightResult": {
            "name": {
                "value": "Before <em>the</em> <em>Rains</em>",
                "matchLevel": "full"
            },
            "year": {
                "value": "(2007)",
                "matchLevel": "none"
            }
    
        },
        "_rankingInfo": {
            "nbTypos": 0,
            "firstMatchedWord": 1,
            "proximityDistance": 1,
            "userScore": 2384081,
            "geoDistance": 0,
            "geoPrecision": 1,
            "nbExactWords": 2
        }
    },
    ...

The ordering of attributes is strictly respected. As we didn't specify
otherwise, results are ranked with the default ordering that performs:

  1. First a sort by number of typos (defined by nbTypos value, in increasing order)
  2. Then, a sort by geo-distance. It is only used when the query is done inside a given geographic area and is applicable in this case.
  3. Then, a sort by proximity between matched query words in objects (defined by proximityDistance, in increasing order). If query words are next to each other, the value is 1, is there is one word between two query words, the value is 2, etc.
  4. Then, a sort according to the matched attribute and the position of the word in the attribute (defined by firstMatchedWord, in increasing order). This is the criteria that respect the order of attributes defined in "attributesToIndex" setting.
  5. Then, a sort on the number of exact words that matched (defined by nbExactWords, by decreassing order). It is often relevant since last query word is interpreted as prefixe by default.
  6. Finally, a sort by user provided custom ranking (defined by customScore attribute, by decreasing order).

This explicit way of ranking results gives you a full understanding of how
results are ranked, by opposition to having a float value that is very
difficult to understand. For example in the two first results, all integers
are identical except for the "userScore", which indicates that the custom
ranking was used to make the difference between these two objects.

The most important thing about Algolia ranking is that you are able to easily
customize it without giving up other criteria. In this case, we introduced a
popularity rank on movies/actors while still considering matching attribute as
more important in the overall ranking rules. The ordering of criteria can of
course be changed if we had wanted to consider the custom ranking score more
important than the matching attribute.

## Instant Search

Going further,  we wanted to provide an Instant Search, also called search-as-
you-type. In order to do that, we needed to interpret the last query word as a
prefix.

In ElasticSearch, you can enable wildcards and add one at the end of the last
query word, here is an example with the query 'word w':

    
    s = Tire.search "imdb" do
        query do
            string "world w*", 
            :default_operator => "AND", 
            :analyze_wildcard => true, 
            :fields => ["name^5", "year^2", "episode"]
        end
        sort do
            by :rank, "asc"
            by :_score
        end
    end

Wildcards in ElasticSearch are not exact and are performed in an approximative
way (there is a limit in the number of words a prefix query can be expended
to).

In Algolia prefix queries are exact, no approximation is performed. By default
last query word is considered as a prefix but you can easily change this
behavior to have all words interpreted as a prefix in the index settings:

    
    index.set_settings({"queryType" => "prefixAll"})

## Typo-tolerance

The final step was to enable fuzzy search in order to tolerate user mistakes.

In both products, typo tolerance (or fuzzy search) is defined by a
[Levenshtein-distance](http://en.wikipedia.org/wiki/Levenshtein_distance)
between query words and hit words. For Asian languages (Chinese, Japanese,
Korean), Levenshtein-distance is known to be inefficient and Algolia applies a
different strategy that for example considers transformation in simplified
Chinese as a typo of Traditional Chinese and vice versa.

On our data-set, levenshtein-distance is a good measure of typos.

In Elasticsearch, you can use the Lucene fuzzy operator '~' on each query word
to apply a Levenshtein-distance with the number of typos you want to tolerate
(for example 'george~1 clooney~1' means that you can tolerate one typo on
'george' and 1 typo on 'clooney').

Unfortunately, you cannot combine the fuzzy operator with a wildcard operator,
so you cannot apply a fuzzy search on a prefix and thus have typo-tolerance on
the last query word. In order to keep the Instant-Search feature, we did a
wildcard search on last query word and applied fuzzy search on other query
words.

In Algolia, typo tolerance works out-of-the-box and you can define the size of
the word needed to allow one or two typos with these two index settings:

  * minWordSizefor1Typo: minimum number of letters in a word/prefix to tolerate one typo (defaults is 3)
  * minWordSizefor2Typos: minimum number of letters in a word/prefix to tolerate two typos (default is 7)

Here is for example the first result of the query 'alexandre~1 b*' in
ElasticSearch:

    
    {
        "_index": "imdb",
        "_type": "imdb",
        "_id": "2152873",
        "_score": 1.8949691,
        "_source": {
            "name": "Alexandra Breckenridge",
            "url": "/name/nm1020036/",
            "rank": 1015
        },
        "highlight": {
            "name": [
                "<em>Alexandra</em> <em>Breckenridge</em>"
            ]
        },
        "sort": [
            1015,
            1.8949691
        ]
    }

And the first result for the query 'alexandre b' in Algolia:

    
    {
        "name": "Alexandre Bustillo",
        "url": "/name/nm2376614/",
        "rank": 19110,
        "objectID": "2070968",
        "_highlightResult": {
            "name": {
                "value": "<em>Alexandre</em> <em>B</em>ustillo",
                "matchLevel": "full"
            }
        }
    }

We can see that Elasticsearch misses results with 'Alexandre' because it does
not sort results by number of typos. This is a huge problem to get a good
ranking when accepting user mistakes.

But Algolia goes even further and allows typos on prefixes. Here are the first
3 results for the query 'gorge clon' in Algolia. The "nbTypos" element
indicates the number of typos corrected. As you can see, corrected parts of
the words are highlighted, which is essential for the end-user to understand
why such hits are retrieved. For the first object, 'gorge' matched 'george'
(count for one typo since the Levenshtein-Distance between the two words is 1)
and 'clon' matched the prefix 'Cloon' (also count for one typo since the
Levenshtein-Distance between the two words is 1).

    
    {
        "name": "George Clooney",
        "url": "/name/nm0000123/",
        "rank": 109,
        "objectID": "2051967",
        "_highlightResult": {
            "name": {
               "value": "<em>George</em> <em>Cloon</em>ey",
               "matchLevel": "full"
            }
        },
        "_rankingInfo": {
            "nbTypos": 2,
            "firstMatchedWord": 0,
            "proximityDistance": 1,
            "userScore": 2436116,
            "geoDistance": 0,
            "geoPrecision": 1,
            "nbExactWords": 0
        }
    },
    {
        "name": "George Clinton",
        "url": "/name/nm1093741/",
        "rank": 14413,
        "objectID": "2066271",
        "_highlightResult": {
            "name": {
                "value": "<em>George</em> <em>Clin</em>ton",
                "matchLevel": "full"
            }
         },
         "_rankingInfo": {
            "nbTypos": 2,
            "firstMatchedWord": 0,
            "proximityDistance": 1,
            "userScore": 2387279,
            "geoDistance": 0,
            "geoPrecision": 1,
            "nbExactWords": 0
        }
    },
    {
        "name": "George Clinton: The Mothership Connection",
        "url": "/title/tt0167955/",
        "rating": 8.5,
        "year": "(1998 Documentary)",
        "nb_voters": 43,
        "rank": 28215,
        "objectID": "85918",
        "_highlightResult": {
            "name": {
                "value": "<em>George</em> <em>Clin</em>ton: The Mothership Connection",
                "matchLevel": "full"
            },
            "year": {
                "value": "(1998 Documentary)",
                "matchLevel": "none"
            }
        },
        "_rankingInfo": {
            "nbTypos": 2,
            "firstMatchedWord": 0,
            "proximityDistance": 1,
            "userScore": 2294113,
            "geoDistance": 0,
            "geoPrecision": 1,
            "nbExactWords": 0
        }
    }

Algolia provides out-of-the-box typo-tolerance that works on both words and
prefixes, and does a smart highlighting of results according to typo
tolerance. This allows end-users to understand search results even with typos.
Unfortunately Elasticsearch fuzzy matching is more complex to customize and
does not provide the ability to highlight prefixes.

## Search Performance

We did several search queries to evaluate performance on the IMDB data set. In
Algolia we used all features including typo-tolerance on prefix. In
Elasticsearch we used Instant-Search queries with typo-tolerance except for
the last query word (we cannot apply typo tolerance on the last word since it
is a prefix).

Query Algolia 1 Shard Algolia 5 Shards ES 1 Shard ES 5 Shards

geo

< 1ms

2ms

101ms

36ms

george clo

2ms

3ms

121ms

51ms

b

< 1ms

2ms

147ms

60ms

batman

2ms

2ms

94ms

29ms

world w

5ms

2ms

134ms

68ms

e

< 1ms

2ms

202ms

81ms

emilia

< 1ms

2ms

102ms

31ms

alexandre b

18ms

9ms

243ms

109ms

# Conclusion

Elasticsearch is a wonderful tool for Big Data analytics, but it is very
difficult to reach a good relevance with it on database search. You can try to
add some logic on top of Elasticsearch or try to reorder manually results for
some queries, but it’s tedious work that continuously needs to be tuned.
Algolia on the other hand focuses on getting a very good relevance with
minimal configuration. While not optimal for all use cases, it makes it
particularly appropriate for database search.

