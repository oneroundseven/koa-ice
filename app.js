const Koa = require('koa');
const path = require('path');
const onError = require('koa-onerror');
const config = require('./config');
const blacklist = require('./src/blacklist');
const staticFilter = require('./src/staticFilter');
const summersMock = require('summers-mock');
const mockLogger = require('./src/mockLogger');
const staticCache = require('koa-static-cache');
const staticCompiler = require('./src/staticCompiler');
const mockViewer = require('summers-mock-viewer');
const router = require('koa-router')();
const { error, debug } = require('./src/logger');

module.exports = (summerCompiler)=> {
    const app = new Koa();
    const setting = config(summerCompiler);

    // error handler
    onError(app);
    app.use(blacklist());
    // static middle
    app.use(staticFilter());
    // static compiler
    app.use(staticCompiler(summerCompiler));

    // static router 如果summerCompiler对象不存在则默认静态资源路径为staticPath
    let staticTargetPath = setting.staticTargetPath;
    if (!summerCompiler) {
        staticTargetPath = setting.staticPath;
    }

    debug('Static target path:' + staticTargetPath);

    if (staticTargetPath) {
        if (!path.isAbsolute(staticTargetPath)) {
            staticTargetPath = path.resolve(__dirname, staticTargetPath);
        }
        app.__staticPath = path.relative(process.cwd(), staticTargetPath);

        app.use(staticCache(staticTargetPath, {
            maxAge: setting.staticExpires * 24 * 60 * 60,
            dynamic: true
        }));
    }

    // summers mock view page
    try {

        if (mockViewer) {
            app.use(staticCache(mockViewer.getViewerPath(), {
                prefix: '/.mock'
            }));

            let swagger = router.get('/swagger/swagger.yaml', mockViewer.swaggerFileHandler);
            app.use(swagger.routes()).use(swagger.allowedMethods());
        }
    } catch (err) {
        error('Mock View Loaded Error:'+ err);
    }

    // summers mock middle wave
    try {
        if (summersMock) {
            summersMock.registrySummersCompiler(summerCompiler);
            app.use(mockLogger());
            app.use(summersMock.middleware);
            app.use(summersMock.middleware_catch);
        }
    } catch (err) {
        error('Mock Loaded Error:'+ err);
    }

    // error-handling
    app.on('error', (err, ctx) => {
        error('Server error:' + err);
    });

    return app;
};
