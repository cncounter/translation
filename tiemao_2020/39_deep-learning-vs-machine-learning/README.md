# Deep learning vs. machine learning: Understand the differences

# 辨析深度学习和机器学习

> Both machine learning and deep learning discover patterns in data, but they involve dramatically different techniques

Machine learning and deep learning are both forms of artificial intelligence. You can also say, correctly, that deep learning is a specific kind of machine learning. Both machine learning and deep learning start with training and test data and a model and go through an optimization process to find the weights that make the model best fit the data. Both can handle numeric (regression) and non-numeric (classification) problems, although there are several application areas, such as object recognition and language translation, where deep learning models tend to produce better fits than machine learning models.

## Machine learning explained

Machine learning algorithms are often divided into supervised (the training data are tagged with the answers) and unsupervised (any labels that may exist are not shown to the training algorithm). Supervised machine learning problems are further divided into classification (predicting non-numeric answers, such as the probability of a missed mortgage payment) and regression (predicting numeric answers, such as the number of widgets that will sell next month in your Manhattan store).

Unsupervised learning is further divided into clustering (finding groups of similar objects, such as running shoes, walking shoes, and dress shoes), association (finding common sequences of objects, such as coffee and cream), and dimensionality reduction (projection, feature selection, and feature extraction).

## Classification algorithms

A classification problem is a supervised learning problem that asks for a choice between two or more classes, usually providing probabilities for each class. Leaving out neural networks and deep learning, which require a much higher level of computing resources, the most common algorithms are Naive Bayes, Decision Tree, Logistic Regression, K-Nearest Neighbors, and Support Vector Machine (SVM). You can also use ensemble methods (combinations of models), such as Random Forest, other Bagging methods, and boosting methods such as AdaBoost and XGBoost.

## Regression algorithms

A regression problem is a supervised learning problem that asks the model to predict a number. The simplest and fastest algorithm is linear (least squares) regression, but you shouldn’t stop there, because it often gives you a mediocre result. Other common machine learning regression algorithms (short of neural networks) include Naive Bayes, Decision Tree, K-Nearest Neighbors, LVQ (Learning Vector Quantization), LARS Lasso, Elastic Net, Random Forest, AdaBoost, and XGBoost. You’ll notice that there is some overlap between machine learning algorithms for regression and classification.

## Clustering algorithms

A clustering problem is an unsupervised learning problem that asks the model to find groups of similar data points. The most popular algorithm is K-Means Clustering; others include Mean-Shift Clustering, DBSCAN (Density-Based Spatial Clustering of Applications with Noise), GMM (Gaussian Mixture Models), and HAC (Hierarchical Agglomerative Clustering).

## Dimensionality reduction algorithms

Dimensionality reduction is an unsupervised learning problem that asks the model to drop or combine variables that have little or no effect on the result. This is often used in combination with classification or regression. Dimensionality reduction algorithms include removing variables with many missing values, removing variables with low variance, Decision Tree, Random Forest, removing or combining variables with high correlation, Backward Feature Elimination, Forward Feature Selection, Factor Analysis, and PCA (Principal Component Analysis).

## Optimization methods

Training and evaluation turn supervised learning algorithms into models by optimizing their parameter weights to find the set of values that best matches the ground truth of your data. The algorithms often rely on variants of steepest descent for their optimizers, for example stochastic gradient descent, which is essentially steepest descent performed multiple times from randomized starting points.

Common refinements on stochastic gradient descent add factors that correct the direction of the gradient based on momentum, or adjust the learning rate based on progress from one pass through the data (called an epoch or a batch) to the next.

## Data cleaning for machine learning

There is no such thing as clean data in the wild. To be useful for machine learning, data must be aggressively filtered. For example, you’ll want to:

- 1. Look at the data and exclude any columns that have a lot of missing data.
- 2. Look at the data again and pick the columns you want to use (feature selection) for your prediction. This is something you may want to vary when you iterate.
- 3. Exclude any rows that still have missing data in the remaining columns.
- 4. Correct obvious typos and merge equivalent answers. For example, U.S., US, USA, and America should be merged into a single category.
- 5. Exclude rows that have data that is out of range. For example, if you’re analyzing taxi trips within New York City, you’ll want to filter out rows with pickup or drop-off latitudes and longitudes that are outside the bounding box of the metropolitan area.

There is a lot more you can do, but it will depend on the data collected. This can be tedious, but if you set up a data cleaning step in your machine learning pipeline you can modify and repeat it at will.

## Data encoding and normalization for machine learning

To use categorical data for machine classification, you need to encode the text labels into another form. There are two common encodings.

One is label encoding, which means that each text label value is replaced with a number. The other is one-hot encoding, which means that each text label value is turned into a column with a binary value (1 or 0). Most machine learning frameworks have functions that do the conversion for you. In general, one-hot encoding is preferred, as label encoding can sometimes confuse the machine learning algorithm into thinking that the encoded column is supposed to be an ordered list.

To use numeric data for machine regression, you usually need to normalize the data. Otherwise, the numbers with larger ranges might tend to dominate the Euclidian distance between feature vectors, their effects could be magnified at the expense of the other fields, and the steepest descent optimization might have difficulty converging. There are a number of ways to normalize and standardize data for machine learning, including min-max normalization, mean normalization, standardization, and scaling to unit length. This process is often called feature scaling.

## Feature engineering for machine learning

A feature is an individual measurable property or characteristic of a phenomenon being observed. The concept of a “feature” is related to that of an explanatory variable, which is used in statistical techniques such as linear regression. Feature vectors combine all the features for a single row into a numerical vector.

