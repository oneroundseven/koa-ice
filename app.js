const Koa = require('koa');
const app = new Koa();

const onerror = require('koa-onerror')
const setting = require('./modules/setting');
const logger = require('./modules/logger');
const blacklist = require('./modules/blacklist');
const staticFilter = require('./modules/staticFilter');
const domi = require('nview-domi');
const staticCache = require('koa-static-cache')

// error handler
onerror(app);
app.use(blacklist());
// static middle
app.use(staticFilter());
// static router
app.use(staticCache(setting.staticPath, {
    maxAge: 365 * 24 * 60 * 60
}));
// domi middle wave
try {
    if (domi) {
        app.use(domi.middleware);
    }
} catch (err) {
    throw new Error('domi init error');
}

// error-handling
app.on('error', (err, ctx) => {
  logger.error('server error', err, ctx)
});

module.exports = app;
