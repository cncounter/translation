# Deep learning vs. machine learning: Understand the differences


> Both machine learning and deep learning discover patterns in data, but they involve dramatically different techniques

Machine learning and deep learning are both forms of artificial intelligence. You can also say, correctly, that deep learning is a specific kind of machine learning. Both machine learning and deep learning start with training and test data and a model and go through an optimization process to find the weights that make the model best fit the data. Both can handle numeric (regression) and non-numeric (classification) problems, although there are several application areas, such as object recognition and language translation, where deep learning models tend to produce better fits than machine learning models.

# 深度学习和机器学习的区别

> 机器学习和深度学习都可以发现数据中的模式，但它们涉及的技术截然不同

机器学习和深度学习都是人工智能的形式。 您也可以正确地说，深度学习是一种特定的机器学习。 机器学习和深度学习都从训练和测试数据以及模型开始，然后通过优化过程找到使模型最适合数据的权重。 两者都可以处理数字（回归）和非数字（分类）问题，尽管有几个应用领域，例如对象识别和语言翻译，深度学习模型往往比机器学习模型产生更好的拟合。

## Machine learning explained

Machine learning algorithms are often divided into supervised (the training data are tagged with the answers) and unsupervised (any labels that may exist are not shown to the training algorithm). Supervised machine learning problems are further divided into classification (predicting non-numeric answers, such as the probability of a missed mortgage payment) and regression (predicting numeric answers, such as the number of widgets that will sell next month in your Manhattan store).

Unsupervised learning is further divided into clustering (finding groups of similar objects, such as running shoes, walking shoes, and dress shoes), association (finding common sequences of objects, such as coffee and cream), and dimensionality reduction (projection, feature selection, and feature extraction).


##机器学习解释

机器学习算法通常分为有监督的（训练数据用答案标记）和无监督的（任何可能存在的标签都不会显示给训练算法）。 有监督的机器学习问题进一步分为分类（预测非数字答案，例如错过按揭付款的概率）和回归（预测数字答案，例如下个月将在曼哈顿商店出售的小部件数量）。

无监督学习进一步分为聚类（寻找相似物体的组，如跑鞋、步行鞋和正装鞋）、关联（寻找物体的共同序列，如咖啡和奶油）和降维（投影、特征选择） ，和特征提取）。


## Classification algorithms

A classification problem is a supervised learning problem that asks for a choice between two or more classes, usually providing probabilities for each class. Leaving out neural networks and deep learning, which require a much higher level of computing resources, the most common algorithms are Naive Bayes, Decision Tree, Logistic Regression, K-Nearest Neighbors, and Support Vector Machine (SVM). You can also use ensemble methods (combinations of models), such as Random Forest, other Bagging methods, and boosting methods such as AdaBoost and XGBoost.

##分类算法

分类问题是一种监督学习问题，要求在两个或多个类之间进行选择，通常为每个类提供概率。 除了需要更高级别计算资源的神经网络和深度学习之外，最常见的算法是朴素贝叶斯、决策树、逻辑回归、K-最近邻和支持向量机 (SVM)。 您还可以使用集成方法（模型的组合），例如随机森林、其他 Bagging 方法和增强方法，例如 AdaBoost 和 XGBoost。

## Regression algorithms

A regression problem is a supervised learning problem that asks the model to predict a number. The simplest and fastest algorithm is linear (least squares) regression, but you shouldn’t stop there, because it often gives you a mediocre result. Other common machine learning regression algorithms (short of neural networks) include Naive Bayes, Decision Tree, K-Nearest Neighbors, LVQ (Learning Vector Quantization), LARS Lasso, Elastic Net, Random Forest, AdaBoost, and XGBoost. You’ll notice that there is some overlap between machine learning algorithms for regression and classification.

## 回归算法

