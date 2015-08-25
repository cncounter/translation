# 如何禁止某些代码调用 `System.exit()`


### 说明

`System.exit()` 的本质是通知 JVM 关闭。

一般来说，有两种禁用 `System.exit()` 的办法：

- 安全管理器
- 安全策略

本质都是JRE 提供的本地实现，在执行之前进行权限判断。

因为`System.exit()` 是一种很暴力的手段，如果在 Client 模式下自己写个小程序无所谓,但是在 Server 上多个程序、或者多线程时就会有很大的麻烦。


### 底层源码



1.先来看看静态方法 `System.exit()` 的源码:

    // System.exit()
    public static void exit(int status) {
        Runtime.getRuntime().exit(status);
    }

应该说很简单, 只是简单地调用运行时的 exit 方法.

2.然后我们看运行时的实例方法 `exit`:

    // Runtime.exit()
    public void exit(int status) {
        SecurityManager security = System.getSecurityManager();
        if (security != null) {
            security.checkExit(status);
        }
        Shutdown.exit(status);
    }

如果有安全管理器，那么就让安全管理器执行 `checkExit`退出权限检查。

如果检查不通过，安全管理器就会抛出异常(这就是约定！)。 

然后当前线程就会往外一路抛异常，如果不捕获，那么该线程就会退出。

此时如果没有其他的前台线程正在运行，那么JVM也会跟着退出。

3.`Shutdown` 是 **java.lang** 包下面的一个类。

访问权限是 default, 所以我们在API中是不能调用的。


    // Shutdown.exit()
    static void exit(int status) {
        boolean runMoreFinalizers = false;
        synchronized (lock) {
            if (status != 0) runFinalizersOnExit = false;
            switch (state) {
            case RUNNING:       /* Initiate shutdown */
                state = HOOKS;
                break;
            case HOOKS:         /* Stall and halt */
                break;
            case FINALIZERS:
                if (status != 0) {
                    /* Halt immediately on nonzero status */
                    halt(status);
                } else {
                    /* Compatibility with old behavior:
                     * Run more finalizers and then halt
                     */
                    runMoreFinalizers = runFinalizersOnExit;
                }
                break;
            }
        }
        if (runMoreFinalizers) {
            runAllFinalizers();
            halt(status);
        }
        synchronized (Shutdown.class) {
            /* Synchronize on the class object, causing any other thread
             * that attempts to initiate shutdown to stall indefinitely
             */
            sequence();
            halt(status);
        }
    }



其中有一些同步方法进行锁定。 退出逻辑是调用了 `halt` 方法。



    // Shutdown.halt()
    static void halt(int status) {
        synchronized (haltLock) {
            halt0(status);
        }
    }

    static native void halt0(int status);

然后就是调用 native 的 `halt0()` 方法让 JVM "**自杀**"了。

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

### 原问题

原来的问题如下:

> I've got a few methods that should call System.exit() on certain inputs. Unfortunately, testing these cases causes JUnit to terminate! Putting the method calls in a new Thread doesn't seem to help, since System.exit() terminates the JVM, not just the current thread. Are there any common patterns for dealing with this? For example, can I subsitute a stub for System.exit()?

大意是:

> 有一些方法需要测试, 但是在某些特定的输入时就会调用 `System.exit()`。这就杯具了,这时候 JUnit 测试也跟着退出了! 用一个新线程来调用这种方法也没什么用, 因为 `System.exit()` 会停止JVM , 而不是退出当前线程。有什么通用的模式来处理这种情况吗? 例如,我能替换掉 `System.exit()` 方法吗?



建议如下:

> Instead of terminating with System.exit(whateverValue), why not throw an unchecked exception? In normal use it will drift all the way out to the JVM's last-ditch catcher and shut your script down (unless you decide to catch it somewhere along the way, which might be useful someday).

> In the JUnit scenario it will be caught by the JUnit framework, which will report that such-and-such test failed and move smoothly along to the next.

翻译如下:

> 在程序中调用 `System.exit(whateverValue)` 是一种很不好的编程习惯, 这种情况为什么不抛出一个未检测的异常(unchecked exception)呢? 如果程序中不进行捕获(catch), 抛出的异常会一路漂移到 JVM , 然后就会退出程序(只有主线程的话)。

> 在 JUnit 的测试场景中异常会被 JUnit 框架捕获, 然后就会报告说某某某测试执行失败,然后就继续下一个单元测试了。


当然,给出的解决方案就是前面的那段代码. 你还可以阅读下面的参考文章，查找其他的解决方案。


### 参考文章:

- [Java: 如何单元测试那种会调用 System.exit() 的方法?](http://stackoverflow.com/questions/309396/java-how-to-test-methods-that-call-system-exit)

- [Java中如何禁止 API 调用  System.exit() ](http://stackoverflow.com/questions/5401281/preventing-system-exit-from-api)

- [如何配置 Tomcat 的安全管理器](https://tomcat.apache.org/tomcat-7.0-doc/security-manager-howto.html)



日期: 2015年08月25日

人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)

