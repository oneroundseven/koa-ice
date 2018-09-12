// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const logger = require('../logger');
const { error, warn, info } = require('../debug');
const hosts = require('../../config').hosts;
const {URL} = require('url');
const path = require('path');
const { visitLogFormat } = require('../util');
const staticMIME = ['css', 'js', 'gif', 'png', 'html', 'jpeg', 'jpg', 'json', 'pdf', 'swf', 'txt', 'wav', 'wma', 'wmv', 'xml', 'woff', 'ttf', 'svg', 'eot', 'ico'];

function staticFilter() {
    return async (ctx, next)=> {
        let ext = path.extname(ctx.req.url).substring(1);
        let myURL = new URL(ctx.request.href);
        let result = match(myURL.hostname, myURL.pathname);

        if (staticMIME.indexOf(ext) === -1 && result) {
            ctx.domi = result;
        } else {
            ctx.__static = true;
        }
        await next();

        if (staticMIME.indexOf(ext) !== -1) {
            let loggerStr = visitLogFormat(ctx.request, ctx.response);
            if (ctx.response.status === 404) {
                warn('STATIC#'+ loggerStr);
            } else {
                info('STATIC#'+ loggerStr);
            }
            logger.info(loggerStr);
        }
    }
}

function match(domain, pathname) {
    let matchPath;
    let result = null;
    let app;

    if (!hosts || hosts.length === 0) {
        return result;
    }

    try {
        for (var i = 0; i < hosts.length; i++) {
            app = hosts[i];

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
        error('Static Error:'+ err);
        logger.error(err);
    }

    return result;
}

module.exports = staticFilter;