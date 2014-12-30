$(document).ready(function(){
  var $body = $('body');
  var $main = $('#main');
  var $message = $('#messageBox');
  var $messages = $('#messages');
  var $submitButton = $('#submitButton');
  var $retrieveButton = $('#retrieveButton');
  var lastUpdate = 1419811200000; // This is 12/28/2014 at 16:00

  $retrieveButton.on('click', function(){
    $('div').remove('.singleMessage');

    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox/',
      type: 'GET',
      success: function(data) {
        console.log('first', data.results[0]);
        var results = []
        for (var i = 0; i < data.results.length; i++) {
          var msgObj = data.results[i];
          var msgTime = new Date(msgObj.createdAt).getTime();
          if (msgTime > lastUpdate) {
            results.push(msgObj);
          }
        }
        for (var j = 0; j < results.length; j++) {
          $messages.append('<div class="singleMessage">' + results[j].username + ': ' + results[j].text + ' ' + results[j].createdAt + '</div>');
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
