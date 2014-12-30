var app = {};
app.init = function(val) {return val;};
app.server = 'https://api.parse.com/1/classes/chatterbox';

$(document).ready(function(){
  var $body = $('body');
  var $main = $('#main');
  var $message = $('#messageBox');
  var $chats = $('#chats');
  var $submitButton = $('#submitButton');
  var $retrieveButton = $('#retrieveButton');
  var $newRoom = $('#newRoom');
  var message = $message.val();
  var friends = {};

  app.clearMessages = function() {
    $('div').remove('.singleMessage');
  };

  app.addMessage = function(message){
    console.log(message);
  };

  app.addRoom = function(room){
    $newRoom.append('<div id="roomSelect"></div>');
    console.log("this.val()", room);
  };

  $('createRoom').on('click', function(){
    console.log("this.val()", $newRoom.val());
    app.addRoom($newRoom.val());
  });

//befriend function
  app.befriend = function(friend){
    if(!friends[friend]){
      friends[friend] = true;
    }
  }

//befriend click event
$('#chats').on('click', '.userText', function(){
  // console.log("this.val()", $newRoom.val());
  app.befriend($(this).text());
  console.log(friends);
});

//What's the best way to separate out addMessage and fetch
  app.fetch = function(){
    app.clearMessages();
    $.ajax({
      url: app.server,
      /*?order=-createdAt',*/
      type: 'GET',
      success: function(data) {
        console.log('data.results[99]', data.results[99]);
        for (var i = data.results.length - 1; i > data.results.length - 21; i--) {
          var msgObj = data.results[i];
          var user = msgObj.username;
          var msgText = msgObj.text;
          var filter = /^(\s|\w|\d|<br\/>)*?$/;
          msgText = filter.exec(msgText);
          user = filter.exec(user);
          //check if user is in friends list
          if (friends[user]) {
            if (msgText !== null && user !== null && msgText[0] !== 'undefined') {
              $chats.append('<div class="singleMessage"><em>' + '<span class="userText">' + user[0] + '</span>' + ' : ' + msgText[0] + '</em></div>');
            }
          } else if (msgText !== null && user !== null && msgText[0] !== 'undefined') {
            $chats.append('<div class="singleMessage">' +'<span class="userText">' + user[0] + '</span>' + ' : ' + msgText[0] + '</div>');
          }
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve message');
      }
    });
  };

  app.fetchRooms = function(){
    $.ajax({
      url: app.server,
      type: 'GET',
      success: function(data) {
        var uniqRoom = {};
        for (var i = 0; i < data.results.length; i++) {
          var room = data.results[i].roomname;
          var filter = /^(\s|\w|\d|<br\/>)*?$/;
          room = filter.exec(room)[0];
          if (room !== null && room !== 'undefined') {
            if (!uniqRoom[room]){
              uniqRoom[room] = room;
            }
          }
        }
        // console.log('uniqRoom', uniqRoom);
        for (var key in uniqRoom) {
          $('#roomList').append('<div class="singleRoom">' + key + '</div>');
        }
      }
    });
  };


  app.toggleRoom = function(newRoom) {
    app.clearMessages();
    $.ajax({
      url: app.server,
      type: 'GET',
      success: function(data) {
        for (var i = 0; i < data.results.length; i++) {
          var msgObj = data.results[i];
          var user = msgObj.username;
          var msgText = msgObj.text;
          var filter = /^(\s|\w|\d|<br\/>)*?$/;
          msgText = filter.exec(msgText);
          var room = msgObj.roomname
          user = filter.exec(user);
          if (msgText !== null && user !== null && msgText[0] !== 'undefined' && room === newRoom && msgText[0].length !== 0) {
            $chats.append('<div class="singleMessage">' + msgText[0] + ' : ' + user[0] + '</div>');
          }
        }
      }
    });
  }

  $('#roomList').on('click', '.singleRoom', function(){
    var room = $(this).text();
    app.toggleRoom(room);
    // console.log('room', room);
  });

  $retrieveButton.on('click', function(){
    $('div').remove('.singleRoom');
    app.fetch();
    app.fetchRooms();
  });

  app.send = function(message) {
    console.log('message', message);
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
  };

  $submitButton.on('click', function(){
    app.send(message);
  });

});
