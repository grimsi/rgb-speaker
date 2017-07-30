var app = angular.module('rgbSpeaker', ['ngMaterial', 'ngCookies', 'mdColorPicker']);

app.controller('mainCtrl', function ($scope, $cookies) {
    var sp = require('serialport');
    $scope.openPorts = [];
    $scope.colorPicker = {};
    var SerialPort = {};
    $scope.colorPicker.options = {
        label: "Choose a color",
        icon: "brush",
        default: "#f00",
        genericPalette: false,
        materialPalette: false,
        hsl: false,
        hex: false,
        openOnInput: false,
        clickOutsideToClose: false,
        alphaChannel: false
    };
    $scope.spinner = false;

    init();

    sp.list(function (err, ports) {
        ports.forEach(function (port) {
            $scope.openPorts.push(port.comName);
        })
    });

    $scope.$watch('port', function () {
        if (angular.isDefined($scope.port)) {
            SerialPort = new sp($scope.port, {
                baudrate: 9600,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                flowControl: false
            });
            $cookies.put('port', $scope.port);
            SerialPort.open(function () {
                console.log("Port opened");
            });
        }
    });

    $scope.$watch('colorPicker.color', function () {
        if (angular.isDefined($scope.colorPicker.color) && $scope.colorPicker.color.slice(0, 3) === "rgb") {
            var color = "c" + _.clone($scope.colorPicker.color.slice(3, $scope.colorPicker.color.length));
            $cookies.put('color', $scope.colorPicker.color);
            SerialPort.write(color);
        }
    });

    function init() {
        $scope.spinner = true;
        if (angular.isDefined($cookies.get('port'))) {
            $scope.port = $cookies.get('port');
        }
        setTimeout(function () {
            if (angular.isDefined($cookies.get('color')) && angular.isDefined($cookies.get('port'))) {
                $scope.colorPicker.color = $cookies.get('color');
            }
            if (angular.isDefined($cookies.get('mode'))) {
                $scope.mode = $cookies.get('mode');
            }
            $scope.spinner = false;
        }, 500);
    }
});