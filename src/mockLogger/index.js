// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const logger = require('../logger');
const setting = require('../../config');

function domiAction() {
    return async (ctx, next)=> {
        // 10 seconds over time
        ctx.__domiRenderTimer = setTimeout(function() {
            next();
            logger.error('DOMI render overtime:' + visitLogFormat(ctx.request, ctx.response));
        }, setting.mockOverTime * 1000);
        await next();
        if (ctx.__domiRenderTimer) {
            clearTimeout(ctx.__domiRenderTimer);
            ctx.__domiRenderTimer = null;
        }
        logger.info(visitLogFormat(ctx.request, ctx.response));
    }
}

function visitLogFormat(koaRequest, koaResponse) {
    return 'DOMI:'+ koaRequest.method + ' ' + koaResponse.status + ' ' + koaRequest.href + ' ' + koaRequest.headers['user-agent'];
}

module.exports = domiAction;