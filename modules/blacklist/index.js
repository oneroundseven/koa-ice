// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */



let blacklist = ()=> {
    return async (ctx, next)=> {

        await next();
    }
};

module.exports = blacklist;