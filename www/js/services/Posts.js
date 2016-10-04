angular.module('someklone.services').factory('Posts', function($q, $http) {

    var posts = [
        {
            id: 0,
            user: {
                id: 1,
                username: "dtrump",
                profileImageSmall: "http://core0.staticworld.net/images/article/2015/11/111915blog-donald-trump-100629006-primary.idge.jpg"
            },
            image: "http://media1.fdncms.com/sacurrent/imager/u/original/2513252/donald_trump4.jpg",
            imageThumbnail: "http://media1.fdncms.com/sacurrent/imager/u/original/2513252/donald_trump4.jpg",
            likes: [],
            caption: "Always winning #elections",
            tags: ['elections'],
            comments: [
                {
                    id: 0,
                    user: {
                        id: 2,
                        username: "POTUS"
                    },
                    comment: "You're never going to make it don #losing",
                    userRefs: [],
                    tags: ["losing"]
                },
                {
                    id: 1,
                    user: {
                        id: 3,
                        username: "HillaryC"
                    },
                    comment: "Damn right @POTUS",
                    userRefs: ["POTUS"],
                    tags: []
                },
            ]

        }
    ]

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
        // get all posts of single user
        getUserPosts: function(userId)
        {
            return $q(function(resolve, reject){

                // execute the search and return results

                resolve(posts); // placeholder
            });
        },
        getPostFromServer: function()
        {
          $http.get('https://home-exercise-server.herokuapp.com/api/posts').then(function(response){
            var string = JSON.stringify(response.data);
            var id = posts.length;
            // begin dirty hackjob
              var data ={"id":id,
                          "user": {
                              "id":10,
                              "username": "schyster",
                              "profileImageSmall":"http://ericpetersautos.com/wp-content/uploads/2013/11/shyster.jpg"
                            },
                          "image":"https://www.nasa.gov/sites/default/files/styles/image_card_4x3_ratio/public/thumbnails/image/leisa_christmas_false_color.png?itok=Jxf0IlS4",
                          "imageThumbnail":"https://www.nasa.gov/sites/default/files/styles/image_card_4x3_ratio/public/thumbnails/image/leisa_christmas_false_color.png?itok=Jxf0IlS4",
                          "likes":[],
                          "caption":"Placeholder post from the server",
                          "tags":[],
                          "comments":[]
                          };
            // endOf dirty hackjob
            posts.push(data);
          });
        },
        like: function(postID, userID, username)
        {
          var liked = false;

          var postToLike = posts[postID];

          var currentuser = username;

          var index = postToLike.likes.indexOf(currentuser);
          if (index == -1)
          {
            postToLike.likes.push(currentuser);
            return;
          }

         var pop = postToLike.likes.indexOf(currentuser);
         postToLike.likes.splice(pop, 1);

        }
    };
});
