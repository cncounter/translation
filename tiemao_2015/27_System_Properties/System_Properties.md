Java: 系统属性(System Properties)简介
==

> 译者注: 对 System 可以理解为 JVM 系统, 是 Java 运行的系统环境。

In [Properties](https://docs.oracle.com/javase/tutorial/essential/environment/properties.html), we examined the way an application can use `Properties` objects to maintain its configuration. The Java platform itself uses a `Properties` object to maintain its own configuration. The System class maintains a `Properties` object that describes the configuration of the current working environment. System properties include information about the current user, the current version of the Java runtime, and the character used to separate components of a file path name.

在[属性(Properties)](https://docs.oracle.com/javase/tutorial/essential/environment/properties.html)一节中, 我们探讨了应用程序如何使用 `Properties` 对象来维护自身的配置。Java 平台本身也使用一个 `Properties` 对象来维护自己的配置。`System` 类维护着一个 `Properties` 对象, 用于描述当前工作环境的配置。系统属性包含当前用户、Java 运行时的当前版本, 以及用于分隔文件路径名各组成部分的字符等信息。

The following table describes some of the most important system properties


下表列出了其中一些最重要的系统属性:


<table summary="Important system properties" border="1" cellpadding="2" width="80%" align="center">
<tbody><tr>
<th id="h1">Key</th>
<th id="h2">Meaning</th>
</tr>
<tr>
<td headers="h1"><code>"file.separator"</code></td>
<td headers="h2">Character that separates components of a file path. This is "<code>/</code>" on UNIX and "<code>\</code>" on Windows.<br/>用于分隔文件路径各组成部分的字符。在 UNIX 上是 "<code>/</code>", 在 Windows 上是 "<code>\</code>"。</td>
</tr>
<tr>
<td headers="h1"><code>"java.class.path"</code></td>
<td headers="h2">Path used to find directories and JAR archives containing class files. Elements of the class path are separated by a platform-specific character specified in the <code>path.separator</code> property.<br/>用于查找包含类文件的目录和 JAR 归档的路径。class path 的各元素之间, 用 <code>path.separator</code> 属性指定的平台相关字符分隔。</td>
</tr>
<tr>
<td headers="h1"><code>"java.home"</code></td>
<td headers="h2">Installation directory for Java Runtime Environment (JRE)<br/>Java 运行环境(JRE)的安装目录</td>
</tr>
<tr>
<td headers="h1"><code>"java.vendor"</code></td>
<td headers="h2">JRE vendor name<br/>JRE 供应商名称</td>
</tr>
<tr>
<td headers="h1"><code>"java.vendor.url"</code></td>
<td headers="h2">JRE vendor URL<br/>JRE 供应商的 URL</td>
</tr>
<tr>
<td headers="h1"><code>"java.version"</code></td>
<td headers="h2">JRE version number<br/>JRE 版本号</td>
</tr>
<tr>
<td headers="h1"><code>"line.separator"</code></td>
<td headers="h2">Sequence used by operating system to separate lines in text files<br/>操作系统用于在文本文件中分隔行的字符序列</td>
</tr>
<tr>
<td headers="h1"><code>"os.arch"</code></td>
<td headers="h2">Operating system architecture<br/>操作系统架构</td>
</tr>
<tr>
<td headers="h1"><code>"os.name"</code></td>
<td headers="h2">Operating system name<br/>操作系统名称</td>
</tr>
<tr>
<td headers="h1"><code>"os.version"</code></td>
<td headers="h2">Operating system version<br/>操作系统版本</td>
</tr>
<tr>
<td headers="h1"><code>"path.separator"</code></td>
<td headers="h2">Path separator character used in <code>java.class.path</code><br/><code>java.class.path</code> 中使用的路径分隔符</td>
</tr>
<tr>
<td headers="h1"><code>"user.dir"</code></td>
<td headers="h2">User working directory<br/>用户工作目录</td>
</tr>
<tr>
<td headers="h1"><code>"user.home"</code></td>
<td headers="h2">User home directory<br/>用户主目录</td>
</tr>
<tr>
<td headers="h1"><code>"user.name"</code></td>
<td headers="h2">User account name<br/>用户账号名</td>
</tr>
</tbody></table>


> **Security consideration**: Access to system properties can be restricted by the [Security Manager](https://docs.oracle.com/javase/tutorial/essential/environment/security.html). This is most often an issue in applets, which are prevented from reading some system properties, and from writing any system properties. For more on accessing system properties in applets, refer to [System Properties](https://docs.oracle.com/javase/tutorial/deployment/doingMoreWithRIA/properties.html) in the [Doing More With Java Rich Internet Applications](https://docs.oracle.com/javase/tutorial/deployment/doingMoreWithRIA/index.html) lesson.

> **安全考虑**: 对系统属性的访问可以被[安全管理器(Security Manager)](https://docs.oracle.com/javase/tutorial/essential/environment/security.html)限制。这种情况在 applet 中最常见, applet 被禁止读取某些系统属性, 也被禁止写入任何系统属性。关于在 applet 中访问系统属性的更多内容, 请参阅 [Doing More With Java Rich Internet Applications](https://docs.oracle.com/javase/tutorial/deployment/doingMoreWithRIA/index.html) 一课中的 [System Properties](https://docs.oracle.com/javase/tutorial/deployment/doingMoreWithRIA/properties.html) 一节。


## 读取系统属性(Reading System Properties)

The `System` class has two methods used to read system properties: getProperty and getProperties.

`System` 类有两个用来读取系统属性的方法: getProperty 和 getProperties。

The `System` class has two different versions of getProperty. Both retrieve the value of the property named in the argument list. The simpler of the two getProperty methods takes a single argument, a property key For example, to get the value of path.separator, use the following statement:

`System` 类有两个不同版本的 getProperty。它们都用来获取参数列表中指定的那个属性的值。两个 getProperty 方法中较简单的那个只接收一个参数, 即属性键。例如, 要获取 path.separator 的值, 可以使用下面这条语句:

	System.getProperty("path.separator");

The getProperty method returns a string containing the value of the property. If the property does not exist, this version of getProperty returns null.

getProperty 方法返回一个包含属性值的字符串。如果该属性不存在, 这个版本的 getProperty 会返回 null。

The other version of getProperty requires two String arguments: the first argument is the key to look up and the second argument is a default value to return if the key cannot be found or if it has no value. For example, the following invocation of getProperty looks up the System property called subliminal.message. This is not a valid system property, so instead of returning null, this method returns the default value provided as a second argument: "Buy StayPuft Marshmallows!"

getProperty 的另一个版本需要两个 String 参数: 第一个参数是要查找的键, 第二个参数是在键找不到、或者键没有值时返回的默认值。例如, 下面这次 getProperty 调用会查找名为 subliminal.message 的系统属性。这不是一个合法的系统属性, 所以该方法不会返回 null, 而是返回作为第二个参数提供的默认值: "Buy StayPuft Marshmallows!"

	System.getProperty("subliminal.message", "Buy StayPuft Marshmallows!");

The last method provided by the System class to access property values is the getProperties method, which returns a Properties object. This object contains a complete set of system property definitions.

`System` 类提供的最后一个访问属性值的方法是 getProperties, 它返回一个 `Properties` 对象。该对象包含一整套系统属性定义。

## 写入系统属性(Writing System Properties)

To modify the existing set of system properties, use System.setProperties. This method takes a Properties object that has been initialized to contain the properties to be set. This method replaces the entire set of system properties with the new set represented by the Properties object.

要修改已有的系统属性集合, 请使用 System.setProperties。该方法接收一个 `Properties` 对象, 该对象已初始化好要设置的属性。此方法会用 `Properties` 对象所代表的属性集合, 替换掉整个系统属性集合。

> **Warning**: Changing system properties is potentially dangerous and should be done with discretion. Many system properties are not reread after start-up and are there for informational purposes. Changing some properties may have unexpected side-effects.

> **警告**: 修改系统属性有可能带来危险, 应当谨慎处理。许多系统属性在启动之后就不会再被读取, 它们只是用于提供信息。修改某些属性可能会带来意料之外的副作用。

The next example, [PropertiesTest](https://docs.oracle.com/javase/tutorial/essential/environment/examples/PropertiesTest.java), creates a `Properties` object and initializes it from [myProperties.txt](https://docs.oracle.com/javase/tutorial/essential/environment/examples/myProperties.txt) .

下一个示例 [PropertiesTest](https://docs.oracle.com/javase/tutorial/essential/environment/examples/PropertiesTest.java) 会创建一个 `Properties` 对象, 并从 [myProperties.txt](https://docs.oracle.com/javase/tutorial/essential/environment/examples/myProperties.txt) 初始化它。

	subliminal.message=Buy StayPuft Marshmallows!

PropertiesTest then uses System.setProperties to install the new Properties objects as the current set of system properties.

然后, PropertiesTest 使用 System.setProperties 把这些新的 Properties 对象安装为当前的系统属性集合。


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

注意 PropertiesTest 是如何创建 `Properties` 对象 p 的, 它被用作 setProperties 的参数:

	Properties p = new Properties(System.getProperties());

This statement initializes the new properties object, p, with the current set of system properties, which in the case of this small application, is the set of properties initialized by the runtime system. Then the application loads additional properties into p from the file myProperties.txt and sets the system properties to p. This has the effect of adding the properties listed in myProperties.txt to the set of properties created by the runtime system at startup. Note that an application can create p without any default Properties object, like this:

这条语句用当前的系统属性集合来初始化新的属性对象 p, 对本例这个小应用来说, 也就是运行时系统所初始化出来的那套属性。接着, 应用从文件 myProperties.txt 中加载额外的属性到 p 里, 并把系统属性设置为 p。这样做的效果, 是把 myProperties.txt 中列出的属性添加到运行时系统在启动时创建的那套属性中。注意, 应用也可以不传入任何默认 Properties 对象来创建 p, 像这样:

	Properties p = new Properties();

Also note that the value of system properties can be overwritten! For example, if myProperties.txt contains the following line, the java.vendor system property will be overwritten:

还要注意, 系统属性的值是可以被覆盖的! 例如, 如果 myProperties.txt 包含下面这一行, java.vendor 系统属性就会被覆盖:

	java.vendor=Acme Software Company

In general, be careful not to overwrite system properties.

一般情况下, 注意不要覆盖系统属性。

The setProperties method changes the set of system properties for the current running application. These changes are not persistent. That is, changing the system properties within an application will not affect future invocations of the Java interpreter for this or any other application. The runtime system re-initializes the system properties each time its starts up. If changes to system properties are to be persistent, then the application must write the values to some file before exiting and read them in again upon startup.

setProperties 方法改变的是当前运行应用的系统属性集合。这些修改不会持久保存。也就是说, 在应用内修改系统属性, 不会影响此后启动 Java 解释器运行本应用或任何其他应用。运行时系统每次启动时都会重新初始化系统属性。如果希望系统属性的修改能够持久保留, 应用就必须在退出前把值写入某个文件, 并在启动时重新读入。




原文链接: [System Properties](https://docs.oracle.com/javase/tutorial/essential/environment/sysprop.html)

翻译日期: 2015年09月12日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
