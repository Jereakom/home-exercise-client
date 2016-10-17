angular.module('someklone.controllers', [])

.controller('HomeCtrl', function($scope, Posts, Users, $http, $state, $timeout) {
    if (Users.getActiveUser() == null)
    {
        $state.go('login');
    }

    $scope.getPosts = function(){
      Posts.getAllPosts().then(function(data)
      {
        Posts.getTags().then(function(){
          $scope.posts = data;
        });
      }
    );
    }

    $scope.searchTag = function(searchValue){
      $state.go('tab.browse-search', {search: searchValue, goSearch: 1, tag: 1});
    }

    $scope.activeuser = Users.getActiveUser();

    $scope.like = function(postID, userID){
      Posts.like(postID, userID);
      $state.reload();
    };

    $scope.comment = {};

    $scope.addComment = function(postID, userID)
    {
        var commentURL = "https://home-exercise-server.herokuapp.com/comments/"+postID+"/"+userID;
        var comment = $scope.comment.comment;
        if (comment === undefined){
          comment = "Generic meme response #"+Math.round(Math.random()*10000);
        }
        var data = {
          comment: comment
        };
        $http.post(commentURL, data).then(function(){
            $state.reload();
          });
    };
})

.controller('BrowseCtrl', function($scope, $state, Posts, Users) {
    if (Users.getActiveUser() == null)
    {
        $state.go('login');
    }


    Posts.getAllPosts().then(function(data)
    {
      $scope.posts = data;
    }
    );


    $scope.activateSearch = function()
    {
        $state.go('tab.browse-search');
    }

    $scope.browseDetail = function(id)
    {
        $state.go('tab.browse-detail', { id: id, fromCard: 1 });
    }

})

.controller('BrowseDetailCtrl', function($scope, $ionicHistory, $stateParams, Posts, Users, $state, $http) {
    if (Users.getActiveUser() == null)
    {
        $state.go('login');
    }

    Posts.getAllPosts().then(function(){
      Posts.getTags();
    });

    $scope.goBack = function()
    {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $state.go('tab.browse');
    }

    $scope.activeuser = Users.getActiveUser();

    if ($stateParams.fromCard == 1){
      Posts.getOnePost($stateParams.id).then(function(data){
        $scope.posts = data;
      });
    }

    $scope.like = function(postID, userID){
      Posts.like(postID, userID);
      $state.reload();
    };

    $scope.searchTag = function(searchValue){
      $state.go('tab.browse-search', {search: searchValue, goSearch: 1, tag: 1});
    }

    $scope.comment = {};

    $scope.addComment = function(postID, userID)
    {
        var commentURL = "https://home-exercise-server.herokuapp.com/comments/"+postID+"/"+userID;
        var comment = $scope.comment.comment;
        if (comment === undefined){
          comment = "Generic meme response #"+Math.round(Math.random()*10000);
        }
        var data = {
          comment: comment
        };
        $http.post(commentURL, data).then(function(){
          $state.reload();
        });
    };

})

.controller('SearchCtrl', function($scope, $state, $ionicHistory, Posts, Users, $stateParams, $http) {

    if (Users.getActiveUser() == null)
    {
        $state.go('login');
    }

    // Posts.getAllPosts().then(function(){
    //   Posts.getTags();
    // });

    $scope.input = {
        searchText: $stateParams.search
    };

    $scope.browseDetail = function(id)
    {
        $state.go('tab.browse-detail', { id: id, fromCard: 1 });
    }

    $scope.searchResults = {
        people: [],
        tags: []
    }

    $scope.tabs = {
        people: true,
        tags: false
    }

    $scope.goBack = function()
    {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $state.go('tab.browse');
    }

    $scope.emptySearch = function()
    {
        $scope.input.searchText = "";
    }

    $scope.tabActivate = function(tab)
    {
        for (var k in $scope.tabs) {
            if ($scope.tabs.hasOwnProperty(k))
            {
                $scope.tabs[k] = false;
                // console.log($scope.tabs);
            }
        }
        $scope.tabs[tab] = true;
        // console.log($scope.tabs);
    }

    $scope.updateSearch = function()
    {

          if($scope.tabs.people == true)
          {
            Posts.searchUser($scope.input.searchText).then(function(result) {
              // $scope.searchResults.people = result;
              $scope.posts = result;
            });
          }
          else // search for posts with tags
          {
            Posts.searchTagPosts($scope.input.searchText).then(function(result){
              $scope.tagposts = result;
            });
          }
    }

    if ($stateParams.goSearch)
    {
      // $scope.tabs.people = true;
      // $scope.tabs.tags = false;

      if ($stateParams.tag)
      {
        $scope.tabs.people = false;
        $scope.tabs.tags = true;
        $stateParams.tag = null;
      }
      $scope.updateSearch();
    }
})

