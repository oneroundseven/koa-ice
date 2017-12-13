module.exports = {
    port : 9098, // 应用端口
    logPath : '/logs', // 设置日志存放位置
    debug : true, // 是否开启调试模式，不开启默认错误日志会存储到日志文件中，开发模式默认开启 并调用domi模块模拟数据

    staticPath: 'E:/Project_MIC/dev_1/mstatic/FINAL/target/mstatic-final', // 静态资源配置路径

    // 本地模拟数据映射
    proxy: [
        {
            name: 'channelfy',
            domain: 'www.channelfy-fy.com',
            api: 'E:\\Project\\koa-ice\\mic\\channelfy\\api',
            view: ''
        },
        {
            name: 'micen',
            domain: 'www.made-in-china.com',
            api: '',
            view: ''
        }
    ]
};