// 参考: http://www.ruanyifeng.com/blog/2018/07/indexeddb.html

// 根据需要配置一部分即可
// 配置模板
var configTemplate = {
    dbName : "",        // 数据库名
    dbVersion : 1,        // 数据库版本
    tableName : "",        // 表名
    keyName : "",        // 主键
    autoIncrement : false,        // 自增
	// 索引: 如 {idxName : 'realName', columnName: 'realName', unique : false}
    idxArray : [],        
    db : null,        // 数据库对象
    data : {},        // 数据
    onsuccess : function(database, config){},    // 成功回调
    onerror : function(event, config){},        // 失败回调
    onupgradeneeded : function(database, config){} // 升级数据库回调
};

// 连接数据库; 如果不存在则会创建
function connectDataBase(config){
    // 参数
    var dbName = config.dbName;
    var dbVersion = config.dbVersion;
    var onsuccess = config.onsuccess;
    var onerror = config.onerror;
    var onupgradeneeded = config.onupgradeneeded;
    // 
    // 异步操作; 在当前方法链执行完之后执行; 参考 macroTask 与 microTask;
    // 所以; 不能在 控制台中 一行一行地执行。
    //
    var promise = new Promise(function(resolve, reject) {
        var request = window.indexedDB.open(dbName, dbVersion);
        // 如果触发表结构升级
        request.onupgradeneeded = function(event){
          console.log("触发数据库更新操作; dbName=", dbName,
              "dbVersion=", dbVersion);
          var db = event.target.result;
            //
          if(onupgradeneeded){
              onupgradeneeded(db, config);
          }

        };
        // 错误
        request.onerror = function (event) {
          console.log("数据库打开报错; dbName=", dbName);
          reject(event);
          if(onerror){
              onerror(event, config);
          }
        };
        // 操作成功
        request.onsuccess = function (event) {
          console.log("数据库打开成功; dbName=", dbName);
          var database = request.result;
          resolve(database);
          if(onsuccess){
              onsuccess(database, config);
          }
        };
    });
    //
    return promise;
};

// 创建表
function createTable(config){
    // 参数
    var dbName = config.dbName;
    var dbVersion = config.dbVersion;
    var onsuccess = config.onsuccess;
    var onerror = config.onerror;
    var onupgradeneeded = config.onupgradeneeded;
	//
    var tableName = config.tableName;        // 表名
    var keyName = config.tableName;        // 主键名称
    var autoIncrement = config.autoIncrement;        // 自增
    var idxArray = config.idxArray || [];        // 自增
    // 
    // 异步操作; 在当前方法链执行完之后执行; 参考 macroTask 与 microTask;
    // 所以; 不能在 控制台中 一行一行地执行。
    //
    var promise = new Promise(function(resolve, reject) {
        var request = window.indexedDB.open(dbName, dbVersion);
        // 如果触发表结构升级
        request.onupgradeneeded = function(event){
          console.log("触发数据库更新操作; dbName=", dbName,
              "dbVersion=", dbVersion);
          var db = event.target.result;
		  // 创建表
		  var options = {};
		  if(keyName){
			  options.keyName = keyName;
		  }
		  if(autoIncrement){
			  options.autoIncrement = autoIncrement;
		  }
		  var objectStore = db.createObjectStore(tableName, { keyPath: keyName });
		  //
		  if(idxArray && idxArray.length){
			  idxArray.forEach(function(idx, i){
				  //
				  var columnName = idx.columnName;
				  var idxName = idx.idxName || columnName;
				  var unique = idx.unique ? true : false;
				  //
				  objectStore.createIndex(idxName, columnName, { unique: unique });
			  });
		  }
			//
          if(onupgradeneeded){
              onupgradeneeded(db, config);
          }

        };
        // 错误
        request.onerror = function (event) {
          console.log("数据库打开报错; dbName=", dbName);
          reject(event);
          if(onerror){
              onerror(event, config);
          }
        };
        // 操作成功
        request.onsuccess = function (event) {
          console.log("数据库打开成功; dbName=", dbName);
          var database = request.result;
          resolve(database);
          if(onsuccess){
              onsuccess(database, config);
          }
        };
    });
    //
    return promise;
};


