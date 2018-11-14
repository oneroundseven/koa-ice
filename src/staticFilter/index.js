// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const { error, warn, debug } = require('../logger');
const config = require('../../config');
const {URL} = require('url');
const path = require('path');
const { visitLogFormat } = require('../util');
const staticMIME = ['css', 'js', 'gif', 'png', 'html', 'jpeg', 'jpg', 'json', 'pdf', 'swf', 'txt', 'wav', 'wma', 'wmv', 'xml', 'woff', 'ttf', 'svg', 'eot', 'ico'];

let hosts, ignoreRules;

function staticFilter() {
    return async (ctx, next)=> {
        const setting = config();
        hosts = setting.hosts;
        ignoreRules = setting.staticIgnoreRules;

        let ext = path.extname(ctx.req.url).substring(1);
        let myURL = new URL(ctx.request.href);
        let result = matchMockConfig(myURL.hostname, myURL.pathname);

        if ((staticMIME.indexOf(ext) === -1 && result) || ignorePath(myURL.pathname)) {
            ctx.domi = result;
        } else if (ext && staticMIME.indexOf(ext) !== -1) {
            ctx.__static = true;
        }
        await next();

        if (staticMIME.indexOf(ext) !== -1) {
            let loggerStr = visitLogFormat(ctx.request, ctx.response);
            if (ctx.response.status === 404) {
                warn('STATIC '+ loggerStr);
            } else {
                debug('STATIC '+ loggerStr);
            }
        }
    }
}

function ignorePath(pathname) {
    let result = false;
    if (ignoreRules && ignoreRules.length > 0) {
        for (let i = 0; i < ignoreRules.length; i++) {
            if (new RegExp(ignoreRules[i]).test(pathname)) {
                result = true;
            }
        }
    }

    return result;
}

function matchMockConfig(domain, pathname) {
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
    }

    return result;
}

module.exports = staticFilter;