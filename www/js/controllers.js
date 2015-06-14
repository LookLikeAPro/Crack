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
      encodingType: Camera.EncodingType.JPEG,
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

}); 

app.controller('AccountCtrl', function($scope, sessionService) {
  $scope.settings = {
    enableFriends: true,
    enableTranslation: true,
    language: 'en'
  };
  $scope.languages = [{display:'English', code:'en'}, {display:'French', code:'fr'}, {display:'Japanese', code:'jp'}];
  $scope.username = sessionService.getUsername();
});