回归问题是一种监督学习问题，它要求模型预测一个数字。 最简单和最快的算法是线性（最小二乘法）回归，但您不应止步于此，因为它通常会给您带来平庸的结果。 其他常见的机器学习回归算法（神经网络的缩写）包括朴素贝叶斯、决策树、K-最近邻、LVQ（学习向量量化）、LARS 套索、弹性网络、随机森林、AdaBoost 和 XGBoost。 您会注意到用于回归和分类的机器学习算法之间存在一些重叠。

## Clustering algorithms

A clustering problem is an unsupervised learning problem that asks the model to find groups of similar data points. The most popular algorithm is K-Means Clustering; others include Mean-Shift Clustering, DBSCAN (Density-Based Spatial Clustering of Applications with Noise), GMM (Gaussian Mixture Models), and HAC (Hierarchical Agglomerative Clustering).

##聚类算法

聚类问题是一种无监督学习问题，它要求模型找到相似数据点的组。 最流行的算法是 K-Means Clustering； 其他包括 Mean-Shift 聚类、DBSCAN（基于密度的噪声应用空间聚类）、GMM（高斯混合模型）和 HAC（分层凝聚聚类）。


## Dimensionality reduction algorithms

Dimensionality reduction is an unsupervised learning problem that asks the model to drop or combine variables that have little or no effect on the result. This is often used in combination with classification or regression. Dimensionality reduction algorithms include removing variables with many missing values, removing variables with low variance, Decision Tree, Random Forest, removing or combining variables with high correlation, Backward Feature Elimination, Forward Feature Selection, Factor Analysis, and PCA (Principal Component Analysis).

## 降维算法

降维是一个无监督学习问题，它要求模型删除或组合对结果影响很小或没有影响的变量。 这通常与分类或回归结合使用。 降维算法包括去除具有许多缺失值的变量、去除低方差的变量、决策树、随机森林、去除或组合具有高相关性的变量、后向特征消除、前向特征选择、因子分析和PCA（主成分分析）。


## Optimization methods

Training and evaluation turn supervised learning algorithms into models by optimizing their parameter weights to find the set of values that best matches the ground truth of your data. The algorithms often rely on variants of steepest descent for their optimizers, for example stochastic gradient descent, which is essentially steepest descent performed multiple times from randomized starting points.

Common refinements on stochastic gradient descent add factors that correct the direction of the gradient based on momentum, or adjust the learning rate based on progress from one pass through the data (called an epoch or a batch) to the next.

## 优化方法

训练和评估通过优化参数权重将监督学习算法转变为模型，以找到与数据的基本事实最匹配的值集。 算法通常依赖于最速下降的变体作为其优化器，例如随机梯度下降，它本质上是从随机起点执行多次的最速下降。

随机梯度下降的常见改进添加了基于动量校正梯度方向的因素，或根据从一次数据（称为一个时期或批次）到下一次的进度调整学习率。

## Data cleaning for machine learning

There is no such thing as clean data in the wild. To be useful for machine learning, data must be aggressively filtered. For example, you’ll want to:

- 1. Look at the data and exclude any columns that have a lot of missing data.
- 2. Look at the data again and pick the columns you want to use (feature selection) for your prediction. This is something you may want to vary when you iterate.
- 3. Exclude any rows that still have missing data in the remaining columns.
- 4. Correct obvious typos and merge equivalent answers. For example, U.S., US, USA, and America should be merged into a single category.
- 5. Exclude rows that have data that is out of range. For example, if you’re analyzing taxi trips within New York City, you’ll want to filter out rows with pickup or drop-off latitudes and longitudes that are outside the bounding box of the metropolitan area.

There is a lot more you can do, but it will depend on the data collected. This can be tedious, but if you set up a data cleaning step in your machine learning pipeline you can modify and repeat it at will.

##机器学习的数据清洗

野外没有干净的数据。为了对机器学习有用，必须积极过滤数据。例如，您需要：

- 1. 查看数据并排除任何有大量缺失数据的列。
- 2. 再次查看数据并选择要用于预测的列（特征选择）。这是您在迭代时可能想要改变的东西。
- 3. 排除在剩余列中仍有缺失数据的任何行。
- 4. 更正明显的错别字并合并等效答案。例如，U.S.、US、USA 和 America 应合并为一个类别。
- 5. 排除数据超出范围的行。例如，如果您正在分析纽约市内的出租车行程，您需要过滤掉包含大都市区边界框之外的上车或下车纬度和经度的行。

