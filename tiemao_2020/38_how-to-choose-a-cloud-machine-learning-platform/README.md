# How to choose a cloud machine learning platform

> 12 capabilities every cloud machine learning platform should provide to support the complete machine learning lifecycle


# 如何选择机器学习云平台

> 要支撑完整的机器学习生命周期, 每个机器学习云平台都应该提供的12项功能特征

In order to create effective machine learning and deep learning models, you need copious amounts of data, a way to clean the data and perform feature engineering on it, and a way to train models on your data in a reasonable amount of time. Then you need a way to deploy your models, monitor them for drift over time, and retrain them as needed.

You can do all of that on-premises if you have invested in compute resources and accelerators such as GPUs, but you may find that if your resources are adequate, they are also idle much of the time. On the other hand, it can sometimes be more cost-effective to run the entire pipeline in the cloud, using large amounts of compute resources and accelerators as needed, and then releasing them.

The major cloud providers — and a number of minor clouds too — have put significant effort into building out their machine learning platforms to support the complete machine learning lifecycle, from planning a project to maintaining a model in production. How do you determine which of these clouds will meet your needs? Here are 12 capabilities every end-to-end machine learning platform should provide.


为了创建有效的机器学习和深度学习模型，您需要大量数据、一种清理数据并对其执行特征工程的方法，以及一种在合理的时间内训练数据模型的方法。然后，您需要一种方法来部署您的模型，并随时间的漂移对其进行监控，根据需要重新训练它们。

如果已经购买了机器和 GPU 加速器等计算资源，则在机房就可以完成所有的工作，但你会发现，如果资源充足的话，在大部分时间这些机器都是处于闲置状态的。 另一方面，有时候，在云环境中运行整个流水线，按需使用大量的计算资源和加速器，用完之后进行释放，在成本方面会更有优势。

大部分云厂商、以及一些小型的云，都付出了很多资源和努力来构建他们的机器学习平台，以支持整个机器学习生命周期，包括规划项目到维护生产模型。 那么我们如何确定这些云中的哪些将满足需求？以下是每个端到端机器学习平台都应该提供的 12 项功能。


## Be close to your data

If you have the large amounts of data needed to build precise models, you don’t want to ship it halfway around the world. The issue here isn’t distance, however, it’s time: Data transmission speed is ultimately limited by the speed of light, even on a perfect network with infinite bandwidth. Long distances mean latency.

The ideal case for very large data sets is to build the model where the data already resides, so that no mass data transmission is needed. Several databases support that to a limited extent.

The next best case is for the data to be on the same high-speed network as the model-building software, which typically means within the same data center. Even moving the data from one data center to another within a cloud availability zone can introduce a significant delay if you have terabytes (TB) or more. You can mitigate this by doing incremental updates.

The worst case would be if you have to move big data long distances over paths with constrained bandwidth and high latency. The trans-Pacific cables going to Australia are particularly egregious in this respect.

## 1. 接近您的数据

如果构建精确模型需要大量的数据，就不会希望将其跨地域进行远距离传输。 这里的问题不是距离，而是时间: 数据传输的极限速度最终受到光速的限制，即便是具有无限带宽的完美网络上也是如此。 距离远就意味着延迟大。

对于大数据集而言, 最理想的情况, 是直接在数据存储的地方构建模型，这样就不需要大量数据传输。有些数据库在一定程度上支持这一点。

另一种比较好的场景, 是数据与模型构建程序位于同一个高速网络下，这通常意味着在同一个数据中心内。 如果有TB级，或者更大量级的数据，即使是在同一个可用区内，但只要将数据从一个数据中心移到另一个数据中心也会有明显的延迟。 我们可以通过增量更新来缓解这种情况。

最糟糕的情况，是必须在带宽受限且延迟高的网络上, 远距离传输大量的数据。 在这方面，通往澳大利亚的跨太平洋电缆尤其令人震惊。


## Support an ETL or ELT pipeline

ETL (export, transform, and load) and ELT (export, load, and transform) are two data pipeline configurations that are common in the database world. Machine learning and deep learning amplify the need for these, especially the transform portion. ELT gives you more flexibility when your transformations need to change, as the load phase is usually the most time-consuming for big data.

In general, data in the wild is noisy. That needs to be filtered. Additionally, data in the wild has varying ranges: One variable might have a maximum in the millions, while another might have a range of -0.1 to -0.001. For machine learning, variables must be transformed to standardized ranges to keep the ones with large ranges from dominating the model. Exactly which standardized range depends on the algorithm used for the model.

## 2. 支持ETL或者ELT管道

ETL(export, transform, and load; 导出、转换和加载) 以及 ELT (export, load, and transform; 导出、加载和转换) 是数据清洗领域中最常见的两种数据管道配置。 机器学习和深度学习放大了对这些操作的需求，尤其是转换部分。 当您的转换操作需要变更时，ELT提供了更灵活的支持，因为加载阶段通常是大数据处理中最耗时的阶段。

