### summers-ice
静态服务及支持本地mock数据

需要支持mock的文件夹需要再根文件夹下增加 hosts.properties
默认会在node执行路径下的所有文件夹中查找

````
domain=www.made-in-china.com
api={apiPath}
view={viewPath}
````

- domain: 必填，用于mock数据的域名访问和文件夹对应
- api: 选填, 用于指定 mock数据文件夹的路径， 默认不填则必须在根目录下面建立名为api的文件夹
- view: 选填, 用于指定html等dom结构文件所在路径, 默认不填则为根目录