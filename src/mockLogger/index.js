// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const { error } = require('../logger');
const { visitLogFormat } = require('../util');
const config = require('../../config');

function domiAction() {
    return async (ctx, next)=> {
        const setting = config();
        // 10 seconds over time
        ctx.__domiRenderTimer = setTimeout(function() {
            next();
            error('MOCK render overtime:' + visitLogFormat(ctx.request, ctx.response));
        }, setting.mockOverTime * 1000);
        await next();
        if (ctx.__domiRenderTimer) {
            clearTimeout(ctx.__domiRenderTimer);
            ctx.__domiRenderTimer = null;
        }
    }
}

module.exports = domiAction;