一般来说，野生的数据是杂乱的。 需要先进行过滤。 此外，野生数据具有不同的范围: 一个变量的最大值可能为数百万，而另一个变量的范围可能是 -0.1 到 -0.001。 对于机器学习而言，必须先将变量转换为标准范围，以防止范围较大的变量主导模型。 究竟蚕蛹多大的标准范围则取决于用于建模的算法。


## Support an online environment for model building

The conventional wisdom used to be that you should import your data to your desktop for model building. The sheer quantity of data needed to build good machine learning and deep learning models changes the picture: You can download a small sample of data to your desktop for exploratory data analysis and model building, but for production models you need to have access to the full data.

Web-based development environments such as Jupyter Notebooks, JupyterLab, and Apache Zeppelin are well suited for model building. If your data is in the same cloud as the notebook environment, you can bring the analysis to the data, minimizing the time-consuming movement of data.

## 3. 支持在线建模

传统的做法是将数据导入桌面环境来进行模型构建。 构建良好的机器学习和深度学习模型所需的大量数据改变了这种情况:  可以将一小部分数据样本下载到桌面环境以进行探索性的数据分析和模型构建，但对于生产模型，需要访问完整的数据。

基于Web的开发环境, 比如 Jupyter Notebooks、JupyterLab 和 Apache Zeppelin 等等非常适合模型构建。 如果我们的数据与 notebook 在同一个云环境中，则可以将分析过程放到数据中，以最大限度地减少耗时的数据移动。


## Support scale-up and scale-out training

The compute and memory requirements of notebooks are generally minimal, except for training models. It helps a lot if a notebook can spawn training jobs that run on multiple large virtual machines or containers. It also helps a lot if the training can access accelerators such as GPUs, TPUs, and FPGAs; these can turn days of training into hours.

## 4. 支持纵向扩展和横向扩展训练

notebook 对CPU算力和内存的要求一般都不高, 除了训练模型的时候。 如果笔记本可以在多个大型虚拟机或容器上执行训练作业的生成，这将有很大帮助。 如果训练时可以使用 GPU、TPU 和 FPGA 等加速器，也会有很大帮助； 这些辅助措施可以将几天的训练时间缩短到几小时。


## Support AutoML and automatic feature engineering

Not everyone is good at picking machine learning models, selecting features (the variables that are used by the model), and engineering new features from the raw observations. Even if you’re good at those tasks, they are time-consuming and can be automated to a large extent.

AutoML systems often try many models to see which result in the best objective function values, for example the minimum squared error for regression problems. The best AutoML systems can also perform feature engineering, and use their resources effectively to pursue the best possible models with the best possible sets of features.


## 5. 支持 AutoML 和自动特征工程

并不是每个人都擅长筛选机器学习模型、选择特征（模型使用的变量）以及从原始观察中设计新特征。 即使您擅长这些任务，它们也很耗时，而这些工作在很大程度上可以实现自动化。

