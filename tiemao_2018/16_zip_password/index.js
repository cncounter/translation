// 判断操作系统
var os = require('os');
if (os.platform() == 'win32') {  
    var chilkat = require('chilkat_node8_win32'); 
} else if (os.platform() == 'linux') {
    if (os.arch() == 'arm') {
        var chilkat = require('chilkat_node8_arm');
    } else if(os.arch() == 'x86') {
        var chilkat = require('chilkat_node8_linux32');
    } else {
        var chilkat = require('chilkat_node8_linux64');
    }
} else if (os.platform() == 'darwin') {
    var chilkat = require('chilkat_node8_macosx');
}

// 执行该示例
chilkatExample();

// 简单示例
function chilkatExample() {
	//
	var zipFileName = "NewZip_cnc.zip"; //保存路径
	var zipPassword = "cncounter"; // 密码
	// src文件信息
	var srcFiles = "E:/CODE_ALL/02_GIT_ALL/translation/tiemao_2018/16_zip_password/node_modules/*";

    // 初始化一个实例
	var zip = new chilkat.Zip();

    var success; // flag

    //  任意密钥,可以免费试用30天。
	var reg_key = "Anything for 30-day trial";
    success = zip.UnlockComponent(reg_key);
    if (success !== true) {
        console.log('UnlockComponent-密钥过期:', zip.LastErrorText);
        return;
    }

    success = zip.NewZip(zipFileName);
    if (success !== true) {
        console.log('NewZip-创建失败:', zipFileName, zip.LastErrorText);
        return;
    }

    //  设置使用 AES 加密方式.
    //  值为4, 表示兼容 WinZip 的 AES 加密.
    zip.Encryption = 4;
    //  Key 长度,可以是 128, 192, 或者 256 bits.
    zip.EncryptKeyLength = 128;
    //  设置AES加密密码:
    zip.EncryptPassword = zipPassword;

    var recurse = true; // 递归遍历目录
    success = zip.AppendFiles(srcFiles, recurse);
	// 此时只是添加文件引用信息, 尚未开始压缩和写入。
    if (success !== true) {
        console.log('AppendFiles:',zip.LastErrorText);
        return;
    }
    //  创建加密zip文件, 文件路径由前面的 NewZip 指定
    var success = zip.WriteZipAndClose();
    if (success !== true) {
        console.log("WriteZipAndClose-文件写入失败", zip.LastErrorText);
        return;
    }
    console.log("AES方式加密的zip文件创建成功.");
};
