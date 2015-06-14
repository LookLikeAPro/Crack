app.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

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

app.service('sessionService', function ($rootScope, socket){
  var user = {
    username: 'Bob',
    password: '1234',
    email: 'jerryzhou00@gmail.com'
  };
  var messages = [];
  socket.on('updateusers', function(users){
    console.log(JSON.stringify(users));
  });
  socket.on('updatechat', function (message){
    alert(JSON.stringify(message));
    $rootScope.$broadcast('updatechat', message);
  });
  this.sendMessage = function(message, user){
    socket.emit('sendchat', message);
  };
  this.login = function(username, email, password) {
    user.username = username;
    user.email = email;
    user.password = password;
    socket.emit('adduser', user.username);
  };
  this.getUsername = function() {
    return user.username;
  };
  this.sendImage = function(imageData){
    socket.emit('sendimage', imageData, 'test.jpg');
  };
});
