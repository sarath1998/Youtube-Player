var CWNamespace = CWNamespace || {};

CWNamespace.helpers = {
  doesInclude: function(container, value) {
    var returnValue = false;
    var pos = container.indexOf(value);
    if (pos >= 0) {
      returnValue = true;
    }
    return returnValue;
  }
};

var angularSlyDemo = angular
  .module("careerwazeWebApp", ["ngAria", "ngRoute", "ui.bootstrap", "youtube-embed"])
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix("");
    $routeProvider
      .when("/", {
        templateUrl: "views/main/main.html"
      })
      .when("/youtube-data", {
        templateUrl: "views/youtube-app/youtubeapi.html",
        controller: "Youtube-ServiceCtrl"
      })
      .when("/youtube-filter", {
        templateUrl: "views/youtube-filter/youtube-filter.html",
        controller: "Youtube-filter"
      })
      .when("/youtube-EnglishObjects", {
        templateUrl: "views/youtube-Show-English-Titles/youtube-Show-English-Titles.html",
        controller: "YoutubeShowEnglishCtrl"
      })
      .when("/register", {
        templateUrl: "views/registration/register.html"
      })
      .otherwise({
        redirectTo: "/page-not-found"
      });

    $locationProvider.html5Mode(false);
  });

// Methods common to CareerWaze Browser JS

String.prototype.isEmpty = function() {
  return this.length === 0 || !this.trim();
};

//Number prototype
Number.prototype.between = function(a, b) {
  var min = Math.min(a, b),
    max = Math.max(a, b);

  return this > min && this < max;
};
