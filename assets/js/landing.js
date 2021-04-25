var bookmarkButton = $('#bookmark-panel');
var bookmarkClose =  $('#bookmark-close');
var searchForm = $('#search-form');
var body = $('body');

// Bookmark panel toggle
bookmarkButton.on('click', function(event) {
     body.toggleClass('offsite-is-open');
});

bookmarkClose.on('click', function(event) {
     body.toggleClass('offsite-is-open');
});

// Send search field contents to results page in the URL
function handleSearchFormSubmit(event) {
  event.preventDefault();
  var searchValue = $('#search-input').val();
     //   If input is empty
  if (!searchValue) {
    return;
  }
  // append search terms to URL and redirect to results page
  var queryString = './results.html?q=' + searchValue;
  location.assign(queryString);
}

// Search form submit event
searchForm.on('submit', handleSearchFormSubmit);

