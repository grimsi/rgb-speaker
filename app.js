var app = angular.module('rgbSpeaker', ['ngMaterial', 'mdColorPicker']);

app.controller('mainCtrl', ['$scope', function ($scope) {
    $scope.colorPicker.options = {
        label: "Choose a color",
        icon: "brush",
        default: "#f00",
        genericPalette: false,
        history: false
    };
}]);