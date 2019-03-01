angular
  .module("careerwazeWebApp")
  .controller("YoutubeShowEnglishCtrl", function(YoutubeService, $scope, $rootScope, $location, $window, $timeout, $q) {
    $scope.searchBox = {
      searchTerm: ""
    };
    $scope.itemsTitle = [];
    $scope.englishTitleObjects = [];
    var reg = /^[A-Za-z0-9 - ]+$/;

    $scope.loadResults = function(search) {
      YoutubeService.getVideos(search).then(
        function(response) {
          console.log(response);
          $scope.obj = response;
          for (var i = 0; i < $scope.obj.data.items.length; i++) {
            // console.log($scope.obj.data.items[i].snippet.channelTitle);
            $scope.itemsTitle.push($scope.obj.data.items[i].snippet.title);
          }
          for (i = 0; i < $scope.itemsTitle.length; i++) {
            if (reg.test($scope.itemsTitle[i])) {
              $scope.englishTitleObjects.push($scope.obj.data.items[i]);
            }
          }
          console.log($scope.itemsTitle);
          console.log($scope.englishTitleObjects);
        },
        function(err) {
          console.log(err);
        }
      );
    };
  });
