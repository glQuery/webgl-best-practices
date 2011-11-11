// Source: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/webgl-extensions.js

    (function(){

        if (!Modernizr.webgl) return;

        var canvas, ctx, exts;

        try { 
            canvas  = document.createElement('canvas'),
            ctx     = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            exts    = ctx.getSupportedExtensions();
        }
        catch (e) {
            return;
        }

        Modernizr.webgl = new Boolean(true);

        for (var i = -1, len = exts.length; ++i < len; ){
            Modernizr.webgl[exts[i]] = true;    
        }

        canvas = undefined;;
    })();
