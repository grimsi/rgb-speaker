let app = angular.module('rgbSpeaker', ['ngMaterial', 'ngCookies', 'ngSanitize', 'mdColorPicker']);

app.controller('mainCtrl', function ($scope, $cookies, $mdToast, $mdDialog, colorService, serialService) {
    $scope.openPorts = [];
    $scope.colorPicker = {};
    $scope.stereo = false;


    let modeIds = {
        'solid': 0,
        'rainbow': 1,
        'breathing': 2,
        'beat': 3,
        'spectrum': 4
    };

    /*setInterval(function () {
        $scope.width = window.outerWidth;
        $scope.height = window.outerHeight;
    }, 10);*/

    init();

    $scope.$watch('port', function () {
        if (angular.isDefined($scope.port)) {
            serialService.openPort($scope.port);
            $cookies.put('port', $scope.port);
            $scope.portCache = _.cloneDeep($scope.port);
        }
    });

    function save() {
        updateMode();
        $cookies.putObject("config", $scope.config);
        $scope.configCache = _.cloneDeep($scope.config);
        $cookies.put('port', $scope.port);
        $scope.portCache = _.cloneDeep($scope.port);
        $mdToast.show(
            $mdToast.simple()
                .textContent('Saved')
                .position("bottom right")
                .hideDelay(1500)
        );
    }

    /**
     * gets called when the stereo switch in "static" gets toggled
     */
    function switchStereo() {
        if (!stereo) {
            $scope.colorPicker.right = $scope.colorPicker.left;
        }
    }


    /**
     * does a bit of magic and sends the serial commands to the arduino using SerialService
     */
    function updateMode() {
        if ($scope.config.currentModeId === 0 && $scope.config.modes.solid.stereo) {
            let colorLeft = colorService.getRGB($scope.config.modes.solid.colorLeft);
            let paramsLeft = {
                colors: {
                    r: colorLeft.r,
                    g: colorLeft.g,
                    b: colorLeft.b
                },
                speed: undefined,
                intensity: undefined
            };
            let colorRight = colorService.getRGB($scope.config.modes.solid.colorRight);
            let paramsRight = {
                colors: {
                    r: colorRight.r,
                    g: colorRight.g,
                    b: colorRight.b
                },
                speed: undefined,
                intensity: undefined
            };
            serialService.setMode('left', paramsLeft);
            serialService.setMode('right', paramsRight);
        } else {
            let color = colorService.getRGB($scope.config.modes[$scope.config.currentModeName].color);
            let params = {
                colors: {
                    r: color.r,
                    g: color.g,
                    b: color.b
                },
                speed: $scope.config.modes[$scope.config.currentModeName].speed,
                intensity: $scope.config.modes[$scope.config.currentModeName].intensity
            };
            serialService.setMode($scope.config.currentModeName, params);
        }
    }

    function clearCookies() {
        $cookies.put('port', null);
        $cookies.putObject('config', null);
        setTimeout(function () {
            $scope.portCache = $cookies.get('port');
            $scope.configCache = $cookies.getObject('config');
            $scope.$digest();
        }, 500);
        $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(false)
                .title('Cache cleared')
                .htmlContent('Please restart the app now for the changes to take effect.<br/>If you don\'t restart now the app will recreate the cache.')
                .ok('Okay')
        );
    }

    /**
     * Initializes the app
     */
    function init() {
        let sp = require('serialport');
        sp.list(function (err, ports) {
            ports.forEach(function (port) {
                $scope.openPorts.push(port.comName);
            })
        });

        if (angular.isDefined($cookies.get('port'))) {
            $scope.port = $cookies.get('port');
            $scope.portCache = _.cloneDeep($scope.port);
        }
        setTimeout(function () {
            if (($cookies.getObject('config'))) {
                $scope.config = $cookies.getObject('config');
                $scope.configCache = _.cloneDeep($scope.config);
            } else {
                $scope.config = {
                    currentModeId: 0,
                    currentModeName: 'solid',
                    modes: {
                        'solid': {
                            id: 0,
                            color: '#f00',
                            colorLeft: '#f00',
                            colorRight: '#00f',
                            stereo: false
                        },
                        'rainbow': {
                            id: 1,
                            speed: 5,
                            intensity: 255
                        },
                        'breathing': {
                            id: 2,
                            color: '#f00',
                            speed: 5,
                            rgb: false
                        },
                        'beat': {
                            id: 3,
                            speed: 10,
                            intensity: 255
                        },
                        'spectrum': {
                            id: 4,
                            speed: 10,
                            intensity: 255
                        }
                    },
                    debug: false
                };
            }
            $scope.$digest();
        }, 500);
    }

    /**
     * Functions callable from view
     */
    $scope.switchStereo = switchStereo;
    $scope.clearCookies = clearCookies;
    $scope.save = save;
});