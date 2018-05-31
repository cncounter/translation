# IndexedDB 简介

打开数据库:

```

// 判断浏览器兼容性:
if (!window.indexedDB) {
    window.alert("浏览器不支持 indexedDB 特性. 请更新!");
}

// 数据库名称
var dbName = "cncounter";
// 数据库版本
var dbVersion = 1;
// 1. 打开数据库
var request = window.indexedDB.open(dbName, dbVersion);
//
var db = null;
//
const userData = [
  { id: "123", name: "tiemao", age: 35, email: "tiemao@cncounter.com" },
  { id: "126", name: "renfufei", age: 32, email: "renfufei@qq.com" }
];
// 操作 回调
request.onerror = function(event) {
  console.error('error:', event);
};
request.onsuccess = function(event) {
  db = request.result; // 成功则赋值 db 对象
  console.log('info:', event);
};
request.onupgradeneeded = function(event) {
  // db 对象
  var db = event.target.result;
  // 使用 "id" 作为主键, 保证唯一。
  var objectStore = db.createObjectStore("user", { keyPath: "id" });
  // 创建索引, 不使用 unique 索引。
  objectStore.createIndex("idx_name", "name", { unique: false });

  // 在新创建的对象存储空间中保存值
  for (var i in userData) {
    objectStore.add(userData[i]);
  }
};
```

如果一切正常, 那么 `db` 就打开了:

```
console.log(db)
VM60:1 IDBDatabase {name: "cncounter", version: 1, …}
```

可能有多个页面在操作同一个 db。 所以需要事务。

```
// 2. 创建存储; 建表
var objectStore = db.createObjectStore("customers", { keyPath: "id" });

```




```
// 操作
request.onerror = function(event) {
  console.error('error:', event)
};
request.onsuccess = function(event) {
  window.db = request.result;
  console.log('info:', event)
};
```



<https://juejin.im/post/5b09a641f265da0dcd0b674f>