Part of the art of choosing features is to pick a minimum set of independent variables that explain the problem. If two variables are highly correlated, either they need to be combined into a single feature, or one should be dropped. Sometimes people perform principal component analysis to convert correlated variables into a set of linearly uncorrelated variables.

Some of the transformations that people use to construct new features or reduce the dimensionality of feature vectors are simple. For example, subtract Year of Birth from Year of Death and you construct Age at Death, which is a prime independent variable for lifetime and mortality analysis. In other cases, feature construction may not be so obvious.

## Splitting data for machine learning

The usual practice for supervised machine learning is to split the data set into subsets for training, validation, and test. One way of working is to assign 80% of the data to the training data set, and 10% each to the validation and test data sets. (The exact split is a matter of preference.) The bulk of the training is done against the training data set, and prediction is done against the validation data set at the end of every epoch.

The errors in the validation data set can be used to identify stopping criteria, or to drive hyperparameter tuning. Most importantly, the errors in the validation data set can help you find out whether the model has overfit the training data.

Prediction against the test data set is typically done on the final model. If the test data set was never used for training, it is sometimes called the holdout data set.

There are several other schemes for splitting the data. One common technique, cross-validation, involves repeatedly splitting the full data set into a training data set and a validation data set. At the end of each epoch, the data is shuffled and split again.

## Machine learning libraries

In Python, Spark MLlib and Scikit-learn are excellent choices for machine learning libraries. In R, some machine learning package options are CARAT, randomForest, e1071, and KernLab. In Java, good choices include Java-ML, RapidMiner, and Weka.

## Deep learning explained

Deep learning is a form of machine learning in which the model being trained has more than one hidden layer between the input and the output. In most discussions, deep learning means using deep neural networks. There are, however, a few algorithms that implement deep learning using other kinds of hidden layers besides neural networks.

The ideas for “artificial” neural networks go back to the 1940s. The essential concept is that a network of artificial neurons built out of interconnected threshold switches can learn to recognize patterns in the same way that an animal brain and nervous system (including the retina) does.

## Backprop

The learning occurs basically by strengthening the connection between two neurons when both are active at the same time during training. In modern neural network software this is most commonly a matter of increasing the weight values for the connections between neurons using a rule called back propagation of error, backprop, or BP.

## Neurons in artificial neural networks

How are the neurons modeled? Each has a propagation function that transforms the outputs of the connected neurons, often with a weighted sum. The output of the propagation function passes to an activation function, which fires when its input exceeds a threshold value.

## Activation functions in neural networks

In the 1940s and ’50s artificial neurons used a step activation function and were called perceptrons. Modern neural networks may say they are using perceptrons, but actually have smooth activation functions, such as the logistic or sigmoid function, the hyperbolic tangent, or the Rectified Linear Unit (ReLU). ReLU is usually the best choice for fast convergence, although it has an issue of neurons “dying” during training if the learning rate is set too high.

The output of the activation function can pass to an output function for additional shaping. Often, however, the output function is the identity function, meaning that the output of the activation function is passed to the downstream connected neurons.

## Neural network topologies

Now that we know about the neurons, we need to learn about the common neural network topologies. In a feed-forward network, the neurons are organized into distinct layers: one input layer, n hidden processing layers, and one output layer. The outputs from each layer go only to the next layer.

In a feed-forward network with shortcut connections, some connections can jump over one or more intermediate layers. In recurrent neural networks, neurons can influence themselves, either directly or indirectly through the next layer.

## Training neural networks

Supervised learning of a neural network is done just like any other machine learning: You present the network with groups of training data, compare the network output with the desired output, generate an error vector, and apply corrections to the network based on the error vector. Batches of training data that are run together before applying corrections are called epochs.

For those interested in the details, back propagation uses the gradient of the error (or cost) function with respect to the weights and biases of the model to discover the correct direction to minimize the error. Two things control the application of corrections: the optimization algorithm and the learning rate variable. The learning rate variable usually needs to be small to guarantee convergence and avoid causing dead ReLU neurons.

## Optimizers for neural networks

Optimizers for neural networks typically use some form of gradient descent algorithm to drive the back propagation, often with a mechanism to help avoid becoming stuck in local minima, such as optimizing randomly selected mini-batches (Stochastic Gradient Descent) and applying momentum corrections to the gradient. Some optimization algorithms also adapt the learning rates of the model parameters by looking at the gradient history (AdaGrad, RMSProp, and Adam).

As with all machine learning, you need to check the predictions of the neural network against a separate validation data set. Without doing that you risk creating neural networks that only memorize their inputs instead of learning to be generalized predictors.

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

## Deep learning vs. machine learning

In general, classical (non-deep) machine learning algorithms train and predict much faster than deep learning algorithms; one or more CPUs will often be sufficient to train a classical model. Deep learning models often need hardware accelerators such as GPUs, TPUs, or FPGAs for training, and also for deployment at scale; without them, the models would take months to train.

For many problems, some classical machine learning algorithms will produce a “good enough” model. For other problems, classical machine learning algorithms have not worked terribly well in the past.

One area that is usually attacked with deep learning is natural language processing, which encompasses language translation, automatic summarization, co-reference resolution, discourse analysis, morphological segmentation, named entity recognition, natural language generation, natural language understanding, part-of-speech tagging, sentiment analysis, and speech recognition.

Another prime area for deep learning is image classification, which includes image classification with localization, object detection, object segmentation, image style transfer, image colorization, image reconstruction, image super-resolution, and image synthesis.

In addition, deep learning has been used successfully to predict how molecules will interact in order to help pharmaceutical companies design new drugs, to search for subatomic particles, and to automatically parse microscope images used to construct a three-dimensional map of the human brain.










> https://www.infoworld.com/article/3512245/deep-learning-vs-machine-learning-understand-the-differences.html
