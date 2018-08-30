// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */

const setting = require('../../config');
const fs = require('fs');
const path = require('path');
const {URL} = require('url');

/** todo
 * 1、判断静态资源是否存在
 * 2、文件不存在直接返回404
 * 3、文件存在，调用编译方法获取最新的编译文件名
 * 4、判断编译文件是否存在，不存在返回 204 调用编译执行
 * 5、编译文件存在正常返回
 */


module.exports = ()=> {
    return async (ctx, next)=> {
        if (ctx.__static) {
            let koaResponse = ctx.response;

            if (koaResponse.status === '200' && SummersCompiler) {
                let requestURL = new URL(ctx.request.href);

                let hashFileName = SummersCompiler.hash().get(requestURL.pathname);
                if (fs.existsSync(path.join(process.cwd(), requestURL.pathname))) {

                }

            } else {
                await next();
            }
        } else {
            await next();
        }
    }
}