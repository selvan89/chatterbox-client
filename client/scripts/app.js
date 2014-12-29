// YOUR CODE HERE:

$(document).ready(function(){
var $body = $('body');
var $main = $('#main');
var $message = $('#messageBox');
var $submitButton = $('#submitButton');

//How to send an ajax request and look at its response.

//create on click method for submitting chat

  $submitButton.on('click', function(){
    console.log('inside click function: ');
    var message = $message.val();
    console.log(message);

    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  });

});
