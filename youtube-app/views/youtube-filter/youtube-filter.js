angular
  .module("careerwazeWebApp")
  .controller("Youtube-filter", function(YoutubeService, $scope, $rootScope, $location, $window, $timeout, $q) {
    $scope.searchBox = {
      searchTerm: ""
    };
    $scope.itemsTitle = [];
    $scope.englishTitles = [];
    var input = {};

    var reg = /^[A-Za-z0-9 \-#,[]| ]+$/;
    var reg1 = /^[a-zA-Z0-9!@#$&()\\-`.+,/" ]+$/;
    var reg3 = /\w/g;
    var outputResults = [];

    $scope.loadResults = function(search) {
      YoutubeService.getVideos(search).then(
        function(response) {
          // console.log(response);
          var obj = response;
          for (var i = 0; i < obj.data.items.length; i++) {
            $scope.itemsTitle.push(obj.data.items[i].snippet.title);
          }

          $scope.itemsTitle.forEach(function(listItem, index) {
            input.sentence = listItem;
            // console.log(input.sentence);
            Algorithmia.client("simtC95YKkxBXrFud7FeRQqp04z1")
              .algo("nlp/LanguageIdentification/1.0.0")
              .pipe(input)
              .then(function(output) {
                console.log("inside then function ; " + input.sentence);
                console.log(output.result[0].language);
                if (output.result[0].language === "en") {
                  console.log("match found");
                  outputResults.push(input.sentence);
                }
              });
          });

          // console.log($scope.itemsTitle);
          // for (let m = 0; m < $scope.itemsTitle.length; m++) {
          //   // console.log($scope.itemsTitle[i]);
          //   // if (reg3.test($scope.itemsTitle[i])) {
          //   //   $scope.englishTitles.push($scope.itemsTitle[i]);
          //   // }
          //   var input = {};
          //   input.sentence = $scope.itemsTitle[m];
          //   // console.log("title : " + input.sentence);
          //   Algorithmia.client("simtC95YKkxBXrFud7FeRQqp04z1")
          //     .algo("nlp/LanguageIdentification/1.0.0")
          //     .pipe(input)
          //     .then(function(output) {
          //       console.log("inside then function ; " + input.sentence);
          //       console.log(output.result[0].language);
          //       if (output.result[0].language === "en") {
          //         console.log("match found");
          //         outputResults.push(input.sentence);
          //       }
          //     });
          // }
        },
        function(err) {
          console.log(err);
        }
      );
    };
  });

//
