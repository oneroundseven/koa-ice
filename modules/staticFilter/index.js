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

function staticFilter() {
    return async (ctx, next)=> {
        let ext = path.extname(ctx.req.url).substring(1);
        let myURL = new URL(ctx.request.href);
        let result = match(myURL.hostname, myURL.pathname);

        if (staticMIME.indexOf(ext) === -1 && result) {
            ctx.domi = result;
        }
        await next();

        if (!result) {
            logger.info(visitLogFormat(ctx.request, ctx.response));
        }
    }
}

function visitLogFormat(koaRequest, koaResponse) {
    return 'STATIC:'+ koaRequest.method + ' ' + koaResponse.status + ' ' + koaRequest.href + ' ' + koaRequest.headers['user-agent'];
}

function match(domain, pathname) {
    let matchPath;
    let result = null;
    let app;

    if (!proxy || proxy.length === 0) {
        return result;
    }

    try {
        for (var i = 0; i < proxy.length; i++) {
            app = proxy[i];

            if (app.domain === domain) {
                if (app.pathFilter) {
                    matchPath = pathname.match(new RegExp(app.pathFilter));
                    if (matchPath) {
                        result = app;
                        break;
                    }
                } else {
                    result = app;
                    break;
                }
            }
        }
    } catch (err) {
        logger.error(err);
    }

    return result;
}

module.exports = staticFilter;