var stackExchangeRequestUrl = 'https://api.stackexchange.com/2.2/questions?pagesize=10&tagged=json&site=stackoverflow';
var pageContainer = $('#site-container');
var searchButton = $('#btn-search');

searchButton.on('click', function(event) {
    fetch(stackExchangeRequestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // Loop through the response
        for (var i = 0; i < 10; i++) {
            // Get data object data
            var question = data.items[i].title;
            var link = data.items[i].link;
            var answers = data.items[i].answer_count;
            var views = data.items[i].view_count;
            var createDate = data.items[i].creation_date;
            // Format the date created
            var createDateFormatted = moment.unix(createDate).format("MM/DD/YYYY");
            // Render HTML elements to display 
            var questionHeader = $('<h5/>').text('Question');
            var questionCard = $('<div class="card results-card" />');
            var questionContainer = $('<span class="card-title" />');
            var createDateContainer = $('<span class="create-date" />');
            var answersContainer = $('<span class="side-container"/>');
            var answersNumber = $('<span class="answers"/>')
            var viewsContainer = $('<span class="side-container"/>');
            var viewsNumber = $('<span class="views" />');
            var linkButton = $('<a class="btn" />');
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
    });
});
