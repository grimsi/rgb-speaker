angular.module("rgbSpeaker").factory("serialService", function () {
    return {
        openPort: openPort,
        setMode: setMode
    };
});

let sp = require('serialport');

let SerialPort;
let modes = {
    'solid': 'c',
    'left': 'l',
    'right': 'r',
    'rainbow': 'f',
    'breathing': 'b',
    'beat': 'm',
    'spectrum': 's'
};

function openPort(port) {
    SerialPort = new sp(port, {
        baudrate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    });
    if (!SerialPort.isOpen) {
        SerialPort.open(function () {
            console.log("Port " + port + " opened.");
        });
    }
}

function setMode(mode, params) {
    switch (modes[mode]) {
        case 'c':
            SerialPort.write("c(" + params.colors.r + ", " + params.colors.g + ", " + params.colors.b + ")");
            break;
        case 'l':
            SerialPort.write("l(" + params.colors.r + ", " + params.colors.g + ", " + params.colors.b + ")");
            break;
        case 'r':
            SerialPort.write("r(" + params.colors.r + ", " + params.colors.g + ", " + params.colors.b + ")");
            break;
        case 'b':
            SerialPort.write("b(" + params.colors.r + ", " + params.colors.g + ", " + params.colors.b + "," + params.speed);
            break;
        case 'f':
            SerialPort.write("f(" + params.speed + ", " + params.intensity);
            break;
        case 'm':
            break;
        case 's':
            break;
    }
}