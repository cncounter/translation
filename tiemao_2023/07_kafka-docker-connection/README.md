# 开发环境搭建: 如何从宿主机和外部访问Docker容器中的Kafka


本文有一篇前置教程:


- [Guide to Setting Up Apache Kafka Using Docker](https://www.baeldung.com/ops/kafka-docker-setup)


## 1. 概述

[Apache Kafka](https://kafka.apache.org/) 是一款非常流行的事件流平台, 经常与 [Docker](https://www.docker.com/) 搭配使用。 很多人会遇到 Kafka 连接建立失败的问题, 特别是当客户端与 Kafka 不在同一个 Docker 网络或者同一台宿主机上时。 这主要是因为 Kafka 的 advertised listeners(对外通告的监听器)配置不当造成的。

本文介绍如何配置监听器(listeners), 让客户端能够连接到运行在 Docker 容器内的 Kafka broker。


## 2. 启动 Kafka 服务

在尝试建立连接之前, 我们需要先用 Docker 运行一个 [Kafka broker](https://www.baeldung.com/ops/kafka-docker-setup)。 下面是 [docker-compose.yaml](https://www.baeldung.com/ops/docker-compose) 文件的片段:

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

这里定义了两个必需的服务 – `Kafka` 和 `Zookeeper`。

我们还定义了一个自定义网络 – `kafka_docker_example_net`, 供这两个服务使用。

稍后我们会详细介绍 `KAFKA_LISTENERS`、`KAFKA_ADVERTISED_LISTENERS` 和 `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP` 这几个属性。

使用上面的 `docker-compose.yaml` 文件, 启动这些服务:


```sh
docker-compose up -d
Creating network "kafka_docker_example_net" with the default driver
Creating zookeeper ... done
Creating kafka ... done
```

此外, 我们会使用 Kafka 的 [console producer](https://kafka-tutorials.confluent.io/kafka-console-consumer-producer-basics/kafka.html) 工具作为示例客户端, 来测试与 Kafka broker 的连接。 如果想不使用 Docker 来运行 kafka-console-producer 脚本, 则需要先下载 [Kafka](https://kafka.apache.org/downloads)。

## 3. 监听器

在连接 Kafka broker 时, 监听器(listeners)、对外通告的监听器(advertised listeners)以及监听协议都起着相当重要的作用。

我们通过 `KAFKA_LISTENERS` 属性来管理监听器, 在其中声明一组以逗号分隔的 URI, 用于指定 broker 应该监听哪些 socket 来接收传入的 TCP 连接。

每个 URI 由协议名、接口地址和端口组成:

```yml
EXTERNAL_SAME_HOST://0.0.0.0:29092,INTERNAL://0.0.0.0:9092
```

这里我们指定了 0.0.0.0 这个元地址, 把 socket 绑定到所有网络接口。 另外, EXTERNAL_SAME_HOST 和 INTERNAL 是自定义的监听器名称, 在以 URI 格式定义监听器时需要指定。

### 3.2. 客户端引导(Bootstrapping)

初次连接时, Kafka 客户端需要一个 bootstrap server 列表, 用于指定各个 broker 的地址。 该列表中至少要包含集群内任意一个 broker 的有效地址。

客户端会使用这个地址连接 broker。 如果连接成功, broker 会返回集群的元数据, 其中包括集群内所有 broker 的 advertised listener 列表。 后续连接时, 客户端就会使用这个列表来访问各个 broker。

### 3.3. 对外通告的监听器(Advertised Listeners)

仅仅声明监听器是不够的, 因为它只是 broker 侧的 socket 配置。 我们还需要一种方式, 来告诉客户端(消费者和生产者)应该如何连接 Kafka。

这时就要借助 `KAFKA_ADVERTISED_LISTENERS` 属性来配置 advertised listeners。 它的格式与 listener 属性类似:

```yml
<listener protocol>://<advertised host name>:<advertised port>
```

在完成初次引导(bootstrapping)之后, 客户端就会使用 advertised listeners 中指定的地址来连接。


### 3.4. 监听器安全协议映射(Listener Security Protocol Map)

除了监听器和 advertised listeners 之外, 我们还需要告诉客户端连接 Kafka 时使用哪种安全协议。 在 `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP` 中, 我们把自定义的协议名映射到合法的安全协议上。

在前面一节的配置中, 我们声明了两个自定义协议名 – `INTERNAL` 和 `EXTERNAL_SAME_HOST`。 名称可以随意取, 但必须把它们映射到合法的安全协议。

我们指定的其中一种安全协议是 `PLAINTEXT`, 它表示客户端不需要与 Kafka broker 进行认证, 而且交换的数据也不加密。


## 4. 客户端从同一个 Docker 网络连接

我们在另一个容器中启动 Kafka console producer, 尝试向 broker 发送消息:

```sh
docker run -it --rm --network kafka_docker_example_net confluentinc/cp-kafka /bin/kafka-console-producer --bootstrap-server kafka:9092 --topic test_topic
>hello
>world
```

这里把这个容器接入已有的 kafka_docker_example_net 网络, 从而可以自由地与 broker 通信。 同时指定了 broker 地址 `kafka:9092` 以及主题(topic)名称, 该主题会被自动创建。

我们成功把消息发送到了该主题, 说明与 broker 的连接是成功的。


## 5. 客户端从同一台宿主机连接

当客户端没有容器化时, 我们来从宿主机连接 broker。 对于外部连接, 我们通告了 EXTERNAL_SAME_HOST 监听器, 可以用它从宿主机建立连接。 从 advertised listener 的配置可以看出, 需要通过 localhost:29092 才能访问到 Kafka broker。

为了测试从同一台宿主机的连通性, 我们使用一个非容器化的 Kafka console producer:

```sh
kafka-console-producer --bootstrap-server localhost:29092 --topic test_topic_2
>hi
>there
```


既然成功发送了消息, 说明无论是初次引导, 还是后续连接(此时客户端会使用 advertised listeners), 与 broker 的通信都是成功的。

前面在 `docker-compose.yaml` 中配置的端口号 `29092`, 使得 Kafka broker 在 Docker 外部也可以访问。

## 6. 客户端从另一台宿主机连接

如果 Kafka broker 运行在另一台宿主机上, 该如何连接呢? 很遗憾, 现有的监听器无法复用, 因为它们只适用于同一个 Docker 网络或者同一台宿主机的连接。 所以需要定义一个新的监听器, 并把它对外通告:

```yml
KAFKA_LISTENERS: EXTERNAL_SAME_HOST://:29092,EXTERNAL_DIFFERENT_HOST://:29093,INTERNAL://:9092
KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka:9092,EXTERNAL_SAME_HOST://localhost:29092,EXTERNAL_DIFFERENT_HOST://157.245.80.232:29093
KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT,EXTERNAL_DIFFERENT_HOST:PLAINTEXT
```

我们新建了一个名为 `EXTERNAL_DIFFERENT_HOST` 的监听器, 关联的安全协议为 `PLAINTEXT`, 端口为 `29093`。 在 `KAFKA_ADVERTISED_LISTENERS` 中, 还加上了 Kafka 所在云主机的 IP 地址。

要注意, 这里不能用 localhost, 因为是从另一台机器(此处是本地工作站)去连接的。 另外, 端口 `29093` 已在 ports 配置段中发布, 以便在 Docker 外部可以访问。

我们来试着发送几条消息:

```sh
kafka-console-producer --bootstrap-server 157.245.80.232:29093 --topic test_topic_3
>hello
>REMOTE SERVER
```

可以看到, 我们成功连接到了 Kafka broker, 并成功发送了消息。

## 7. 总结

本文介绍了如何配置监听器, 让客户端能够连接到运行在 Docker 容器内的 Kafka broker。 我们分析了客户端位于同一个 Docker 网络、同一台宿主机、不同宿主机等几种场景。 可以看出, listener、advertised listener 以及安全协议映射的配置决定了连接能否建立。



# 相关链接


- [Guide to Setting Up Apache Kafka Using Docker](https://www.baeldung.com/ops/kafka-docker-setup)
- [Connect to Apache Kafka Running in Docker](https://www.baeldung.com/kafka-docker-connection)
- [docker-compose.yaml 简介](https://www.baeldung.com/ops/docker-compose)
- [Apache Kafka 官网](https://kafka.apache.org/)
- [Docker 官网](https://www.docker.com/)
