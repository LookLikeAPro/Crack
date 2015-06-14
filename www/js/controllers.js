app.controller('LoginCtrl', function($scope, $state, sessionService) {  
  $scope.submit = function(username, email, password) {
    sessionService.login(username, email, password);
    $state.go('tab.dash');
  };
  
}); 

app.controller('DashCtrl', ['$scope',  'sessionService', '$cordovaCamera', '$interval', function ($scope, sessionService, $cordovaCamera, $interval) {
  $scope.sendMessage = function(text) {
    $scope.sendText = '';
    sessionService.sendMessage(text);
  };
  $scope.play = function(index){
    angular.element(document.querySelector('#link'+index))[0].play();
  };

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
  $interval(function(){
    $scope.currentDate = new Date();
  }, 1000);
  $scope.formatTime = function(time){
    time = parseInt(time);
    if (time < 1){
      return '< 1 min';
    }
    else {
      return time + ' min';
    }
  };
  $scope.messages = sessionService.getChatroom();
  $scope.username = sessionService.getUsername();
  $scope.$on('updatechatroom', function(event, args) {
    $scope.messages = sessionService.getChatroom();
  });
  $scope.sessionService = sessionService; //holy shit bad code
}]);

app.controller('ChatsCtrl', function($scope, $interval, sessionService) {  
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
  $scope.chats = sessionService.getUsers();
  $scope.$on('updateusers', function(){
    $scope.chats = sessionService.getUsers();
  });
});

app.controller('ChatDetailCtrl', function($scope, $stateParams, socket, sessionService, $interval) {
  $scope.chat = sessionService.getChat($stateParams.user);
  $scope.sendMessage = function(text) {
    $scope.sendText = '';
    sessionService.sendMessage(text, $stateParams.user);
  };
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
  $interval(function(){
    $scope.currentDate = new Date();
  }, 1000);
  $scope.formatTime = function(time){
    time = parseInt(time);
    if (time < 1){
      return '< 1 min';
    }
    else {
      return time + ' min';
    }
  };
  $scope.play = function(index){
    angular.element(document.querySelector('#link'+index))[0].play();
  };
  $scope.username = sessionService.getUsername();
  $scope.sessionService = sessionService; //holy shit bad code
}); 

app.controller('AccountCtrl', function($scope, sessionService) {
  $scope.settings = {
    enableFriends: true,
    enableTranslation: true,
    language: 'en'
  };
  $scope.languages = [{display:'English', code:'en'}, {display:'French', code:'fr'}, {display:'Japanese', code:'jp'}];
  $scope.$watch('settings', function(){
    sessionService.setSettings($scope.settings);
  });
  $scope.username = sessionService.getUsername();
});
