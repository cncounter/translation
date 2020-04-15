Micrometer Documentation
==

Micrometer provides a simple facade over the instrumentation clients for the most popular monitoring systems, allowing you to instrument your JVM-based application code without vendor lock-in. Think SLF4J, but for application metrics! Application metrics recorded by Micrometer are intended to be used to observe, alert, and react to the current/recent operational state of your environment.


Instructions for how to configure Micrometer for use with different monitoring systems. As a facade over multiple monitoring systems, the point of Micrometer is to allow you to instrument your code in the same way and be able to visualize the results in your monitoring system of choice.


Micrometer 为大部分监控系统提供了一个基于客户端机器的指标系统， 像SLF4J一样简单的门面模式， 不需要关心具体的JVM版本和厂商。
Micrometer 记录的指标主要是用于监控，告警，以及对当前的系统环境变化做出响应。

Micrometer 作为指标采集的基础类库，目的是以相同的方式来配置，支持对接到不同的可视化监控系统服务。


- JMX. Micrometer provides a hierarchical mapping to JMX, primarily as a cheap and portable way to view metrics locally. Where JMX exporting is found in production, the same metrics are generally exported to another, more purpose-fit monitoring system.
- JMX： Micrometer还会注册JMX相关的MBeans，非常简单和方便地在本地通过JMX来查看相关指标。 如果是生产环境中使用，则一般是将监控指标导出到其他监控系统中保存起来。


- AppOptics. AppOptics is a dimensional time-series SAAS with built-in dashboarding. Micrometer supports shipping metrics to AppOptics directly via its API.

- Atlas. An in-memory dimensional time series database with built-in graphing, a custom stack-based query language, and advanced math operations. Atlas originated at Netflix, where it remains the operational metrics solution.

- Datadog. Datadog is a dimensional time-series SAAS with built-in dashboarding and alerting. Micrometer supports shipping metrics to Datadog directly via its API or through Dogstatsd via the StatsD registry.

- Dynatrace. Dynatrace is a dimensional time-series SAAS with built-in dashboarding. Micrometer supports shipping metrics to Dynatrace directly via its API.

- Elastic. Elasticsearch is an open source search and analytics platform. Metrics stored in Elasticsearch can be visualized in Kibana.


