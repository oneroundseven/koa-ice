// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author sheny@made-in-china.com
 */



let blacklist = ()=> {
    return async (ctx, next)=> {

        console.log(ctx.request.ip);
        await next();
    }
};

module.exports = blacklist;