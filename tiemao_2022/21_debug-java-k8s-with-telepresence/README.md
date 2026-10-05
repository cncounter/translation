# EASILY DEBUG JAVA APPS RUNNING ON KUBERNETES WITH TELEPRESENCE AND INTELLIJ IDEA

# 使用 Telepresence 和 IntelliJ IDEA 轻松调试运行在 Kubernetes 上的 Java 应用

Many Java-based organizations adopt cloud native development practices with the goal of shipping features faster. The technologies and architectures may change when we move to the cloud, but the fact remains that we all still add the occasional bug to our code. The challenge here is that many of your existing local debugging tools and practices can’t be used when everything is running in a container or on the cloud. A change in approach is required!

许多以 Java 为主的组织都在采用云原生开发实践, 目标是更快地交付功能特性。迁移到云端之后, 技术和架构可能会发生变化, 但有一点始终不变: 我们偶尔还是会在代码里引入 bug。这里的挑战在于, 当所有东西都运行在容器中或云端时, 你现有的许多本地调试工具和做法都派不上用场。所以需要改变思路!

## DEBUGGING CLOUD NATIVE APPS REQUIRES A NEW APPROACH

## 调试云原生应用需要新的思路

Easy and efficient debugging is essential to being a productive developer. However, when you are working with a system that is composed of a large number of microservices running in a Kubernetes cluster, the approach you take to debugging has to change.

简单高效的调试, 是成为高效开发者的必备能力。然而, 当你面对的系统由大量运行在 Kubernetes 集群中的微服务组成时, 你的调试方式就必须改变。

