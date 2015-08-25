# 如何禁止某些代码调用 `System.exit()`


### 说明

`System.exit()` 的本质是通知 JVM 关闭。

一般来说，有两种禁用 `System.exit()` 的办法：

- 安全管理器
- 安全策略

本质都是JRE 提供的本地实现，在执行之前进行权限判断。

因为`System.exit()` 是一种很暴力的手段，如果在 Client 模式下自己写个小程序无所谓,但是在 Server 上多个程序、或者多线程时就会有很大的麻烦。


### 示例

使用安全管理器的实现代码如下所示:

1.定义异常类, 继承自 `SecurityException`

>  ExitException.java

	package com.cncounter.security;
	
	public class ExitException extends SecurityException {
		private static final long serialVersionUID = 1L;
		public final int status;
	
		public ExitException(int status) {
			super("忽略 Exit方法调用!");
			this.status = status;
		}
	}

2.定义安全管理器类, 继承自 `SecurityManager`

> NoExitSecurityManager.java

	package com.cncounter.security;
	
	import java.security.Permission;
	
	public class NoExitSecurityManager extends SecurityManager {
		@Override
		public void checkPermission(Permission perm) {
			// allow anything.
		}
	
		@Override
		public void checkPermission(Permission perm, Object context) {
			// allow anything.
		}
	
		@Override
		public void checkExit(int status) {
			super.checkExit(status);
			throw new ExitException(status);
		}
	}

其中直接拒绝系统退出。

3.增加一个辅助和测试类，实际使用时你也可以自己进行控制。

> NoExitHelper.java

	package com.cncounter.security;
	
	public class NoExitHelper {
	
		/**
		 * 设置不允许调用 System.exit(status)
		 * 
		 * @throws Exception
		 */
		public static void setNoExit() throws Exception {
			System.setSecurityManager(new NoExitSecurityManager());
		}
	
		public static void main(String[] args) throws Exception {
			setNoExit();
			testNoExit();
			testExit();
			testNoExit();
		}
	
		public static void testNoExit() throws Exception {
			System.out.println("Printing works");
		}
	
		public static void testExit() throws Exception {
			try {
				System.exit(42);
			} catch (ExitException e) {
				//
				System.out.println("退出的状态码为: " + e.status);
			}
		}
	}

在其中，使用了一个 main 方法来做简单的测试。 控制台输出结果如下:

	Printing works
	退出的状态码为: 42
	Printing works




### 参考文章:

- [Java: 如何单元测试那种会调用 System.exit() 的方法?](http://stackoverflow.com/questions/309396/java-how-to-test-methods-that-call-system-exit)

- [Java中如何禁止 API 调用  System.exit() ](http://stackoverflow.com/questions/5401281/preventing-system-exit-from-api)

- [如何配置 Tomcat 的安全管理器](https://tomcat.apache.org/tomcat-7.0-doc/security-manager-howto.html)



日期: 2015年08月25日

人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

