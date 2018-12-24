# Java异常简介

![](exception_hierarchy.jpg#pic_center)

> 图片来自: 图说Java异常层次结构: <https://blog.csdn.net/renfufei/article/details/16344847>



首先说方法, 方法也叫函数, 就是由一些语句组成的代码块。

在面向过程的语言中叫函数, 在面向对象的编程语言中称为方法。本质上是一回事。

方法就是一种封装, 将一堆相关的逻辑组合在一起, 类似于打包, 主要目的是为了重用, 也为了可读性。 要知道代码主要是程序员写的, 稍微大一点的系统/项目, 就是一项软件工程, 可读性和可维护性都非常重要。 也许有人要出来锤了, 说这个不是面向对象中的封装。。。

方法有几个要素: 方法名, 参数(也叫形参, 参数的格式), 方法体(业务逻辑), 以及返回值。

我们就说这个返回值, 返回值的类型可以是任意类型, 比如 `int`, `void`, `Integer` 或者自定义的对象类型等等。

基本示例:

```
public class BaseDemo {
    public static int sum(int num1, int num2) {
        return num1 + num2;
    }

    public static void main(String[] args) {
        int cnt1 = 1;
        int cnt2 = 2;
        int total = BaseDemo.sum(cnt1, cnt2);
        System.out.println("total=" + total);
    }
}
```

程序很简单,运行结果也很简单。控制台输出的内容为:

```
total=3
```

假设在某些需求下, 需要使用包装类。

代码变为:

```
public class IntegerDemo1 {
    public static Integer sum(Integer num1, Integer num2) {
        return num1 + num2;
    }

    public static void main(String[] args) {
        Integer cnt1 = 1;
        Integer cnt2 = 2;
        Integer total = IntegerDemo1.sum(cnt1, cnt2);
        System.out.println("total=" + total);
    }
}
```

运行结果还是一样的:

```
total=3
```

然后, 假设调用时传递的参数稍微变化, 有了个 null 值:

```
public class IntegerDemo2 {
    public static Integer sum(Integer num1, Integer num2) {
        return num1 + num2;
    }

    public static void main(String[] args) {
        Integer cnt1 = 1;
        Integer cnt2 = null;
        Integer total = IntegerDemo2.sum(cnt1, cnt2);
        System.out.println("total=" + total);
    }
}
```

运行程序, 结果是抛出空指针异常(`NullPointerException`):

```
Exception in thread "main" java.lang.NullPointerException
	at IntegerDemo2.sum(IntegerDemo2.java:8)
	at IntegerDemo2.main(IntegerDemo2.java:14)

```

为什么呢?

我们通过 jd-gui 来看.class文件反编译后的代码:

```
// jd-gui-反编译
import java.io.PrintStream;

public class IntegerDemo2
{
  public static Integer sum(Integer num1, Integer num2)
  {
    return Integer.valueOf(num1.intValue() + num2.intValue());
  }

  public static void main(String[] args) {
    Integer cnt1 = Integer.valueOf(1);
    Integer cnt2 = null;
    Integer total = sum(cnt1, cnt2);
    System.out.println("total=" + total);
  }
}
```

反编译后的代码, 和源代码是等价的, 只是某些语法糖被编译器转换了。

可以看到:

- int转Integer, 使用了 `Integer.valueOf(1)` 这种形式;
- Integer转int, 使用了 `num2.intValue()` 这种形式;

那么如果`num2`为`null`,根据Java的规则, 执行时会抛出空指针异常。

从上面的异常层次结构图中, 可以看到, 空指针异常(`NullPointerException`)属于运行时异常(`RuntimeException`); 

一个异常类, 继承了 `RuntimeException`, 那么这种异常就属于运行时异常, 也叫不受检查的异常(Unchecked Exceptions)。

一个异常类(往上追朔,继承自 `Exception` 的才叫异常类), 如果没有继承 `RuntimeException`, 那么就属于一般异常, 也叫受检查的异常(Checked Exceptions)。

谁来检查? 一般是编译器, 比如著名的 `javac`, 当然, 也可能是 Idea 或者 Eclipse 先执行检查;

编译器会对代码进行语法分析, 对 Checked Exceptions 进行检查, 如果不符合规范, 那就拒绝编译, 并给出错误信息。

详细的说明, 请参考 `RuntimeException` 和 `Exception` 类的源代码。

> unchecked exceptions, 指 `RuntimeException` 及其子/孙类; 以及 `Error`
>
> checked exceptions, `Exception`及其子/孙类, 但不属于`RuntimeException`体系的异常;

也可以参考Java语言规范中的 Chapter 11. Exceptions: <https://docs.oracle.com/javase/specs/jls/se8/html/jls-11.html>

> The `unchecked exception` classes are the `run-time exception` classes and the `error` classes.

继续看示例:

























