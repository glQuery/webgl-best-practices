// Source: https://github.com/mrdoob/three.js/blob/master/examples/js/RequestAnimationFrame.js

    if ( !window.requestAnimationFrame ) {

	    window.requestAnimationFrame = ( function() {

		    return window.webkitRequestAnimationFrame ||
		    window.mozRequestAnimationFrame ||
		    window.oRequestAnimationFrame ||
		    window.msRequestAnimationFrame ||
		    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

			    window.setTimeout( callback, 1000 / 60 );

		    };

	    } )();

    }

