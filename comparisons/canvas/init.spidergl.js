// Source: http://spidergl.svn.sourceforge.net/viewvc/spidergl/src/ui_canvas.js?revision=92&view=markup

    /*************************************************************************/
    /*                                                                       */
    /*  SpiderGL                                                             */
    /*  JavaScript 3D Graphics Library on top of WebGL                       */
    /*                                                                       */
    /*  Copyright (C) 2010                                                   */
    /*  Marco Di Benedetto                                                   */
    /*  Visual Computing Laboratory                                          */
    /*  ISTI - Italian National Research Council (CNR)                       */
    /*  http://vcg.isti.cnr.it                                               */
    /*  mailto: marco[DOT]dibenedetto[AT]isti[DOT]cnr[DOT]it                 */
    /*                                                                       */
    /*  This file is part of SpiderGL.                                       */
    /*                                                                       */
    /*  SpiderGL is free software; you can redistribute it and/or modify     */
    /*  under the terms of the GNU Lesser General Public License as          */
    /*  published by the Free Software Foundation; either version 2.1 of     */
    /*  the License, or (at your option) any later version.                  */
    /*                                                                       */
    /*  SpiderGL is distributed in the hope that it will be useful, but      */
    /*  WITHOUT ANY WARRANTY; without even the implied warranty of           */
    /*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.                 */
    /*  See the GNU Lesser General Public License                            */
    /*  (http://www.fsf.org/licensing/licenses/lgpl.html) for more details.  */
    /*                                                                       */
    /*************************************************************************/


    // canvas utilities
    /***********************************************************************/
    function sglGetCanvasContext(canvasID) {
	    var canvas = document.getElementById(canvasID);
	    if (!canvas) return null;

	    var gl = canvas.getContext("experimental-webgl");
	    if (!gl) return null;

	    if (gl.FALSE == undefined) gl.FALSE = 0;
	    if (gl.TRUE  == undefined) gl.TRUE  = 1;

	    return gl;
    }
    /***********************************************************************/

// Source: http://spidergl.svn.sourceforge.net/viewvc/spidergl/src/ui_canvas.js?revision=92&view=markup

    // _SglCanvasManager
    /***********************************************************************/
    function _SglCanvasManager(canvasID, handler, updateRate) {
	    var canvas = document.getElementById(canvasID);
	    if (!canvas) throw new Error("SpiderGL : Canvas not found");

	    canvas.contentEditable = true;

	    var gl = sglGetCanvasContext(canvasID);
	    if (!gl) throw new Error("SpiderGL : Cannot get WebGL context");

	    gl.pixelStorei(gl.PACK_ALIGNMENT,                 1);
	    gl.pixelStorei(gl.UNPACK_ALIGNMENT,               1);
	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,            1);
	    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

	    // for some strange reason, this is a workaround
	    // to have Chrome work properly...
	    // (anyway it should be harmless...)
	    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	    var ui  = new SglCanvasUI(this, handler, canvas, gl);
	    this.ui = ui;

	    var mgr = this;

	    this.gl      = gl;
	    this.canvas  = canvas;
	    this.handler = handler;
	    //this.handler.prototype.ui = get function() { return ui };
	    //this.handler.ui = get function() { return ui };
	    this.handler.ui = ui;

	    this._drawPending = false;
	    this._drawFunc = function() {
		    mgr.draw();
	    };
