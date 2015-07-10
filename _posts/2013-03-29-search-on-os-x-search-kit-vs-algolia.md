---
layout: post
title: 'Search on OS X: Search Kit vs Algolia'
author:
  login: nicolas
  email: nicolas@algolia.com
  display_name: nicolas
  first_name: Nicolas
  last_name: Dessaigne
---

I recently read Matt Thompson's [post about Apple Search
Kit](http://nshipster.com/search-kit/) and he's right about it being rather
unknown; At least I had never heard of it before. So my very first thought was
"How does it compare to our own SDK for OS X?" I immediately asked Julien if
he could perform a few tests. Here are our findings.

## Scope of use

Before examining the technical differences, it is important to stress the
different intents behind the creation of both tools.

SearchKit has been designed as a document search engine, in what I call the
"traditional approach". It is able to index documents directly from disk
(including conversion for a few common formats like pdf), and at the same time
enables tokenization or stop words to be customized.

Algolia was designed differently. Even if it can be used to index 100-page
documents, we targeted small texts, focusing on ease-of-use and performance.
Tweaking a search engine requires deep expertise so we chose to hide that
complexity by making sensible choices that work 99% of the time. You may see
it as the "we know what's best for you" approach taken by Apple for many of
their products! On the other hand, we provide a Search SDK and only that. If
you need to index PDF files, you need to manage the conversion with other
libs.

## Test setup and scenario

To get up to speed quickly, we performed our test with an existing dump of
city data we had already grabbed from [geonames](http://www.geonames.org/) for
a tutorial (available here: [http://www.algolia.com/doc/GeonamesCities.json](h
ttp://www.algolia.com/doc/GeonamesCities.json)). It contains 150k cities with
their name, country, known population, and geoposition.

Search Kit doesn't support multi-fields (a document is a single collection of
terms) so we chose to only index the city names in this test. (Teaser:
upcoming Algolia SDK V2 will support geosearch).

## Results

Here are the raw results on a MacBook Pro Retina:

**Search Kit**
**Algolia**

**Indexation time**
19498ms

4240ms

**Index size**
17MB without terms

(24MB with terms for summary)

8MB

**Search time for prefix queries**  
(max 1k hits)

    l*

255ms

14ms

    lo*

255ms

16ms

    los*

51ms

20ms

    los a*

40ms

12ms

The actual syntax of Algolia queries does not need the '*' character, as we
use prefix queries by default.

## Our observations

We discovered a few weak points of Search Kit during the test:

  * It is a low level API and it doesn't provide an Objective-C wrapper. It may explain why almost no one has heard of it.
  * It doesn't provide any help to highlight matching characters or terms.
  * It doesn't support approximations, nor stemming. That means you need to query the exact words that are in the documents you index (prefix queries can also help in some cases).
  * There is no notion of multiple fields. A document is a simple set of terms. This is particularly problematic when you want to tune ranking, for example by boosting the title.
  * You must use a URI as identifier, even if you are indexing a simple string or if you are indexing an object that already has its own unique identifier. No big deal, but it complicates the code. For our test, we had to write something like the following:
    
    NSURL *objectURL = [NSURL URLWithString:[NSString stringWithFormat:@"file:///%@", [cityName stringByAddingPercentEscapesUsingEncoding: NSUTF8StringEncoding]]];
    SKDocumentRef document = SKDocumentCreateWithURL((__bridge CFURLRef)objectURL);
    SKIndexAddDocumentWithText(index, document, (__bridge CFStringRef)cityName, true);

However, there are a few features in Search Kit that Algolia does not provide:

  * It enables customization of tokenization and of stop words. Make sure you know what you're doing however, as it can have unexpected impact. For example, if you add '-' as a kSKTermChars, you won't be able to find "Saint-Etienne" with the "etienne" query.
  * It is able to convert some common file types (PDF, HTML, RTF, DOC).
  * It supports more advanced boolean queries.

## Conclusion

There is no one-size-fits-all search engine out there, especially on OS X. I
would say that if you're building a search-as-you-type feature like Spotlight,
you should first give our SDK a try. It is much faster to integrate, has
better response times, and handles typos. And don't forget it is also
available for your iOS apps.

If, on the other hand, you want to build a more traditional document search,
you may need the document conversion and customization of Search Kit.

We are not Search Kit gurus and we're happy for any errors in this post to be
corrected.

* * *

Here is the code we used for indexing and searching on Search Kit & Algolia.

#### Indexation with Search Kit

    
    CFTimeInterval before = CFAbsoluteTimeGetCurrent();
    SKIndexRef index = SKIndexCreateWithURL((__bridge CFURLRef)fileURL, NULL, kSKIndexInvertedVector, NULL);
    assert(index != nil);
    NSString *citiesPath = [[NSBundle mainBundle] pathForResource:@"GeonamesCities" ofType:@"json"];
    NSData* citiesData = [NSData dataWithContentsOfFile:citiesPath];
    NSDictionary* dict = [NSJSONSerialization JSONObjectWithData:citiesData options:0 error:nil];
    
    NSUInteger cnt = 0;
    for (NSDictionary* k in dict) {
      NSString *cityName = [k objectForKey:@"Name"];
      NSURL *objectURL = [NSURL URLWithString:[NSString stringWithFormat:@"file:///%@", 
          [cityName stringByAddingPercentEscapesUsingEncoding: NSUTF8StringEncoding]]];
      assert(objectURL != nil);
      SKDocumentRef document = SKDocumentCreateWithURL((__bridge CFURLRef)objectURL);
      SKIndexAddDocumentWithText(index, document, (__bridge CFStringRef)cityName, true);
      ++cnt;
    }
    SKIndexFlush(index);
    SKIndexCompact(index);
    CFTimeInterval after = CFAbsoluteTimeGetCurrent();
    NSLog(@"Time to compile %zdms", (NSUInteger)((after - before) * 1000));

#### Indexation with Algolia Search

    
    CFTimeInterval before = CFAbsoluteTimeGetCurrent();
    ASIndex* index = [[ASIndex alloc] initWithName:@"GeonamesCities" delegate:nil
                                      userDataClass:nil licenseKey:@""];
    NSString *citiesPath = [[NSBundle mainBundle] pathForResource:@"GeonamesCities" ofType:@"json"];
    NSData* citiesData = [NSData dataWithContentsOfFile:citiesPath];
    NSDictionary* dict = [NSJSONSerialization JSONObjectWithData:citiesData options:0 error:nil];
    
    for (NSDictionary* k in dict) {
        [index setEntry:nil forName:[k objectForKey:@"Name"]];
    }
    [index publishChanges];
    CFTimeInterval after = CFAbsoluteTimeGetCurrent();
    NSLog(@"Time to search %zdms", (NSUInteger)((after - before) * 1000));

#### Search with Search Kit

    
    NSString *query = @"l*";
    CFTimeInterval before = CFAbsoluteTimeGetCurrent();
    SKSearchOptions options = kSKSearchOptionDefault;
    NSUInteger limit = 1000; // Maximum number of results
    NSTimeInterval time = 10; // Maximum time to get results, in seconds
    SKDocumentID documentIDs[limit];
    CFURLRef *urls = calloc(limit, sizeof(CFURLRef));
    float *scores = calloc(limit, sizeof(float));
    SKSearchRef search = SKSearchCreate(index, (__bridge CFStringRef)query, options);
    CFIndex count;
    
    SKSearchFindMatches(search, limit, documentIDs, scores, time, &count);
    SKIndexCopyDocumentURLsForDocumentIDs(index, count, documentIDs, urls);
    
    CFTimeInterval after = CFAbsoluteTimeGetCurrent();
    NSLog(@"Time to search %zdms", (NSUInteger)((after - before) * 1000));

#### Search with Algolia Search

    
    NSString *query = @"l";
    CFTimeInterval before = CFAbsoluteTimeGetCurrent();
    [index setNbHitsForSuggest:1000]; // Maximum number of results
    
    [index suggestSync:query];
    
    CFTimeInterval after = CFAbsoluteTimeGetCurrent();
    NSLog(@"Time to search %zdms", (NSUInteger)((after - before) * 1000));

