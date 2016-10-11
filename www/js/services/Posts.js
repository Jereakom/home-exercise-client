angular.module('someklone.services').factory('Posts', function($q, $http) {

    var posts = [];

    return {
        // posts from myself and the from the users i am following
        following: function()
        {
            return $q(function(resolve, reject){
                resolve(posts);
            });
        },
        // most recent posts
        recent: function()
        {
            return $q(function(resolve, reject){
                resolve(posts);
            });
        },
        // search posts based on tags
        searchTag: function()
        {
            return $q(function(resolve, reject){
                resolve(posts);
            });
        },
        getAllPosts: function()
        {
            return $q(function(resolve, reject){
            posts = [];
            $http.get("https://home-exercise-server.herokuapp.com/posts").then(function(data) {
            for (var i = 0; i < data.data.length; i++) {
                var id = data.data[i].id;
                var image = data.data[i].image;
                var likes = data.data[i].likes;
                var caption = data.data[i].caption;
                var tags = data.data[i].tags;
                var comments = data.data[i].comments;
                var post ={
                  "id":id,
                  "user": {
                    "id": data.data[i].User.id,
                    "username": data.data[i].User.username,
                    "profileImageSmall": data.data[i].User.profileImage
                  },
                  "image":image,
                  "imageThumbnail":image,
                  "likes":0,
                  "caption":caption,
                  "tags":tags,
                  "comments":comments,
                  "likes":likes
                  };
                posts.push(post);
              }
            });
            resolve(posts);
          });
        },
        // get all posts of single user
        getUserPosts: function(userId)
        {
            return $q(function(resolve, reject){

              var userposts = [];
              var url = "https://home-exercise-server.herokuapp.com/users/"+userId+"/posts";
              $http.get(url).then(function(data) {
              for (var i = 0; i < data.data.length; i++) {
                var id = data.data[i].id;
                var image = data.data[i].image;
                var likes = data.data[i].likes;
                var caption = data.data[i].caption;
                var tags = data.data[i].tags;
                var comments = data.data[i].comments
                var post ={
                  "image": image,
                  "imageThumbnail": image,
                  "likes":0,
                  "caption": caption,
                  "tags": tags,
                  "comments": comments,
                  "likes": likes
                  };
                  userposts.push(post);
                };
              });
                resolve(userposts);
            });
        },
        addPost: function(image, caption, userId)
        {
          var data = {
            "UserId": userId,
            "image":image,
            "imageThumbnail":image,
            "caption": caption,
            "tags":[]
          };
          $http.post("https://home-exercise-server.herokuapp.com/posts", data).then(function(result){
            console.log(result);
          });
        },
        like: function(postID, userID)
        {
          var postLikeURL = "https://home-exercise-server.herokuapp.com/likes/"+postID+"/"+userID;
          $http.post(postLikeURL).then(function(result){
            return result;
          });
       }
    };
});
