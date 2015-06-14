app.factory('socket', ['socketFactory',function (socketFactory) {
  mySocket = socketFactory({
    ioSocket: io.connect('http://173.255.194.96:9001')
  });
  return mySocket;
}]);

app.factory('Camera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      
      return q.promise;
    }
  };
}]);

app.service('sessionService', function ($rootScope, socket, $sceDelegate){
  var user = {
    username: 'bob',
    password: '1234',
    email: 'jerryzhou00@gmail.com'
  };
  var settings = {
    enableFriends: true,
    enableTranslation: true,
    language: 'en'
  };
  var users = [];
  var chatroom = [];
  var messages = [];
  var myself = this;
  socket.on('updateusers', function(_users){
    var temp = [];
    for (var property in _users) {
      if (_users.hasOwnProperty(property) && _users[property] && _users[property].toString() !== user.username) {
        temp.push(myself.getChat(_users[property].toString()));
      }
    }
    users = temp;
    console.log(users);
    $rootScope.$broadcast('updateusers');
  });
  socket.on('activeusers', function(_users){
    for (var property in _users) {
      if (_users.hasOwnProperty(property)) {
        for (var i=0; i<users.length; i++) {
          if (users[i].username == property) {
            users[i].avatar = _users[property];
          }
        }
      }
    }
  });
  socket.on('connect', function() {
    if(user.username) {
      socket.emit('adduser', user.username);
    }
  });
  socket.on('updatechat', function (message){
    message.time = new Date();
    if (message.ttsurl) {
      message.ttsurl = $sceDelegate.trustAs('resourceUrl', message.ttsurl);
    }
    console.log(message);
    if (message.hasOwnProperty('username') || !message.hasOwnProperty('touser')) {
      chatroom.push(message);
      $rootScope.$broadcast('updatechatroom', {});
    }
    else {
      if (message.fromuser != user.username) { //message not from me
        for(var i=0; i<users.length; i++) {//'userlist' 'ttsurl'
          if (users[i].username==message.fromuser) {
            if (users[i].hasOwnProperty('messages')) {
              users[i].messages.push(message);
            }
            else {
              users[i].messages = [message];
            }
          }
        }
      }
      else { //message from me
        for(var i=0; i<users.length; i++) {
          if (users[i].username==message.touser) {
            if (users[i].hasOwnProperty('messages')) {
              users[i].messages.push(message);
            }
            else {
              users[i].messages = [message];
            }
          }
        }
      }
    }
  });
this.sendMessage = function(message, user){
  console.log("sending");
  if (user) {
    socket.emit('sendchat', message, user);
  }
  else {
    socket.emit('sendchat', message);
  }
};
this.login = function(_username, email, password) {
  user.username = _username;
  user.email = email;
  user.password = password;
  socket.emit('adduser', user.username);
  socket.emit('userlist');
};
this.getUsername = function() {
  return user.username;
};
this.sendImage = function(imageData){
  socket.emit('sendimage', imageData, 'test.jpg');
};
this.getUsers = function(){
  if (users){
    var removeIndex = users.indexOf(user.username);
    if (removeIndex > -1) {
      users.splice(removeIndex, 1);
    }
  }
  return users;
};
this.getChat = function(username){
  for (var i=0; i<users.length; i++) {
    if (users[i].username == username) {
      return users[i];
    }
  }
  return {username: username, messages: []};
};
this.getChatroom = function() {
  return chatroom;
};
this.setSettings = function(_settings) {
  settings = _settings;
};
this.getSettings = function() {
  return settings;
};
});
