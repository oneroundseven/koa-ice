// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const logger = require('../logger');
let path = require('path');
let url = require('url');

const staticMIME = ['css', 'js', 'gif', 'png', 'html', 'jpeg', 'jpg', 'json', 'pdf', 'swf', 'txt', 'wav', 'wma', 'wmv', 'xml', 'woff', 'ttf', 'svg', 'eot', 'ico'];

let ext;

function staticFilter() {
    return async (ctx, next)=> {
        ext = path.extname(ctx.req.url);
        if (staticMIME.contains(ext)) {

        }
        ext = path.extname(url.parse(ctx.req.url)).pathname;
        console.log(ctx.req.url);
        console.log(ctx.request.ip);
        await next();
    }
}

module.exports = staticFilter;