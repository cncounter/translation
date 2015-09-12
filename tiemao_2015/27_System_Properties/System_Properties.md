Java: 系统属性(System Properties)简介
==

> 译者注: 对 System 可以理解为 JVM 系统, 是 Java 运行的系统环境。

In [Properties](https://docs.oracle.com/javase/tutorial/essential/environment/properties.html), we examined the way an application can use `Properties` objects to maintain its configuration. The Java platform itself uses a `Properties` object to maintain its own configuration. The System class maintains a `Properties` object that describes the configuration of the current working environment. System properties include information about the current user, the current version of the Java runtime, and the character used to separate components of a file path name.

The following table describes some of the most important system properties


<table summary="Important system properties" border="1" cellpadding="2" width="80%" align="center">
<tbody><tr>
<th id="h1">Key</th>
<th id="h2">Meaning</th>
</tr>
<tr>
<td headers="h1"><code>"file.separator"</code></td>
<td headers="h2">Character that separates components of a file path. This is "<code>/</code>" on UNIX and "<code>\</code>" on Windows.</td>
</tr>
<tr>
<td headers="h1"><code>"java.class.path"</code></td>
<td headers="h2">Path used to find directories and JAR archives containing class files. Elements of the class path are separated by a platform-specific character specified in the <code>path.separator</code> property.</td>
</tr>
<tr>
<td headers="h1"><code>"java.home"</code></td>
<td headers="h2">Installation directory for Java Runtime Environment (JRE)</td>
</tr>
<tr>
<td headers="h1"><code>"java.vendor"</code></td>
<td headers="h2">JRE vendor name</td>
</tr>
<tr>
<td headers="h1"><code>"java.vendor.url"</code></td>
<td headers="h2">JRE vendor URL</td>
</tr>
<tr>
<td headers="h1"><code>"java.version"</code></td>
<td headers="h2">JRE version number</td>
</tr>
<tr>
<td headers="h1"><code>"line.separator"</code></td>
<td headers="h2">Sequence used by operating system to separate lines in text files</td>
</tr>
<tr>
<td headers="h1"><code>"os.arch"</code></td>
<td headers="h2">Operating system architecture</td>
</tr>
<tr>
<td headers="h1"><code>"os.name"</code></td>
<td headers="h2">Operating system name</td>
</tr>
<tr>
<td headers="h1"><code>"os.version"</code></td>
<td headers="h2">Operating system version</td>
</tr>
<tr>
<td headers="h1"><code>"path.separator"</code></td>
<td headers="h2">Path separator character used in <code>java.class.path</code></td>
</tr>
<tr>
<td headers="h1"><code>"user.dir"</code></td>
<td headers="h2">User working directory</td>
</tr>
<tr>
<td headers="h1"><code>"user.home"</code></td>
<td headers="h2">User home directory</td>
</tr>
<tr>
<td headers="h1"><code>"user.name"</code></td>
<td headers="h2">User account name</td>
</tr>
</tbody></table>


> **Security consideration**: Access to system properties can be restricted by the [Security Manager](https://docs.oracle.com/javase/tutorial/essential/environment/security.html). This is most often an issue in applets, which are prevented from reading some system properties, and from writing any system properties. For more on accessing system properties in applets, refer to [System Properties](https://docs.oracle.com/javase/tutorial/deployment/doingMoreWithRIA/properties.html) in the [Doing More With Java Rich Internet Applications](https://docs.oracle.com/javase/tutorial/deployment/doingMoreWithRIA/index.html) lesson.


## Reading System Properties

The `System` class has two methods used to read system properties: getProperty and getProperties.

The `System` class has two different versions of getProperty. Both retrieve the value of the property named in the argument list. The simpler of the two getProperty methods takes a single argument, a property key For example, to get the value of path.separator, use the following statement:

	System.getProperty("path.separator");

The getProperty method returns a string containing the value of the property. If the property does not exist, this version of getProperty returns null.

The other version of getProperty requires two String arguments: the first argument is the key to look up and the second argument is a default value to return if the key cannot be found or if it has no value. For example, the following invocation of getProperty looks up the System property called subliminal.message. This is not a valid system property, so instead of returning null, this method returns the default value provided as a second argument: "Buy StayPuft Marshmallows!"

	System.getProperty("subliminal.message", "Buy StayPuft Marshmallows!");

The last method provided by the System class to access property values is the getProperties method, which returns a Properties object. This object contains a complete set of system property definitions.

## Writing System Properties

To modify the existing set of system properties, use System.setProperties. This method takes a Properties object that has been initialized to contain the properties to be set. This method replaces the entire set of system properties with the new set represented by the Properties object.

> **Warning**: Changing system properties is potentially dangerous and should be done with discretion. Many system properties are not reread after start-up and are there for informational purposes. Changing some properties may have unexpected side-effects.
The next example, [PropertiesTest](https://docs.oracle.com/javase/tutorial/essential/environment/examples/PropertiesTest.java), creates a `Properties` object and initializes it from [myProperties.txt](https://docs.oracle.com/javase/tutorial/essential/environment/examples/myProperties.txt) .

	subliminal.message=Buy StayPuft Marshmallows!

PropertiesTest then uses System.setProperties to install the new Properties objects as the current set of system properties.


	import java.io.FileInputStream;
	import java.util.Properties;
	
	public class PropertiesTest {
	    public static void main(String[] args)
	        throws Exception {
	
	        // set up new properties object
	        // from file "myProperties.txt"
	        FileInputStream propFile =
	            new FileInputStream( "myProperties.txt");
	        Properties p =
	            new Properties(System.getProperties());
	        p.load(propFile);
	
	        // set the system properties
	        System.setProperties(p);
	        // display new properties
	        System.getProperties().list(System.out);
	    }
	}

Note how PropertiesTest creates the Properties object, p, which is used as the argument to setProperties:

	Properties p = new Properties(System.getProperties());

This statement initializes the new properties object, p, with the current set of system properties, which in the case of this small application, is the set of properties initialized by the runtime system. Then the application loads additional properties into p from the file myProperties.txt and sets the system properties to p. This has the effect of adding the properties listed in myProperties.txt to the set of properties created by the runtime system at startup. Note that an application can create p without any default Properties object, like this:

	Properties p = new Properties();

Also note that the value of system properties can be overwritten! For example, if myProperties.txt contains the following line, the java.vendor system property will be overwritten:

	java.vendor=Acme Software Company

In general, be careful not to overwrite system properties.

The setProperties method changes the set of system properties for the current running application. These changes are not persistent. That is, changing the system properties within an application will not affect future invocations of the Java interpreter for this or any other application. The runtime system re-initializes the system properties each time its starts up. If changes to system properties are to be persistent, then the application must write the values to some file before exiting and read them in again upon startup.





原文链接: [System Properties](https://docs.oracle.com/javase/tutorial/essential/environment/sysprop.html)

翻译日期: 2015年09月12日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
