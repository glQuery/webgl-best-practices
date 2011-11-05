// Source: https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js

    try {

		  if ( ! ( _gl = _canvas.getContext( 'experimental-webgl', { antialias: _antialias, stencil: _stencil, preserveDrawingBuffer: _preserveDrawingBuffer } ) ) ) {

			  throw 'Error creating WebGL context.';

		  }

		  console.log(
			  navigator.userAgent + " | " +
			  _gl.getParameter( _gl.VERSION ) + " | " +
			  _gl.getParameter( _gl.VENDOR ) + " | " +
			  _gl.getParameter( _gl.RENDERER ) + " | " +
			  _gl.getParameter( _gl.SHADING_LANGUAGE_VERSION )
		  );

	  } catch ( error ) {

		  console.error( error );

	  }

