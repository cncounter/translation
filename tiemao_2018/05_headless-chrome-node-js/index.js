// 配置
// 端口号
const http_port = 3000;
// 工作目录; 存储目录;
const workspace = "/home/data/www/node-server/workspace";
// URL下载路径前缀
const baseDownloadUriPath = "/dl/";
// 成功状态的返回值
const STATUS_SUCCESS = 1;
// 应该存放到配置文件中
const CLOSE_TOKEN = "888884387";

// 模块依赖
const http = require('http');
const express = require('express');
const fs = require('fs');
const shell = require('shelljs');
const path = require('path');
const zipFolder = require('zip-folder');
//
const printpdf = require('./puppeteer-printpdf.js');

// express服务实例
const server = express();

// 错误处理器
server.use(function errorHandler(err, request, response, next) {
    console.error('发生错误:信息为:', err);
    response.status(500).send('Server-Error:' + err);
});

// 请求 Mapping
// get, post, put, all 等
server.all('*', function requireAuth(request, response, next) {
    console.log("request.url=" + request.url);
    // 校验访问密钥
    next();
});

//
server.get('/', function (request, response) {
    response.json({
        message: "服务器正在运行! http_port=" + http_port,
        ts: new Date().getTime()
    });
});

//
server.get('/printpdf.json', function (request, response) {
    // express 包装的参数
    var params = request.query;
    // 请求viewPageUrl
    var viewPageUrl = params.viewPageUrl;
    // 文件名称
    var fileName = params.fileName;
    // 回调地址
    var callbackUrl = params.callbackUrl;
    // 其他参数
    var batchTaskId = params.batchTaskId || 0;
    var detailId = params.detailId || 0;
    var detailOrder = params.detailOrder || 0;

    // 文件保存路径
    var dirname = workspace + "/" + batchTaskId;
    var filePath = dirname + "/" + fileName;
    //
    var startMillis = new Date().getTime();
    // 创建目录
    if (!fs.existsSync(workspace)) {
        //fs.mkdirSync(workspace);
        shell.mkdir('-p', workspace);
    }
    if (!fs.existsSync(dirname)) {
        //fs.mkdirSync(dirname);
        shell.mkdir('-p', dirname);
    }

    //
    var config = {
        url: viewPageUrl,
        path: filePath,
        callbackUrl: callbackUrl
    };
    var promise = printpdf.printpdf(config);
    //
    promise.then(function () {
        //
        var successMillis = new Date().getTime();
        var costMillis = successMillis - startMillis;
        //
        console.log("costMillis=", costMillis);
        //  加上成功标识
        var    url = concatParam(callbackUrl, "success", "true");
            url = concatParam(url, "batchTaskId", batchTaskId);
            url = concatParam(url, "detailId", detailId);
        // 回调通知
        callbackUrl && http.get(url, function (resp) {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', function (chunk) {
                data += chunk;
                data = data.trim();
            });
            resp.on('end', function () {
                console.log("request:" + callbackUrl, ";statusCode=", resp.statusCode);
                console.log("data=" + data);
            });
        });
    }).
        catch(function (err) {
            //
            console.error(err);
            //  加上错误消息
            callbackUrl = concatParam(callbackUrl, "success", "false");
            callbackUrl = concatParam(callbackUrl, "batchTaskId", batchTaskId);
            callbackUrl = concatParam(callbackUrl, "detailId", detailId);
            // 回调通知
            callbackUrl && http.get(callbackUrl, function (resp) {
                let data = '';
                // A chunk of data has been recieved.
                resp.on('data', function (chunk) {
                    data += chunk;
                    data = data.trim();
                });
                resp.on('end', function () {
                    console.log("request:" + callbackUrl, ";statusCode=", resp.statusCode);
                    console.log(data);
                });
            });
        });
//
    var respData = {
        status: STATUS_SUCCESS,
        ts: new Date().getTime()
    };
    response.json(respData);
});