- [AppOptics](https://www.appoptics.com/)，支持APM和系统监控的SAAS服务，支持各种仪表板和时间轴等监控界面，提供API和客户端。

- [Atlas](https://github.com/Netflix/atlas), 是Netflix旗下的一款开源的，基于内存的时序数据库，内置图形界面，支持高级数学运算和自定义查询语言。

- [Datadog](https://www.datadoghq.com/)， 支持APM和系统监控的SAAS服务，内置各种仪表板，支持告警。 支持API和客户端，以及客户端代理。

- [Dynatrace](https://www.dynatrace.com/), 支持APM和系统监控的SAAS服务, 内置各种仪表板， 集成了监控和分析平台。

- ELK开源技术栈，一般用于日志监控，[Elasticsearch](http://www.elastic.co/) 是搜索引擎，支持各种数据和指标存储， 日志监控一般通过 [Logstash](http://www.elastic.co/products/logstash) 执行分析， [Kibana](http://www.elastic.co/products/kibana) 负责人机交互和可视化。


- Ganglia. An aging hierarchical metrics system which enjoyed wide popularity in Linux system monitoring and is still in place in many organizations. It originated in the early 2000s at the University of California, Berkeley.

- Graphite. One of the most popular current hierarchical metrics systems backed by a fixed-size database, similar in design and purpose to RRD. It originated at Orbitz in 2006 and was open sourced in 2008.

- Humio. Humio is a dimensional time-series SAAS with built-in dashboarding. Micrometer supports shipping metrics to Humio directly via its API.

- Influx. The InfluxData suite of tools supports real-time stream processing and storage of time-series data. It supports downsampling, automatically expiring and deleting unwanted data, as well as backup and restore. Analysis of data is done via a SQL-like query language.

- [Ganglia](http://ganglia.sourceforge.net/)， 用于高性能计算系统，群集和网络的可伸缩的分布式监控工具。 起源于加州大学伯克利分校，是一款历史悠久的多层级指标监控系统，在Linux系统中广受欢迎。


- [Graphite](https://graphiteapp.org/), 当前非常流行的多层级次指标监控系统，使用固定数量的底层数据库，其设计和目的与RRD相似。 由Orbitz在2006年创建，并于2008年开源。

- [Humio](https://www.humio.com/), 支持APM、日志和系统监控的SAAS服务。

- [Influx](https://www.influxdata.com/), InfluxDB是由InfluxData开发的一款开源时序型数据库。它由Go写成，着力于高性能地查询与存储时序数据。InfluxDB被广泛应用于存储系统的监控数据，IoT行业的实时数据等场景，通过类似SQL的查询语言来完成数据分析。 InfluxData工具套件可用于实时流处理，支持抽样采集指标，自动过期，删除不需要的数据，以及备份和还原等功能。

- Instana. Instana is an automatic application performance management and infrastructure monitoring system.

- KairosDB. KairosDB is a dimensional time-series database built on top of Cassandra. Charting can be accomplished in Grafana.

- New Relic. Micrometer publishes to New Relic Insights, a SaaS offering with a full UI and a query language called NRQL. New Relic Insights operates on a push model.

- Prometheus. An in-memory dimensional time series database with a simple built-in UI, a custom query language, and math operations. Prometheus is designed to operate on a pull model, scraping metrics from application instances periodically based on service discovery.

- SignalFx. SignalFx is a dimensional monitoring system SaaS with a full UI operating on a push model. It has a rich set of alert "detectors".

- [Instana](https://www.instana.com/)， 支持自动APM、系统监控的SAAS服务。

- [KairosDB](https://kairosdb.github.io/)， 是建立在 [Apache Cassandra](http://cassandra.apache.org/) 基础上的时序数据库。可以通过 [Grafana](https://grafana.com/) 来绘制精美漂亮的监控图表。

- [New Relic](https://newrelic.com/)。 这是一款具有完整UI的可视化SaaS产品，支持NRQL查询语言， New Relic Insights 基于推模型来运行。

- [Prometheus](https://prometheus.io/), 具有简单的内置UI，支持自定义查询语言和数学运算的, 开源的内存时序数据库。  Prometheus设计为基于拉模型来运行，根据服务发现，定期从应用程序实例中收集指标。

- [SignalFx](https://www.signalfx.com/)， 在推送模型上运行的SaaS服务，具有完整UI。支持实时的系统性能，微服务，以及APM监控系统，支持多样化的预警“检测器”。

- Stackdriver. Stackdriver Monitoring is a dimensional time-series SAAS with built-in dashboarding and alerting. Micrometer supports shipping metrics to Stackdriver directly via its API using a push model. Alternatively, you can export Micrometer metrics via Prometheus and use a Prometheus to Stackdriver sidecar.

- StatsD. Micrometer supports three flavors of StatsD: the original Etsy format plus the Datadog and Telegraf (Influx) extensions of StatsD that add dimensional support. Use this registry if you prefer to publish metrics to a StatsD agent.

- Wavefront. Wavefront is a SaaS-based metrics monitoring and analytics platform that lets you visualize, query, and alert over data from across your entire stack (infrastructure, network, custom app metrics, business KPIs, etc.)

- [Stackdriver](https://cloud.google.com/stackdriver?hl=zh-cn), 是 Google Cloud 的嵌入式监测套件，用于监控云基础架构、软件和应用的性能，排查其中的问题并加以改善。 这个监测套件属于 SAAS服务，支持内置仪表板和告警功能。

- [StatsD](https://github.com/statsd/statsd), 开源的，简单但很强大的统计信息聚合服务器。

- [Wavefront](https://www.wavefront.com/)，是基于SaaS的指标监视和分析平台，支持可视化查询，以及预警监控等功能， 包括系统性能、网络，自定义指标，业务KPI等等。
