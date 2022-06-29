# EASILY DEBUG JAVA APPS RUNNING ON KUBERNETES WITH TELEPRESENCE AND INTELLIJ IDEA

Many Java-based organizations adopt cloud native development practices with the goal of shipping features faster. The technologies and architectures may change when we move to the cloud, but the fact remains that we all still add the occasional bug to our code. The challenge here is that many of your existing local debugging tools and practices can’t be used when everything is running in a container or on the cloud. A change in approach is required!

## DEBUGGING CLOUD NATIVE APPS REQUIRES A NEW APPROACH

Easy and efficient debugging is essential to being a productive developer. However, when you are working with a system that is composed of a large number of microservices running in a Kubernetes cluster, the approach you take to debugging has to change.

For one, when you want to conduct integration tests with a service you typically can’t run all of your dependent services on your local machine. This then opens up the challenges of remote debugging and the associated fiddling with debug protocols and exposing ports correctly. However, there is another way! The open source CNCF [Telepresence](https://www.telepresence.io/) tool can help.

This article walks you through the use of Telepresence for seamlessly connecting your local development machine to a remote Kubernetes cluster that contains the rest of your microservices. This enables you to spin up a single service or small collection of services locally and debug your apps using your existing tools while still being able to access the remote services as if you were working in the cluster.

## DIFFICULTIES WITH DEBUGGING JAVA APPS RUNNING IN KUBERNETES

Remote debugging of Java apps running in Kubernetes can be challenging. The primary issue is exposing the debug ports for your locally running IDE or debugger to connect to. You can expose the port in your Kubernetes Service YAML, but this can be a security risk if you accidentally deploy the config to production, and so you typically have to maintain two copies of the YAML when using this approach.

You can use instead use `kubectl port-forward` to set up a local connection to a specific Service or Pod, but this can be tricky to manage and any network glitches and you will be discconected.

Telepresence can be used to overcome both of these challenges. By setting up a two-way proxy between your local machine and remote Kubernetes cluster you can debug your services running locally as if they were running in the cluster i.e. your service can connect to other remote services simply using the K8s Service names and ports. Telepresence also allows for the easy exporting of environment variables, which you can load into your local IDE or debugger.

Let’s now walk through an example of how to set all of this up.

## TUTORIAL: INTELLIJ + TELEPRESENCE = EASY JAVA K8S DEBUGGING

### STEP 1: DEPLOY A SAMPLE JAVA MICROSERVICE APPLICATION

In this tutorial, we’ll build on a [sample application](https://github.com/datawire/edgey-corp-java) that was introduced in a [previous article on DZone](https://dzone.com/articles/rapidly-develop-java-microservices-on-kubernetes-w). All the instructions you need to get started with debugging the “DataProcessingService” Java application are included in the article you are now reading. We assume you have access to a Kubernetes cluster, either a remote cluster or something like minikube running locally that you can pretend is a remote cluster. We also assume that you have the current version of Java installed, alongside either the [Community or Ultimate edition of JetBrains IntelliJ IDEA](https://www.jetbrains.com/idea/download/).

You can find a detailed explanation of each service in the original article, and the architecture diagram below should provide a high-level overview of the dependencies between services:

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/EdgeCorp-Architecture.png?resize=600%2C446&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/EdgeCorp-Architecture.png?ssl=1)

In this architecture diagram, you’ll notice that requests from users are routed through an ingress controller to our services. For simplicity’s sake, we’ll skip the step of [deploying an ingress controller](https://www.getambassador.io/docs/emissary/latest/topics/install/#kubernetes-yaml) in this tutorial. If you’re ready to use Telepresence in your own setup and need a simple way to set up an ingress controller, we recommend checking out the CNCF Emissary-ingress.

First, let’s deploy the sample application to your Kubernetes cluster:

```
$ kubectl apply -f https://raw.githubusercontent.com/datawire/edgey-corp-java/main/k8s-config/edgey-corp-web-app-no-mapping.yaml
```

If you run `kubectl get svc` you should see something similar to this:

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/kubectl-output.jpg?resize=600%2C94&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/kubectl-output.jpg?ssl=1)

### STEP 2: SET UP YOUR LOCAL JAVA DEVELOPMENT ENVIRONMENT AND INTELLIJ IDEA

You will need to configure your local development environment so that you can debug the `DataProcessingService` service. As you can see in the architecture diagram above, the `DataProcessingService` is dependent on both the `VeryLargeJavaService` and the `VeryLargeDataStore`, so in order to make a change to this service, we’ll have to interact with these other services as well. You can imagine that both the web page generating monolith “VeryLargeJavaService” and “VeryLargeDataStore” are too resource hungry to run on your local machine

So, let’s get started with using our new approach to debugging!

Clone the repository for this application from GitHub.

```
$ git clone https://github.com/datawire/edgey-corp-java.git
```

Start IntelliJ IDEA and select “Open” from the “Welcome” screen. Navigate to the DataProcessingService and click the “Open” button.

After the project loads into IntelliJ IDEA, start the application in debug mode by clicking on the bug-shaped icon in the top navigation panel:

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-debugging.png?resize=600%2C46&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-debugging.png?ssl=1)

After Maven finishes downloading the dependencies you should be able to see your service running and listening on port 3000

```
2021-03-19 08:43:17.943 INFO 26902 --- [ restartedMain] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 581 ms
2021-03-19 08:43:18.075 INFO 26902 --- [ restartedMain] o.s.s.concurrent.ThreadPoolTaskExecutor : Initializing ExecutorService 'applicationTaskExecutor'
2021-03-19 08:43:18.196 INFO 26902 --- [ restartedMain] o.s.b.d.a.OptionalLiveReloadServer : LiveReload server is running on port 35729
2021-03-19 08:43:18.256 INFO 26902 --- [ restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer : Tomcat started on port(s): 3000 (http) with context path ''
2021-03-19 08:43:18.266 INFO 26902 --- [ restartedMain] g.d.DataProcessingServiceJavaApplication : Started DataProcessingServiceJavaApplication in 1.222 seconds (JVM running for 2.356)
```

