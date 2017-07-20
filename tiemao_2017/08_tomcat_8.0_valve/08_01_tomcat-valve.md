# What is Tomcat valve?

### WHAT IS A TOMCAT VALVE?

A Tomcat valve - a new technology introduced with Tomcat 4 which allows you to associate an instance of a Java class with a particular Catalina container.

This configuration allows the named class to act as a preprocessor of each request. These classes are called valves, and they must implement the org.apache.catalina.Valve interface or extend the org.apache.catalina.valves.ValveBase class. Valves are proprietary to Tomcat and cannot, at this time, be used in a different servlet/JSP container. At this writing, Tomcat comes configured with four valves:

- Access Log
- Remote Address Filter
- Remote Host Filter
- Request Dumper

Each of these valves (and their available attributes) are described as follows.

### THE ACCESS LOG VALVE

The first of the Tomcat prepackaged valves is the Access Log valve: org.apache.catalina.valves.AccessLogValve. It creates log files to track client access information.

Some of the content that it tracks includes page hit counts, user session activity, user authentication information, and much more. The Access Log valve can be associated with an engine, host, or context container.

The following code snippet is an example entry using the org.apache.catalina.valves.AccessLogValve:

```
<Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs" prefix="localhost_access_log." suffix=".txt" pattern="common"/>
```

This code snippet states that the log files will be placed in the <CATALINA_HOME>/logs directory, prepended with the value localhost_access_log., and appended with the .txt suffix.

We have many java packages with ready-made tomcats that would make your life much easier. Take a look at our [java hosting](https://www.oxxus.net/) offer and join our Java family

### THE REMOTE ADDRESS FILTER

The Remote Address filter, org.apache.catalina.valves.RemoteAddrValve, allows you to compare the IP address of the requesting client against one or more regular expressions to either allow or prevent the request from continuing based on the results of this comparison. A Remote Address filter can be associated with a Tomcat Engine, Host, or Context container.

org.apache.catalina.valves.RemoteAddrValve.

```
<Valve className="org.apache.catalina.valves.RemoteAddrValve" deny="127.*"/>
```

This valve entry denies access to the assigned container for all client IP addresses that begin with 127. If I assign this valve entry to the host container localhost, then all clients with an IP address beginning with 127 will see a http status 403 - Frobidden page.

### THE REMOTE HOST FILTER

The Remote Host filter—org.apache.catalina.valves.RemoteHostValve is much like the RemoteAddrValve, except it allows you to compare the remote host address of the client that submitted this request instead of the fixed IP address. A Remote Host filter can be associated with a Tomcat Engine, Host, or Context container. An example entry using the org.apache.catalina.valves.RemoteHostValve can be found in the following code snippet.

```
<Valve className="org.apache.catalina.valves.RemoteHostValve" deny="virtuas*"/>
```

This valve entry denies access to the assigned container for all client hostnames including virtuas. If I assign this valve entry to the host container localhost, then all clients beginning with virtuas will see a 403 - Forbidden page.

### THE REQUEST DUMPER VALVE

The Request Dumper valve org.apache.catalina.valves.RequestDumperValve is a debugging tool that allows you to dump the HTTP headers associated with the specified request and response to the logger that is associated with our corresponding container. This valve is especially useful when you are trying to resolve any problems associated with headers or cookies sent by an HTTP client.

A Request Dumper filter can be associated with an Engine, Host, or Context container. The Request Dumper filter supports no additional attributes. An example entry using the org.apache.catalina.valve.RequestDumperValve can be found in the following code snippet:

```
<Valve className="org.apache.catalina.valves.RequestDumperValve"/>
```

To use the RequestDumperValve, you simply need to add this entry to the Tomcat container that you would like to monitor. To see this valve in action, open the current <TOMCAT_HOME>/conf/server.xml, uncomment the previously listed line found in the Standalone engine, and restart Tomcat. Now make a request to any of the applications found at http://localhost:8080.

After the request has been processed, open the latest <TOMCAT_HOME>/logs/catalina_log file. You should see several entries made by the RequestDumperValve.

These entries describe the contents of the most recent request.



原文链接: <https://www.oxxus.net/tutorials/tomcat/tomcat-valve>

