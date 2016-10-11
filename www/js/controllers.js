angular.module('someklone.controllers', [])

.controller('HomeCtrl', function($scope, Posts, Users, $http, $state) {
    if (Users.getActiveUser() == null)
    {
        $state.go('login');
    }

    $scope.getPosts = function(){
      Posts.getAllPosts().then(function(data)
      {
        $scope.posts = data;
      }
    );
    }

    $scope.activeuser = Users.getActiveUser();

    $scope.like = function(postID, userID){
      Posts.like(postID, userID);
      $scope.getPosts();
      };

    $scope.addComment = function(postID, userID, username)
    {
        var comment = $scope.commentScope.comment;

        var postToComment = $scope.posts[postID];

        var commentID = postToComment.comments.length;

        var refers = comment.match(/(@\w+)/ig);
        // search for username mentions
        if (refers){
          refers = refers.toString().match(/\w+/ig);
        }
        // search for tags
        var tags = comment.match(/(#\w+)/ig);

        if (tags){
          tags = tags.toString().match(/\w+/ig);
        }
        postToComment.comments.push(
          {
            id: commentID,
            user: {
                id: userID,
                username: username
            },
            comment: comment,
            userRefs: refers,
            tags: tags
        });
        $scope.commentScope.comment = "";
    };
})

.controller('BrowseCtrl', function($scope, $state) {

    $scope.activateSearch = function()
    {
        $state.go('tab.browse-search');
    }

    $scope.browseDetail = function(id)
    {
        $state.go('tab.browse-detail', { id: id });
    }

})

.controller('BrowseDetailCtrl', function($scope, $stateParams) {
    console.log($stateParams);
})

.controller('SearchCtrl', function($scope, $state, $ionicHistory, Users) {

    $scope.input = {
        searchText: ""
    };

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
            }
        }
        $scope.tabs[tab] = true;
    }

    $scope.updateSearch = function()
    {
        if($scope.tabs.people == true)
        {
            Users.searchUser($scope.input.searchText).then(function(result) {
                $scope.searchResults.people = result;
            });
        }
        else // search for posts with tags
        {

        }
    }



})

.controller('PostCtrl', function($scope, $state, $ionicHistory) {

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
    $scope.goBack = function()
    {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('post');
    }

    $scope.sharePost = function()
    {
        $scope.imageURI;
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

.controller('ActivityCtrl', function($scope, Users) {
    $scope.activity = Users.getActiveUserActivity();
})

.controller('AccountCtrl', function($scope, Users, Posts) {
    $scope.userData = Users.getActiveUser();

    Posts.getUserPosts($scope.userData.id).then(function(results){
        $scope.posts = results;
    });
});
