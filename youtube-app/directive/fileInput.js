var app = angular.module("careerwazeWebApp");
app.directive("fileinput", [
  function() {
    var helpers = CWNamespace.helpers;
    return {
      scope: {
        fileinput: "=",
        filepreview: "="
      },
      require: "ngModel",
      link: function(scope, element, attributes, ctrl) {
        element.bind("change", function(changeEvent) {
          var file = changeEvent.target.files[0];
          var filename = file.name;
          var filesize = file.size;
          var extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
          var maxAllowedSize = 8547855; //1-MB //40kb-40960

          var _validFileExtensions = ["jpg", "jpeg", "bmp", "gif", "png", "doc", "docx"];
          if (!helpers.doesInclude(_validFileExtensions, extension)) {
            return false;
          }
          if (filesize > maxAllowedSize) {
            return false;
          }

          scope.fileinput = changeEvent.target.files[0];
          var reader = new FileReader();
          reader.onload = function(loadEvent) {
            scope.$apply(function() {
              scope.filepreview = loadEvent.target.result;
            });
          };
          reader.readAsDataURL(scope.fileinput);
        });
      }
    };
  }
]);
