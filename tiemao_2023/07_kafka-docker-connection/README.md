# 开发环境搭建: 如何从宿主机和外部访问Docker容器中的Kafka


本文有一篇前置教程:


- [Guide to Setting Up Apache Kafka Using Docker](https://www.baeldung.com/ops/kafka-docker-setup)


## 1. Overview

[Apache Kafka](https://kafka.apache.org/) is a very popular event streaming platform that is used with [Docker](https://www.docker.com/) frequently. Often, people experience connection establishment problems with Kafka, especially when the client is not running on the same Docker network or the same host. This is primarily due to the misconfiguration of Kafka's advertised listeners.

In this tutorial, we will learn how to configure the listeners so that clients can connect to a Kafka broker running within Docker.


## 2. Setup Kafka

Before we try to establish the connection, we need to run a [Kafka broker using Docker](https://www.baeldung.com/ops/kafka-docker-setup). Here's a snippet of our [docker-compose.yaml](https://www.baeldung.com/ops/docker-compose) file:

```yml
version: '2'
services:
  zookeeper:
    container_name: zookeeper
    networks: 
      - kafka_network
    ...
  
  kafka:
    container_name: kafka
    networks: 
      - kafka_network
    ports:
      - 29092:29092
    environment:
      KAFKA_LISTENERS: EXTERNAL_SAME_HOST://:29092,INTERNAL://:9092
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka:9092,EXTERNAL_SAME_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
     ... 

networks:
  kafka_network:
    name: kafka_docker_example_net
```

Here, we defined two must-have services – `Kafka` and `Zookeeper`. 

We also defined a custom network – `kafka_docker_example_net`, which our services will use.

We will look at the `KAFKA_LISTENERS`, `KAFKA_ADVERTISED_LISTENERS`, and `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP` properties in more detail later.

With the above `docker-compose.yaml` file, we start the services:


```sh
docker-compose up -d
Creating network "kafka_docker_example_net" with the default driver
Creating zookeeper ... done
Creating kafka ... done
```

Also, we will be using the Kafka [console producer](https://kafka-tutorials.confluent.io/kafka-console-consumer-producer-basics/kafka.html) utility as a sample client to test the connection to the Kafka broker. To use the Kafka-console-producer script without Docker, we need to have [Kafka](https://kafka.apache.org/downloads) downloaded.

## 3. Listeners

Listeners, advertised listeners, and listener protocols play a considerable role when connecting with Kafka brokers.

We manage listeners with the `KAFKA_LISTENERS` property, where we declare a comma-separated list of URIs, which specify the sockets that the broker should listen on for incoming TCP connections.

Each URI comprises a protocol name, followed by an interface address and a port:

```yml
EXTERNAL_SAME_HOST://0.0.0.0:29092,INTERNAL://0.0.0.0:9092
```

Here, we specified a 0.0.0.0 meta address to bind the socket to all interfaces. Further, EXTERNAL_SAME_HOST and INTERNAL are the custom listener names that we need to specify when defining listeners in the URI format.

### 3.2. Bootstrapping

For initial connections, Kafka clients need a bootstrap server list where we specify the addresses of the brokers. The list should contain at least one valid address to a random broker in the cluster.

The client will use that address to connect to the broker. If the connection is successful, the broker will return the metadata about the cluster, including the advertised listener lists for all the brokers in the cluster. For subsequent connections, the clients will use that list to reach the brokers.

### 3.3. Advertised Listeners

Just declaring listeners is not enough because it's just a socket configuration for the broker. We need a way to tell the clients (consumers and producers) how to connect to Kafka.

This is where advertised listeners come into the picture with the help of the `KAFKA_ADVERTISED_LISTENERS` property. It has a similar format as the listener's property:

```yml
<listener protocol>://<advertised host name>:<advertised port>
```

The clients use the addresses specified as advertised listeners after the initial bootstrapping process.


### 3.4. Listener Security Protocol Map

Apart from listeners and advertised listeners, we need to tell the clients about the security protocols to use when connecting to Kafka. In the `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP`, we map our custom protocol names to valid security protocols.

In the configuration in the previous section, we declared two custom protocol names – `INTERNAL` and `EXTERNAL_SAME_HOST`. We can name them as we want, but we need to map them to valid security protocols.

One of the security protocols we specified is `PLAINTEXT`, which means that the clients don't need to authenticate with the Kafka broker. Also, the data exchanged is not encrypted.


## 4. Client Connecting from the Same Docker Network

Let's start the Kafka console producer from another container and try to produce messages to the broker:

```sh
docker run -it --rm --network kafka_docker_example_net confluentinc/cp-kafka /bin/kafka-console-producer --bootstrap-server kafka:9092 --topic test_topic
>hello
>world
```

Here, we are attaching this container to the existing kafka_docker_example_net network to communicate to our broker freely. We also specify the broker's address –  `kafka:9092` and the name of the topic, which will be created automatically.

We were able to produce the messages to the topic, which means that the connection to the broker was successful.


## 5. Client Connecting from the Same Host

Let's connect to the broker from the host machine when the client is not containerized. For external connection, we advertised EXTERNAL_SAME_HOST listener, which we can use to establish the connection from the host. From the advertised listener property, we know that we have to use the localhost:29092 address to reach Kafka broker.

To test connectivity from the same host, we will use a non-Dockerized Kafka console producer:

```sh
kafka-console-producer --bootstrap-server localhost:29092 --topic test_topic_2
>hi
>there
```


Since we managed to produce the topic, it means that both the initial bootstrapping and the subsequent connection (where advertised listeners are used by the client) to the broker were successful.

The port number `29092` that we configured in `docker-compose.yaml` earlier made the Kafka broker reachable outside Docker.

## 6. Client Connecting from a Different Host

How would we connect to a Kafka broker if it's running on a different host machine? Unfortunately, we can't re-use existing listeners because they are only for the same Docker network or host connection. So instead, we need to define a new listener and advertise it:

```yml
KAFKA_LISTENERS: EXTERNAL_SAME_HOST://:29092,EXTERNAL_DIFFERENT_HOST://:29093,INTERNAL://:9092
KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka:9092,EXTERNAL_SAME_HOST://localhost:29092,EXTERNAL_DIFFERENT_HOST://157.245.80.232:29093
KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT,EXTERNAL_DIFFERENT_HOST:PLAINTEXT
```

We created a new listener called `EXTERNAL_DIFFERENT_HOST` with security protocol `PLAINTEXT` and port `29093` associated. In `KAFKA_ADVERTISED_LISTENERS`, we also added the IP address of the cloud machine Kafka is running on.

We have to keep in mind that we can't use localhost because we are connecting from a different machine (local workstation in this case). Also, port `29093` is published under the ports section so that it's reachable outside Docker.

Let's try producing a few messages:

```sh
kafka-console-producer --bootstrap-server 157.245.80.232:29093 --topic test_topic_3
>hello
>REMOTE SERVER
```

We can see that we were able to connect to the Kafka broker and produce messages successfully.

## 7. Conclusion

In this article, we learned how to configure the listeners so that clients can connect to a Kafka broker running within Docker. We looked at different scenarios where the client was running on the same Docker network, same host, different host, etc. We saw that the configurations for listeners, advertised listeners, and security protocol maps determine the connectivity.



# 相关链接


- [Connect to Apache Kafka Running in Docker](https://www.baeldung.com/kafka-docker-connection)
- [Guide to Setting Up Apache Kafka Using Docker](https://www.baeldung.com/ops/kafka-docker-setup)
- [docker-compose.yaml 简介](https://www.baeldung.com/ops/docker-compose)
- [Apache Kafka 官网](https://kafka.apache.org/)
- [Docker 官网](https://www.docker.com/)
