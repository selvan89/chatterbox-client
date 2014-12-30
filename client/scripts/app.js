var app = {};
app.init = function(val) {return val;};

$(document).ready(function(){
  var $body = $('body');
  var $main = $('#main');
  var $message = $('#messageBox');
  var $messages = $('#messages');
  var $submitButton = $('#submitButton');
  var $retrieveButton = $('#retrieveButton');

  $retrieveButton.on('click', function(){
    $('div').remove('.singleMessage');
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
      type: 'GET',
      success: function(data) {
        // console.log('data.results[99]', data.results[99]);
        for (var i = data.results.length - 1; i > data.results.length - 21; i--) {
          var msgObj = data.results[i];
          var user = msgObj.username;
          var msgText = msgObj.text;
          var filter = /^(\s|\w|\d|<br\/>)*?$/;
          msgText = filter.exec(msgText);
          user = filter.exec(user);
          if (msgText !== null && user !== null && msgText[0] !== 'undefined') {
            $messages.append('<div class="singleMessage">' + msgText[0] + ' : ' + user[0] + '</div>');
          }
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message');
      }
    });
  });

  var message = $message.val();
  console.log(message);

  app.send = function(message) {
    $.ajax({
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
  }

  $submitButton.on('click', function(){
    app.send();
  });

});
