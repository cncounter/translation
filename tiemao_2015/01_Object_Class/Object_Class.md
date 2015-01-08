Object类源码分析
==

Object类是所有类继承层次中的根.

每个类最终的超类(superclass)都是 Object.

所有对象, 包括数组(array),都具有Object类中方法的实现.

类的完全限定名: `java.lang.Object`

基础定义:	`public class Object`

## registerNatives()

类开始的地方,是一个私有的native静态方法:

    private static native void registerNatives();
    static {
        registerNatives();
    }

并且指定了静态块在类被加载后进行注册. 源码对此方法没有注释,根据Java命名规范和约定,猜测是注册本地方法,也就是和JVM进行通信,调用一些钩子函数之类的东西.

## getClass()

然后是实例的 getClass() 方法: 

	public final native Class<?> getClass();

注释信息: 

返回当前对象(this,谁调用就是谁)的运行时类.

返回的 Class 对象就是该对象的类定义中 `static synchronized` 方法的默认锁资源.

实际的返回类型是 `Class<? extends |X|>`, 但在调用 getClass 时 `|X|` 已经被类型擦除了(只存在于编译期检查, Java的运行期没有泛型). 例如,下面的代码中就不需要类型转换:

	Number n = 0;                             
	Class<? extends Number> c = n.getClass();

## hashCode()


返回代表此对象的散列码(hash code)的值.

默认的实现如下:

    public native int hashCode();





## equals()

    public boolean equals(Object obj) {
        return (this == obj);
    }


## clone()

    protected native Object clone() throws 
		CloneNotSupportedException;

## toString()

toString方法的默认实现很简单,可以看到, 就是获取类名,加上 @, 再加上 hashCode()转换为16进制后的表现形式:

    public String toString() {
        return getClass().getName() 
		+ "@" 
		+ Integer.toHexString(hashCode());
    }





## notify()



    public final native void notify();




## notifyAll()



    public final native void notifyAll();



## wait()



    public final native void wait(long timeout) 
		throws InterruptedException;

然后


    public final void wait() throws InterruptedException {
        wait(0);
    }


此外,

    public final void wait(long timeout, int nanos) 
		throws InterruptedException {
        if (timeout < 0) {
            throw new IllegalArgumentException(
				"timeout value is negative");
        }

        if (nanos < 0 || nanos > 999999) {
            throw new IllegalArgumentException(
              "nanosecond timeout value out of range");
        }

        if (nanos >= 500000 
			|| (nanos != 0 && timeout == 0)) {
            timeout++;
        }

        wait(timeout);
    }

## finalize()

    protected void finalize() throws Throwable { }


