const Koa = require('koa');
const path = require('path');
const onError = require('koa-onerror');
const setting = require('./config')();
const blacklist = require('./src/blacklist');
const staticFilter = require('./src/staticFilter');
const summersMock = require('summers-mock');
const mockLogger = require('./src/mockLogger');
const staticCache = require('koa-static-cache');
const staticCompiler = require('./src/staticCompiler');
const { error, info } = require('./src/logger');

module.exports = (summerCompiler)=> {
    const app = new Koa();

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

    info(('STATIC Started:' + staticTargetPath).bgGreen.white);

    if (staticTargetPath) {
        if (!path.isAbsolute(staticTargetPath)) {
            staticTargetPath = path.resolve(__dirname, staticTargetPath);
        }

        app.use(staticCache(staticTargetPath, {
            maxAge: setting.staticExpires * 24 * 60 * 60,
            dynamic: true
        }));
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
        error('Mock loaded Error:'+ err);
    }

    // error-handling
    app.on('error', (err, ctx) => {
        error('Server error:' + err);
    });

    return app;
};
