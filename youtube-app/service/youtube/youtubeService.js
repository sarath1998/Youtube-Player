angular.module("careerwazeWebApp").factory("YoutubeService", function($q, $http, config, $timeout) {
  var youtubeService = {};
  // var _learningByContentType = function () {
  //   // var deferred = $q.defer();
  //   // var url = 'url'
  //   // $http.get(getRecommendationsUrl).then(
  //   //   function (response) {
  //   //     deferred.resolve(response);
  //   //     CWAppCache.put(response);
  //   //   },
  //   //   function (error) {
  //   //     deferred.reject(error);
  //   //   }
  //   // );
  //   // return deferred.promise;
  // };
  // // youtubeService.learning = _learningByContentType;

  var _timeout = function() {
    var deferred = $q.defer();
    var arr = ["AngularJS", "ReactJS", "NodeJS"];
    var timeOutFunc = $timeout(function() {
      return arr;
    }, 3000);

    timeOutFunc.then(
      function(response) {
        // console.log(response);
        deferred.resolve(response);
      },
      function(err) {
        deferred.reject(err);
      }
    );
    return deferred.promise;
  };

  var _getVideos = function(skill) {
    var deferred = $q.defer();
    var url =
      "https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyD7ZGJrgPN-aO3BL-6tkCQ2mwYfDZ9HzNs&type=video&safeSearch=strict&videoCategoryId=28&order=rating&relevanceLanguage=en&maxResults=50&q=";
    url = url + skill;
    console.log(url);
    $http.get(url).then(
      function(response) {
        deferred.resolve(response);
      },
      function(error) {
        deferred.reject(error);
      }
    );
    return deferred.promise;
  };

  youtubeService.timeout = _timeout;
  youtubeService.getVideos = _getVideos;
  return youtubeService;
});
