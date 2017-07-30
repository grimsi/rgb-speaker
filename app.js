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

    init();

    sp.list(function (err, ports) {
        ports.forEach(function (port) {
            $scope.openPorts.push(port.comName);
        })
    });

    $scope.$watch('port', function () {
        if (angular.isDefined($scope.port) && !sp.isOpen($scope.port)) {
            openSerialPort($scope.port);
        }
    });

    $scope.$watch('colorPicker.color', function () {
        if (angular.isDefined($scope.colorPicker.color) && $scope.colorPicker.color.slice(0, 3) === "rgb") {
            let color = "c" + $scope.colorPicker.color.slice(3, $scope.colorPicker.color.length);
            setSolidColor(color);
        }
    });

    function init() {
        if (angular.isDefined($cookies.get('port'))) {
            $scope.port = $cookies.get('port');
            openSerialPort($cookies.get('port'));
        }
        setTimeout(function () {
            if (angular.isDefined($cookies.get('color'))) {
                $scope.colorPicker.color = $cookies.get('color');
                setSolidColor("c" + $cookies.get('color').slice(3, $cookies.get('color').length));
            }
            if (angular.isDefined($cookies.get('mode'))) {
                $scope.mode = $cookies.get('mode');
            }
            $scope.$digest();
        }, 500);
    }

    function openSerialPort(port) {
        SerialPort = new sp(port, {
            baudrate: 9600,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false
        });
        $cookies.put('port', port);
        SerialPort.open(function () {
            console.log("Port opened");
        });
    }

    function setSolidColor(color) {
        $cookies.put('color', $scope.colorPicker.color);
        SerialPort.write(color);
        console.log("Sent solid color:" + color);
    }
});