// Source: https://github.com/fserb/glix/blob/master/utils.js

    glix.module.utils = function(gl) {
      var raf =
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) { window.setTimeout( callback, 1000 / 60 ); };

      var craf =
        window.cancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout;

      gl.requestFrame = function(func) { return raf(func); };
      gl.cancelRequestFrame = function(func) { return craf(func); };
    };