// 压缩zip文件
server.get('/zippdf.json', function (request, response) {
    // express 包装的参数
    var params = request.query;
    // 回调地址
    var callbackUrl = params.callbackUrl;
    // 文件名称
    var fileName = params.fileName;
    // 其他参数
    var batchTaskId = params.batchTaskId || 0;
    //
    console.log("fileName="+fileName);

    // 文件保存路径
    var dirname = workspace + "/" + batchTaskId;
    var filePath = workspace + "/" + fileName;
    var downloadURI = encodeURIComponent(fileName);//
    //
    var startMillis = new Date().getTime();
    // 创建目录
    if (!fs.existsSync(workspace)) {
        fs.mkdirSync(workspace);
    }
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
    }
    zipFolder(dirname, filePath,  function(err){
        if(err){
            errorFn(err);
        } else {
            successFn();
        }
    });

    function errorFn(err){
        if (!err) {return;}
            //
            console.error(err);
            //  加上错误消息
            callbackUrl = concatParam(callbackUrl, "success", "false");
            callbackUrl = concatParam(callbackUrl, "batchTaskId", batchTaskId);
            // 回调通知
            callbackUrl && http.get(callbackUrl, function (resp) {
                let data = '';
                // A chunk of data has been recieved.
                resp.on('data', function (chunk) {
                    data += chunk;
                    data = data.trim();
                });
                resp.on('end', function () {
                        console.log("request:" + callbackUrl, ";statusCode=", resp.statusCode);
                        console.log(data);
                    }
                )
                ;
            });
        
    };
    function successFn(){
            //
            var successMillis = new Date().getTime();
            var costMillis = successMillis - startMillis;
            //
            console.log("costMillis=", costMillis);
            //  加上成功标识
            callbackUrl = concatParam(callbackUrl, "success", "true");
            callbackUrl = concatParam(callbackUrl, "batchTaskId", batchTaskId);
            callbackUrl = concatParam(callbackUrl, "downloadURI", downloadURI);
            // 回调通知
            callbackUrl && http.get(callbackUrl, function (resp) {
                let data = '';
                // A chunk of data has been recieved.
                resp.on('data', function(chunk) {
                    data += chunk;
                    data = data.trim();
                });
                //
                resp.on('end', function() {
                    console.log("request:" + callbackUrl, ";statusCode=", resp.statusCode);
                    console.log("data=" + data);
                });
            });
    };
   
    var respData = {
        status: STATUS_SUCCESS,
        ts: new Date().getTime()
    };
    response.json(respData);
});


server.get(baseDownloadUriPath+':fileName', function(req, res, next) {
  // 实现文件下载 
  var fileName = req.params.fileName;
  //
  // 文件路径
  var filePath = workspace + "/" + fileName;
  console.log("fileName="+fileName);
  console.log("filePath="+filePath);
  var stats = fs.statSync(filePath); 
  if(stats.isFile()){
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename='+encodeURIComponent(fileName),
      'Content-Length': stats.size
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.end(404);
  }
});

// 关闭
server.get('/command/stop', function (request, response) {
    // express 包装的参数
    var params = request.query;
    // IP 地址
    var ip = request.ip;
    //
    var token = params.token;
    //
    //console.log("客户端IP地址为=" +ip+ ";token="+token);
    
    var respData = {
        status: STATUS_SUCCESS,
        ip : ip,
        ts: new Date().getTime()
    };
    response.json(respData);
    //
    if("127.0.0.1" === ip 
		|| "::1" === ip 
		|| "::ffff:127.0.0.1" === ip){
      console.log("关闭服务器: "+ip);
      // 关闭服务器; 退出进程
	  process.exit(0);
    } else if(CLOSE_TOKEN && (CLOSE_TOKEN === token)){
      console.log("关闭服务器;ip="+ip+";token="+token);
      // 关闭服务器; 退出进程
	  process.exit(0);
	}
});

function concatParam(url, name, value){
    if(!url || !name){return url;}
    if(url.indexOf("?") <0){
        url += "?";
    }
    if(url.indexOf("=") > 0){
        url += "&";
    }
    var encValue = encodeURIComponent(value+"");
    url = url + name + "=" + encValue;
    return url;
};

// 启动监听
server.listen(http_port, function (err) {
    if (err) {
        // 如果启动时发生错误:
        return console.error('启动失败: ', err);
    }
    // 需要用 `符号`
    console.log(`服务器启动成功, 端口号: ${http_port}`)
    ;
});    

