
curuser=`whoami`

# 检测root用户
if [ "$curuser" = "root" ]; then
  echo "OK! current user is: $curuser"
else
  echo "Error: Please Use Super User, current user is : $curuser"
  echo "Error: Exit with Err Code: 1"
  exit 1;
fi

# 创建并进入相应目录
mkdir -p redis_all
cd redis_all/

# 下载; 如果下载不了可以采用其他方式
if [ ! -e ./redis-stable.tar.gz ] ; then
  wget http://download.redis.io/redis-stable.tar.gz
else
  echo "OK! No download required! File Exists: redis-stable.tar.gz"
fi

sleep 1;

# 解压前检查
if [ ! -e ./redis-stable.tar.gz ] ; then
  echo "Error: File Download Fail: redis-stable.tar.gz"
  echo "Error: Exit with Err Code: 2"
  exit 2;
else
  echo "OK! Download success! File exists: redis-stable.tar.gz"
fi

# 解压
if [ ! -e ./redis-stable/utils/create-cluster ] ; then
  tar xzf redis-stable.tar.gz
else
  echo "OK! No need to decompress! Dir exists: redis-stable"
fi

sleep 1;

# 编译前检查
if [ ! -e ./redis-stable/utils/create-cluster ] ; then
  echo "Error: Dir Not exists: redis-stable"
  echo "Error: Exit with Err Code: 3"
  exit 3;
else
  echo "OK! decompress success: redis-stable"
fi

# 编译; 要求gcc, 没有请先安装
echo "OK! Prepare To compile: make"
sleep 1;

cd redis-stable

# 编译
if [ ! -e ./src/redis-server ] ; then
  make
else
  echo "OK! No need to compile, File Exists: ./src/redis-server"
fi


# 编译后检查
if [ ! -e ./src/redis-server ] ; then
  echo "Error: File Not exists: ./src/redis-server"
  echo "Error: Exit with Err Code: 4"
  exit 4;
else
  echo "OK! compile success: ./src/redis-server"
fi


# 搭建集群

cd utils/create-cluster

# 查看帮助
./create-cluster


# 如果要修改端口号, 直接修改脚本 create-cluster 即可
# 注意: 如果需要内网其他机器访问, 需要关闭保护模式;

# 启动实例
./create-cluster start

# 创建集群
./create-cluster create

# Linux 下查看端口号监听
lsof -iTCP -sTCP:LISTEN -n -P | grep TCP
