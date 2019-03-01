angular
  .module("careerwazeWebApp")
  .controller("MainController", function(YoutubeService, $scope, $rootScope, $location, $window, $timeout, $q) {
    var helpers = CWNamespace.helpers;
    $scope.foo = "Heading from controller";
    $scope.skillArray = [];
    $scope.youtubeModel = {
      searchFor: ""
    };

    YoutubeService.timeout().then(
      function(response) {
        $scope.skillArray = response;
        //console.log($scope.skillArray);
      },
      function(err) {
        console.log(err);
      }
    );

    // function that fetches videos based on the entry in the url
    $scope.loadDefaultResults = function(search) {
      console.log(search);
      YoutubeService.getVideos(search).then(
        function(response) {
          $scope.obj = response;
          console.log($scope.obj);
          // for(i=0;i<$scope.obj.data.items.length;i++){
          //   console.log($scope.obj.data.items[i].snippet.channelTitle);
          //   $scope.itemsTitle.push($scope.obj.data.items[i].snippet.channelTitle);
          // }
          // console.log( $scope.itemsTitle);
        },
        function(err) {
          console.log(err);
        }
      );
    };
  });
