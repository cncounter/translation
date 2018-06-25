# Vue中dev服务器打开Gzip压缩

vue-cli 创建项目之后, 在开发服务器, 浏览器打开需要下载 10MB以上的脚本。

开启gzip之后, 传输量下降到 2MB以内。

如果是生产版本, 打包后一般可以控制在 1MB 以内, 开启gzip,则传输量只有 200-400KB。


我们使用的是 vue-cli 3.0 版本。

`package.json` 配置如下:

```
{
  "name": "demo-project",
  "version": "1.0.1",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "axios": "^0.18.0",
    "crypto-js": "^3.1.9-1",
    "dayjs": "^1.5.24",
    "element-ui": "^2.3.9",
    "moment": "^2.22.2",
    "nprogress": "^0.2.0",
    "qs": "^6.5.2",
    "save": "^2.3.2",
    "store": "^2.0.12",
    "vue": "^2.5.16",
    "vue-router": "^3.0.1",
    "vue-table-with-tree-grid": "^0.2.4",
    "vuex": "^3.0.1"
  },
  "devDependencies": {
    "@babel/polyfill": "^7.0.0-beta.46",
    "@vue/cli-plugin-babel": "^3.0.0-beta.10",
    "@vue/cli-service": "^3.0.0-beta.10",
    "compression-webpack-plugin": "^1.1.11",
    "vue-template-compiler": "^2.5.16"
  },
  "babel": {
    "presets": [
      "@vue/app"
    ]
  },
  "postcss": {
    "plugins": {
      "autoprefixer": {}
    }
  }
}

```



配置如下:

> vue.config.js

```
module.exports = {
    configureWebpack: {
        entry: [
            '@babel/polyfill',
            './src/main.js'
        ]
    },
    baseUrl: '/',
    productionSourceMap: true,
    // configure webpack-dev-server behavior
    devServer: {
        open: true, // 自动打开浏览器
        disableHostCheck: false,
        host: '0.0.0.0', // 监听的IP
        port: 8081, // 启动端口号
        https: false,
        hotOnly: false,
        compress: true, // gzip
        proxy: {
            '/rest': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
}
```

注意到 devServer 使用的配置 `compress: true`。

关于 devServer 的配置请参考: <https://webpack.docschina.org/configuration/dev-server/>

关于 proxy 的配置, 请参考: <https://github.com/vuejs/vue-cli/tree/dev/docs/config>



如果没有 cnpm, 则需要先全局安装: 


```
npm install -g cnpm
```

安装 `package.json` 中定义的依赖:

```
cnpm install
```

编译并启动 dev 服务器:

```
npm run serve
```


会自动在node环境中, 执行 `package.json` 定义的 `serve` 脚本。

然后自动打开浏览器。


作者: 铁锚 <https://blog.csdn.net/renfufei/>

日期: 2018年6月25日