// 插入数据
function insert(config){
    // 参数
    var db = config.db;        // 数据库对象
    var onsuccess = config.onsuccess;
    var onerror = config.onerror;
	
    var tableName = config.tableName;        // 表名
    var data = config.data;        // 数据

  
    var promise = new Promise(function(resolve, reject) {
          //
          var transaction = db.transaction([tableName], "readwrite");
          var objectStore = transaction.objectStore(tableName)
          var request = objectStore.add(data);

        // 错误
        request.onerror = function (event) {
          console.log("数据写入失败; tableName=", tableName);
          reject(event);
          if(onerror){
              onerror(event, config);
          }
        };
        // 操作成功
        request.onsuccess = function (event) {
          console.log("数据写入成功; tableName=", tableName);
          var database = request.result;
          resolve(database);
          if(onsuccess){
              onsuccess(database, config);
          }
        };
    });
    //
    return promise;
};


// 修改数据
function update(config){
    // 参数
    var db = config.db;        // 数据库对象
    var onsuccess = config.onsuccess;
    var onerror = config.onerror;
	
    var tableName = config.tableName;        // 表名
    var data = config.data;        // 数据

  
    var promise = new Promise(function(resolve, reject) {
          //
          var transaction = db.transaction([tableName], "readwrite");
          var objectStore = transaction.objectStore(tableName)
          var request = objectStore.put(data);

        // 错误
        request.onerror = function (event) {
          console.log("数据更新失败; tableName=", tableName);
          reject(event);
          if(onerror){
              onerror(event, config);
          }
        };
        // 操作成功
        request.onsuccess = function (event) {
          console.log("数据更新成功; tableName=", tableName);
          resolve(data);
          if(onsuccess){
              onsuccess(data, config);
          }
        };
    });
    //
    return promise;
};


// 删除数据; delete 是关键字;
function remove(config){
    // 参数
    var db = config.db;        // 数据库对象
    var onsuccess = config.onsuccess;
    var onerror = config.onerror;
	
    var tableName = config.tableName;        // 表名
    var keyValue = config.keyValue;        // 主键值

  
    var promise = new Promise(function(resolve, reject) {
          //
          var transaction = db.transaction([tableName], "readwrite");
          var objectStore = transaction.objectStore(tableName)
          var request = objectStore.delete(keyValue);

        // 错误
        request.onerror = function (event) {
          console.log("数据删除失败; tableName=", tableName);
          reject(event);
          if(onerror){
              onerror(event, config);
          }
        };
        // 操作成功
        request.onsuccess = function (event) {
          console.log("数据删除成功; tableName=", tableName);
          resolve(keyValue);
          if(onsuccess){
              onsuccess(keyValue, config);
          }
        };
    });
    //
    return promise;
};

//

// 获取数据
function get(config){
    // 参数
    var db = config.db;        // 数据库对象
    var tableName = config.tableName;        // 表名
    var keyValue = config.keyValue;        // 主键值

    var onsuccess = config.onsuccess;
    var onerror = config.onerror;

  
    var promise = new Promise(function(resolve, reject) {
          //
          var transaction = db.transaction([tableName]);
          var objectStore = transaction.objectStore(tableName)
          var request = objectStore.get(keyValue);

        // 错误
        request.onerror = function (event) {
          console.log("读取数据失败; tableName=", tableName, 
			  "tableName=", tableName, "keyValue=",keyValue);
          reject(event);
          if(onerror){
              onerror(event, config);
          }
        };
        // 操作成功
        request.onsuccess = function (event) {
          console.log("数据读取成功; tableName=", tableName);
          var data = request.result;
          resolve(data);
          if(onsuccess){
              onsuccess(data, config);
          }
        };
    });
    //
    return promise;
};


// 获取数据
function listAll(config){
    // 参数
    var db = config.db;        // 数据库对象
    var tableName = config.tableName;        // 表名
    var keyValue = config.keyValue;        // 主键值

    var onsuccess = config.onsuccess;
    var onerror = config.onerror;

  
    var promise = new Promise(function(resolve, reject) {
          //
          var transaction = db.transaction([tableName]);
          var objectStore = transaction.objectStore(tableName)
          var request = objectStore.openCursor();

        // 错误
        request.onerror = function (event) {
          console.log("读取数据失败; ", "tableName=", tableName, "keyValue=",keyValue);
          reject(event);
          if(onerror){
              onerror(event, config);
          }
        };
		//
		var dataList = [];
        // 操作成功
        request.onsuccess = function (event) {
			//
			var cursor = event.target.result;
			//
			if (cursor) {
				var id = cursor.key;
				var data = cursor.value;
				dataList.push(data);
			   cursor.continue();
			} else {
			  console.log("没有更多数据了！");
			  resolve(dataList);
			  if(onsuccess){
				  onsuccess(dataList, config);
			  }
			}
        };
    });
    //
    return promise;
};