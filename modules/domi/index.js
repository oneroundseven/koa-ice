// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author sheny@made-in-china.com
 */

const views = require('koa-views');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');

const index = require('./routes/index');
const users = require('./routes/users');


// middlewares
app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}));
app.use(json());

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())