您可以做的还有很多，但这取决于收集的数据。这可能很乏味，但如果您在机器学习管道中设置了数据清理步骤，您可以随意修改和重复它。

## Data encoding and normalization for machine learning

To use categorical data for machine classification, you need to encode the text labels into another form. There are two common encodings.

One is label encoding, which means that each text label value is replaced with a number. The other is one-hot encoding, which means that each text label value is turned into a column with a binary value (1 or 0). Most machine learning frameworks have functions that do the conversion for you. In general, one-hot encoding is preferred, as label encoding can sometimes confuse the machine learning algorithm into thinking that the encoded column is supposed to be an ordered list.

To use numeric data for machine regression, you usually need to normalize the data. Otherwise, the numbers with larger ranges might tend to dominate the Euclidian distance between feature vectors, their effects could be magnified at the expense of the other fields, and the steepest descent optimization might have difficulty converging. There are a number of ways to normalize and standardize data for machine learning, including min-max normalization, mean normalization, standardization, and scaling to unit length. This process is often called feature scaling.

## 机器学习的数据编码和归一化

要使用分类数据进行机器分类，您需要将文本标签编码为另一种形式。有两种常见的编码。

一种是标签编码，这意味着每个文本标签值都替换为一个数字。另一种是one-hot编码，这意味着每个文本标签值都变成了一个带有二进制值（1或0）的列。大多数机器学习框架都有为您进行转换的功能。通常，首选单热编码，因为标签编码有时会使机器学习算法混淆，认为编码列应该是有序列表。

要使用数字数据进行机器回归，通常需要对数据进行归一化。否则，具有较大范围的数字可能倾向于支配特征向量之间的欧几里得距离，它们的影响可能会以牺牲其他字段为代价而被放大，并且最速下降优化可能难以收敛。有多种方法可以对机器学习的数据进行归一化和标准化，包括最小-最大归一化、均值归一化、标准化和缩放到单位长度。这个过程通常称为特征缩放。

## Feature engineering for machine learning

A feature is an individual measurable property or characteristic of a phenomenon being observed. The concept of a “feature” is related to that of an explanatory variable, which is used in statistical techniques such as linear regression. Feature vectors combine all the features for a single row into a numerical vector.

Part of the art of choosing features is to pick a minimum set of independent variables that explain the problem. If two variables are highly correlated, either they need to be combined into a single feature, or one should be dropped. Sometimes people perform principal component analysis to convert correlated variables into a set of linearly uncorrelated variables.

Some of the transformations that people use to construct new features or reduce the dimensionality of feature vectors are simple. For example, subtract Year of Birth from Year of Death and you construct Age at Death, which is a prime independent variable for lifetime and mortality analysis. In other cases, feature construction may not be so obvious.

## 机器学习的特征工程

特征是个体可测量的特性或被观察现象的特征。 “特征”的概念与解释变量的概念相关，用于线性回归等统计技术。特征向量将单行的所有特征组合成一个数值向量。

选择特征的部分艺术是选择解释问题的最小自变量集。如果两个变量高度相关，要么需要将它们组合成一个特征，要么应该删除一个。有时人们执行主成分分析将相关变量转换为一组线性不相关变量。

人们用来构建新特征或降低特征向量维数的一些变换很简单。例如，从死亡年份中减去出生年份，然后构建死亡年龄，这是生命周期和死亡率分析的主要自变量。在其他情况下，特征构建可能不那么明显。

## Splitting data for machine learning

The usual practice for supervised machine learning is to split the data set into subsets for training, validation, and test. One way of working is to assign 80% of the data to the training data set, and 10% each to the validation and test data sets. (The exact split is a matter of preference.) The bulk of the training is done against the training data set, and prediction is done against the validation data set at the end of every epoch.