.controller('PostCtrl', function($scope, $state, $ionicHistory, Users) {
    if (Users.getActiveUser() == null)
    {
        $state.go('login');
    }


    $scope.tabs = {
        gallery: true,
        photo: false
    }

    $scope.goBack = function()
    {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('tab.home');
    }

    $scope.photo = function()
    {
        $scope.tabs.photo = true;
        $scope.tabs.gallery = false;

        var options = {

        // Some common settings are 20, 50, and 100

        quality: 100,

        destinationType: Camera.DestinationType.FILE_URI,

        sourceType: Camera.PictureSourceType.CAMERA,

        encodingType: Camera.EncodingType.JPEG,

        mediaType: Camera.MediaType.PICTURE,

        correctOrientation: true
        };

        navigator.camera.getPicture(function cameraSuccess(imageUri) {

        $scope.$apply(function(){

        $scope.photo.picture = imageUri;

        console.log(imageUri);

        });

        }, function cameraError(error) {

        console.debug("Unable to obtain picture: " + error, "app");

        }, options);
    }

    $scope.gallery = function()
    {
        $scope.tabs.photo = false;
        $scope.tabs.gallery = true;

        var options = {

        quality: 100,

        destinationType: Camera.DestinationType.FILE_URI,

        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,

        encodingType: Camera.EncodingType.JPEG,

        mediaType: Camera.MediaType.PICTURE,

        correctOrientation: true

        };

        navigator.camera.getPicture(function cameraSuccess(imageUri) {

        $scope.$apply(function(){

        $scope.gallery.picture = imageUri;

        console.log(imageUri);

        });

        }, function cameraError(error) {

        console.debug("Unable to obtain picture: " + error, "app");

        }, options);

    }

    $scope.confimPost = function()
    {
        if ($scope.tabs.photo)
        {
          $state.go('post-confirm', {uri: $scope.photo.picture});
        }
        else if ($scope.tabs.gallery)
        {
          $state.go('post-confirm', {uri: $scope.gallery.picture});
        }
    }

})

.controller('PostConfirmCtrl', function($scope, $state, $ionicHistory, $stateParams, Posts, Users, $cordovaFileTransfer){
    if (Users.getActiveUser() == null)
    {
        $state.go('login');
    }

    $scope.goBack = function()
    {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('post');
    }

    $scope.sharePost = function()
    {
        $scope.uploadPhoto($scope.imageURI);
    }

    $scope.user = Users.getActiveUser();

    $scope.post = {};
    $scope.imageURI = $stateParams.uri;

    $scope.uploadPhoto = function(imageURI)
    {
        var options = new FileUploadOptions()
        options.fileKey = "image";

        $cordovaFileTransfer.upload('https://home-exercise-server.herokuapp.com/upload', imageURI, options).then(function(result) {
            console.log("File upload complete");
            console.log(result);
            console.log(result.response);
            $scope.uploadResults = "Upload completed successfully"
            $scope.imageURI = result.response;
            Posts.addPost($scope.imageURI, $scope.post.capt, $scope.user.id);
            $state.go('tab.home');
        }, function(err) {
            console.log("File upload error");
            console.log(err);
            $scope.uploadResults = "Upload failed"
        }, function (progress) {
            // constant progress updates
            console.log(progress);
        });
    }

})

.controller('LoginCtrl', function($scope, $state, Users, $http){
  $scope.data ={};
  $scope.register = function(){
    console.log(Users.getActiveUser());
    $http.post("https://home-exercise-server.herokuapp.com/register", $scope.data).then(function(result){
      var id = result.data.id;
      var username = result.data.username;
      var profileImage = result.data.profileImage;
      var data = {
        "id": id,
        "username": username,
        "profileImage": profileImage,
        "profileImageSmall": profileImage
      };
      Users.setActiveUser(data);
      if (Users.getActiveUser()){
        $state.go('tab.home');
      }
    })
  };

  $scope.login = function() {
    $http.post("https://home-exercise-server.herokuapp.com/login", $scope.data).then(function(result){
      console.log(result.data[0]);
      console.log(Users.getActiveUser());
      // Users.setActiveUser(result.data[0]);
      var id = result.data[0].id;
      var username = result.data[0].username;
      var profileImage = result.data[0].profileImage;
      var data = {
        "id": id,
        "username": username,
        "profileImage": profileImage,
        "profileImageSmall": profileImage
      };
      Users.setActiveUser(data);
      // console.log(Users.getActiveUser());
      if (Users.getActiveUser()){
        $state.go('tab.home');
      }
    });
  };
})

.controller('ActivityCtrl', function($scope, Users, $state) {
    if (Users.getActiveUser() == null)
    {
        $state.go('login');
    }

    $scope.activity = Users.getActiveUserActivity();
})

.controller('AccountCtrl', function($scope, Users, Posts, $state) {
    if (Users.getActiveUser() == null)
    {
        $state.go('login');
    }

    Posts.getAllPosts().then(function(){
      Posts.getTags();
    });

    $scope.userData = Users.getActiveUser();

    $scope.browseDetail = function(id)
    {
        $state.go('tab.browse-detail', { id: id, fromCard: 1 });
    }

    Posts.getUserPosts($scope.userData.id).then(function(results){
        $scope.posts = results;
    });
});
