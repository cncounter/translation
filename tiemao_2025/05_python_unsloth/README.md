# 在MAC环境中安装unsloth

[TOC]

本文简单介绍如何在Mac操作系统中安装 unsloth. unsloth是一款对大模型进行微调的开发者工具。

## 1. 背景

我的电脑是MAC, 跟着教程安装 unsloth 一直报错.

```
Building wheels for collected packages: xformers
  Building wheel for xformers (pyproject.toml) ... error
  error: subprocess-exited-with-error

  × Building wheel for xformers (pyproject.toml) did not run successfully.
  │ exit code: 1
  ╰─> [213 lines of output]
      /.../lib/python3.11/site-packages/torch/
        _subclasses/functional_tensor.py:279: 
    UserWarning: Failed to initialize NumPy: 
    No module named 'numpy' (Triggered internally at 
      /Users/runner/work/pytorch/pytorch/pytorch/
        torch/csrc/utils/tensor_numpy.cpp:81.)
        cpu = _conversion_method_template(device=torch.device("cpu"))
```

看报错信息说没有 'numpy' 模块, 网上资料说是 'numpy' 版本不兼容。


## 2. 排查

搜索 [unsloth macos](https://www.bing.com/search?q=unsloth+macos) 


Bing的人工智能说不支持MAC。

找到了一些资料:

- [GITHUB: Unsloth On Mac · Issue # 685](https://github.com/unslothai/unsloth/issues/685)
- [GITHUB: Apple Silicon Support # 4 ](https://github.com/unslothai/unsloth/issues/4)
- [CSDN: mac安装unsloth](https://blog.csdn.net/weixin_45562510/article/details/147198314)


## 3. 下载MAC版unsloth项目分支的源码

参考这些资料, 打开MAC版本的非官方仓库的分支页面:

> [https://github.com/shashikanth-a/unsloth/tree/apple_silicon_support](https://github.com/shashikanth-a/unsloth/tree/apple_silicon_support)

使用git下载代码:

```
mkdir -p ~/GITHUB_ALL

cd ~/GITHUB_ALL

# apple_silicon_support分支, 只下载1个深度
git clone --depth 1 -b apple_silicon_support git@github.com:shashikanth-a/unsloth.git
```

也可以直接下载zip包, 完成之后解压。

> https://github.com/shashikanth-a/unsloth/archive/refs/heads/apple_silicon_support.zip


## 4. 创建环境与安装

参考前面的文章:

> [适合新手的Python与神经网络学习日记](https://blog.csdn.net/renfufei/article/details/150343467)

先使用conda创建一个新的环境:

```sh
# 进入目录
# cd ~/GITHUB_ALL/unsloth-apple_silicon_support
cd ~/GITHUB_ALL/unsloth

# 创建一个Python 3.12 版本的环境
conda create -y -n unsloth312 python=3.12

# 激活环境
conda activate unsloth312


# 可以查看项目的 pyproject.toml文件, 里面有多个配置
# 我们使用 huggingface 这一节来执行安装
pip install -e ".[huggingface]"

```

安装需要消耗一些时间, 
成功的话, 会有类似下面这样的成功提示.

```js

Successfully built unsloth
Installing collected packages: 
  torchao, pytz, mpmath, xxhash, urllib3, unsloth, 
  ..., 
  transformers, datasets, trl, peft, unsloth_zoo

Successfully installed 
   ...
   transformers-4.55.2
   unsloth-2025.8.5 
   unsloth_zoo-2025.8.7
   ...
```

可以看到, 安装了 `unsloth`, `unsloth_zoo` 等库。

## 5. 测试

直接在Python的REPL环境中进行验证:

```sh

# 先进入python环境中
python

# 引入 unsloth,  如果不报错就是安装成功了。
# import unsloth 

# import unsloth_zoo
# 如果引入 unsloth_zoo 则会报错
# NotImplementedError: Unsloth currently only works on NVIDIA GPUs and Intel GPUs.

# 退出python交互环境
# quit()
```



## 6. 参考资料

参考文章: [mac安装unsloth -CSDN](https://blog.csdn.net/weixin_45562510/article/details/147198314)