For one, when you want to conduct integration tests with a service you typically can’t run all of your dependent services on your local machine. This then opens up the challenges of remote debugging and the associated fiddling with debug protocols and exposing ports correctly. However, there is another way! The open source CNCF [Telepresence](https://www.telepresence.io/) tool can help.

举例来说, 当你想对某个服务做集成测试时, 通常没办法把所有依赖的服务都跑在本地机器上。这就带来了远程调试的难题, 以及随之而来的折腾调试协议、正确暴露端口等问题。不过, 还有另一种办法! 开源的 CNCF 工具 [Telepresence](https://www.telepresence.io/) 可以帮上忙。

This article walks you through the use of Telepresence for seamlessly connecting your local development machine to a remote Kubernetes cluster that contains the rest of your microservices. This enables you to spin up a single service or small collection of services locally and debug your apps using your existing tools while still being able to access the remote services as if you were working in the cluster.

本文将带你使用 Telepresence, 把本地开发机无缝连接到包含其余微服务的远程 Kubernetes 集群。这样你就可以在本地启动单个服务或一小组服务, 用现有的工具调试应用, 同时还能像在集群内部一样访问远程服务。

## DIFFICULTIES WITH DEBUGGING JAVA APPS RUNNING IN KUBERNETES

## 调试运行在 Kubernetes 中的 Java 应用有哪些难点

Remote debugging of Java apps running in Kubernetes can be challenging. The primary issue is exposing the debug ports for your locally running IDE or debugger to connect to. You can expose the port in your Kubernetes Service YAML, but this can be a security risk if you accidentally deploy the config to production, and so you typically have to maintain two copies of the YAML when using this approach.

远程调试运行在 Kubernetes 中的 Java 应用并不轻松。首要问题是如何暴露调试端口, 好让本地运行的 IDE 或调试器连上来。你可以在 Kubernetes Service 的 YAML 里暴露端口, 但如果不小心把这份配置部署到了生产环境, 就会带来安全风险, 所以采用这种做法时通常得维护两份 YAML。

You can use instead use `kubectl port-forward` to set up a local connection to a specific Service or Pod, but this can be tricky to manage and any network glitches and you will be discconected.

你也可以改用 `kubectl port-forward` 来建立到特定 Service 或 Pod 的本地连接, 但这种方式不好管理, 而且一旦网络出现波动, 连接就会断开。

Telepresence can be used to overcome both of these challenges. By setting up a two-way proxy between your local machine and remote Kubernetes cluster you can debug your services running locally as if they were running in the cluster i.e. your service can connect to other remote services simply using the K8s Service names and ports. Telepresence also allows for the easy exporting of environment variables, which you can load into your local IDE or debugger.

Telepresence 可以同时解决这两个难题。它会在本地机器与远程 Kubernetes 集群之间建立双向代理, 这样你在本地运行的服务就能像运行在集群里一样进行调试, 也就是说, 你的服务只需使用 K8s 的 Service 名称和端口, 就能连上其他远程服务。Telepresence 还能方便地导出环境变量, 你可以把这些变量加载到本地 IDE 或调试器中。

Let’s now walk through an example of how to set all of this up.

下面我们通过一个示例, 演示如何把这一整套环境搭起来。

## TUTORIAL: INTELLIJ + TELEPRESENCE = EASY JAVA K8S DEBUGGING

## 教程: IntelliJ + Telepresence = 轻松调试 Java K8s 应用

### STEP 1: DEPLOY A SAMPLE JAVA MICROSERVICE APPLICATION

### 第 1 步: 部署一个示例 Java 微服务应用

In this tutorial, we’ll build on a [sample application](https://github.com/datawire/edgey-corp-java) that was introduced in a [previous article on DZone](https://dzone.com/articles/rapidly-develop-java-microservices-on-kubernetes-w). All the instructions you need to get started with debugging the “DataProcessingService” Java application are included in the article you are now reading. We assume you have access to a Kubernetes cluster, either a remote cluster or something like minikube running locally that you can pretend is a remote cluster. We also assume that you have the current version of Java installed, alongside either the [Community or Ultimate edition of JetBrains IntelliJ IDEA](https://www.jetbrains.com/idea/download/).

在本教程中, 我们会基于一个[示例应用](https://github.com/datawire/edgey-corp-java)来展开, 它曾在[DZone 上的一篇文章](https://dzone.com/articles/rapidly-develop-java-microservices-on-kubernetes-w)中介绍过。要开始调试 “DataProcessingService” 这个 Java 应用所需的全部说明, 都包含在你正在阅读的这篇文章里。我们假设你已经能访问一个 Kubernetes 集群, 既可以是远程集群, 也可以是本地运行的 minikube 之类(把它当作远程集群来用)。我们还假设你安装了当前版本的 Java, 以及 [JetBrains IntelliJ IDEA 的社区版或旗舰版](https://www.jetbrains.com/idea/download/)。

You can find a detailed explanation of each service in the original article, and the architecture diagram below should provide a high-level overview of the dependencies between services:

每个服务的详细说明可以查看原文, 下面的架构图则给出了各服务之间依赖关系的高层概览:

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/EdgeCorp-Architecture.png?resize=600%2C446&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/EdgeCorp-Architecture.png?ssl=1)

In this architecture diagram, you’ll notice that requests from users are routed through an ingress controller to our services. For simplicity’s sake, we’ll skip the step of [deploying an ingress controller](https://www.getambassador.io/docs/emissary/latest/topics/install/#kubernetes-yaml) in this tutorial. If you’re ready to use Telepresence in your own setup and need a simple way to set up an ingress controller, we recommend checking out the CNCF Emissary-ingress.

从这张架构图可以看出, 来自用户的请求会先经过 ingress controller, 再路由到我们的服务。为了简单起见, 本教程会跳过[部署 ingress controller](https://www.getambassador.io/docs/emissary/latest/topics/install/#kubernetes-yaml) 这一步。如果你准备在自己的环境里使用 Telepresence, 又需要一种简单的方式来搭建 ingress controller, 我们推荐了解一下 CNCF 的 Emissary-ingress。

First, let’s deploy the sample application to your Kubernetes cluster:

首先, 把示例应用部署到你的 Kubernetes 集群:

```
$ kubectl apply -f https://raw.githubusercontent.com/datawire/edgey-corp-java/main/k8s-config/edgey-corp-web-app-no-mapping.yaml
```

If you run `kubectl get svc` you should see something similar to this:

执行 `kubectl get svc`, 你应该会看到类似下面这样的输出:

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/kubectl-output.jpg?resize=600%2C94&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/kubectl-output.jpg?ssl=1)

### STEP 2: SET UP YOUR LOCAL JAVA DEVELOPMENT ENVIRONMENT AND INTELLIJ IDEA

### 第 2 步: 配置本地 Java 开发环境和 IntelliJ IDEA

You will need to configure your local development environment so that you can debug the `DataProcessingService` service. As you can see in the architecture diagram above, the `DataProcessingService` is dependent on both the `VeryLargeJavaService` and the `VeryLargeDataStore`, so in order to make a change to this service, we’ll have to interact with these other services as well. You can imagine that both the web page generating monolith “VeryLargeJavaService” and “VeryLargeDataStore” are too resource hungry to run on your local machine

你需要配置好本地开发环境, 才能调试 `DataProcessingService` 服务。从上文的架构图可以看到, `DataProcessingService` 同时依赖 `VeryLargeJavaService` 和 `VeryLargeDataStore`, 所以要想修改这个服务, 我们还得跟这两个服务打交道。可以想象, 生成网页的单体应用 “VeryLargeJavaService” 和 “VeryLargeDataStore” 都太吃资源, 没法在本地机器上运行

So, let’s get started with using our new approach to debugging!

那么, 让我们开始使用这种新的调试方式吧!

Clone the repository for this application from GitHub.

从 GitHub 克隆这个应用的仓库。

```
$ git clone https://github.com/datawire/edgey-corp-java.git
```

Start IntelliJ IDEA and select “Open” from the “Welcome” screen. Navigate to the DataProcessingService and click the “Open” button.

启动 IntelliJ IDEA, 在 “Welcome” 界面选择 “Open”。导航到 DataProcessingService 目录, 点击 “Open” 按钮。

After the project loads into IntelliJ IDEA, start the application in debug mode by clicking on the bug-shaped icon in the top navigation panel:

项目加载进 IntelliJ IDEA 之后, 点击顶部导航栏中那个虫子形状的图标, 以 debug 模式启动应用:

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-debugging.png?resize=600%2C46&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-debugging.png?ssl=1)

After Maven finishes downloading the dependencies you should be able to see your service running and listening on port 3000

等 Maven 下载完依赖之后, 你应该就能看到服务已经启动, 并监听在 3000 端口

```
2021-03-19 08:43:17.943 INFO 26902 --- [ restartedMain] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 581 ms
2021-03-19 08:43:18.075 INFO 26902 --- [ restartedMain] o.s.s.concurrent.ThreadPoolTaskExecutor : Initializing ExecutorService 'applicationTaskExecutor'
2021-03-19 08:43:18.196 INFO 26902 --- [ restartedMain] o.s.b.d.a.OptionalLiveReloadServer : LiveReload server is running on port 35729
2021-03-19 08:43:18.256 INFO 26902 --- [ restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer : Tomcat started on port(s): 3000 (http) with context path ''
2021-03-19 08:43:18.266 INFO 26902 --- [ restartedMain] g.d.DataProcessingServiceJavaApplication : Started DataProcessingServiceJavaApplication in 1.222 seconds (JVM running for 2.356)
```

In a terminal window, `curl localhost:3000/color` to see that your locally running service is returning the color `blue`.

在终端窗口中执行 `curl localhost:3000/color`, 可以看到本地运行的服务返回的颜色是 `blue`。

```
$ curl localhost:3000/color
"blue"
```

You now have your local service loaded into your IDE and running in debug mode! Now you need to connect this to the remote Kubernetes cluster.

现在你的本地服务已经加载到 IDE 中, 并以 debug 模式运行了! 接下来需要把它连接到远程 Kubernetes 集群。

### STEP 3: INSTALL AND CONFIGURE TELEPRESENCE

### 第 3 步: 安装并配置 Telepresence

Instead of fiddling about with remote debugging protocols and exposing ports via `kubectl port-forward` to access services running in our remote Kubernetes cluster, we are going to use Telepresence to creates a bidirectional network connection between your local machine and the Kubernetes cluster to enable fast, efficient development.

我们不再折腾远程调试协议, 也不再通过 `kubectl port-forward` 暴露端口来访问远程 Kubernetes 集群中运行的服务, 而是改用 Telepresence, 在本地机器和 Kubernetes 集群之间建立双向网络连接, 从而实现快速、高效的开发。

Install the [Telepresence CLI](https://www.telepresence.io/docs/latest/install/).

安装 [Telepresence CLI](https://www.telepresence.io/docs/latest/install/)。

```
# Mac OS X
sudo curl -fL https://app.getambassador.io/download/tel2/darwin/amd64/latest/telepresence -o /usr/local/bin/telepresence

#Linux
sudo curl -fL https://app.getambassador.io/download/tel2/linux/amd64/latest/telepresence -o /usr/local/bin/telepresence

# Windows
curl -fL https://app.getambassador.io/download/tel2/windows/amd64/latest/telepresence.zip -o telepresence.zip
```

Make the binary executable

让二进制文件可执行

```
$ sudo chmod a+x /usr/local/bin/telepresence
```

Test Telepresence by connecting to the remote cluster

通过连接远程集群来测试 Telepresence

```
$ telepresence connect
```

Send a request to the remotely running DataProcessingService:

向远程运行的 DataProcessingService 发送一个请求:

```
$ curl http://dataprocessingservice.default.svc.cluster.local:3000/color
"green"
```

You’ll notice two things here:

1. You are able to refer to the remote K8s Service directly via its internal cluster name as if your development machine is inside the cluster
2. The color returned by the remote DataProcessingService is “green”, versus the local result you saw above of “blue”

你会注意到两件事:

1. 你可以直接通过集群内部名称来访问远程的 K8s Service, 就好像你的开发机就在集群内部一样
2. 远程 DataProcessingService 返回的颜色是 “green”, 而上面看到的本地结果是 “blue”

Great! You’ve successfully configured Telepresence. Right now Telepresence is “intercepting” (discussed below) the request you’re making to the Kubernetes API server, and routing over its direct connection to the cluster instead of over the Internet.

很好! 你已经成功配置好了 Telepresence。现在 Telepresence 正在 “拦截”(下文会讨论)你发往 Kubernetes API server 的请求, 并通过它与集群的直接连接进行路由, 而不是走公网。

### STEP 4: INTERCEPT REMOTE TRAFFIC AND DEBUG YOUR LOCAL SERVICE

### 第 4 步: 拦截远程流量并调试本地服务

An intercept is a routing rule for Telepresence. You can create an intercept to route all traffic intended for the `DataProcessingService` in the cluster to the local version of the `DataProcessingService` running in debug mode on port 3000.

intercept(拦截) 是 Telepresence 的一条路由规则。你可以创建一个 intercept, 把集群中原本发往 `DataProcessingService` 的所有流量, 都路由到本地以 debug 模式运行在 3000 端口上的 `DataProcessingService` 版本。

Create the intercept

创建 intercept

```
$ telepresence intercept dataprocessingservice --port 3000

Using Deployment dataprocessingservice
intercepted
Intercept name : dataprocessingservice
State : ACTIVE
Workload kind : Deployment
Destination : 127.0.0.1:3000
Volume Mount Point: /var/folders/5y/rnzvwcc17g9cpf11c4t_kwmm0000gn/T/telfs-3378669609
Intercepting : all TCP connections
```

1. Access the application directly with Telepresence. Visit [http://verylargejavaservice:8080](http://verylargejavaservice:8080/) in your browser. Again, Telepresence is intercepting requests from your browser and routing them directly to the Kubernetes cluster. You should see a web page that displays the architecture of the system you have deployed into your cluster:

1. 通过 Telepresence 直接访问应用。在浏览器中访问 [http://verylargejavaservice:8080](http://verylargejavaservice:8080/)。同样, Telepresence 正在拦截来自浏览器的请求, 并把它们直接路由到 Kubernetes 集群。你应该会看到一个网页, 展示你部署到集群中的系统架构:

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/EdgeyCorp-homepage.png?resize=600%2C464&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/EdgeyCorp-homepage.png?ssl=1)

Note that the color of the title and DataProcessingService box is blue. This is because the color is being determined by the locally running copy of the DataProcessingService, as the Telepresence intercept is routing the remote cluster traffic to this.

注意, 标题和 DataProcessingService 方框的颜色是蓝色。这是因为颜色是由本地运行的 DataProcessingService 副本决定的, 而 Telepresence 的 intercept 正把远程集群的流量路由到它这里。

Within IntelliJ IDEA use the “Project” window to navigate to the “DataProcessingController.java” file. Once this file is open, set a breakpoint on line 36 by clicking once in the margin next to the line number. This breakpoint will be triggered when the “color” endpoint of the DataProcessingService is called.

在 IntelliJ IDEA 中, 用 “Project” 窗口导航到 “DataProcessingController.java” 文件。打开这个文件后, 在行号旁的空白处点击一下, 在第 36 行设置一个断点。当 DataProcessingService 的 “color” 端点被调用时, 这个断点就会被触发。

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-1.png?resize=600%2C492&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-1.png?ssl=1)

In your browser, visit [http://verylargejavaservice:8080](http://verylargejavaservice:8080/) again. Notice how IntelliJ IDEA immediately jumps to the foreground on your desktop with the breakpoint hit. You can view the stack trace in the bottom left corner of the Debug window and you can also see the current variables involved. At this point, you can perform all of the typical debug actions, e.g. inspecting variable values, changing variables, stepping through and over code, and halting execution.

在浏览器中再次访问 [http://verylargejavaservice:8080](http://verylargejavaservice:8080/)。注意 IntelliJ IDEA 会立刻跳到桌面前台, 并命中断点。你可以在 Debug 窗口的左下角查看调用栈, 也能看到当前涉及的变量。此时, 你可以执行所有常规的调试操作, 例如查看变量值、修改变量、单步进入和跳过代码, 以及中止执行。

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-2.png?resize=600%2C545&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-2.png?ssl=1)

Right-click on the `defaultColor`variable in the Debug variables window, and select “View/Edit Text” from the menu. In the “View/Edit Text” popup that is shown, change the text from blue to orange by deleting the current text and typing “orange”. Click “Set”.

在 Debug variables 窗口中右击 `defaultColor` 变量, 从菜单中选择 “View/Edit Text”。在弹出的 “View/Edit Text” 对话框中, 删掉当前文本并输入 “orange”, 把文本从 blue 改成 orange。然后点击 “Set”。

Next click the “Resume Program” icon in the left panel of the Debug window

接着点击 Debug 窗口左侧面板中的 “Resume Program” 图标

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-3.png?resize=600%2C252&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-3.png?ssl=1)

Your browser window should complete reloading, and display an orange color for the title and DataProcessingService box:

你的浏览器窗口应该会完成重新加载, 并把标题和 DataProcessingService 方框显示为橙色:

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-Step-4.png?resize=600%2C464&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-Step-4.png?ssl=1)

Success! You have successfully made a request to the remote VeryLargeJavaService and Telepresence has intercepted the call this service has made to the remote DataProcessingService and rerouted the traffic to your local copy running in debug mode!

成功了! 你成功地向远程 VeryLargeJavaService 发起了请求, Telepresence 拦截了该服务对远程 DataProcessingService 的调用, 并把流量重新路由到了你在本地以 debug 模式运行的副本!

In addition to rapidly inspecting and changing variables locally, you can also step through the execution of the local service as if it were running in the remote cluster. You can view data passed into the local service from the service running in the remote cluster, and interact with other services running in the cluster as if you were also running here.

除了能在本地快速查看和修改变量之外, 你还可以单步跟踪本地服务的执行, 就像它运行在远程集群中一样。你可以查看从远程集群中运行的服务传入本地服务的数据, 也能与集群中运行的其他服务交互, 就像你自己也运行在集群里一样。

## LEARN MORE ABOUT TELEPRESENCE

## 进一步了解 Telepresence

In this article, you’ve learned how to use Telepresence to easily debug a Java microservice running in Kubernetes. Now, instead of trying to mock out dependencies or fiddle around with remote debugging, you can iterate quickly with an instant feedback loop when locally debugging using your favorite IDE and tools.

本文中, 你学会了如何使用 Telepresence 轻松调试运行在 Kubernetes 中的 Java 微服务。现在, 你不必再去模拟依赖, 也不用折腾远程调试, 只要用你熟悉的 IDE 和工具在本地调试, 就能获得即时反馈、快速迭代。



If you want to learn more about Telepresence, check out the following resources:

如果你想进一步了解 Telepresence, 可以参考以下资源:

- [Read the Telepresence docs](https://www.getambassador.io/docs/telepresence/)
- Learn about [shared local development environment URLs](https://www.getambassador.io/docs/telepresence/latest/quick-start/demo-node/) for easy collaboration with teammates
- Join our [Ambassador Labs community Slack channel](https://a8r.io/slack) to connect with the Telepresence community

- [阅读 Telepresence 文档](https://www.getambassador.io/docs/telepresence/)
- 了解[共享的本地开发环境 URL](https://www.getambassador.io/docs/telepresence/latest/quick-start/demo-node/), 方便与团队成员协作
- 加入我们的 [Ambassador Labs 社区 Slack 频道](https://a8r.io/slack), 与 Telepresence 社区交流


原文链接:

> https://www.javaadvent.com/2021/12/easily-debug-java-apps-running-on-kubernetes-with-telepresence-and-intellij-idea.html