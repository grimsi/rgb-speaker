angular.module("rgbSpeaker").factory("audioService", function () {
    return {
        getSpectrum: getSpectrum
    };
});

let Analyser = require('audio-analyser');
let analyser = new Analyser({
    minDecibels: -100,
    maxDecibels: -30,
    fftSize: 1024,
    frequencyBinCount: 512,
    smoothingTimeConstant: 0.2,
    channel: 0,
    bufferSize: 44100
});

function getSpectrum() {
    return analyser.getFrequencyData(3);
}