[AutoML 系统](https://www.infoworld.com/article/3430788/automated-machine-learning-or-automl-explained.html) 通常会尝试多种模型，来查看哪个会产生最佳目标函数值，例如回归问题的最小平方误差。 最好的 AutoML 系统还可以执行特征工程，并有效地利用它们的资源来追求具有最佳特征集的最佳模型。


## Support the best machine learning and deep learning frameworks

Most data scientists have favorite frameworks and programming languages for machine learning and deep learning. For those who prefer Python, Scikit-learn is often a favorite for machine learning, while TensorFlow, PyTorch, Keras, and MXNet are often top picks for deep learning. In Scala, Spark MLlib tends to be preferred for machine learning. In R, there are many native machine learning packages, and a good interface to Python. In Java, H2O.ai rates highly, as do Java-ML and Deep Java Library.

The cloud machine learning and deep learning platforms tend to have their own collection of algorithms, and they often support external frameworks in at least one language or as containers with specific entry points. In some cases you can integrate your own algorithms and statistical methods with the platform’s AutoML facilities, which is quite convenient.

Some cloud platforms also offer their own tuned versions of major deep learning frameworks. For example, AWS has an optimized version of TensorFlow that it claims can achieve nearly-linear scalability for deep neural network training.


## 6. 支持最好的机器学习和深度学习框架

大部分数据科学家都有自己喜欢的机器学习框架、深度学习框架、以及编程语言。 对于喜欢 Python 的人来说，Scikit-learn 通常是机器学习的最爱，而 TensorFlow、PyTorch、Keras 和 MXNet 通常是深度学习的首选。 在 Scala 语言生态中，Spark MLlib 往往是机器学习的首选。 在 R 语言中，提供了很多原生的机器学习包，以及很好的 Python 接口。 在 Java 语言中，H2O.ai 受到的评价很高，Java-ML 和 Deep Java 库也不错。

云机器学习平台、云深度学习平台、往往都有自己的算法集合，它们通常支持至少一种语言的外部框架、或者作为具有特定入口点的容器。 在某些情况下，您可以将自己的算法和统计方法，与平台的 AutoML 工具集成，这非常方便。

一些云平台还提供自己的深度学习框架的调优版本。 例如，AWS 有一个优化版的 TensorFlow，它声称可以为深度神经网络训练实现近乎线性的可扩展性。


## Offer pre-trained models and support transfer learning

Not everyone wants to spend the time and compute resources to train their own models — nor should they, when pre-trained models are available. For example, the ImageNet dataset is huge, and training a state-of-the-art deep neural network against it can take weeks, so it makes sense to use a pre-trained model for it when you can.

On the other hand, pre-trained models may not always identify the objects you care about. Transfer learning can help you customize the last few layers of the neural network for your specific data set without the time and expense of training the full network.

## 7. 提供预训练模型并支持迁移学习

不是每个人都想花时间和计算资源来训练自己的模型:  当预训练模型可用时，就不需要自己折腾。 例如，ImageNet 数据集非常庞大，针对它训练最先进的深度神经网络可能需要至少几周的时间，因此在可能的情况下，使用预先训练的模型是非常有意义的。

另一方面，预先训练的模型可能并不总是能识别您关心的对象。 迁移学习可以帮助您为特定的数据集定制神经网络的最后几层，而无需花费时间和费用来训练整个网络。

## Offer tuned AI services

The major cloud platforms offer robust, tuned AI services for many applications, not just image identification. Example include language translation, speech to text, text to speech, forecasting, and recommendations.

These services have already been trained and tested on more data than is usually available to businesses. They are also already deployed on service endpoints with enough computational resources, including accelerators, to ensure good response times under worldwide load.

## 8. 提供经过优化的 AI 服务

主要的云平台为许多应用程序提供强大的、经过调优的 AI 服务，而不仅仅是图像识别。 示例包括语言翻译、语音识别、文本朗读、预测和推荐算法。

这些服务已经接受了比一般企业所需更多的数据训练和测试。 它们也已经部署到具有足够计算资源（包括加速器）的服务端点上，以确保在全局负载下的良好响应时间。


## Manage your experiments

The only way to find the best model for your data set is to try everything, whether manually or using AutoML. That leaves another problem: Managing your experiments.

A good cloud machine learning platform will have a way that you can see and compare the objective function values of each experiment for both the training sets and the test data, as well as the size of the model and the confusion matrix. Being able to graph all of that is a definite plus.

## 9. 实验过程管理

为数据集找到最佳模型的唯一方法，是穷举和尝试一切方法，无论是人工的方式、还是使用 AutoML。 这就带来了另一个问题: 实验过程管理。

一个好的云机器学习平台会有一种方式，你可以查阅和比对每次实验的目标函数值，包括训练集和测试数据，以及模型的大小和混淆矩阵。  能够绘制所有这些是一个明确的加分项。


## Support model deployment for prediction

Once you have a way of picking the best experiment given your criteria, you also need an easy way to deploy the model. If you deploy multiple models for the same purpose, you’ll also need a way to apportion traffic among them for a/b testing.

## 10. 支持预测式的模型部署

一旦找到办法来根据标准选择最佳实验，我们还需要一种简单的方法来部署模型。 如果您出于同一目的部署多个模型，您还需要一种在它们之间分配流量以进行 a/b 测试的方法。


## Monitor prediction performance

Unfortunately, the world tends to change, and data changes with it. That means you can’t deploy a model and forget it. Instead, you need to monitor the data submitted for predictions over time. When the data starts changing significantly from the baseline of your original training data set, you’ll need to retrain your model.

## 11. 性能监控和预测

不幸的是，世界往往会发生变化，数据也会随之变化。 这意味着我们不能一劳永逸、部署模型之后就不管了。 相反，我们需要随着时间的推移，监控提交的数据并进行预测。 当数据与原始训练数据集相比, 开始发生明显变化时，我们需要重新训练模型。


## Control costs

Finally, you need ways to control the costs incurred by your models. Deploying models for production inference often accounts for 90% of the cost of deep learning, while the training accounts for only 10% of the cost.

The best way to control prediction costs depends on your load and the complexity of your model. If you have a high load, you might be able to use an accelerator to avoid adding more virtual machine instances. If you have a variable load, you might be able to dynamically change your size or number of instances or containers as the load goes up or down. And if you have a low or occasional load, you might be able to use a very small instance with a partial accelerator to handle the predictions.

## 12. 成本控制

最终，还需要控制模型产生的成本。 生产环境部署和执行模型的成本，通常占深度学习成本的 90%以上，而训练仅占成本的 10%。

预测和控制成本的最佳方法取决于您的流量/CPU负载，以及模型的复杂度。 如果CPU负载很高，可以考虑使用加速器来避免添加太多的虚拟机实例。 如果负载是动态变化的，则可以随着负载的上升或下降而动态调整实例或容器的大小以及数量。 如果负载较低或者只有偶发性的负载，则可以使用带有部分加速器的非常小的实例来处理预定流量。


> https://www.infoworld.com/article/3568889/how-to-choose-a-cloud-machine-learning-platform.html
