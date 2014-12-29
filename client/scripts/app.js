$(document).ready(function(){
  var $body = $('body');
  var $main = $('#main');
  var $message = $('#messageBox');
  var $submitButton = $('#submitButton');
  var $retrieveButton = $('#retrieveButton');

  $retrieveButton.on('click', function(){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox/',
      type: 'GET',
      success: function(data) {
        for (var i = 0; i < data.results.length; i++) {
          if (data.results[i].username === "Vijay") {
            console.log(data.results[i]);
          }
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message');
      }
    });
  });

//create on click method for submitting chat
  $submitButton.on('click', function(){
    var message = $message.val();
    console.log(message);

//How to send an ajax request and look at its response.
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
