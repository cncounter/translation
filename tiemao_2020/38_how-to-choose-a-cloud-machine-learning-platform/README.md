# How to choose a cloud machine learning platform

> 12 capabilities every cloud machine learning platform should provide to support the complete machine learning lifecycle

In order to create effective machine learning and deep learning models, you need copious amounts of data, a way to clean the data and perform feature engineering on it, and a way to train models on your data in a reasonable amount of time. Then you need a way to deploy your models, monitor them for drift over time, and retrain them as needed.

You can do all of that on-premises if you have invested in compute resources and accelerators such as GPUs, but you may find that if your resources are adequate, they are also idle much of the time. On the other hand, it can sometimes be more cost-effective to run the entire pipeline in the cloud, using large amounts of compute resources and accelerators as needed, and then releasing them.

The major cloud providers — and a number of minor clouds too — have put significant effort into building out their machine learning platforms to support the complete machine learning lifecycle, from planning a project to maintaining a model in production. How do you determine which of these clouds will meet your needs? Here are 12 capabilities every end-to-end machine learning platform should provide.

## Be close to your data

If you have the large amounts of data needed to build precise models, you don’t want to ship it halfway around the world. The issue here isn’t distance, however, it’s time: Data transmission speed is ultimately limited by the speed of light, even on a perfect network with infinite bandwidth. Long distances mean latency.


The ideal case for very large data sets is to build the model where the data already resides, so that no mass data transmission is needed. Several databases support that to a limited extent.

The next best case is for the data to be on the same high-speed network as the model-building software, which typically means within the same data center. Even moving the data from one data center to another within a cloud availability zone can introduce a significant delay if you have terabytes (TB) or more. You can mitigate this by doing incremental updates.

The worst case would be if you have to move big data long distances over paths with constrained bandwidth and high latency. The trans-Pacific cables going to Australia are particularly egregious in this respect.

## Support an ETL or ELT pipeline

ETL (export, transform, and load) and ELT (export, load, and transform) are two data pipeline configurations that are common in the database world. Machine learning and deep learning amplify the need for these, especially the transform portion. ELT gives you more flexibility when your transformations need to change, as the load phase is usually the most time-consuming for big data.

In general, data in the wild is noisy. That needs to be filtered. Additionally, data in the wild has varying ranges: One variable might have a maximum in the millions, while another might have a range of -0.1 to -0.001. For machine learning, variables must be transformed to standardized ranges to keep the ones with large ranges from dominating the model. Exactly which standardized range depends on the algorithm used for the model.

## Support an online environment for model building

The conventional wisdom used to be that you should import your data to your desktop for model building. The sheer quantity of data needed to build good machine learning and deep learning models changes the picture: You can download a small sample of data to your desktop for exploratory data analysis and model building, but for production models you need to have access to the full data.

Web-based development environments such as Jupyter Notebooks, JupyterLab, and Apache Zeppelin are well suited for model building. If your data is in the same cloud as the notebook environment, you can bring the analysis to the data, minimizing the time-consuming movement of data.

## Support scale-up and scale-out training

The compute and memory requirements of notebooks are generally minimal, except for training models. It helps a lot if a notebook can spawn training jobs that run on multiple large virtual machines or containers. It also helps a lot if the training can access accelerators such as GPUs, TPUs, and FPGAs; these can turn days of training into hours.

Support AutoML and automatic feature engineering
Not everyone is good at picking machine learning models, selecting features (the variables that are used by the model), and engineering new features from the raw observations. Even if you’re good at those tasks, they are time-consuming and can be automated to a large extent.

AutoML systems often try many models to see which result in the best objective function values, for example the minimum squared error for regression problems. The best AutoML systems can also perform feature engineering, and use their resources effectively to pursue the best possible models with the best possible sets of features.

## Support the best machine learning and deep learning frameworks

Most data scientists have favorite frameworks and programming languages for machine learning and deep learning. For those who prefer Python, Scikit-learn is often a favorite for machine learning, while TensorFlow, PyTorch, Keras, and MXNet are often top picks for deep learning. In Scala, Spark MLlib tends to be preferred for machine learning. In R, there are many native machine learning packages, and a good interface to Python. In Java, H2O.ai rates highly, as do Java-ML and Deep Java Library.

The cloud machine learning and deep learning platforms tend to have their own collection of algorithms, and they often support external frameworks in at least one language or as containers with specific entry points. In some cases you can integrate your own algorithms and statistical methods with the platform’s AutoML facilities, which is quite convenient.

Some cloud platforms also offer their own tuned versions of major deep learning frameworks. For example, AWS has an optimized version of TensorFlow that it claims can achieve nearly-linear scalability for deep neural network training.

Offer pre-trained models and support transfer learning
Not everyone wants to spend the time and compute resources to train their own models — nor should they, when pre-trained models are available. For example, the ImageNet dataset is huge, and training a state-of-the-art deep neural network against it can take weeks, so it makes sense to use a pre-trained model for it when you can.

On the other hand, pre-trained models may not always identify the objects you care about. Transfer learning can help you customize the last few layers of the neural network for your specific data set without the time and expense of training the full network.

## Offer tuned AI services

The major cloud platforms offer robust, tuned AI services for many applications, not just image identification. Example include language translation, speech to text, text to speech, forecasting, and recommendations.

These services have already been trained and tested on more data than is usually available to businesses. They are also already deployed on service endpoints with enough computational resources, including accelerators, to ensure good response times under worldwide load.

## Manage your experiments

The only way to find the best model for your data set is to try everything, whether manually or using AutoML. That leaves another problem: Managing your experiments.

A good cloud machine learning platform will have a way that you can see and compare the objective function values of each experiment for both the training sets and the test data, as well as the size of the model and the confusion matrix. Being able to graph all of that is a definite plus.

## Support model deployment for prediction

Once you have a way of picking the best experiment given your criteria, you also need an easy way to deploy the model. If you deploy multiple models for the same purpose, you’ll also need a way to apportion traffic among them for a/b testing.

## Monitor prediction performance

Unfortunately, the world tends to change, and data changes with it. That means you can’t deploy a model and forget it. Instead, you need to monitor the data submitted for predictions over time. When the data starts changing significantly from the baseline of your original training data set, you’ll need to retrain your model.

## Control costs

Finally, you need ways to control the costs incurred by your models. Deploying models for production inference often accounts for 90% of the cost of deep learning, while the training accounts for only 10% of the cost.

The best way to control prediction costs depends on your load and the complexity of your model. If you have a high load, you might be able to use an accelerator to avoid adding more virtual machine instances. If you have a variable load, you might be able to dynamically change your size or number of instances or containers as the load goes up or down. And if you have a low or occasional load, you might be able to use a very small instance with a partial accelerator to handle the predictions.


> https://www.infoworld.com/article/3568889/how-to-choose-a-cloud-machine-learning-platform.html
