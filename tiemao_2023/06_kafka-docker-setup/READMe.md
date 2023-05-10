# 开发环境搭建: 通过Docker运行并配置Apache Kafka

## 1. Overview

Docker is one of the most popular container engines used in the software industry to create, package and deploy applications.

In this tutorial, we'll learn how to do an [Apache Kafka](https://kafka.apache.org/) setup using Docker.


## 2. Single Node Setup

A single node Kafka broker setup would meet most of the local development needs, so let's start by learning this simple setup.

### 2.1. docker-compose.yml Configuration

To start an Apache Kafka server, we'd first need to start a [Zookeeper](https://www.baeldung.com/java-zookeeper#overview) server.

We can configure this dependency in a [docker-compose.yml](https://www.baeldung.com/docker-compose) file, which will ensure that the Zookeeper server always starts before the Kafka server and stops after it.

Let's create a simple `docker-compose.yml` file with two services, namely `zookeeper` and `kafka`:

```yml
version: '2'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - 22181:2181
  
  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - 29092:29092
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

```

In this setup, our Zookeeper server is listening on `port=2181` for the kafka service, which is defined within the same container setup. However, for any client running on the host, it'll be exposed on port `22181`.

Similarly, the kafka service is exposed to the host applications through port `29092`, but it is actually advertised on port `9092` within the container environment configured by the `KAFKA_ADVERTISED_LISTENERS` property.


### 2.2. Start Kafka Server

Let's start the Kafka server by spinning up the containers using the [docker-compose](https://docs.docker.com/compose/reference/) command:

```sh
$ docker-compose up -d
Creating network "kafka_default" with the default driver
Creating kafka_zookeeper_1 ... done
Creating kafka_kafka_1     ... done
```

Now let's use the [nc](https://www.baeldung.com/linux/netcat-command#scanning-for-open-ports-using-netcat) command to verify that both the servers are listening on the respective ports:

```sh
$ nc -z localhost 22181
Connection to localhost port 22181 [tcp/*] succeeded!
$ nc -z localhost 29092
Connection to localhost port 29092 [tcp/*] succeeded!
```


Additionally, we can also check the verbose logs while the containers are starting up and verify that the Kafka server is up:


```sh
$ docker-compose logs kafka | grep -i started
kafka_1      | [2021-04-10 22:57:40,413] DEBUG [ReplicaStateMachine controllerId=1] Started replica state machine with initial state -> HashMap() (kafka.controller.ZkReplicaStateMachine)
kafka_1      | [2021-04-10 22:57:40,418] DEBUG [PartitionStateMachine controllerId=1] Started partition state machine with initial state -> HashMap() (kafka.controller.ZkPartitionStateMachine)
kafka_1      | [2021-04-10 22:57:40,447] INFO [SocketServer brokerId=1] Started data-plane acceptor and processor(s) for endpoint : ListenerName(PLAINTEXT) (kafka.network.SocketServer)
kafka_1      | [2021-04-10 22:57:40,448] INFO [SocketServer brokerId=1] Started socket server acceptors and processors (kafka.network.SocketServer)
kafka_1      | [2021-04-10 22:57:40,458] INFO [KafkaServer id=1] started (kafka.server.KafkaServer)
```

With that, our Kafka setup is ready for use.

### 2.3. Connection Using Kafka Tool

Finally, let's use the [Kafka Tool GUI utility](https://kafkatool.com/download.html) to establish a connection with our newly created Kafka server, and later, we'll visualize this setup:

![](https://www.baeldung.com/wp-content/uploads/2021/04/Screenshot-2021-04-11-at-4.51.32-AM.png)

```yml
Bootstrap servers: localhost:29092
```

We must note that we need to use the `Bootstrap servers propert`y to connect to the Kafka server listening at port `29092` for the host machine.

Finally, we should be able to visualize the connection on the left sidebar:

![](https://www.baeldung.com/wp-content/uploads/2021/04/Screenshot-2021-04-11-at-5.46.48-AM.png)

As such, the entries for Topics and Consumers are empty because it's a new setup. Once the topics are created, we should be able to visualize data across partitions. Moreover, if there are active consumers connected to our Kafka server, we can view their details too.

## 3. Kafka Cluster Setup

For more stable environments, we'll need a resilient setup. Let's extend our `docker-compose.yml` file to create a multi-node Kafka cluster setup.

### 3.1. docker-compose.yml Configuration

A cluster setup for Apache Kafka needs to have redundancy for both Zookeeper servers and the Kafka servers.

So, let's add configuration for one more node each for Zookeeper and Kafka services:


```yml

version: '2'
services:
  zookeeper-1:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - 22181:2181

  zookeeper-2:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - 32181:2181
  
  kafka-1:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper-1
      - zookeeper-2

    ports:
      - 29092:29092
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper-1:2181,zookeeper-2:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-1:9092,PLAINTEXT_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
  kafka-2:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper-1
      - zookeeper-2
    ports:
      - 39092:39092
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_ZOOKEEPER_CONNECT: zookeeper-1:2181,zookeeper-2:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-2:9092,PLAINTEXT_HOST://localhost:39092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

```

We must ensure that the service names and `KAFKA_BROKER_ID` are unique across the services.

Moreover, each service must expose a unique port to the host machine. Although `zookeeper-1` and `zookeeper-2` are listening on port `2181`, they're exposing it to the host via ports `22181` and `32181`, respectively. The same logic applies for the `kafka-1` and `kafka-2` services, where they'll be listening on ports `29092` and `39092`, respectively.

### 3.2. Start the Kafka Cluster

Let's spin up the cluster by using the `docker-compose` command:

```sh
$ docker-compose up -d
Creating network "kafka_default" with the default driver
Creating kafka_zookeeper-1_1 ... done
Creating kafka_zookeeper-2_1 ... done
Creating kafka_kafka-2_1     ... done
Creating kafka_kafka-1_1     ... done
```

Once the cluster is up, let's use the Kafka Tool to connect to the cluster by specifying comma-separated values for the Kafka servers and respective ports:

![](https://www.baeldung.com/wp-content/uploads/2021/04/Screenshot-2021-04-11-at-5.29.01-AM.png)


Finally, let's take a look at the multiple broker nodes available in the cluster:


![](https://www.baeldung.com/wp-content/uploads/2021/04/Screenshot-2021-04-11-at-5.30.10-AM.png)

## 4. Conclusion

In this article, we used the Docker technology to create single node and multi-node setups of Apache Kafka.

We also used the Kafka Tool to connect and visualize the configured broker server details.



# 相关链接


- [Guide to Setting Up Apache Kafka Using Docker](https://www.baeldung.com/ops/kafka-docker-setup)
- [Connect to Apache Kafka Running in Docker](https://www.baeldung.com/kafka-docker-connection)
- [Intro to Apache Kafka with Spring](https://www.baeldung.com/spring-kafka)
- [Kafka Connect Example with MQTT and MongoDB](https://www.baeldung.com/kafka-connect-mqtt-mongodb)
- [Kafka Streams vs. Kafka Consumer](https://www.baeldung.com/java-kafka-streams-vs-kafka-consumer)
- [docker-compose.yaml 简介](https://www.baeldung.com/ops/docker-compose)
- [Getting Started with Java and Zookeeper](https://www.baeldung.com/java-zookeeper#overview)
- [Apache Kafka 官网](https://kafka.apache.org/)
- [Docker 官网](https://www.docker.com/)
