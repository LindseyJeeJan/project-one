var bookmarkButton = $('#bookmark-panel');
var bookmarkClose =  $('#bookmark-close');
var body = $('body');


bookmarkButton.on('click', function(event) {
     body.toggleClass('offsite-is-open');
});

bookmarkClose.on('click', function(event) {
     body.toggleClass('offsite-is-open');
});