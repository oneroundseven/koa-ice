const Koa = require('koa');
const app = new Koa();

const onerror = require('koa-onerror');
const setting = require('./config');
const logger = require('./modules/logger');
const blacklist = require('./modules/blacklist');
const staticFilter = require('./modules/staticFilter');
const summersMock = require('summers-mock');
const mockLogger = require('./modules/mockLogger');
const staticCache = require('koa-static-cache');
const path = require('path');
const compiler = require('./modules/compiler');

// error handler
onerror(app);
app.use(blacklist());
// static middle
app.use(staticFilter());

app.use(compiler());
// static router
let staticTargetPath = setting.staticTargetPath;

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
        summersMock.registrySummersCompiler(global.SummersCompiler);
        app.use(mockLogger());
        app.use(summersMock.middleware);
    }
} catch (err) {
    console.error(err);
    throw Error('summersMock exec error');
}

// error-handling
app.on('error', (err, ctx) => {
  logger.error('server error', err, ctx)
});

module.exports = app;
