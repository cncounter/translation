# Google gives everyone machine learning superpowers with TensorFlow 1.0

# Google的超级帝国 -- TensorFlow 1.0


 ![TensorFlow Dev Summit 2017 logo](https://www.extremetech.com/wp-content/uploads/2017/02/TensorFlow-Dev-Summit-2017-logo-640x353.jpg)


It wasn’t that long ago that building and training neural networks was strictly for seasoned computer scientists and grad students. That began to change with the release of a number of open-source [machine learning](https://www.extremetech.com/tag/machine-learning) frameworks like Theano, Spark ML, Microsoft’s CNTK, and Google’s TensorFlow. Among them, TensorFlow stands out for its powerful, yet accessible, functionality, coupled with the stunning growth of its user base. With this week’s release of TensorFlow 1.0, Google has pushed the frontiers of machine learning further in a number of directions.

这不是很久以前,构建和训练神经网络是经验丰富的计算机科学家和研究生严格.开始改变,释放大量的开源(机器学习)(https://www.extremetech.com/tag/machine-learning)Theano这样的框架,引发毫升,微软的CNTK,谷歌的TensorFlow.其中,TensorFlow脱颖而出的强大,然而,访问功能,再加上惊人的增长的用户群。在本周发布的TensorFlow 1.0,谷歌进一步推动机器学习的前沿方向。


### TensorFlow isn’t just for neural networks anymore

### TensorFlow不仅仅是神经网络了


In an effort to make TensorFlow a more-general machine learning framework, Google has added both built-in Estimator functionality, and support for a number of more traditional machine learning algorithms including K-means, SVM (Support Vector Machines), and Random Forest. While there are certainly other frameworks like SparkML that support those tools, having a solution that can combine them with [neural networks](https://www.extremetech.com/tag/neural-networks) makes TensorFlow a great option for hybrid problems.

为了让TensorFlow范围更机器学习框架,谷歌已经添加内置估计量的功能,并支持一些更传统的机器学习算法包括k - means,SVM(支持向量机)和随机森林.当然还有其它一些SparkML这样的框架支持这些工具,有一个解决方案,可以把它们与神经网络(https://www.extremetech.com/tag/neural-networks)TensorFlow混合问题的一个很好的选择。


TensorFlow 1.0 also offers impressive performance improvements and scaling. In one benchmark, a training session running on a 64-processor machine ran nearly 60 times as fast as one running on a single processor.

TensorFlow 1.0还提供了令人印象深刻的性能改进和扩展.在一个基准,训练64处理器的机器上运行了近60倍一个运行在一个处理器上。


### With Keras, anyone has a chance to build the next HAL9000

### Keras,任何人都有机会建立下一个HAL9000


[![This is all the code needed to build a model that analyzes videos and answers questions](https://www.extremetech.com/wp-content/uploads/2017/02/Keras-demo-300x211.png)](https://www.extremetech.com/wp-content/uploads/2017/02/Keras-demo.png)As powerful as TensorFlow is, constructing a complex model directly in its API takes quite a bit of knowledge, and some careful programming. This is especially true of sophisticated models like recurrent neural networks and their fancy cousins, LSTMs (Long Short Term Memory models). The Keras programming interface provides a more user-friendly layer on top of [TensorFlow](https://www.extremetech.com/tag/tensorflow) (and Theano) that make constructing high-end networks deceptively simple.

[![This is to all the code model,本人提出构建analyzes影片和雅虎问答(问题)]]https://www.extremetech.com/wp-content/uploads/2017/02/Keras-demo-300x211.png(https://www.extremetech.com/wp-content/uploads/2017/02/Keras-demo.png)和TensorFlow是一样强大,直接在其API构建一个复杂的模型需要相当多的知识,和一些小心编程.尤其如此复杂的递归神经网络模型及其奇特的表亲,LSTMs(长期短期记忆模型).Keras编程接口之上提供了一个更具用户友好性层[TensorFlow](https://www.extremetech.com/tag/tensorflow)(和Theano)构建高端网络看似简单。


During the Summit, Keras author Francois Chollet showed how easy it is to build a network that looks at video sequences and answered questions about them — in a single page of code! Of course, knowing how to put various layers in the model together still takes a lot of skill, but actually constructing it is relatively painless. Keras also includes a number of pre-trained models for easy instantiation. Given the labor-intensive nature of assembling the large datasets needed to train models, and the processor-intensive nature of training, that’s a huge benefit for developers.

在峰会期间,Keras作者弗朗索瓦Chollet显示是多么容易建立一个网络看视频序列和回答问题——在一个页面的代码!当然,知道如何把模型中各层仍然需要很多的技巧,但实际上构建相对无痛.Keras还包括许多pre-trained模型简单的实例化.鉴于劳动密集型的组装所需的大型数据集训练模型,和处理器密集型的培训,对于开发人员来说是一个巨大的利益。


### Making your smartphone a lot smarter

### 让你的智能手机更聪明了


One of the most impressive new capabilities of TensorFlow is that its models can be run on many smartphones. TF1.0 even takes advantage of the Hexagon DSP that is built into Qualcomm’s Snapdragon 820 CPU. Google is already using this to power applications like Translate and Word Lens even when your phone is completely offline. Before now, sophisticated algorithms like those required for translation or speech recognition required real-time access to the cloud and its compute servers.

TensorFlow最令人印象深刻的新功能之一是其模型可以在许多智能手机上运行。TF1.0甚至利用内置的六角DSP高通Snapdragon 820 CPU.谷歌已经使用这种权力应用程序翻译和文字镜头,即使你的手机是完全离线的.现在之前,复杂的算法如需要翻译或语音识别所需的实时访问云计算服务器。


TensorFlow has also been ported to IBM’s POWER architecture as part of PowerAI, and to Movidius’s [Myriad 2 specialized processor](https://www.extremetech.com/extreme/222095-google-taps-chipmaker-movidius-to-add-machine-learning-to-phones).

TensorFlow也被移植到IBM POWER体系结构作为PowerAI的一部分,和Movidius无数2专用处理器(https://www.extremetech.com/extreme/222095-google-taps-chipmaker-movidius-to-add-machine-learning-to-phones)。


### Getting started with TensorFlow

### 开始使用TensorFlow


You can [download TensorFlow](http://www.tensorflow.org) 1.0 now. Currently, Keras is a separate package that’s easy to install using pip or your favorite package manager, but Google plans to have it built-in to the 1.2 release of TensorFlow. There are some API-breaking changes going from .12 to 1.0, but many of them are fairly straightforward name changes that have already been telegraphed with Deprecated messages. Google even provides a handy script that will try and update your existing code, if needed.

你可以下载TensorFlow(http://www.tensorflow.org)1.0现在.目前,Keras是一个单独的包很容易安装使用脉冲或你最喜欢的包管理器,但谷歌计划它内置TensorFlow的1.2版本.有一些从API-breaking变化。12到1.0,但很多都是相当简单的名称更改,已经弃用消息电报.谷歌甚至提供了一个方便的脚本,它将尝试更新你的现有代码,如果必要的。


As is typical of machine learning tools, you’ll get much better performance running on a supported GPU, but now there are even options to spin your models up in the cloud. For example, Y Combinator-backed startup [Floyd Hub](https://www.floydhub.com/) has TensorFlow and many other machine learning tools pre-installed on powerful GPU systems you can rent just for the amount of time you need to train and run your models.

是典型的机器学习工具,你会得到更好的性能运行在GPU的支持,但是现在甚至有选择自旋模型的云.例如,Y Combinator-backed启动(Floyd中心)(https://www.floydhub.com/)TensorFlow和许多其他机器学习工具预装在GPU强大的系统你可以租只是为你需要训练的时间和运行您的模型。


Now read: [Artificial neural networks are changing the world. What are they?](https://www.extremetech.com/extreme/215170-artificial-neural-networks-are-changing-the-world-what-are-they)

现在读:[人工神经网络是改变世界。他们是什么?)(https://www.extremetech.com/extreme/215170-artificial-neural-networks-are-changing-the-world-what-are-they)




*   By [David Cardinal](https://www.extremetech.com/author/dcardinal "Posts by David Cardinal") on February 17, 2017 at 10:30 am
