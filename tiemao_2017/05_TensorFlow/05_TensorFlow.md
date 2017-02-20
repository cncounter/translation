# Google gives everyone machine learning superpowers with TensorFlow 1.0

*   By [David Cardinal](https://www.extremetech.com/author/dcardinal "Posts by David Cardinal") on February 17, 2017 at 10:30 am
*   [Comment](https://www.extremetech.com/extreme/244573-google-gives-everyone-machine-learning-superpowers-tensorflow-1-0#disqus_thread)

 						![TensorFlow Dev Summit 2017 logo](https://www.extremetech.com/wp-content/uploads/2017/02/TensorFlow-Dev-Summit-2017-logo-640x353.jpg)

It wasn’t that long ago that building and training neural networks was strictly for seasoned computer scientists and grad students. That began to change with the release of a number of open-source [machine learning](https://www.extremetech.com/tag/machine-learning) frameworks like Theano, Spark ML, Microsoft’s CNTK, and Google’s TensorFlow. Among them, TensorFlow stands out for its powerful, yet accessible, functionality, coupled with the stunning growth of its user base. With this week’s release of TensorFlow 1.0, Google has pushed the frontiers of machine learning further in a number of directions.

### TensorFlow isn’t just for neural networks anymore

In an effort to make TensorFlow a more-general machine learning framework, Google has added both built-in Estimator functionality, and support for a number of more traditional machine learning algorithms including K-means, SVM (Support Vector Machines), and Random Forest. While there are certainly other frameworks like SparkML that support those tools, having a solution that can combine them with [neural networks](https://www.extremetech.com/tag/neural-networks) makes TensorFlow a great option for hybrid problems.

TensorFlow 1.0 also offers impressive performance improvements and scaling. In one benchmark, a training session running on a 64-processor machine ran nearly 60 times as fast as one running on a single processor.

### With Keras, anyone has a chance to build the next HAL9000

[![This is all the code needed to build a model that analyzes videos and answers questions](https://www.extremetech.com/wp-content/uploads/2017/02/Keras-demo-300x211.png)](https://www.extremetech.com/wp-content/uploads/2017/02/Keras-demo.png)As powerful as TensorFlow is, constructing a complex model directly in its API takes quite a bit of knowledge, and some careful programming. This is especially true of sophisticated models like recurrent neural networks and their fancy cousins, LSTMs (Long Short Term Memory models). The Keras programming interface provides a more user-friendly layer on top of [TensorFlow](https://www.extremetech.com/tag/tensorflow) (and Theano) that make constructing high-end networks deceptively simple.

During the Summit, Keras author Francois Chollet showed how easy it is to build a network that looks at video sequences and answered questions about them — in a single page of code! Of course, knowing how to put various layers in the model together still takes a lot of skill, but actually constructing it is relatively painless. Keras also includes a number of pre-trained models for easy instantiation. Given the labor-intensive nature of assembling the large datasets needed to train models, and the processor-intensive nature of training, that’s a huge benefit for developers.

### Making your smartphone a lot smarter

One of the most impressive new capabilities of TensorFlow is that its models can be run on many smartphones. TF1.0 even takes advantage of the Hexagon DSP that is built into Qualcomm’s Snapdragon 820 CPU. Google is already using this to power applications like Translate and Word Lens even when your phone is completely offline. Before now, sophisticated algorithms like those required for translation or speech recognition required real-time access to the cloud and its compute servers.

TensorFlow has also been ported to IBM’s POWER architecture as part of PowerAI, and to Movidius’s [Myriad 2 specialized processor](https://www.extremetech.com/extreme/222095-google-taps-chipmaker-movidius-to-add-machine-learning-to-phones).

### Getting started with TensorFlow

You can [download TensorFlow](http://www.tensorflow.org) 1.0 now. Currently, Keras is a separate package that’s easy to install using pip or your favorite package manager, but Google plans to have it built-in to the 1.2 release of TensorFlow. There are some API-breaking changes going from .12 to 1.0, but many of them are fairly straightforward name changes that have already been telegraphed with Deprecated messages. Google even provides a handy script that will try and update your existing code, if needed.

As is typical of machine learning tools, you’ll get much better performance running on a supported GPU, but now there are even options to spin your models up in the cloud. For example, Y Combinator-backed startup [Floyd Hub](https://www.floydhub.com/) has TensorFlow and many other machine learning tools pre-installed on powerful GPU systems you can rent just for the amount of time you need to train and run your models.

Now read: [Artificial neural networks are changing the world. What are they?](https://www.extremetech.com/extreme/215170-artificial-neural-networks-are-changing-the-world-what-are-they)