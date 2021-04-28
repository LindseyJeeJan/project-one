var searchForm = $('#search-form');
var bookmarkPanel = $('#offsite-container');
var body = $('body');

var bookmarks = [];

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

function init() {
    // Get bookmarks from localStorage
    var storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    // If bookmarks exist in localStorage, update the bookmarks array
    if (storedBookmarks !== null) {
        bookmarks = storedBookmarks;
    }
    // render bookmarks to the page
   // renderBookmarks();
}

init();