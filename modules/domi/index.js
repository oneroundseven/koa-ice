// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const hosts = require('./hosts');
const logger = require('../logger');


//const domi = require('domi');

let path = require('path');

let staticMIME = ['css', 'js', 'gif', 'png', 'html', 'jpeg', 'jpg', 'json', 'pdf', 'swf', 'txt', 'wav', 'wma', 'wmv', 'xml', 'woff', 'ttf', 'svg', 'eot', 'ico'];

let ext;

function domiAction() {
    return async (ctx, next)=> {
        ext = path.extname(ctx.req.url).substring(1);
        logger.visit(ctx.request.ip + ':' + ctx.req.url);

        if (staticMIME.indexOf(ext) === -1 && hosts(ctx.request.href)) {
            // domi action
            await asynTest(ctx);
        } else {
            await next();
        }
    }
}

function asynTest(ctx) {

    return new Promise((resolve, reject) => {
        setTimeout(function() {
            ctx.body = 'hello world';
            console.log('success');
            resolve();
        }, 3000);
    });
}

module.exports = domiAction;