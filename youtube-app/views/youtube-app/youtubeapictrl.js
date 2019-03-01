angular
  .module("careerwazeWebApp")
  .controller("Youtube-ServiceCtrl", function(YoutubeService, $scope, $rootScope, $location, $window, $timeout, $q) {
    $scope.searchBox = {
      searchTerm: ""
    };
    $scope.noresponse = "";
    $scope.itemsTitle = [];
    $scope.itemslength = false;
    $scope.defaultSearchterm = "Angularjs";

    var loadDefaultResults = function(skill) {
      YoutubeService.getVideos(skill).then(
        function(response) {
          console.log(response);
          $scope.obj = response;
          $scope.itemslength = $scope.obj.data.items.length;
          if (!$scope.itemslength) {
            $scope.noresponse = "no data obtained";
          } else {
            $scope.theVideoId = $scope.obj.data.items[0].id.videoId;
            $scope.playingVideoTitle = $scope.obj.data.items[0].snippet.title;
            $scope.playingVideoDescription = $scope.obj.data.items[0].snippet.description;
          }
          $scope.searchBox.searchTerm = "";
        },
        function(err) {
          console.log(err);
        }
      );
    };

    $scope.loadResults = function(search) {
      YoutubeService.getVideos(search).then(
        function(response) {
          console.log(response);
          $scope.obj = response;
          $scope.itemslength = $scope.obj.data.items.length;
          if (!$scope.itemslength) {
            $scope.noresponse = "no data obtained";
          } else {
            $scope.theVideoId = $scope.obj.data.items[0].id.videoId;
            $scope.playingVideoTitle = $scope.obj.data.items[0].snippet.title;
            $scope.playingVideoDescription = $scope.obj.data.items[0].snippet.description;
          }
          $scope.searchBox.searchTerm = "";
        },
        function(err) {
          console.log(err);
        }
      );
    };
    $scope.playvideo = function(item) {
      $scope.theVideoId = item.id.videoId;
      $scope.playingVideoTitle = item.snippet.title;
      $scope.playingVideoDescription = item.snippet.description;
    };

    loadDefaultResults($scope.defaultSearchterm);
  });
