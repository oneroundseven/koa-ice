module.exports = {
    port : 9098, // 应用端口
    logPath : 'logs', // 设置日志存放位置
    debug : false, // 关闭调试模式

    staticPath: 'static', // 静态资源配置路径

    mail : {
        host : 'mail3.focuschina.com', // default : 127.0.0.1
        port : null, // default : 25
        auth: {
            user: 'oneroundseven@gmail.com',
            pass: '15531685'
        }
    }
};