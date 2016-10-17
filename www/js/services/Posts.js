angular.module('someklone.services').factory('Posts', function($q, $http) {

    var posts = [];

    var tags = [];

    $http.get("https://home-exercise-server.herokuapp.com/comments").then(function(res){
      tags = res;
    });

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
        searchUser: function(searchWord)
        {
          var upperCaseSearchWord = searchWord.toUpperCase();
          return $q(function(resolve, reject){
              if(searchWord.length > 0)
              {
                // posts.caption;
                // posts.comments.tags;


                  var matches = posts.filter(function(p){
                      if (p != null){
                        // var obj = JSON.parse(p);
                        var testString = p.user.username.toUpperCase();
                        return testString.includes(upperCaseSearchWord);
                      }
                  });
                  resolve(matches);
              }
              else
              {
                reject();
              }
          });
        },
        // search posts based on tags
        searchTag: function(searchWord)
        {
          var upperCaseSearchWord = searchWord.toUpperCase();
          return $q(function(resolve, reject){
              if(searchWord.length > 0)
              {
                // posts.caption;
                // posts.comments.tags;
                 var allTags = [];

                 for (var i = 0; i < posts.length; i++) {
                   var tag = posts[i].tags;
                   if (tag != null){
                     for (var i2 = 0; i2 < tag.length; i2++) {
                       if (allTags.indexOf(tag[i2]) == -1)
                       var str = "{\"tag\":\""+tag[i2]+"\", \"post\":\""+posts[i].id+"\"}"
                       var obj = JSON.parse(str);
                       allTags.push(obj);
                     }
                   }
                 }

                  tags.data;
                  for (var i = 0; i < tags.data.length; i++) {
                    var tag = tags.data[i].tags;
                    if (tag != null){
                      for (var i2 = 0; i2 < tag.length; i2++) {
                        if (allTags.indexOf(tag[i2]) == -1)
                        var str = "{\"tag\":\""+tag[i2]+"\", \"post\":\""+tags.data[i].PostId+"\"}"
                        var obj = JSON.parse(str);
                        allTags.push(obj);
                      }
                    }

                  }
                  allTags;

                  var matches = allTags.filter(function(p){
                      if (p != null){
                        // var obj = JSON.parse(p);
                        var testString = p.tag.toUpperCase();
                        return testString.includes(upperCaseSearchWord);
                      }
                  });
                  resolve(matches);
              }
              else
              {
                reject();
              }
          });
        },
        searchTagPosts: function(searchWord)
        {
          var upperCaseSearchWord = searchWord.toUpperCase();
          return $q(function(resolve, reject){
              if(searchWord.length > 0)
              {
                // posts.caption;
                // posts.comments.tags;
                 var allTags = [];

                 for (var i = 0; i < posts.length; i++) {
                   var tag = posts[i].tags;
                   if (tag != null){
                     for (var i2 = 0; i2 < tag.length; i2++) {
                       if (allTags.indexOf(tag[i2]) == -1)
                       var str = "{\"tag\":\""+tag[i2]+"\", \"post\":\""+posts[i].id+"\"}"
                       var obj = JSON.parse(str);
                       allTags.push(obj);
                     }
                   }
                 }

                  tags.data;
                  for (var i = 0; i < tags.data.length; i++) {
                    var tag = tags.data[i].tags;
                    if (tag != null){
                      for (var i2 = 0; i2 < tag.length; i2++) {
                        if (allTags.indexOf(tag[i2]) == -1)
                        var str = "{\"tag\":\""+tag[i2]+"\", \"post\":\""+tags.data[i].PostId+"\"}"
                        var obj = JSON.parse(str);
                        allTags.push(obj);
                      }
                    }

                  }
                  allTags;

                  var matches = allTags.filter(function(p){
                      if (p != null){
                        // var obj = JSON.parse(p);
                        var testString = p.tag.toUpperCase();
                        return testString.includes(upperCaseSearchWord);
                      }
                  });

                  var findThese = [];
                  var tagPosts = [];

                  for (var i = 0; i < matches.length; i++) {
                    findThese.push(matches[i].post);
                  }
                  for (var i = 0; i < findThese.length; i++) {
                    for (var i2 = 0; i2 < posts.length; i2++) {
                      if (posts[i2].id == findThese[i])
                      {
                        tagPosts.push(posts[i2]);
                      }
                    }
                  }
                  matches = tagPosts;

                  resolve(matches);
                // });
              }
              else
              {
                reject();
              }
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
                if (likes.length > 0){
                  for (var i4 = 0; i4 < likes.length; i4++) {
                    likes[i4] = JSON.parse(likes[i4]);
                  }
                }
                var caption = data.data[i].caption;
                var tags = data.data[i].tags;
                var comments = data.data[i].Comments;
                // if (comments.length > 0){
                //   for (var i7 = 0; i7 < comments.length; i7++) {
                //     comments[i7].text = JSON.parse(comments[i7]);
                //   }
                // }
                var post ={
                  "id":id,
                  "user": {
                    "id": data.data[i].Poster.id,
                    "username": data.data[i].Poster.username,
                    "profileImageSmall": data.data[i].Poster.profileImage
                  },
                  "image":image,
                  "imageThumbnail":image,
                  "likes":likes,
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
                var likes = data.data[i].likes
                if (likes.length > 0){
                  for (var i2 = 0; i2 < likes.length; i2++) {
                    likes[i2] = JSON.parse(likes[i2]);
                  }
                }
                var caption = data.data[i].caption;
                var tags = data.data[i].tags;
                var comments = data.data[i].comments;
                // if (comments.length > 0){
                //   for (var i3 = 0; i3 < comments.length; i3++) {
                //     comments[i3] = JSON.parse(comments[i3]);
                //   }
                // }
                var post ={
                  "id": id,
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
        getOnePost: function(postID)
        {
          return $q(function(resolve, reject){

            var posts = [];
            var url = "https://home-exercise-server.herokuapp.com/posts/"+postID;
            $http.get(url).then(function(data) {
              var id = data.data.id;
              var image = data.data.image;
              var likes = data.data.likes;
              if (likes.length > 0){
                for (var i4 = 0; i4 < likes.length; i4++) {
                  likes[i4] = JSON.parse(likes[i4]);
                }
              }
              var caption = data.data.caption;
              var tags = data.data.tags;
              var comments = data.data.Comments;
              // if (comments.length > 0){
              //   for (var i7 = 0; i7 < comments.length; i7++) {
              //     comments[i7] = JSON.parse(comments[i7]);
              //   }
              // }
              var post ={
                "id":id,
                "user": {
                  "id": data.data.Poster.id,
                  "username": data.data.Poster.username,
                  "profileImageSmall": data.data.Poster.profileImage
                },
                "image":image,
                "imageThumbnail":image,
                "likes":likes,
                "caption":caption,
                "tags":tags,
                "comments":comments,
                "likes":likes
                };
              posts.push(post);
            });
            resolve(posts);
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
