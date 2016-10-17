angular.module('someklone.services').factory('Users', function($q, $http) {

    var activeUser = null;

    var users = [];


    return {
        getOne: function(key)
        {
            return $q(function(resolve, reject){
                for(var i = 0; i < users.length; i++)
                {
                    if(users[i].id == key)
                    {
                        resolve(users[i]);
                    }
                }
                reject();

            });
        },
        getAllUsers: function()
        {
            return $q(function(resolve, reject){
                users = [];
                $http.get("https://home-exercise-server.herokuapp.com/users").then(function(data) {
                console.log(data);
                for (var i = 0; i < data.data.length; i++) {
                    var User ={
                        "id": data.data[i].id,
                        "username": data.data[i].username,
                        "profileImageSmall": data.data[i].profileImage
                      };
                    users.push(User);
                  }
                });
                resolve(users);
        });
        },
        getActiveUser: function()
        {
            return activeUser;
        },
        test: function()
        {
          return users;
        },
        setActiveUser: function(user)
        {
          activeUser = user;
        },
        getActiveUserActivity: function()
        {
            return activeUser.activity;
        },
        searchUser: function(searchWord) {

            var upperCaseSearchWord = searchWord.toUpperCase();
            return $q(function(resolve, reject){
                if((searchWord.length > 0) && (users.length == 0))
                {
                    var jusers = [];
                    $http.get("https://home-exercise-server.herokuapp.com/users").then(function(data) {
                    console.log(data);
                    for (var i = 0; i < data.data.length; i++) {
                        var User ={
                            "id": data.data[i].id,
                            "username": data.data[i].username,
                            "profileImageSmall": data.data[i].profileImage
                          };
                        jusers.push(User);
                      }
                    }).then(function(){
                    var matches = users.filter(function(u){
                        var testString = u.username.toUpperCase();
                        return testString.includes(upperCaseSearchWord);
                    });
                    resolve(matches);
                  });
                }
                else if ((searchWord.length > 0) && (users.length > 0))
                {
                  var matches = users.filter(function(u){
                      var testString = u.username.toUpperCase();
                      return testString.includes(upperCaseSearchWord);
                  });

                  resolve(matches);
                }
                else
                {
                  reject();
                }
            });
        },

    };
})
