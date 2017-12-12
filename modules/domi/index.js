// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const logger = require('../logger');
const proxy = require('../setting').proxy;
const {URL} = require('url');
const path = require('path');
const staticMIME = ['css', 'js', 'gif', 'png', 'html', 'jpeg', 'jpg', 'json', 'pdf', 'swf', 'txt', 'wav', 'wma', 'wmv', 'xml', 'woff', 'ttf', 'svg', 'eot', 'ico'];

function domiAction() {
    return async (ctx, next)=> {
        let ext = path.extname(ctx.req.url).substring(1);
        let myURL = new URL(ctx.request.href);
        let result = match(myURL.hostname, myURL.pathname);

        logger.info(ctx.request.ip + ':' + ctx.req.url);

        if (staticMIME.indexOf(ext) === -1 && result) {
            // domi action domi(result)
            try {
                await asynTest(ctx);
            } catch (err) {
                logger.error(err);
                await next();
            }
        } else {
            await next();
        }
    }
}

function match(domain, pathname) {
    let matchPath;
    let result;
    let app;

    if (!proxy || proxy.length === 0) {
        return result;
    }

    try {
        for (var i = 0; i < proxy.length; i++) {
            app = proxy[i];

            if (app.domain === domain && app.pathFilter) {
                matchPath = pathname.match(new RegExp(app.pathFilter));
                if (matchPath) {
                    result = proxy[i];
                    break;
                }
            }
        }
    } catch (err) {
        logger.error(err);
    }

    return result;
}

function asynTest(ctx) {

    return new Promise((resolve, reject) => {
        setTimeout(function() {
            ctx.body = 'hello world';
            logger.info('success');
            resolve();
        }, 3000);
    });
}

module.exports = domiAction;