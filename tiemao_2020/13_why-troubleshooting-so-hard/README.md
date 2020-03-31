# Why is troubleshooting so hard?

[By definition](https://en.wikipedia.org/wiki/Troubleshooting), troubleshooting is supposed to be a logical, systematic search for the source of a problem in order to solve it. Now if you recall the last time you had to troubleshoot a particular issue happening in a production system – would you call it logical and systematic? Or would you agree that words such as hectic and guess-driven are more likely to describe the process you went through?

If you tend to answer YES to the latter question, then you end up wasting a lot of time trying to find the answer. Even worse, as the process is completely unpredictable, it builds tensions within the team and finger-pointing is likely to start happening:

![troubleshooting war room](https://plumbr.io/app/uploads/2016/09/war-room-finger-pointing.jpg)

In this post I am going to analyze different aspects leading to such situations. First part of the post focuses on the fundamental problems built into the environments where troubleshooting occurs. Second part of the post will describe the tooling and human-related problems in the field. In the closing section I will show that there is still some light at the end of the tunnel.

## Troubleshooting in production

A particular set of problems tend to happen when you are troubleshooting a particular problem in production. Many different aspects are now likely to make the process a misery:

First and foremost, you are competing with the pressure of “**let’s just restart the instance to get back to normal**”. The desire to use the fastest way to get rid of the impact on end users is natural. Unfortunately, the restart is also likely to destroy any evidence regarding the actual root cause. If the instance is restarted, you no longer can harvest the evidence of what was actually happening. Even when the restart resolves the issue at hand, the root cause itself is still there and is just waiting to happen again.

Next in line are different security-related aspects, which tend to **isolate engineering from production environments**. If you do not have the access to the environment yourself, you are forced to troubleshoot remotely, with all the problems related to it: every operation to be carried out now includes multiple persons, increasing both the time it takes to carry out each action and potentially losing information along the way.

The situation goes from bad to worse when you are shipping “let’s hope this works” patches to production. **Testing and applying the patch tends to take hours or even days**, further increasing the time it takes to actually fix the issue at hand. If multiple “let’s hope” patches are required, the resolution is delayed for week(s).

Last but not least in line are the tools to be used themselves. **Some of the tools you would like to deploy are likely to make the situation even worse** for end users. Just as examples:

- Taking heap dumps from the JVM would stop the JVM for tens of seconds.
- Increased verbosity in logging is likely to introduce additional concurrency issues.
- The sheer overhead of an attached profiler can bring an already slow application completely down.

So it is likely that you end up in a situation where days or even weeks are spent in passing yet another telemetry gathering script or yet another “let’s hope it works” patch to production:

![isolating engineers from operations](https://plumbr.io/app/uploads/2016/09/wall-of-confusion.jpg)

Looking at the problems you are facing when troubleshooting in production, it is only natural that in many cases the troubleshooting activities are carried out in a different environment.

## Troubleshooting in test/development

When troubleshooting in a different environment you can escape the menaces haunting you in production. However, you are now facing a completely different problem which can end up being even worse: namely the challenge of reproducing the performance issue happening in production. There are different aspects making the reproducing process a misery:

- The test environment is not using the same datasource(s) as the production. This means that issues triggered by the data volume might not reproduce in the test environment.
- The usage patterns revealing certain issues are not easy to recreate. Just imagine an issue which happens only on 29th of February and requires two users on Windows ME to access a particular function at the same time triggering a specific concurrency issue.
- The application itself is not the same. The production deployment might have significantly different configuration. The differences can include a different OS, clustering features, startup parameters or even different builds.

These difficulties lead to the infamous “works on my machine” quote being brought into the discussion:

![works on my machine](https://plumbr.io/app/uploads/2016/09/cannot-reproduce.jpg)

So as can be seen, independent of the environment at hand, when you have to troubleshoot something, the nature of the environment at hand will toss several obstacles in your way.

Besides the environment-specific constraints, there are other aspects also contributing to the unpredictable nature of the troubleshooting process. This will be covered in the next section.

## Tooling and experienced people to the rescue?

The environmental constraints would not be actual showstoppers if the tools used and the discipline of troubleshooting were mature. In reality it is far from it – the engineers responsible for solving the issue often do not have a predefined process to tackle the problem. Honestly, do you recognize yourself in the following sequence of actions taken in shell:

```
my-precious:~ me$ sar
sar: failed to open input file [-1][/var/log/sa/sa06]
/usr/bin/sar [-Adgpu] [-n { DEV | EDEV | PPP }] [-e time] [-f filename] [-i sec] [-s time]

my-precious:~ me$ man sar

my-precious:~ me$ sar 1
15:29:02  %usr  %nice   %sys   %idle
15:29:03    1      0      2     97
Average:      1      0      2     97   

my-precious:~ me$ sar 1 1000
15:29:06  %usr  %nice   %sys   %idle
15:29:07    2      0      2     97
15:29:08    1      0      2     97
^CAverage:      1      0      1     97

my-precious:~ me$ man sar
my-precious:~ me$ sar -G 1 3
sar: illegal option -- G
/usr/bin/sar [-Adgpu] [-n { DEV | EDEV | PPP }] [-e time] [-f filename] [-i sec] [-s time]

my-precious:~ me$ asdöäaskdasäl;
-bash: asdöäaskdasäl: command not found

my-precious:~ me$
```

If you found the above to be too familiar, don’t be afraid, you are not alone. Far from it, most of the engineers lack the in-depth experience in the field which makes it impossible to make progress based on the familiar patterns recognized. This is not something to be ashamed of – unless you are [Brendan Gregg](http://www.brendangregg.com/) or [Peter Lawrey](https://twitter.com/PeterLawrey), you just don’t have the 10,000 hours of troubleshooting down your belt to make you an expert on the subject.

This lack of experience tends to result in tossing different evidence-gathering tools towards the problem at hand, including but not limited to:

- Harvesting different metrics (CPU, memory, IO, network, etc).
- Analyzing application logs
- Analyzing GC logs
- Capturing and analyzing thread dumps
- Capturing and analyzing heap dumps

The number of such tools you can use is almost unlimited. Just check out the lists [here](https://github.com/deephacks/awesome-jvm) and [here](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr.html#diagnostic_tools) if you are not convinced. The approach of randomly trying out different tools results in more time spent in choosing and trying out the tools than in actually solving the issue at hand.

## Solving the troubleshooting nightmare

Besides accumulating minutes towards the 10,000 hours which would make you the expert in the field, there are faster solutions to alleviate the pain caused by troubleshooting.

### Profiling in development

To make it clear, the post is not about bashing the profiling as a technique. There is nothing wrong in profiling the code, especially before it gets shipped to production. On the contrary, understanding the hotspots and memory consumption of various parts of the app will prevent some issues impacting your end users in production in the first place.

However, the differences in data, usage patterns and environments will only end up exposing a subset of the issues you eventually will be faced in production. The same techniques which worked well as pre-emptive measures will only rarely help while troubleshooting the problem retroactively.

### Testing in QA

Investing into QA, especially if the investments result in automation of the process is the next line of defence you can build. Testing will further reduce the number of incidents in production if applied thoughtfully and thoroughly.

However it is often hard to justify the investments in QA. Everything labelled “performance test something” or “acceptance test something” will eventually be competing with new features driven by clear and measurable business goals. Now when the only things the developer pushing for the “performance something” task are some acronyms, such tasks will never make it out of the backlog:

| **Priority** | **Type** | **Description**                     | **ROI**                                 |
| :----------- | :------- | :---------------------------------- | :-------------------------------------- |
| 1            | Feature  | Integrate invoicing with Salesforce | BigCO will sign a 250K contract with us |
| 2            | Feature  | Support Windows 10                  | 10% more trials sign-ups will convert   |
| …            | …        | …                                   | ….                                      |
| 99           | Task     | Load test customer search           | ???                                     |

To justify such investments, you need to link the return of the investment to the activity. Reducing the P1 performance incidents in production by 3x can be linked to its dollar value and in such case it has a chance against the next feature the sales team is pushing.

### Monitoring in production

First thing you need to accept is that problems will occur in production deployment. Even NASA tends to blow up their craft every once in a while, so you’d better be prepared for issues happening in production. No matter how well you profile or how thoroughly you test, bugs will still slip through.

So you cannot avoid troubleshooting production issues. To be better equipped for the task at hand, you should have transparency to your production environment. Whenever an issue arises, you ideally already have all the evidence you need to fix it. If you have all the information you need, you can effectively skip the problematic reproducing and evidence gathering steps.

Unfortunately the state of the art in monitoring world offers no single silver bullet to expose all the information you need in different circumstances. The set of tools to deploy for a typical web-based application should include at least the following:

- Log monitoring. Logs from various nodes of your production stack should be aggregated so that the engineering team can quickly search for information, visualize the logs and register alerts on anomalies. One of most frequently used solution is the ELK stack, where the logs are stored in [Elasticsearch](http://www.elastic.co/), analyzed in [Logstash](http://www.elastic.co/products/logstash) and visualized with [Kibana](http://www.elastic.co/products/kibana).
- System monitoring. Aggregating and visualizing system-level metrics in your infrastructure is both beneficial and simple to set up. Keeping an eye on CPU, memory, network and disk usage allows you to spot system-level problems and register alerts on anomalies.
- Application Performance Monitoring/User Experience Monitoring. Keeping an eye on individual user interactions will reveal performance and availability issues impacting your end users. At minimum you will be aware when particular services your application(s) offer are malfunctioning. At best, when [Plumbr](https://plumbr.io/) is being used, you are also zoomed in to the actual root cause in source code.

## Take-away

Troubleshooting is a necessary evil. You cannot avoid it, so it is only fair that you are aware of the related problems. You cannot bypass the constraints posed by different environments nor can you make yourself an expert overnight.

Making sure you apply profiling in development and test your code before the release reduces the frequency of troubleshooting issues in production. Having transparency to your production deployment allows you to respond faster and in a predictable way whenever the two safety nets have failed.



<https://plumbr.io/blog/monitoring/why-is-troubleshooting-so-hard>
