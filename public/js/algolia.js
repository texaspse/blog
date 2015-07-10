// Init the search box
$(function(config) {
  'use strict';

  var applicationId = config.applicationId;
  var apiKey = config.apiKey;
  var indexName = config.indexName;

  var algolia = algoliasearch(applicationId, apiKey);
  var helper = algoliasearchHelper(algolia, indexName);
  helper.setQueryParameter('distinct', true);
  helper.on('result', onResult);

  // Input listening for queries
  var $searchInput = $('.js-algolia__input');
  $searchInput.on('keyup', onQueryChange);

  // Content to hide/show when searching
  var $initialContent = $('.js-algolia__initial-content');
  var $searchContent = $('.js-algolia__search-content');
  var $searchContentResults = $searchContent.find('.algolia__results');
  // Rendering templates
  var templateResult = Hogan.compile($('#algolia__template').html());
  var templateNoResults = $('#algolia__template--no-results').html();

  var lastQuery;
  function onQueryChange() {
    lastQuery = $searchInput.val();
    if (lastQuery.length === 0) {
      $initialContent.removeClass('algolia__initial-content--hidden');
      $searchContent.removeClass('algolia__search-content--active');
      return false;
    }
    $initialContent.addClass('algolia__initial-content--hidden');
    $searchContent.addClass('algolia__search-content--active');
    helper.setQuery(lastQuery).search();
  }

  function onResult(data) {
    // Avoid race conditions, discard results that do not match the latest query
    if (data.query !== lastQuery) {
      return false;
    }
    var content = data.nbHits ? renderResults(data) : templateNoResults;
    $searchContentResults.html(content);
  }

  function renderResults(data) {
    return $.map(data.hits, function(hit) {
      if (hit.posted_at) {
        hit.posted_at_readable = moment.unix(hit.posted_at).fromNow();
      }
      hit.css_selector = encodeURI(hit.css_selector);
      hit.url = config.baseurl + hit.url;

      return templateResult.render(hit);
    }).join('');
  }

  // Scroll page to result
  (function() {
    var anchor = window.location.hash.substring(1);
    if (!anchor.match(/^algolia:/)) {
      return;
    }

    var selector = decodeURI(anchor.replace(/^algolia:/, ''));
    var target = $('.page,.post').find(selector);
    var targetOffset = target[0].getBoundingClientRect().top + window.pageYOffset;
    var targetHeight = target.height();
    var windowHeight = $(window).height();
    var scrollOffset = targetOffset - (windowHeight / 2) - (targetHeight / 2);

    window.setTimeout(function() {
      window.scroll(0, scrollOffset);
    }, 100);

  })();
}(window.ALGOLIA_CONFIG));
