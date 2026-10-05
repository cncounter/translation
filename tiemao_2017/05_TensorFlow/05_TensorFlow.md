# Google gives everyone machine learning superpowers with TensorFlow 1.0

# Google 赋予每个人机器学习的超能力 —— TensorFlow 1.0


 ![TensorFlow Dev Summit 2017 logo](https://www.extremetech.com/wp-content/uploads/2017/02/TensorFlow-Dev-Summit-2017-logo-640x353.jpg)


It wasn’t that long ago that building and training neural networks was strictly for seasoned computer scientists and grad students. That began to change with the release of a number of open-source [machine learning](https://www.extremetech.com/tag/machine-learning) frameworks like Theano, Spark ML, Microsoft’s CNTK, and Google’s TensorFlow. Among them, TensorFlow stands out for its powerful, yet accessible, functionality, coupled with the stunning growth of its user base. With this week’s release of TensorFlow 1.0, Google has pushed the frontiers of machine learning further in a number of directions.

就在不久之前, 构建和训练神经网络还只是资深计算机科学家和研究生的专利。随着 Theano、Spark ML、微软的 CNTK、谷歌的 TensorFlow 等一批开源 [机器学习](https://www.extremetech.com/tag/machine-learning) 框架的发布, 这种局面开始改变。其中, TensorFlow 凭借强大而又平易近人的功能, 再加上用户群的惊人增长而脱颖而出。本周随着 TensorFlow 1.0 的发布, 谷歌在多个方向上进一步拓展了机器学习的边界。


### TensorFlow isn’t just for neural networks anymore

### TensorFlow 不仅仅是神经网络了


In an effort to make TensorFlow a more-general machine learning framework, Google has added both built-in Estimator functionality, and support for a number of more traditional machine learning algorithms including K-means, SVM (Support Vector Machines), and Random Forest. While there are certainly other frameworks like SparkML that support those tools, having a solution that can combine them with [neural networks](https://www.extremetech.com/tag/neural-networks) makes TensorFlow a great option for hybrid problems.

为了让 TensorFlow 成为更通用的机器学习框架, 谷歌既加入了内置的 Estimator(估计器)功能, 也支持了许多更传统的机器学习算法, 包括 K-means、SVM(支持向量机)和随机森林。当然, 也有像 SparkML 这样的其他框架支持这些工具, 但有一个能把它们与 [神经网络](https://www.extremetech.com/tag/neural-networks) 结合起来的方案, 使 TensorFlow 成为处理混合问题的绝佳选择。


TensorFlow 1.0 also offers impressive performance improvements and scaling. In one benchmark, a training session running on a 64-processor machine ran nearly 60 times as fast as one running on a single processor.

TensorFlow 1.0 还带来了令人印象深刻的性能改进和扩展能力。在一项基准测试中, 一次训练在 64 处理器的机器上运行的速度几乎是在单处理器上运行的 60 倍。


### With Keras, anyone has a chance to build the next HAL9000

### 借助 Keras, 任何人都有机会构建下一个 HAL9000


[![This is all the code needed to build a model that analyzes videos and answers questions](https://www.extremetech.com/wp-content/uploads/2017/02/Keras-demo-300x211.png)](https://www.extremetech.com/wp-content/uploads/2017/02/Keras-demo.png)As powerful as TensorFlow is, constructing a complex model directly in its API takes quite a bit of knowledge, and some careful programming. This is especially true of sophisticated models like recurrent neural networks and their fancy cousins, LSTMs (Long Short Term Memory models). The Keras programming interface provides a more user-friendly layer on top of [TensorFlow](https://www.extremetech.com/tag/tensorflow) (and Theano) that make constructing high-end networks deceptively simple.

[![构建一个能分析视频并回答问题的模型所需的全部代码](https://www.extremetech.com/wp-content/uploads/2017/02/Keras-demo-300x211.png)](https://www.extremetech.com/wp-content/uploads/2017/02/Keras-demo.png)TensorFlow 虽然强大, 但直接用它自身的 API 构建一个复杂模型需要相当多的知识和一些细致的编程。对于像循环神经网络及其更花哨的表亲 LSTM(长短期记忆模型)这样的复杂模型尤其如此。Keras 编程接口在 [TensorFlow](https://www.extremetech.com/tag/tensorflow)(以及 Theano)之上提供了一个更友好的层次, 让构建高端网络看起来简单得不可思议。


During the Summit, Keras author Francois Chollet showed how easy it is to build a network that looks at video sequences and answered questions about them — in a single page of code! Of course, knowing how to put various layers in the model together still takes a lot of skill, but actually constructing it is relatively painless. Keras also includes a number of pre-trained models for easy instantiation. Given the labor-intensive nature of assembling the large datasets needed to train models, and the processor-intensive nature of training, that’s a huge benefit for developers.

在峰会期间, Keras 的作者 Francois Chollet 展示了构建一个能够查看视频序列并回答相关问题的网络是多么容易——只用了整整一页代码!当然, 知道如何把模型中的各个层组合起来仍然需要很多技巧, 但实际的构建过程相对轻松。Keras 还包含许多预训练模型, 方便直接实例化。考虑到组装训练模型所需的大型数据集是劳动密集型工作, 而训练又是处理器密集型工作, 这对开发者来说是一个巨大的好处。


### Making your smartphone a lot smarter

### 让你的智能手机聪明得多


One of the most impressive new capabilities of TensorFlow is that its models can be run on many smartphones. TF1.0 even takes advantage of the Hexagon DSP that is built into Qualcomm’s Snapdragon 820 CPU. Google is already using this to power applications like Translate and Word Lens even when your phone is completely offline. Before now, sophisticated algorithms like those required for translation or speech recognition required real-time access to the cloud and its compute servers.

TensorFlow 最令人印象深刻的新功能之一, 是它的模型可以在许多智能手机上运行。TF1.0 甚至利用了高通 Snapdragon 820 CPU 内置的 Hexagon DSP。谷歌已经在用它为 Translate 和 Word Lens 之类的应用提供支持, 即使你的手机完全离线也能使用。在此之前, 翻译或语音识别所需的这类复杂算法都需要实时访问云端及其计算服务器。


TensorFlow has also been ported to IBM’s POWER architecture as part of PowerAI, and to Movidius’s [Myriad 2 specialized processor](https://www.extremetech.com/extreme/222095-google-taps-chipmaker-movidius-to-add-machine-learning-to-phones).

TensorFlow 还被移植到 IBM 的 POWER 架构, 作为 PowerAI 的一部分; 也移植到了 Movidius 的 [Myriad 2 专用处理器](https://www.extremetech.com/extreme/222095-google-taps-chipmaker-movidius-to-add-machine-learning-to-phones)。


### Getting started with TensorFlow

### TensorFlow 入门


You can [download TensorFlow](http://www.tensorflow.org) 1.0 now. Currently, Keras is a separate package that’s easy to install using pip or your favorite package manager, but Google plans to have it built-in to the 1.2 release of TensorFlow. There are some API-breaking changes going from .12 to 1.0, but many of them are fairly straightforward name changes that have already been telegraphed with Deprecated messages. Google even provides a handy script that will try and update your existing code, if needed.

现在你就可以 [下载 TensorFlow](http://www.tensorflow.org) 1.0 了。目前, Keras 还是一个单独的包, 用 pip 或你喜欢的包管理器都很容易安装, 但谷歌计划在 TensorFlow 1.2 版本中将它内置。从 0.12 到 1.0 有一些破坏 API 的改动, 但其中很多只是简单的名称变更, 已经通过 Deprecated 消息提前告知。如果需要, 谷歌甚至还提供了一个便利脚本, 尝试更新你现有的代码。


As is typical of machine learning tools, you’ll get much better performance running on a supported GPU, but now there are even options to spin your models up in the cloud. For example, Y Combinator-backed startup [Floyd Hub](https://www.floydhub.com/) has TensorFlow and many other machine learning tools pre-installed on powerful GPU systems you can rent just for the amount of time you need to train and run your models.

和典型的机器学习工具一样, 在受支持的 GPU 上运行会获得更好的性能, 但现在甚至还可以选择把模型放到云端运行。例如, Y Combinator 投资的初创公司 [Floyd Hub](https://www.floydhub.com/) 在强大的 GPU 系统上预装了 TensorFlow 和许多其他机器学习工具, 你只需按训练和运行模型所需的时间租用即可。


Now read: [Artificial neural networks are changing the world. What are they?](https://www.extremetech.com/extreme/215170-artificial-neural-networks-are-changing-the-world-what-are-they)

现在阅读: [人工神经网络正在改变世界。它们是什么?](https://www.extremetech.com/extreme/215170-artificial-neural-networks-are-changing-the-world-what-are-they)




*   By [David Cardinal](https://www.extremetech.com/author/dcardinal "Posts by David Cardinal") on February 17, 2017 at 10:30 am
