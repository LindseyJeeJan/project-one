var pageContainer = $('#site-container');
var resultsContainer = $('#results-container');
var videoContainer = $('#videos-container');
var searchForm = $('#search-form');
var body = $('body');

var bookmarks = [];

function getParametersFromURL() {
  // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
  var searchParamsArr = document.location.search.split('?');

  // Get the query and format values
  var query = searchParamsArr[1].split('=').pop();
  // Make API call 
  searchApi(query);
  searchVApi(query); //Video API
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
function renderArticleResultsCards(results) {
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

        // Decode text strings coming from the array
    var decodeHTML = function (question) {
      var txt = document.createElement('textarea');
      txt.innerHTML = question;
      return txt.value;
    };

    question = decodeHTML(question);
    // Render HTML elements to display 
    var questionHeader = $('<h5/>');
    var questionCard = $('<div class="card results-card card-question" />');
    var questionContainer = $('<span class="card-title" />');
    var createDateContainer = $('<span class="create-date" />');
    var answersContainer = $('<span class="side-container"/>');
    var answersNumber = $('<span class="answers"/>')
    var viewsContainer = $('<span class="side-container"/>');
    var viewsNumber = $('<span class="views" />');
    var linkButton = $('<a class="btn purple darken-3" target="_blank" />');
    var favoriteIcon = $('<span class="icon"><i class="far fa-bookmark"></i></span>');
    var div = $('<div />');
    var div2 = $('<div />');
    var div3 = $('<div />');
    //  Put data into the elements
    questionHeader.text(question);
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
    resultsContainer.append(questionCard);
  }
}


//Tutorial YouTube API 


function searchVApi(queryTerms) {
  $("#videos-container").empty()
  $.get('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=' + queryTerms + '&key=AIzaSyDfQfEVK8-H_6dMmoC5Z94bXnuYF6A6lT8&type=video', function (data) {
    console.log(data)


    data.items.forEach(item => {

      var str = item.snippet.title;
      var title = str.substr(0, 30);

      var vidCard = $('<div class = "col s12 m4 l4" />');
      var sizeCard = $('<div class = "card medium hoverable video-results" />');
      var vidCont = $('<div class = "video-container"> <iframe width ="420" height ="315"src="https://www.youtube.com/embed/' + item.id.videoId + '/frameborder="0" allowfullscreen></iframe> ');
      var cardCont = $('<div class = "card-content">  <div class = "row title-row"> <h6 class=" col s9 card-title truncate">' + title + '</h6>  <div class ="col s3 bookmarks"> <span class="icon"><i class="far fa-bookmark"></i></span> ')
      var cardDesc = $('<p class = "">' + item.snippet.description + '</p>');
      cardCont.append(cardDesc);
      var cardAction = $('<div class = "card-action center-align"> <a class ="btn purple darken-3" href ="https://www.youtube.com/watch?v=' + item.id.videoId + '/"> View Tutorial </a>');





      videoContainer.append(vidCard);
      vidCard.append(sizeCard);
      sizeCard.append(vidCont, cardCont, cardAction);



    })
  })
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
  searchVApi("coding" + searchValue);
}

// Bookmark event listener 
pageContainer.on('click', '.icon', function (event) {
  // toggle bookmark icon
  var icon = $(this).find('i');
  //  determine if bookmark was added or removed
  var isBookmark = icon.hasClass('fas');
  icon.removeClass('fas far').addClass(isBookmark ? 'far' : 'fas');

  // determine if video or question
  var isQuestion = false;
  var isVideo = false;
  var card = $(this).closest('.card');
  if (card.hasClass('card-question')) {
    isQuestion = true;
  } else {
    isVideo = true;
  }

  if (isQuestion) {
    var questionDate = card.find('.create-date').text();
    var questionQuestion = card.find('.card-title').text();
    var questionURL = card.find('a.btn').attr('href');
    var questionAnswers = card.find('.answers').text();
    var questionViews = card.find('.views').text();
  }

  if (!isBookmark) {
    // Add item to array
    if (isQuestion) {
      bookmarks.push({
        type: 'question',
        qDate: questionDate,
        qTitle: questionQuestion,
        qUrl: questionURL,
        qAnswers: questionAnswers,
        qViews: questionViews
      });
    } else {
      bookmarks.push({
        type: 'video',
        vTitle: videoTitle,
        vId: videoId,
        vDesc: videoDescription,


      });
    }

  } else {
    if (isQuestion) {
      // Return matching object from array bookmarks, get its index
      var getMatchingIndex = bookmarks.findIndex(x => x.qTitle === questionQuestion);

    } else {
      getMatchingIndex = bookmarks.findIndex(x => x.vTitle === videoTitle);
      //  TODO: Return matching video from bookmarks array
    }
    // Remove bookmark object that was clicked from array
    if (getMatchingIndex > -1) {
      bookmarks.splice(getMatchingIndex, 1);
    }
  }

  //  push to local storage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
});

// Search form submit event listener
searchForm.on('submit', handleSearchFormSubmit);

function init() {
  // Get schedule from localStorage
  var storedBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  // If schedule appointments were retrieved from localStorage, update the scheduling object to it
  if (storedBookmarks !== null) {
    bookmarks = storedBookmarks;
  }
  getParametersFromURL();
}

init();