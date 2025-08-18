# 适合新手的Python与神经网络学习日记



本文的学习, 参考了B站有视频教程:

> [Bili: 从零设计并训练一个神经网络，你就能真正理解它了](https://www.bilibili.com/video/BV134421U77t)


这个教程, 有一个好处, 初学者不需要去死磕那些算法的内部实现原理, 先拿来用即可。

本人在使用Mac电脑学习的过程中, 发现相关环境的安装与配置对初学者来说可能有些难度,  所以写下这篇学习日记。



## 1、下载与安装

我们使用Anaconda来进行管理, 官方下载页面:

> https://www.anaconda.com/download

或者下载版本选择页面:

> https://www.anaconda.com/download/success

可以在里面找到对应平台的安装包。

下载安装即可。 我们不用再单独安装 python 了。


打开命令行shell, 验证conda是否正确配置:

```sh

# 查看conda版本
conda --version


# 查看帮助信息
conda --help

```



## 2、环境配置

默认的那个base环境, 不太好折腾。

我们选择新建环境。

> 如果环境配置出问题了, 删除自定义环境, 重新折腾一个即可。


### 2.1 创建Python环境

创建Python3.10的环境:

> `conda create -y -n pytorch310 python=3.10`


环境名称是: `pytorch310`, 这个可以随便取。



其中, `-y` 命令表示直接接受, 免去交互过程中的确认。
如果不加 `-y`,  中途可能会有交互, 要求接受协议, 根据提示, 输入适当的命令回车即可。


### 2.2 检查Python环境

创建完成之后, 检查环境:


```sh

# 列出环境列表
conda env list

# conda environments:
#
base                 * /Users/renfufei/SOFT_ALL/miniconda/miniconda3
pytorch310             /Users/renfufei/SOFT_ALL/miniconda/miniconda3/envs/pytorch310
```


切换新环境:


```sh
# 切换当前shell下的python环境
conda activate pytorch310

# 取消激活的环境: 退到上一个环境;
# conda deactivate

# 切换回 base
# conda activate base

```



### 2.3 验证Python环境

验证python版本配置:

```sh

# 查看python版本
python --version

Python 3.10.18


# 查看当前环境支持的软件包列表
conda list

```




## 3、安装Pytorch


根据平台, 选择需要的包即可:


```sh

# 切换当前shell下的python环境
conda activate pytorch310

# 安装 torch 相关的包:
conda install -y pytorch torchvision torchaudio

```

其中, `-y` 命令表示直接接受, 免去交互过程中的确认。


### 3.1 验证Pytorch安装成功

安装完成后, 验证一下:

```sh

# 先进入python环境中
python

# 引入 torch,  如果不报错就是OK了。
# import torch 

# 退出python交互环境
# quit()

```


如果报错, 则需要根据提示信息进行排查。


### 3.2 验证Pytorch是否支持M系列芯片

验证是否支持 mac m* 系列芯片的 mps 加速, 在python的REPL交互环境中输入以下代码:


```python

# 先进入python环境中
# python

import torch 

# 验证是否支持 mac m* 系列芯片的 mps 加速
print(torch.backends.mps.is_available()) 
print(torch.backends.mps.is_built())

# 退出python交互环境
# quit()

```

回车执行。

如果支持, 则每个print语句会打印出对应的 `True`。

如果是windows, 则需要使用其他命令; 参考这一篇文章:


> [知乎: Anaconda + Pytorch 超详细安装教程](https://zhuanlan.zhihu.com/p/687424747)


## 4. 测试神经网络

参考这个项目:

> https://github.com/xhh890921/mnist_network

对应的B站有视频教程:

> [Bili: 从零设计并训练一个神经网络，你就能真正理解它了](https://www.bilibili.com/video/BV134421U77t)


### 4.1 下载示例项目

我们先clone项目:

```sh
# 保存位置
mkdir -p ~/GITHUB_ALL
cd ~/GITHUB_ALL

# 克隆项目
git clone git@github.com:xhh890921/mnist_network.git

```

如果网络有问题, 这个过程, 国内开发者可能需要一点必备的科学技巧。

例如这样的:

```
# 复制终端带里命令, 然后在命令行执行:
# export https_pr*oxy=http://127.0.0.1:7890
# export http_pro*xy=http://127.0.0.1:7890
# export all_prox*y=socks5://127.0.0.1:7890

```


### 4.2 执行准备数据和下载文件的脚本

项目代码下载完成之后, 进入相应的项目目录:

```sh
# 进入目录
cd ~/GITHUB_ALL/mnist_network

# 切换当前shell下的python环境
conda activate pytorch310

# 查看文件
ls -l

# 这时候项目目录下只有几个简单的文件:

    download_data.py
    model.py
    README.md
    test.py
    train.py

# 逐个执行以下脚本

# 1. 执行下载文件的脚本
python ./download_data.py

# 2. 执行训练
# python ./train.py

# 3. 执行测试
# python ./test.py

```

下载可能需要一点时间。

下载完成后, 可以看到有一些目录:

```sh
ls -l data/MNIST/raw mnist_images/


data/MNIST/raw:
-rw-r--r--  1 renfufei  staff   7840016  8 13 12:50 t10k-images-idx3-ubyte
-rw-r--r--  1 renfufei  staff   1648877  8 13 12:50 t10k-images-idx3-ubyte.gz
-rw-r--r--  1 renfufei  staff     10008  8 13 12:50 t10k-labels-idx1-ubyte
-rw-r--r--  1 renfufei  staff      4542  8 13 12:50 t10k-labels-idx1-ubyte.gz
-rw-r--r--  1 renfufei  staff  47040016  8 13 12:50 train-images-idx3-ubyte
-rw-r--r--  1 renfufei  staff   9912422  8 13 12:50 train-images-idx3-ubyte.gz
-rw-r--r--  1 renfufei  staff     60008  8 13 12:50 train-labels-idx1-ubyte
-rw-r--r--  1 renfufei  staff     28881  8 13 12:50 train-labels-idx1-ubyte.gz

mnist_images/:

drwxr-xr-x  12 renfufei  staff  384  8 13 12:50 test/
drwxr-xr-x  12 renfufei  staff  384  8 13 12:50 train/
```

这些就是需要的图片。 




### 4.3 配置gitignore


如果想让 git 版本控制仓库整洁一点, 可以将目录加入忽略列表:

```sh
# vim .git/info/exclude

data/*
mnist_images/*
```




### 4.4 执行训练


> 执行训练和测试的过程中, 可以打开【活动监视器】或者【任务管理器】, 查看CPU和GPU的使用情况。


继续在前面的环境中, 执行训练:


```sh
# 2. 执行训练
python ./train.py

```



训练过程中的部分日志:

```js

train_dataset length:  60000
train_loader length:  938
Epoch 1/10 | Batch 0/938 | Loss: 2.2891
Epoch 1/10 | Batch 100/938 | Loss: 0.4798
Epoch 1/10 | Batch 200/938 | Loss: 0.2560

...

Epoch 10/10 | Batch 600/938 | Loss: 0.0061
Epoch 10/10 | Batch 700/938 | Loss: 0.0128
Epoch 10/10 | Batch 800/938 | Loss: 0.0033
Epoch 10/10 | Batch 900/938 | Loss: 0.0090
```




### 4.5 执行测试

继续在前面的环境中, 执行测试:


```sh
# 3. 执行测试
python ./test.py

```


测试结果部分日志:

```js
...
wrong case: predict = 4 y = 9 img_path = ./mnist_images/test/9/ec2e3cca5a16a0d3.png
wrong case: predict = 1 y = 9 img_path = ./mnist_images/test/9/f37d8336779ebfe3.png
test accuracy = 9790 / 10000 = 0.979
```


## 5. 小结

相关的代码都有注释, 参考资料中的视频也讲的不错, 建议过去看看。


## 6. 参考资料

对应的B站有视频教程:

> [Bili: 从零设计并训练一个神经网络，你就能真正理解它了](https://www.bilibili.com/video/BV134421U77t)


