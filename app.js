const Koa = require('koa');
const app = new Koa();

const onerror = require('koa-onerror')
const setting = require('./modules/setting');
const logger = require('./modules/logger');
const blacklist = require('./modules/blacklist');
const domi = require('./modules/domi');

// error handler
onerror(app);
app.use(blacklist());
app.use(domi());
// static router
app.use(require('koa-static')(setting.staticPath));

// logger
/*app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});*/

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
