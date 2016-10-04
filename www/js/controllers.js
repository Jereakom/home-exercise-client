angular.module('someklone.controllers', [])

.controller('HomeCtrl', function($scope, $rootScope, Posts, Users, $http) {

    Posts.following().then(function(data)
        {
            $scope.posts = data;
            Posts.getPostFromServer();
        }
    );
    $scope.activeuser = Users.getActiveUser();
    $scope.commentScope = {
      like: Posts.like
    };
    $scope.addComment = function(postID, userID, username)
    {
        var comment = $scope.commentScope.comment;
        var postToComment = $scope.posts[postID];
        var commentID = postToComment.comments.length;
        var refers = comment.match(/(@\w+)/ig);
        if (refers){
          refers = refers.toString().match(/\w+/ig)
        }
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
    };
    // $scope.comment = "test";
    // Posts.addComment("test asdasdasds", 0, 1, "dtrump");
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

        // The use of $apply is required to make angular aware of the changed situation,

        // without it you will not see the image on the screen as expected.

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

        // fetch photos

        var options = {

        // Some common settings are 20, 50, and 100

        quality: 100,

        destinationType: Camera.DestinationType.FILE_URI,

        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,

        encodingType: Camera.EncodingType.JPEG,

        mediaType: Camera.MediaType.PICTURE,

        correctOrientation: true

        };

        navigator.camera.getPicture(function cameraSuccess(imageUri) {

        // The use of $apply is required to make angular aware of the changed situation,

        // without it you will not see the image on the screen as expected.

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

.controller('PostConfirmCtrl', function($scope, $state, $ionicHistory, $stateParams, Posts){
    $scope.goBack = function()
    {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('post');
    }

    $scope.sharePost = function()
    {

        Posts.addPost($scope.imageURI, $scope.post.capt);
        $state.go('tab.home');
    }
    $scope.post = {};
    $scope.imageURI = $stateParams.uri;
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
