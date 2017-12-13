// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const logger = require('../logger');

function domiAction() {
    return async (ctx, next)=> {
        await asynTest(ctx);
        logger.info(visitLogFormat(ctx.request, ctx.response));
    }
}

function asynTest(ctx) {
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            ctx.body = 'hello domi';
            logger.info(ctx.domi);
            resolve();
        }, 3000);
    });
}

function visitLogFormat(koaRequest, koaResponse) {
    return 'DOMI:'+ koaRequest.method + ' ' + koaResponse.status + ' ' + koaRequest.href + ' ' + koaRequest.headers['user-agent'];
}

module.exports = domiAction;