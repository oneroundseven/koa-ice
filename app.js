const Koa = require('koa');
const app = new Koa();

const onerror = require('koa-onerror');
const setting = require('./modules/setting');
const logger = require('./modules/logger');
const blacklist = require('./modules/blacklist');
const staticFilter = require('./modules/staticFilter');
const domi = require('nview-domi');
const domiLogger = require('./modules/domiLogger');
const staticCache = require('koa-static-cache');
const path = require('path');

// error handler
onerror(app);
app.use(blacklist());
// static middle
app.use(staticFilter());
// static router
let staticPath = setting.staticPath;
if (staticPath) {
    if (!path.isAbsolute(staticPath)) {
        staticPath = path.resolve(__dirname, staticPath);
    }

    app.use(staticCache(staticPath, {
        maxAge: 365 * 24 * 60 * 60
    }));
}
// domi middle wave
try {
    if (domi) {
        app.use(domiLogger());
        app.use(domi.middleware);
    }
} catch (err) {
    throw Error('domi exec error');
}

// error-handling
app.on('error', (err, ctx) => {
  logger.error('server error', err, ctx)
});

module.exports = app;
