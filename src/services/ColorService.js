angular.module("rgbSpeaker").factory("colorService", function () {
    return {
        getRGB: getRGB
    };
});

var tinycolor = require('tinycolor2');

function getRGB(colorString) {
    return new tinycolor(colorString).toRgb();
}