The errors in the validation data set can be used to identify stopping criteria, or to drive hyperparameter tuning. Most importantly, the errors in the validation data set can help you find out whether the model has overfit the training data.

Prediction against the test data set is typically done on the final model. If the test data set was never used for training, it is sometimes called the holdout data set.

There are several other schemes for splitting the data. One common technique, cross-validation, involves repeatedly splitting the full data set into a training data set and a validation data set. At the end of each epoch, the data is shuffled and split again.

## 为机器学习拆分数据

监督式机器学习的通常做法是将数据集拆分为用于训练、验证和测试的子集。一种工作方式是将 80% 的数据分配给训练数据集，将 10% 分配给验证和测试数据集。 （确切的分割是一个偏好问题。）大部分训练是针对训练数据集完成的，而预测是针对每个时期结束时的验证数据集完成的。

验证数据集中的错误可用于识别停止标准，或驱动超参数调整。最重要的是，验证数据集中的错误可以帮助您找出模型是否过度拟合了训练数据。

针对测试数据集的预测通常是在最终模型上完成的。如果测试数据集从未用于训练，则有时将其称为保持数据集。

还有其他几种拆分数据的方案。一种常见的技术是交叉验证，它涉及将完整数据集反复拆分为训练数据集和验证数据集。在每个 epoch 结束时，数据被打乱并再次拆分。

## Machine learning libraries

In Python, Spark MLlib and Scikit-learn are excellent choices for machine learning libraries. In R, some machine learning package options are CARAT, randomForest, e1071, and KernLab. In Java, good choices include Java-ML, RapidMiner, and Weka.

## 机器学习库

在 Python 中，Spark MLlib 和 Scikit-learn 是机器学习库的绝佳选择。 在 R 中，一些机器学习包选项是 CARAT、randomForest、e1071 和 KernLab。 在 Java 中，不错的选择包括 Java-ML、RapidMiner 和 Weka。

## Deep learning explained

Deep learning is a form of machine learning in which the model being trained has more than one hidden layer between the input and the output. In most discussions, deep learning means using deep neural networks. There are, however, a few algorithms that implement deep learning using other kinds of hidden layers besides neural networks.

The ideas for “artificial” neural networks go back to the 1940s. The essential concept is that a network of artificial neurons built out of interconnected threshold switches can learn to recognize patterns in the same way that an animal brain and nervous system (including the retina) does.

## 深度学习解释

深度学习是机器学习的一种形式，其中被训练的模型在输入和输出之间有多个隐藏层。 在大多数讨论中，深度学习意味着使用深度神经网络。 然而，有一些算法使用除神经网络之外的其他类型的隐藏层来实现深度学习。

“人工”神经网络的想法可以追溯到 1940 年代。 基本概念是由相互连接的阈值开关构建的人工神经元网络可以像动物大脑和神经系统（包括视网膜）一样学习识别模式。

## Backprop

The learning occurs basically by strengthening the connection between two neurons when both are active at the same time during training. In modern neural network software this is most commonly a matter of increasing the weight values for the connections between neurons using a rule called back propagation of error, backprop, or BP.

## 反向传播

当两个神经元在训练期间同时处于活动状态时，学习基本上是通过加强两个神经元之间的连接来实现的。 在现代神经网络软件中，这通常是使用称为误差反向传播、反向传播或 BP 的规则来增加神经元之间连接的权重值的问题。

## Neurons in artificial neural networks

How are the neurons modeled? Each has a propagation function that transforms the outputs of the connected neurons, often with a weighted sum. The output of the propagation function passes to an activation function, which fires when its input exceeds a threshold value.

##人工神经网络中的神经元

神经元是如何建模的？ 每个都有一个传播函数，用于转换连接神经元的输出，通常带有加权和。 传播函数的输出传递给激活函数，当其输入超过阈值时触发。

## Activation functions in neural networks

