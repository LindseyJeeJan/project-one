var pageContainer = $('#site-container');
var searchForm = $('#search-form');
var bookmarkContainer = $('#bookmarks .row');
var body = $('body');
var homeLink = $('nav a');
var redirectUrl = './index.html';

var bookmarks = [];

homeLink.on('click', function () {
  document.location = redirectUrl;
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
    var questionQuestion = card.find('.card-real-title').text();
    var questionURL = card.find('a.btn').attr('href');
    var questionAnswers = card.find('.answers').text();
    var questionViews = card.find('.views').text();
  } else {
    var videoTitle = card.find('.card-title').text();
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
        vId: vidId,
        vDesc: videoDescription
      });
    }

  } else {
    if (isQuestion) {
      // Return matching object from array bookmarks, get its index
      var getMatchingIndex = bookmarks.findIndex(x => x.qTitle === questionQuestion);
    } else {
      //  Return matching video from bookmarks array
      var getMatchingIndex = bookmarks.findIndex(x => x.vTitle === videoTitle);
    }
    // Remove bookmark object that was clicked from array
    if (getMatchingIndex > -1) {
      bookmarks.splice(getMatchingIndex, 1);
    }
  }

  //  push to local storage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  renderBookmarks();
});

//Write bookmarks from storage to the page
function renderBookmarks() {
  // If no bookmarks are in memory, show no Bookmarks message
  if (bookmarks.length === 0) {
    showNoBookmarksMessage();
  }
  // First clear the display 
  $('.results-card').parent('.col').remove();
  $('.video-results').parent('.col').remove();
  // Get search phrases from the array of objects and print them onto the page
  for (var i = 0; i < bookmarks.length; i++) {
    var bookmark = bookmarks[i];
    var bookmarkType = bookmark.type;
    if (bookmarkType === "question") {
      // Render question card
      var question = bookmark.qTitle;
      var link = bookmark.qUrl;
      var createDate = bookmark.qDate;

      // Decode text strings coming from the array
      var decodeHTML = function (question) {
        var txt = document.createElement('textarea');
        txt.innerHTML = question;
        return txt.value;
      };

      question = decodeHTML(question);

      var questionCard = $('<div class="card results-card card-question medium hoverable" />');
      var questionHeader = $('<h6 class=" col s9 card-title truncate"/>').text('Stack Overflow Post');
      var questionHeaderContainerContainer = $('<div class="card-content" />');
      var questionHeaderContainer = $('<div class="row title-row" />');
      var questionContainer = $('<p class="card-real-title" />');
      var createDateContainer = $('<span class="create-date" />');
      var linkButton = $('<a class="btn purple darken-3" target="_blank" />');
      var favoriteIcon = $('<div class="col s3 bookmarks"><span class="icon"><i class="fas fa-bookmark"></i></span></div>');
      var divWrapper = $('<div class="col s12 m4"/>');
      var div1 = $('<div class="image-holder" />');
      var div4 = $('<div class="card-action center-align" />');
      //  Put data into the elements
      questionContainer.text(question);
      linkButton.text('View Question').attr('href', link);
      createDateContainer.text(createDate);
      //  Create structure
      questionHeaderContainer.append(questionHeader).append(favoriteIcon);
      questionHeaderContainerContainer.append(questionHeaderContainer).append(questionContainer).append(createDateContainer);
      div4.append(linkButton);
      questionCard.append(div1).append(questionHeaderContainerContainer).append(div4);
      divWrapper.append(questionCard);
      //  Assemble card
      bookmarkContainer.append(divWrapper);
    } else {


      var vidCard = $('<div class = "col s12 m4 l4" />');
      var sizeCard = $('<div class = "card medium hoverable video-results" />');
      var contCard = $('<div class ="card-content" />');

      var vidCont = $('<div class ="card-image video-container"> <iframe width ="420" height ="315"src="https://www.youtube.com/embed/' + bookmark.vId + 'frameborder="0" allowfullscreen></iframe> ');
      var cardCont = $('<div class = "content">  <div class = "row title-row"> <h6 class=" col s9 card-title truncate">' + bookmark.vTitle + '</h6>  <div class ="col s3 bookmarks"> <span class="icon"><i class="fas fa-bookmark"></i></span> ')
      var cardDesc = $('<p class = "">' + bookmark.vDesc + '</p>');
      var cardAction = $('<div class = "card-action center-align"> <a class ="btn purple darken-3" href ="https://www.youtube.com/watch?v=' + bookmark.vId + '/"> View Tutorial </a>');

      bookmarkContainer.append(vidCard);
      vidCard.append(sizeCard);
      sizeCard.append(contCard);
      contCard.append(vidCont, cardCont, cardDesc);
      sizeCard.append(cardAction)

    }
  }
}

// Search form submit event
searchForm.on('submit', handleSearchFormSubmit);

function showNoBookmarksMessage() {
  var bookmarkMessage = $('<h5/>');
  bookmarkMessage.text('No bookmarks.');
  bookmarkContainer.append(bookmarkMessage);
}

function init() {
  // Get bookmarks from localStorage
  var storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  // If bookmarks exist in localStorage, update the bookmarks array
  if (storedBookmarks.length !== 0) {
    bookmarks = storedBookmarks;
  }
  // render bookmarks to the page
  renderBookmarks();
}

init();