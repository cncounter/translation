# Java中的finally与return示例


Java中, try-finally 语句块的基本语法如下:

```
try{
  // ... 某些逻辑
} finally{
  // ... 执行某些操作
}
```

当然, try 语句块后面, 还可以有多个catch块。例如:

```
try{
  // ... 某些逻辑
} catch(RuntimeException e){
  // ... 处理异常信息
} catch(Exception ex){
  // ... 多个 catch 语句的顺序得遵循 Exception 的继承级别
} finally{
  // ... 执行某些操作
}
```

只要执行到 try 语句块中, finally 语句块总是会被执行。 分为几种情况:

- try 执行时不抛出异常, 则执行顺序为 try-finally;
- try 执行时抛出异常, 则执行顺序为 try-catch-finally;
- finally 执行时抛出异常, 则finally只执行到抛异常的地方;
- 嵌套的 try-catch-finally 规则一致;
- 如果 try 执行时调用了 `System.exit()`, 则JVM直接退出, 不会执行finally。

具体的执行顺序, 可以采用暴力调试(即控制台输出信息), 很方便得出结果。


容易造成困扰的是其中某个块包含 return 语句。

可以这样理解, return 语句只是将某个值写入某个地方, 该执行的逻辑还得执行。

> 确切讲是将返回值存放到操作数栈里面。 请参考Java虚拟机规范中的栈帧部分(Frame).


看示例代码1:

```
public class TestTryReturn {
    public static void main(String[] args) {
        // 结果是 0
        System.out.println("testTryReturn():" + 
	    testTryReturn());
    }
    public static int testTryReturn() {
        int temp = 0;
        try {
            return temp; // 将 temp 的值写入存放返回值的地方
        } finally {
            temp = 66;
            System.out.println("finally-temp:" + temp);
        }
    }
}
```

执行结果为:

```
finally-temp:66
testTryReturn():0
```

这里在 try 语句之中存在 return 语句,  注释部分已经做了说明, 即 return 语句只是将 temp 的值写入存放返回值的地方。 

finally语句块中,并没有再去修改存返回值的内存。虽然修改了局部变量 temp 的值, 但没有再将 temp 写入到返回值不是么!


再来看示例代码2:

```
public class TestFinallyReturn {
    public static void main(String[] args) {
        // 结果是 66
        System.out.println("testFinallyReturn():" + 
	    testFinallyReturn());
    }
    public static int testFinallyReturn() {
        int temp = 0;
        try {
            return temp; // 将 temp 的值写入存放返回值的地方
        } finally {
            temp = 66;
            System.out.println("finally-temp:" + temp);
            return temp; // 将 temp 的值写入存放返回值的地方
        }
    }
}
```

执行结果为:

```
finally-temp:66
testFinallyReturn():66
```

对比示例1, 这里的 finally 语句中存在 return 语句。 相当于执行顺序为:

```
temp 初始化赋值为0;
try 中将temp的值(0)写入存放返回值的地方;
finally 中将temp赋值为66; 并打印输出;
finally 中将temp的值(66)写入存放返回值的地方;
```

很明显, finally中的return语句, 将返回值覆盖了。

那么再来看看 catch和finally中都存在return语句的情况。

示例代码3:

```
public class TestCatchFinallyReturn {

    public static void main(String[] args) {
        // 结果是
        System.out.println("testCatchFinallyReturn():" + 
	    testCatchFinallyReturn());
    }

    public static int testCatchFinallyReturn() {
        int temp = 0;
        try {
            if("".length() < 10){
                throw new RuntimeException("测试代码抛出的运行时异常");
            }
            return temp; // 很明显这里不会被执行
        } catch (RuntimeException e){
            // ... TODO: 处理异常
            temp = 88;
            System.out.println("catch-RuntimeException-temp:" + temp);
            return temp;
        } catch (Exception e){
            // ... TODO: 处理其他异常
            temp = 99;
            System.out.println("catch-Exception-temp:" + temp);
            return temp;
        } finally {
            temp = 66;
            System.out.println("finally-temp:" + temp);
            return temp; // 将 temp 的值写入存放返回值的地方
        }
    }
}
```

执行结果为:

```
catch-RuntimeException-temp:88
finally-temp:66
testCatchFinallyReturn():66
```

示例3和示例2的解释类似。

那么, 如果不 catch 异常呢? 请看示例4:

```
public class TestNoCatchFinallyReturn {

    public static void main(String[] args) {
        // 结果是
        System.out.println("testNoCatchFinallyReturn():" + 
	    testNoCatchFinallyReturn());
    }

    public static int testNoCatchFinallyReturn() {
        int temp = 0;
        try {
            if ("".length() < 10) {
                throw new RuntimeException("测试代码抛出的运行时异常");
            }
            return temp; // 很明显这里不会被执行
        } finally {
            temp = 66;
            System.out.println("finally-temp:" + temp);
            return temp; // 将 temp 的值写入存放返回值的地方
        }
    }
}
```

这次执行结果比较诡异:

```
finally-temp:66
testNoCatchFinallyReturn():66
```

异常被 finally语句中的 return 语句给覆盖了. 详细信息请参考Java虚拟机规范, 在本文末尾给出了链接。

如果把finally语句中的return给注释, 请看示例5:


```
public class TestNoCatchFinally {

    public static void main(String[] args) {
        // 结果是
        System.out.println("testNoCatchFinally():" + 
	    testNoCatchFinally());
    }

    public static int testNoCatchFinally() {
        int temp = 0;
        try {
            if ("".length() < 10) {
                throw new RuntimeException("测试代码抛出的运行时异常");
            }
            return temp; // 很明显这里不会被执行
        } finally {
            temp = 66;
            System.out.println("finally-temp:" + temp);
            // return temp; // 这里注释了 return 语句
        }
    }
}
```

结果符合正常的预期。

```
finally-temp:66
Exception in thread "main" 
java.lang.RuntimeException: 测试代码抛出的运行时异常
```

如果在 try 或者 catch 语句中退出JVM呢?

```
public class TestExitFinally {
    public static void main(String[] args) {
        // 结果是
        System.out.println("testNoCatchFinally():" + 
	    testNoCatchFinally());
    }
    public static int testNoCatchFinally() {
        int temp = 0;
        try {
            if ("".length() < 10) {
                throw new RuntimeException("测试代码抛出的运行时异常");
            }
            return temp; // 很明显这里不会被执行
        } catch (Exception e){
            temp = 99;
            System.out.println("catch-Exception-temp:" + temp);
            System.exit(0); // 注意这里直接让虚拟机退出
            return temp;
        } finally {
            temp = 66;
            System.out.println("finally-temp:" + temp);
            // return temp; // 将 temp 的值写入存放返回值的地方
        }
    }
}
```

控制台输出的执行结果为:

```
catch-Exception-temp:99
```

符合预期, `System.exit(0);` 让JVM直接退出, 不管之后的执行逻辑。


综合来看, throw 和 return 在语法层面上是同等级别的。

return 是方法执行正常返回, throw 是方法执行异常返回。

更多信息, 请参考:


Oracle官方文档,finally语句块的教程: <https://docs.oracle.com/javase/tutorial/essential/exceptions/finally.html>

Java虚拟机规范: <https://docs.oracle.com/javase/specs/jvms/se8/html/>


作者: 铁锚 <https://blog.csdn.net/renfufei>

日期: 2018年9月12日