In the 1940s and ’50s artificial neurons used a step activation function and were called perceptrons. Modern neural networks may say they are using perceptrons, but actually have smooth activation functions, such as the logistic or sigmoid function, the hyperbolic tangent, or the Rectified Linear Unit (ReLU). ReLU is usually the best choice for fast convergence, although it has an issue of neurons “dying” during training if the learning rate is set too high.

The output of the activation function can pass to an output function for additional shaping. Often, however, the output function is the identity function, meaning that the output of the activation function is passed to the downstream connected neurons.

## 神经网络中的激活函数

在 1940 年代和 50 年代，人工神经元使用步进激活函数并被称为感知器。 现代神经网络可能会说他们在使用感知器，但实际上具有平滑的激活函数，例如逻辑或 sigmoid 函数、双曲正切或整流线性单元 (ReLU)。 ReLU 通常是快速收敛的最佳选择，尽管如果学习率设置得太高，它在训练过程中存在神经元“死亡”的问题。

激活函数的输出可以传递给输出函数以进行额外的整形。 然而，通常输出函数是恒等函数，这意味着激活函数的输出被传递到下游连接的神经元。

## Neural network topologies

Now that we know about the neurons, we need to learn about the common neural network topologies. In a feed-forward network, the neurons are organized into distinct layers: one input layer, n hidden processing layers, and one output layer. The outputs from each layer go only to the next layer.

In a feed-forward network with shortcut connections, some connections can jump over one or more intermediate layers. In recurrent neural networks, neurons can influence themselves, either directly or indirectly through the next layer.

## 神经网络拓扑

现在我们了解了神经元，我们需要了解常见的神经网络拓扑。 在前馈网络中，神经元被组织成不同的层：一个输入层、n 个隐藏处理层和一个输出层。 每一层的输出只传到下一层。

在具有快捷连接的前馈网络中，一些连接可以跳过一个或多个中间层。 在循环神经网络中，神经元可以通过下一层直接或间接地影响自己。

## Training neural networks

Supervised learning of a neural network is done just like any other machine learning: You present the network with groups of training data, compare the network output with the desired output, generate an error vector, and apply corrections to the network based on the error vector. Batches of training data that are run together before applying corrections are called epochs.

For those interested in the details, back propagation uses the gradient of the error (or cost) function with respect to the weights and biases of the model to discover the correct direction to minimize the error. Two things control the application of corrections: the optimization algorithm and the learning rate variable. The learning rate variable usually needs to be small to guarantee convergence and avoid causing dead ReLU neurons.

## 训练神经网络

神经网络的监督学习就像任何其他机器学习一样完成：您向网络提供训练数据组，将网络输出与所需输出进行比较，生成误差向量，并根据误差向量对网络应用修正 . 在应用更正之前一起运行的成批训练数据称为纪元。

对于那些对细节感兴趣的人，反向传播使用误差（或成本）函数相对于模型的权重和偏差的梯度来发现正确的方向以最小化误差。 有两件事控制修正的应用：优化算法和学习率变量。 学习率变量通常需要很小以保证收敛并避免导致死 ReLU 神经元。


## Optimizers for neural networks

Optimizers for neural networks typically use some form of gradient descent algorithm to drive the back propagation, often with a mechanism to help avoid becoming stuck in local minima, such as optimizing randomly selected mini-batches (Stochastic Gradient Descent) and applying momentum corrections to the gradient. Some optimization algorithms also adapt the learning rates of the model parameters by looking at the gradient history (AdaGrad, RMSProp, and Adam).

As with all machine learning, you need to check the predictions of the neural network against a separate validation data set. Without doing that you risk creating neural networks that only memorize their inputs instead of learning to be generalized predictors.

## 神经网络优化器

神经网络的优化器通常使用某种形式的梯度下降算法来驱动反向传播，通常具有帮助避免陷入局部最小值的机制，例如优化随机选择的小批量（随机梯度下降）并将动量校正应用于 坡度。 一些优化算法还通过查看梯度历史（AdaGrad、RMSProp 和 Adam）来调整模型参数的学习率。

与所有机器学习一样，您需要根据单独的验证数据集检查神经网络的预测。 如果不这样做，您就有可能创建只记住输入而不是学习成为广义预测器的神经网络。


