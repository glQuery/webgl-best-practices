// Source: https://github.com/xeolabs/scenejs/blob/V2.0.0/src/scenejs/core/core.js 

    /** Names of supported WebGL canvas contexts
     */
    SUPPORTED_WEBGL_CONTEXT_NAMES:["webgl", "experimental-webgl", "webkit-3d", "moz-webgl", "moz-glweb20"],

// Source: https://github.com/xeolabs/scenejs/blob/V2.0.0/src/scenejs/scene/scene.js

   /** Locates canvas in DOM, finds WebGL context on it, sets some default state on the context, then returns
     *  canvas, canvas ID and context wrapped up in an object.
     *
     * If canvasId is null, will fall back on Scene.DEFAULT_CANVAS_ID
     */
    function findCanvas(canvasId, contextAttr) {
        var canvas;
        if (!canvasId) {
            SceneJS_loggingModule.info("Scene attribute 'canvasId' omitted - looking for default canvas with ID '"
                    + Scene.DEFAULT_CANVAS_ID + "'");
            canvasId = Scene.DEFAULT_CANVAS_ID;
            canvas = document.getElementById(canvasId);
            if (!canvas) {
                throw SceneJS_errorModule.fatalError(
                        SceneJS.errors.CANVAS_NOT_FOUND,
                        "Scene failed to find default canvas with ID '"
                                + Scene.DEFAULT_CANVAS_ID + "'");
            }
        } else {
            canvas = document.getElementById(canvasId);
            if (!canvas) {
                SceneJS_loggingModule.warn("Scene config 'canvasId' unresolved - looking for default canvas with " +
                                           "ID '" + Scene.DEFAULT_CANVAS_ID + "'");
                canvasId = Scene.DEFAULT_CANVAS_ID;
                canvas = document.getElementById(canvasId);
                if (!canvas) {
                    throw SceneJS_errorModule.fatalError(SceneJS.errors.CANVAS_NOT_FOUND,
                            "Scene attribute 'canvasId' does not match any elements in the page and no " +
                            "default canvas found with ID '" + Scene.DEFAULT_CANVAS_ID + "'");
                }
            }
        }

        // If the canvas uses css styles to specify the sizes make sure the basic
        // width and height attributes match or the WebGL context will use 300 x 150
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        var context;
        var contextNames = SceneJS.SUPPORTED_WEBGL_CONTEXT_NAMES;
        for (var i = 0; (!context) && i < contextNames.length; i++) {
            try {
                if (SceneJS_debugModule.getConfigs("webgl.logTrace") == true) {
                    context = canvas.getContext(contextNames[i] /*, { antialias: true} */, contextAttr);
                    if (context) {
                        context = WebGLDebugUtils.makeDebugContext(
                                context,
                                function(err, functionName, args) {
                                    SceneJS_loggingModule.error(
                                            "WebGL error calling " + functionName +
                                            " on WebGL canvas context - see console log for details");
                                });
                        context.setTracing(true);
                    }
                } else {
                    context = canvas.getContext(contextNames[i], contextAttr);
                }
            } catch (e) {
            }
        }
        if (!context) {
            throw SceneJS_errorModule.fatalError(
                    SceneJS.errors.WEBGL_NOT_SUPPORTED,
                    'Canvas document element with ID \''
                            + canvasId
                            + '\' failed to provide a supported WebGL context');
        }

        try {
            context.clearColor(0.0, 0.0, 0.0, 1.0);
            context.clearDepth(1.0);
            context.enable(context.DEPTH_TEST);
            context.disable(context.CULL_FACE);
            context.depthRange(0, 1);
            context.disable(context.SCISSOR_TEST);
        } catch (e) {
            throw SceneJS_errorModule.fatalError(// Just in case we get a context but can't get any functionson it
                    SceneJS.errors.WEBGL_NOT_SUPPORTED,
                    'Canvas document element with ID \''
                            + canvasId
                            + '\' provided a supported WebGL context, but functions appear to be missing');
        }
        return {
            canvas: canvas,
            context: context,
            canvasId : canvasId
        };
    }
