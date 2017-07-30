var app = angular.module('rgbSpeaker', ['ngMaterial', 'ngCookies', 'mdColorPicker']);

app.controller('mainCtrl', function ($scope, $cookies) {
    var sp = require('serialport');
    var tinycolor = require('tinycolor2');
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
        if (angular.isDefined($scope.port)) {
            openSerialPort($scope.port);
        }
    });

    $scope.$watch('colorPicker.color', function () {
        if (angular.isDefined($scope.colorPicker.color)) {
            if ($scope.colorPicker.color.slice(0, 3) === "rgb") {
                let color = $scope.colorPicker.color.slice(3, $scope.colorPicker.color.length);
                updateModeAndColor($scope.mode, color);
            }
            else if ($scope.colorPicker.color.slice(0, 1) === "#") {
                let color = new tinycolor($scope.colorPicker.color).toRgbString();
                color = color.slice(3, color.length);
                updateModeAndColor($scope.mode, color);
            }
        }
    });

    $scope.$watch('mode.name', function () {
        if (angular.isDefined($scope.mode)) {
            let color = new tinycolor($scope.colorPicker.color).toRgbString();
            color = color.slice(3, color.length);
            updateModeAndColor($scope.mode, color);
        }
    });

    $scope.$watch('mode.speed', function () {
        if (angular.isDefined($scope.mode.speed)) {
            let color = new tinycolor($scope.colorPicker.color).toRgbString();
            color = color.slice(3, color.length);
            updateModeAndColor($scope.mode, color);
        }
    });

    function init() {
        if (angular.isDefined($cookies.get('port'))) {
            $scope.port = $cookies.get('port');
        }
        setTimeout(function () {
            if (angular.isDefined($cookies.get('color'))) {
                $scope.colorPicker.color = $cookies.get('color');
            }
            if (angular.isDefined($cookies.getObject('mode'))) {
                $scope.mode = $cookies.getObject('mode');
            } else {
                $scope.mode.speed = 5;
                $scope.mode.intensity = 255;
                $scope.mode.name = 'solid';
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

    function updateModeAndColor(mode, color) {
        switch (mode.name) {
            case 'solid':
                setSolidColor(color);
                break;
            case 'rainbow':
                setRainbowEffect(mode.speed, mode.intensity);
                break;
        }
        $cookies.putObject('mode', $scope.mode);
    }

    function setSolidColor(color) {
        color = "c" + color;
        SerialPort.write(color);
        console.log("Sent command: " + color);
    }

    function setRainbowEffect(speed, intensity) {
        let rainbow = "r(" + speed + ", " + intensity + ")";
        SerialPort.write(rainbow);
        console.log("Sent command: " + rainbow);
    }

    function changeMode(mode) {
        let modeIds = {
            'solid': 0,
            'rainbow': 1,
            'breathing': 2,
            'beat': 3,
            'spectrum': 4
        };
        $scope.mode.name = mode;
        $scope.mode.id = modeIds[mode];
        $cookies.putObject('mode', $scope.mode);
    }

    /**
     * Functions callable from view
     */
    $scope.changeMode = changeMode;
});