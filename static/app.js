// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author sheny@made-in-china.com
 */

const Koa = require('koa');
const app = new Koa();
const logger = require('../modules/log');
const setting = require('../setting');

app.use(async function(ctx, next) {
    logger.info('hello world');
    await next();
});

app.use(require('koa-static')(__dirname + setting.static.path));

module.exports = app;