## Deep learning algorithms

A deep neural network for a real problem might have upwards of 10 hidden layers. Its topology might be simple, or quite complex.

The more layers in the network, the more characteristics it can recognize. Unfortunately, the more layers in the network, the longer it will take to calculate, and the harder it will be to train.

Convolutional neural networks (CNN) are often used for machine vision. Convolutional neural networks typically use convolutional, pooling, ReLU, fully connected, and loss layers to simulate a visual cortex. The convolutional layer basically takes the integrals of many small overlapping regions. The pooling layer performs a form of non-linear down-sampling. ReLU layers apply the non-saturating activation function f(x) = max(0,x). In a fully connected layer, the neurons have connections to all activations in the previous layer. A loss layer computes how the network training penalizes the deviation between the predicted and true labels, using a Softmax or cross-entropy loss function for classification, or a Euclidean loss function for regression.

Recurrent neural networks (RNN) are often used for natural language processing (NLP) and other sequence processing, as are Long Short-Term Memory (LSTM) networks and attention-based neural networks. In feed-forward neural networks, information flows from the input, through the hidden layers, to the output. This limits the network to dealing with a single state at a time.

In recurrent neural networks, the information cycles through a loop, which allows the network to remember recent previous outputs. This allows for the analysis of sequences and time series. RNNs have two common issues: exploding gradients (easily fixed by clamping the gradients) and vanishing gradients (not so easy to fix).

In LSTMs, the network is capable of forgetting (gating) previous information as well as remembering it, in both cases by altering weights. This effectively gives an LSTM both long-term and short-term memory, and solves the vanishing gradient problem. LSTMs can deal with sequences of hundreds of past inputs.

Attention modules are generalized gates that apply weights to a vector of inputs. A hierarchical neural attention encoder uses multiple layers of attention modules to deal with tens of thousands of past inputs.

Random Decision Forests (RDF), which are not neural networks, are useful for a range of classification and regression problems. RDFs are constructed from many layers, but instead of neurons an RDF is constructed from decision trees, and outputs a statistical average (mode for classification or mean for regression) of the predictions of the individual trees. The randomized aspects of RDFs are the use of bootstrap aggregation (a.k.a. bagging) for individual trees, and taking random subsets of the features for the trees.

XGBoost (eXtreme Gradient Boosting), also not a deep neural network, is a scalable, end-to-end tree boosting system that has produced state-of-the-art results on many machine learning challenges. Bagging and boosting are often mentioned in the same breath; the difference is that instead of generating an ensemble of randomized trees, gradient tree boosting starts with a single decision or regression tree, optimizes it, and then builds the next tree from the residuals of the first tree.

Some of the best Python deep learning frameworks are TensorFlow, Keras, PyTorch, and MXNet. Deeplearning4j is one of the best Java deep learning frameworks. ONNX and TensorRT are runtimes for deep learning models.

## 深度学习算法

一个真正问题的深度神经网络可能有 10 个以上的隐藏层。它的拓扑结构可能很简单，也可能非常复杂。

网络中的层数越多，它可以识别的特征就越多。不幸的是，网络中的层数越多，计算所需的时间就越长，训练起来也就越困难。

卷积神经网络 (CNN) 通常用于机器视觉。卷积神经网络通常使用卷积、池化、ReLU、全连接和损失层来模拟视觉皮层。卷积层基本上取了很多小的重叠区域的积分。池化层执行一种形式的非线性下采样。 ReLU 层应用非饱和激活函数 f(x) = max(0,x)。在全连接层中，神经元与前一层中的所有激活都有连接。损失层计算网络训练如何惩罚预测标签和真实标签之间的偏差，使用 Softmax 或交叉熵损失函数进行分类，或使用欧几里德损失函数进行回归。

循环神经网络 (RNN) 通常用于自然语言处理 (NLP) 和其他序列处理，长短期记忆 (LSTM) 网络和基于注意力的神经网络也是如此。在前馈神经网络中，信息从输入通过隐藏层流向输出。这限制了网络一次只能处理一个状态。

