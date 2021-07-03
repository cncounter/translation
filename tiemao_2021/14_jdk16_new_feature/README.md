# JDK 16 New Features:  Java Runtime


```
// JDK16的空指针异常长这样
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "Object.toString()" because "localObj" is null
	at TestNull.main(TestNull.java:7)


// 代码长这样:
public class TestNull{
  public static void main(String... args){
    Object localObj = "renfufei";
    if("".length() < 10){
      localObj = null;
    }
    System.out.println(localObj.toString());
  }
}

// 执行的命令包括:
jenv versions
jenv local 16
javac -g TestNull.java
java TestNull
```




- <https://github.com/wkorando/sip-of-java>
- <https://wkorando.github.io/sip-of-java/008.html>
