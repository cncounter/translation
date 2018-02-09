// 模块依赖
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
// 端口号
const http_port = 80;
// express服务实例
const server = express();

//
var storagePath = "workspace";

// 示例: http://localhost:80/download/export_12345.zip
// 对应的文件为: storagePath/export_12345.zip
//
server.get('/download/:fileName', function(req, res, next) {
  // 实现文件下载 
  var fileName = req.params.fileName;
  // 文件路径
  var filePath = storagePath + "/" + fileName;
  var stats = fs.statSync(filePath); 
  if(stats.isFile()){
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename='+fileName,
      'Content-Length': stats.size
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.end(404);
  }
});



// 启动监听
server.listen(http_port, function(err){
  if (err) {
    // 如果启动时发生错误:
    return console.error('something bad happened', err);
  }
  console.log(`server is listening on ${http_port}`);
});

//
