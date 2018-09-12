// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const { error, info } = require('../debug');
const { visitLogFormat } = require('../util');
const setting = require('../../config');

function domiAction() {
    return async (ctx, next)=> {
        // 10 seconds over time
        ctx.__domiRenderTimer = setTimeout(function() {
            next();
            error('DOMI render overtime:' + visitLogFormat(ctx.request, ctx.response));
        }, setting.mockOverTime * 1000);
        await next();
        if (ctx.__domiRenderTimer) {
            clearTimeout(ctx.__domiRenderTimer);
            ctx.__domiRenderTimer = null;
        }
        info(visitLogFormat(ctx.request, ctx.response));
    }
}

module.exports = domiAction;