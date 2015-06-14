app.controller('LoginCtrl', function($scope, $state, sessionService) {  
  $scope.submit = function(username, email, password) {
    sessionService.login(username, email, password);
    $state.go('tab.dash');
  };
  
}); 

app.controller('DashCtrl', ['$scope',  'sessionService', '$cordovaCamera', function ($scope, sessionService, $cordovaCamera) {
  $scope.sendMessage = function(text) {
    sessionService.sendMessage(text, []);
  };
  $scope.$on('updatechat', function(event, data){
    $scope.messages.push(data);
  });
  $scope.captureImage = function() {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      sessionService.sendImage(imageData);
    }, function(err) {
      // error
    });
  };

  $scope.username = sessionService.getUsername();
  $scope.messages = [];
}]);

app.controller('ChatsCtrl', function($scope, Chats) {  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
});

app.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, socket) {
  $scope.chat = Chats.get($stateParams.chatId);
  socket.emit('new message', {text:'ol'});
  socket.on('test', function (data) {
    console.log("RECEIVED:"+JSON.stringify(data));
  });

}); 

app.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
