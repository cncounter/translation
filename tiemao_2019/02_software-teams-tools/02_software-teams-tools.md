# Tools For Software Engineering Teams

The effect of poorly performing web applications echoes across various parts of the business. The more breakage there is, the more busy support teams get. There is less traction, and product teams are puzzled about user retention. Engineers are inundated with bug-fixes, leaving no time for feature development. Business stakeholders receive no insight into performance improvements. Engineering managers cannot clearly justify the efforts being taken. The list goes on. 

What are the available options to keep this risk at bay? The answer lies in providing your development team with the right kind of tools they can use to deal with common problems that arise from each stage in software development.

## Planning tools

The beginning of most software products/projects lies in planning and tracking development. Planning tools are used from the time a project begins until the time a project is under active development. Planning a project is the start of every iteration in cyclical project management followed in most places today. It is justified as helping herd cats, or prevent yak shaving. The most common tool is [Jira](https://www.atlassian.com/software/jira). There are a few alternatives too which engineering teams pick up based on their needs. 

## Version control tools

Gone are the days when the person holding the rubber duck is the only one who can make changes to the source code. Version control is the first tool that every engineering team decides upon before anything else. Even among small teams or hobby projects with a single programmer, version control is employed. Engineering teams have a clear choice among [Git](https://git-scm.com/), Mercurial, and [Apache Subversion](https://subversion.apache.org/)provided by several vendors. There is immense maturity in the realm of version control, as a result of which teams know exactly what they’re getting into.

## Testing tools

Nearly every engineering team in the world that does web application development uses [Selenium](https://www.seleniumhq.org/) in their testing environment. When deployed using the [Robot Framework](http://robotframework.org/), a generic test automation setup is available for acceptance testing. It provides a powerful way of asserting if applications work, and gives a good sanity check for the laundry list of requirements. 

## CI/CD tools

With a change in the way software was developed, it was only natural for the methods of software release to evolve as well. To facilitate faster release cycles, where teams released software more frequently, the CI/CD pipeline was conceived. This stands for the combined practices of continuous integration and continuous delivery. [Jenkins](https://jenkins.io/), [Travis](https://travis-ci.org/), and [CircleCI](https://circleci.com/) are among the most popular tools used by engineering teams to have functional CI/CD pipelines.

## Configuration tools

The fundamental goal of configuration tools is to manage large-scale infrastructure efficiently. Some of the ancillary goals are to minimize interference and input required from engineers and sysadmins, reduce complexity involved in configuring distributed infrastructure. [Ansible](https://www.ansible.com/) is the most prevalent tool, and alternatives like [Chef](https://www.chef.io/chef/), [Puppet](https://puppet.com/), and [Salt](https://www.saltstack.com/) are available too.

## Monitoring tools

This is a very scattered space at the moment. That said, there is enormous evolution happening with monitoring tools. Early monitoring tools began to inspect server parameters when software was released and used these as indicators of application health. Correlation existed between how the server held up and what a user experienced. This approach unfortunately raises more questions than it actually answers. Today, there is a shift in this paradigm owing to different evolutions in browsers, communication protocols, and other pieces. It is possible to record the experience of a user by attaching agents to the browser. 

There is also a lot of effort invested in areas like log management, alerting, telemetry, and reporting in the name of monitoring. Some of these are valid. Logging security events, meaningful alerting, resource utilization are valuable parameters to track, but only if accompanied by a clear strategy of monitoring users. A handful of tools like [Zabbix](https://www.zabbix.com/), [Nagios](https://www.nagios.org/), and [Prometheus](https://prometheus.io/) are used by engineers, but none of them solve the problem of real-user monitoring.

Simply investing in software will not help you mitigate your performance problems. There are many steps you need to take to be able to get there. It is not for the faint-hearted, or for the easily-distracted. Tuning web applications for good performance is a serious commitment and requires enormous effort to do well. It also demands discipline to maintain web applications that way. The returns that await teams who undertake this effort are huge!

Please remember – performance is about people. About your users.

We’re all united in our goal to make software faster, and provide a reliable digital user experience. There are many means to achieve this end, [Plumbr](https://www.plumbr.io/) being one among them. Plumbr provides a real-user monitoring system that provides performance insights based on the interactions of your users. [Sign up today for a free trial](http://app.plumbr.io/signup), and stay on top of performance issues faced by your users.


<https://plumbr.io/blog/devops/tools-for-software-engineering-teams>

December 19, 2018