In a terminal window, `curl localhost:3000/color` to see that your locally running service is returning the color `blue`.

```
$ curl localhost:3000/color
"blue"
```

You now have your local service loaded into your IDE and running in debug mode! Now you need to connect this to the remote Kubernetes cluster.

### STEP 3: INSTALL AND CONFIGURE TELEPRESENCE

Instead of fiddling about with remote debugging protocols and exposing ports via `kubectl port-forward` to access services running in our remote Kubernetes cluster, we are going to use Telepresence to creates a bidirectional network connection between your local machine and the Kubernetes cluster to enable fast, efficient development.

Install the [Telepresence CLI](https://www.telepresence.io/docs/latest/install/).

```
# Mac OS X
sudo curl -fL https://app.getambassador.io/download/tel2/darwin/amd64/latest/telepresence -o /usr/local/bin/telepresence

#Linux
sudo curl -fL https://app.getambassador.io/download/tel2/linux/amd64/latest/telepresence -o /usr/local/bin/telepresence

# Windows
curl -fL https://app.getambassador.io/download/tel2/windows/amd64/latest/telepresence.zip -o telepresence.zip
```

Make the binary executable

```
$ sudo chmod a+x /usr/local/bin/telepresence
```

Test Telepresence by connecting to the remote cluster

```
$ telepresence connect
```

Send a request to the remotely running DataProcessingService:

```
$ curl http://dataprocessingservice.default.svc.cluster.local:3000/color
"green"
```

You’ll notice two things here:

1. You are able to refer to the remote K8s Service directly via its internal cluster name as if your development machine is inside the cluster
2. The color returned by the remote DataProcessingService is “green”, versus the local result you saw above of “blue”

Great! You’ve successfully configured Telepresence. Right now Telepresence is “intercepting” (discussed below) the request you’re making to the Kubernetes API server, and routing over its direct connection to the cluster instead of over the Internet.

### STEP 4: INTERCEPT REMOTE TRAFFIC AND DEBUG YOUR LOCAL SERVICE

An intercept is a routing rule for Telepresence. You can create an intercept to route all traffic intended for the `DataProcessingService` in the cluster to the local version of the `DataProcessingService` running in debug mode on port 3000.

Create the intercept

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

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/EdgeyCorp-homepage.png?resize=600%2C464&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/EdgeyCorp-homepage.png?ssl=1)

Note that the color of the title and DataProcessingService box is blue. This is because the color is being determined by the locally running copy of the DataProcessingService, as the Telepresence intercept is routing the remote cluster traffic to this.

Within IntelliJ IDEA use the “Project” window to navigate to the “DataProcessingController.java” file. Once this file is open, set a breakpoint on line 36 by clicking once in the margin next to the line number. This breakpoint will be triggered when the “color” endpoint of the DataProcessingService is called.

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-1.png?resize=600%2C492&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-1.png?ssl=1)

In your browser, visit [http://verylargejavaservice:8080](http://verylargejavaservice:8080/) again. Notice how IntelliJ IDEA immediately jumps to the foreground on your desktop with the breakpoint hit. You can view the stack trace in the bottom left corner of the Debug window and you can also see the current variables involved. At this point, you can perform all of the typical debug actions, e.g. inspecting variable values, changing variables, stepping through and over code, and halting execution.

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-2.png?resize=600%2C545&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-2.png?ssl=1)

Right-click on the `defaultColor`variable in the Debug variables window, and select “View/Edit Text” from the menu. In the “View/Edit Text” popup that is shown, change the text from blue to orange by deleting the current text and typing “orange”. Click “Set”.

Next click the “Resume Program” icon in the left panel of the Debug window

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-3.png?resize=600%2C252&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-step-3.png?ssl=1)

Your browser window should complete reloading, and display an orange color for the title and DataProcessingService box:

[![img](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-Step-4.png?resize=600%2C464&ssl=1)](https://i0.wp.com/www.javaadvent.com/content/uploads/2021/12/IDEA-Step-4.png?ssl=1)

Success! You have successfully made a request to the remote VeryLargeJavaService and Telepresence has intercepted the call this service has made to the remote DataProcessingService and rerouted the traffic to your local copy running in debug mode!

In addition to rapidly inspecting and changing variables locally, you can also step through the execution of the local service as if it were running in the remote cluster. You can view data passed into the local service from the service running in the remote cluster, and interact with other services running in the cluster as if you were also running here.

## LEARN MORE ABOUT TELEPRESENCE

In this article, you’ve learned how to use Telepresence to easily debug a Java microservice running in Kubernetes. Now, instead of trying to mock out dependencies or fiddle around with remote debugging, you can iterate quickly with an instant feedback loop when locally debugging using your favorite IDE and tools.



If you want to learn more about Telepresence, check out the following resources:

- [Read the Telepresence docs](https://www.getambassador.io/docs/telepresence/)
- Learn about [shared local development environment URLs](https://www.getambassador.io/docs/telepresence/latest/quick-start/demo-node/) for easy collaboration with teammates
- Join our [Ambassador Labs community Slack channel](https://a8r.io/slack) to connect with the Telepresence community


原文链接:

> https://www.javaadvent.com/2021/12/easily-debug-java-apps-running-on-kubernetes-with-telepresence-and-intellij-idea.html