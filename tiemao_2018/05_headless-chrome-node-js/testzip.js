

var zipFolder = require('zip-folder');
//
function zip(folderPath, zipFilePath){
     
    zipFolder(folderPath, zipFilePath, function(err) {
        if(err) {
          console.log('oh no!', err);
        } else {
          console.log('EXCELLENT');
        }
    });
};

//
var workspace = "workspace";

// 文件名称
var filename = "testZip.zip";
var taskid = 12345;
// 文件保存路径
var dirname = workspace + "/" + taskid;

zip(dirname, workspace+"/"+filename);
