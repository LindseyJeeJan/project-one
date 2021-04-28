var pageContainer = $('#site-container');
var searchForm = $('#search-form');
var bookmarkPanel = $('#offsite-container');
var body = $('body');

var bookmarks = [];

function getParametersFromURL() {
  // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
  var searchParamsArr = document.location.search.split('?');

  // Get the query and format values
  var query = searchParamsArr[1].split('=').pop();
  // Make API call 
  searchApi(query);
}

function searchApi(queryTerms) {
    // Empty results
    $('.card-question').remove();
    // Add search terms from the URL

    stackExchangeRequestUrl = 'https://api.stackexchange.com/2.2/search?pagesize=3&order=desc&sort=relevance&intitle=' + queryTerms + '&site=stackoverflow';
    
    // Stack Exchange API call
    fetch(stackExchangeRequestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        renderArticleResultsCards(data);
    })
}

// Render search results for Stack Overflow 
function renderArticleResultsCards(results){
 // Loop through the response
        for (var i = 0; i < 3; i++) {
            // Get data object data
            var question = results.items[i].title;
            var link = results.items[i].link;
            var answers = results.items[i].answer_count;
            var views = results.items[i].view_count;
            var createDate = results.items[i].creation_date;
            // Format the date created
            var createDateFormatted = moment.unix(createDate).format("MM/DD/YYYY");
            // Render HTML elements to display 
            var questionHeader = $('<h5/>').text('Question');
            var questionCard = $('<div class="card results-card card-question" />');
            var questionContainer = $('<span class="card-title" />');
            var createDateContainer = $('<span class="create-date" />');
            var answersContainer = $('<span class="side-container"/>');
            var answersNumber = $('<span class="answers"/>')
            var viewsContainer = $('<span class="side-container"/>');
            var viewsNumber = $('<span class="views" />');
            var linkButton = $('<a class="btn" target="_blank" />');
            var favoriteIcon = $('<span class="icon"><i class="far fa-bookmark"></i></span>');
            var div = $('<div />');
            var div2 = $('<div />');
            var div3 = $('<div />');
            //  Put data into the elements
            questionContainer.text(question);
            linkButton.text('View').attr('href', link);
            answersContainer.text('Answers');
            answersNumber.text(answers)
            viewsContainer.text('Views');
            viewsNumber.text(views);
            viewsContainer.append(viewsNumber);
            answersContainer.append(answersNumber);
            createDateContainer.text(createDateFormatted);
            //  Create structure
            div.append(answersContainer).append(viewsContainer);
            div2.append(questionHeader).append(createDateContainer).append(questionContainer);
            div3.append(favoriteIcon).append(linkButton);
            questionCard.append(div).append(div2).append(div3);
            //  Assemble card
            pageContainer.append(questionCard);
        } 
}

// When form is submited on this page, send search terms to the API call
function handleSearchFormSubmit(event) {
  event.preventDefault();
    //  Get input field contents
  var searchValue = $('#search-input').val();
    // If input is empty, do nothing
  if (!searchValue) {
    return;
  }
// Make API call
  searchApi(searchValue);
}

// Bookmark event listener 
pageContainer.on('click', '.icon', function(event){
    // toggle bookmark icon
    var icon = $(this).find('i');
    var isBookmark = icon.hasClass('fas'); 
    icon.removeClass('fas far').addClass(isBookmark ? 'far' : 'fas');

    // determine if video or question
    var isQuestion = false;
    var isVideo = false;
    var card = $(this).closest('.card');
    if (card.hasClass('card-question')){
       isQuestion = true;
    } else {
        isVideo = true;
    } 

    if (isBookmark) {
        // TODO: add item to array
       
    } else {
        // TODO: remove item from array
    }
    //  TODO: push bookmarks to bookmarks array

    //  push to local storage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    renderBookmarks(); 

});

// TODO: Write bookmarks from storage to the page
function renderBookmarks() {
    // TODO write bookmarks to page

     // TODO: First clear the display 

      // Get search phrases from the array of objects and print them onto the page
    for (var i = 0; i < bookmarks.length; i++) {
      //   var bookmark = bookmarks[i];
    }   
}


// Search form submit event listener
searchForm.on('submit', handleSearchFormSubmit);

function init() {
    // Get bookmarks from localStorage
    var storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    // If bookmarks exist in localStorage, update the bookmarks array
    if (storedBookmarks !== null) {
        bookmarks = storedBookmarks;
    }
    // render bookmarks to the page
    renderBookmarks();
}

init();
getParametersFromURL();