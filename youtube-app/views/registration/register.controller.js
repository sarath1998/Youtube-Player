angular
    .module("careerwazeWebApp")
    .controller("RegisterController", function (
        YoutubeService,
        $scope,
        $rootScope,
        $location,
        $window,
        $timeout,
        $q
    ) {
        var helpers = CWNamespace.helpers;
        $scope.bar = 'Heading from controller';
    });