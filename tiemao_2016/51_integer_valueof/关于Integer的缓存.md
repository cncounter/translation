# 关于 Integer 的缓存

首先, java 的 == 是比较的内存地址。



源代码如下:

> TestEquals.java


```
public class TestEquals {

    // equals 方法不用测试; Integer 类进行了取值判断
    public static void main(String[] args){
        //
        Integer n1 = 268; // 编译为 Integer.valueOf(268);
        Integer n2 = 268; // 编译为 Integer.valueOf(268);
        boolean equalN1N2 =  (n1 == n2);
        System.out.println("equalN1N2="+equalN1N2); // false
        //
        Integer num1 = new Integer(268); // 新分配的对象
        Integer num2 = new Integer(268); // 新分配的对象
        boolean equalNums12 =  (num1 == num2);
        System.out.println("equalNums12="+equalNums12); // false
        //
        Integer n3 = 66; // 编译为 Integer.valueOf(66);
        Integer n4 = 66; // 编译为 Integer.valueOf(66);
        boolean equalN3N4 =  (n3 == n4);
        System.out.println("equalN3N4="+equalN3N4); // true
        //
        Integer num3 = new Integer(66); // 新分配的对象
        Integer num4 = new Integer(66); // 新分配的对象
        boolean equalNums34 =  (num3 == num4);
        System.out.println("equalNums34="+equalNums34); // false
    }
}
```


反编译后的内容:

> TestEquals.class


```
import java.io.PrintStream;

public class TestEquals
{
  public static void main(String[] args)
  {
    Integer n1 = Integer.valueOf(268);
    Integer n2 = Integer.valueOf(268);
    boolean equalN1N2 = n1 == n2;
    System.out.println("equalN1N2=" + equalN1N2);

    Integer num1 = new Integer(268);
    Integer num2 = new Integer(268);
    boolean equalNums12 = num1 == num2;
    System.out.println("equalNums12=" + equalNums12);

    Integer n3 = Integer.valueOf(66);
    Integer n4 = Integer.valueOf(66);
    boolean equalN3N4 = n3 == n4;
    System.out.println("equalN3N4=" + equalN3N4);

    Integer num3 = new Integer(66);
    Integer num4 = new Integer(66);
    boolean equalNums34 = num3 == num4;
    System.out.println("equalNums34=" + equalNums34);
  }
}
```

解释如下:

Integer类的静态方法

> Integer.class

```
    public static Integer valueOf(int i) {
        if (i >= IntegerCache.low && i <= IntegerCache.high)
            return IntegerCache.cache[i + (-IntegerCache.low)];
        return new Integer(i);
    }
```

可以看到, 如果在某个范围内,调用 valueOf() 时返回的是 cache 对象


> Integer.class

```
    private static class IntegerCache {
        static final int low = -128;
        static final int high;
        static {
            // ...
            int h = 127;
            // ... 可以配置,但一般使用默认
            // sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
            // ...
            high = h;
        }
        // ...
    }
```

类似的,还有 

- Long.LongCache
- Short.ShortCache
- Byte.ByteCache

但 Double 和 Float 的 `valueOf` 方法是直接 new 一个新对象。

> **结论:**
>
> jd-gui 反编译工具很重要, 是Java开发者的必备工具。
>
> 关于语法的大部分迷惑, 都可以通过比对反编译后的代码得到解释。
>
> 下载地址/或者自己搜索: [https://github.com/java-decompiler/jd-gui/releases](https://github.com/java-decompiler/jd-gui/releases)

