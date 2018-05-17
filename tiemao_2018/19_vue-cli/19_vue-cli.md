# 使用vue-cli脚手架创建新项目


## 0. 安装 cnpm

众所周知、为了我们的人身安全, 我们有墙。

所以一部分 npm 包会安装失败。

cnpm等价于使用淘宝镜像源的npm, 可以使用命令安装: 

```
npm i cnpm -g

```

其中, `i` 是 `install` 的简写。


## 1. 全局安装 vue-cli

```
cnpm i vue-cli -g

```


## 2. 初始化项目


先进入工作目录, 如:

```
E:

cd E:\CODE_ALL\04_Demo_ALL

```


然后执行下面的命令初始化一个项目。


```

vue init webpack demo-vue-front

```

初始化过程中会要求输入一些信息, 回车确认即可。

提示是否安装eslint，输入 `n` 不安装。

各个版本可能行为不一致。 糟点是会提示初始化完成之后自动执行 `npm install`, 然后就因为墙的原因报一些错。


## 3. 下载安装依赖

```
cd demo-vue-front
cnpm i

```

## 4. 启动测试

```
cnpm run dev

```

启动之后, 可能会提示打开页面: <http://localhost:8080> 。 

然后就可以看到简单的测试效果。


## 5. 安装Vue相关模块


```
cnpm i vue-router --save
cnpm i vuex --save
cnpm i vue-resource --save
```

其中, `vue-router` 是路由管理, `vuex` 是状态管理,  `vue-resource` 是网路请求模块。 也可以安装其他模块。

`--save`选项的作用, 是将依赖信息保存到 `package.json` 之中。



Vue教程: <https://cn.vuejs.org/v2/guide/installation.html>


参考: <https://segmentfault.com/a/1190000007441374>



2018年5月17日

