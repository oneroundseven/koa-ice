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
 * 5、编译文件存在则读取文件内容返回
 */

let sourcePath;
let targetPath;
const debug = require('debug')('app:compile');
const mime = require('mime-types');

module.exports = (summerCompiler)=> {
    return async (ctx, next)=> {
        if (ctx.__static && summerCompiler) {
            let koaResponse = ctx.response;
            let requestURL = new URL(ctx.request.href);

            sourcePath = path.join(setting.staticPath, requestURL.pathname);

            try {
                let source = fs.statSync(sourcePath);

                // 如果访问为源文件
                if (source.isFile()) {
                    targetPath = summerCompiler.getHash(sourcePath);

                    // 如果summerCompiler编译后的文件存在则直接去读编译后的文件返回，如不存在返回204
                    if (targetPath) {
                        let target = fs.statSync(targetPath);
                        if (target && target.isFile()) {
                            let file = fs.readFileSync(targetPath);
                            ctx.type = mime.lookup(requestURL.pathname) || 'application/octet-stream';
                            ctx.set('cache-control', 'public, max-age=' + setting.staticExpires * 24 * 60 * 60);
                            ctx.body = file;
                        } else {
                            summerCompiler.watch.addWatchTask('change', sourcePath);
                            ctx.status = 204;
                            koaResponse.end();
                        }
                    } else {
                        summerCompiler.watch.addWatchTask('change', sourcePath);
                        ctx.status = 204;
                        koaResponse.end();
                    }
                } else {
                    await next();
                }

            } catch(err) {
                debug('target for source compile Error:'+ sourcePath + ' ERROR:' + err);
                await next();
            }
        } else {
            await next();
        }
    }
}