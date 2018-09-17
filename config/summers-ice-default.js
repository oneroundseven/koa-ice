// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */

module.exports = {
    port : 9098, // 应用端口
    debug : true, // 是否开启调试模式，不开启默认错误日志会存储到日志文件中，开发模式默认开启 并调用domi模块模拟数据

    staticPath: null, // 静态资源源文件路径 默认为当前命令执行路径  (相对路径)
    staticExpires: 10, // 静态资源缓存过期时间，默认为10天
    staticTargetPath: null, // 静态资源编译后的文件存储路径, 默认为当前staticPath路径/target  (相对路径)
    staticIgnoreRules: ['swagger.yaml$'], // 静态资源忽略哪些请求的正则

    config: 'hosts.properties', // mock 配置文件 (当前命令执行路径下的每个文件夹中独立配置，有则纳入mock模拟)
    mockOverTime: 10, // 本地模拟数据请求超时时间设置 默认10s
    mockIgnore: ['.idea', 'node_modules', 'logs', '.git', '.svn', 'target'], // mock配置忽略哪些文件夹

    blackList: ['192.168.31.*'] // 访问黑名单
};