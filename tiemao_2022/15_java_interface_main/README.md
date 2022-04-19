# Java基础面试题：main方法可以写在interface中吗？


Java语言规范中约定, `main` 方法必须声明为 `public`, `static`, `void`。 而且必须指定一个类型为 `String` 数组的形参（[§8.4.1](https://docs.oracle.com/javase/specs/jls/se11/html/jls-8.html#jls-8.4.1)）。

所以 main 方法可以有这些形式:


```java
public static void main(String[] args)
public static void main(String []args)
public static void main(String... args)
public static void main(String... aaa)
```

那么, 可以衍生出这些问题, JVM启动时指定的启动类:

- main 方法可以写在interface中吗?
- main 方法可以写在abstract类中吗?
- main 方法可以写在package级别访问权限的类中吗?
- main 方法可以写在private类中吗?
- main 方法可以写在static类中吗?


示例代码:

```java

interface TestMain {

    public static void main(String[] args) {
        System.out.println("Test interface main");
    }
}
```

在JDK8及以上平台可以正常执行。

知识点:

- JDK8引入了新的语言特性, interface中可以声明并实现 static 方法以及 default 方法;
