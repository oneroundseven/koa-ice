// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const config = require('../../config');
const { warn } = require('../logger');

function blackList() {
    return async (ctx, next)=> {

        let black_ips = config().blackList;

        if (black_ips && black_ips.length > 0) {
            let ip = ctx.request.ip;

            // localhost
            if (ip === '::1') {
                await next();
                return;
            }

            // ipv6
            ip = ip.replace('::ffff:', '');

            let tmp, index;
            for (let i = 0; i < black_ips.length; i++) {
                if (ip === black_ips[i]) {
                    ctx.status = 403;
                    ctx.body = 'No Permision';
                    warn('IP reject:'+ ip);
                    return;
                } else {

                    if (black_ips[i].indexOf('*') !== -1) {
                        tmp = black_ips[i].split('.');
                        ip = ip.split('.');
                        index = tmp.indexOf('*');

                        if (index !== -1) {
                            ip.splice(index, 1);
                            tmp.splice(index, 1);

                            if (ip.join('.') === tmp.join('.')) {
                                ctx.status = 403;
                                ctx.body = 'No Permision';
                                warn('IP reject:'+ ip);
                                return;
                            }
                        }
                    }
                }
            }
            await next();
        } else {
            await next();
        }
    }
}

module.exports = blackList;