在循环神经网络中，信息在一个循环中循环，这使得网络能够记住最近的先前输出。这允许分析序列和时间序列。 RNN 有两个常见问题：梯度爆炸（通过钳位梯度很容易修复）和梯度消失（不太容易修复）。

在 LSTM 中，网络能够通过改变权重来忘记（门控）先前的信息以及记住它。这有效地为 LSTM 提供了长期和短期记忆，并解决了梯度消失问题。 LSTM 可以处理数百个过去输入的序列。

注意模块是将权重应用于输入向量的广义门。分层神经注意力编码器使用多层注意力模块来处理数以万计的过去输入。

随机决策森林 (RDF) 不是神经网络，可用于解决一系列分类和回归问题。 RDF 由许多层构成，但 RDF 不是神经元，而是由决策树构成，并输出单个树的预测的统计平均值（分类模式或回归平均值）。 RDF 的随机方面是对单个树使用引导聚合（也称为装袋），并为树获取特征的随机子集。

XGBoost（eXtreme Gradient Boosting），也不是深度神经网络，是一种可扩展的端到端树提升系统，在许多机器学习挑战中产生了最先进的结果。 Bagging 和 boosting 经常被同时提到；不同之处在于，梯度树提升不是生成随机树的集合，而是从单个决策树或回归树开始，对其进行优化，然后从第一棵树的残差构建下一棵树。

一些最好的 Python 深度学习框架是 TensorFlow、Keras、PyTorch 和 MXNet。 Deeplearning4j 是最好的 Java 深度学习框架之一。 ONNX 和 TensorRT 是深度学习模型的运行时。

## Deep learning vs. machine learning

In general, classical (non-deep) machine learning algorithms train and predict much faster than deep learning algorithms; one or more CPUs will often be sufficient to train a classical model. Deep learning models often need hardware accelerators such as GPUs, TPUs, or FPGAs for training, and also for deployment at scale; without them, the models would take months to train.

For many problems, some classical machine learning algorithms will produce a “good enough” model. For other problems, classical machine learning algorithms have not worked terribly well in the past.

One area that is usually attacked with deep learning is natural language processing, which encompasses language translation, automatic summarization, co-reference resolution, discourse analysis, morphological segmentation, named entity recognition, natural language generation, natural language understanding, part-of-speech tagging, sentiment analysis, and speech recognition.

Another prime area for deep learning is image classification, which includes image classification with localization, object detection, object segmentation, image style transfer, image colorization, image reconstruction, image super-resolution, and image synthesis.

In addition, deep learning has been used successfully to predict how molecules will interact in order to help pharmaceutical companies design new drugs, to search for subatomic particles, and to automatically parse microscope images used to construct a three-dimensional map of the human brain.

## 深度学习与机器学习

一般来说，经典（非深度）机器学习算法的训练和预测速度比深度学习算法快得多；一个或多个 CPU 通常足以训练经典模型。深度学习模型通常需要 GPU、TPU 或 FPGA 等硬件加速器进行训练，也需要大规模部署；如果没有它们，模型将需要几个月的时间来训练。

对于许多问题，一些经典的机器学习算法会产生一个“足够好”的模型。对于其他问题，经典机器学习算法过去并没有表现得非常好。

深度学习经常受到攻击的一个领域是自然语言处理，包括语言翻译、自动摘要、共参考解析、话语分析、形态分割、命名实体识别、自然语言生成、自然语言理解、词性标记、情感分析和语音识别。

深度学习的另一个主要领域是图像分类，包括具有定位的图像分类、对象检测、对象分割、图像风格迁移、图像着色、图像重建、图像超分辨率和图像合成。

此外，深度学习已成功用于预测分子如何相互作用，以帮助制药公司设计新药、搜索亚原子粒子以及自动解析用于构建人脑 3D 地图的显微镜图像。






> https://www.infoworld.com/article/3512245/deep-learning-vs-machine-learning-understand-the-differences.html
