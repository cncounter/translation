## 徒手编写ArrayList


Java的集合类 ArrayList 是从JDK1.2 开始提供的。

实现的几个接口包括:

```java
// ArrayList 基本结构
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable {}
// 列表: List 接口 @since 1.2
public interface List<E> extends Collection<E> { }
// 集合: Collection 接口 @since 1.2
public interface Collection<E> extends Iterable<E> { }
// 可迭代遍历: @since 1.5
public interface Iterable<T> {}
```

先不管他们, 我们从简单到复杂, 一步步来。

### v0.1 初始结构


首先确定包名: `com.cncounter.structure`。

ArrayList, 就是用数组来实现的, 需要使用一个对象数组来保存内部的数据, 代码如下所示:

```java
package com.cncounter.structure;

// 初始数据结构V0.1
public class ArrayList {
    // 内部使用一个数组来保存内容
    private Object[] data;
}
```

既然是对象数组, 那就不支持Java的原生数据类型, 如果需要的话, 也只能使用包装类了。


### v0.2 增加基础属性


List中保存了多少个元素? 我们用一个 size 属性来表示。

```java
    // 列表中的元素个数
    private int size = 0;
```

然后创建一个带初始化方法的构造函数:

```java
// 初始数据结构V0.1
// 增加基础属性V0.2
public class ArrayList<E> {
    // 内部使用一个数组来保存内容
    private Object[] data;
    // 列表中的元素个数
    private int size = 0;

    public ArrayList() {
        this.data = new Object[100];
    }
}
```

为了简单, 这里随意指定了一个初始化容量(initialCapacity)。

这样一个简单的对象就构造出来了。

### v0.3 增加基础方法

List接口指定的方法很多, 我们先从简单的来.

首先是判断是否为空的isEmpty方法, 以及获取元素个数的size方法:

```java
    // 元素个数
    public int size() {
        return size;
    }

    // 是否是空的
    public boolean isEmpty() {
        return 0 == size;
    }
```

最基础的是增加元素的add方法, 以及获取指定索引位置元素的get方法。


```java
    // 增加元素
    public boolean add(E e) {
        this.data[size] = e;
        size++;
        return true;
    }

    // 获取指定索引位置的元素
    public E get(int index) {
        if (index >= size || index < 0) {
            return null;
        }
        return (E) data[index];
    }
```

索引位置也称为下标。 元素加进去之后, 需要有一个判断集合中是否包含指定元素的 contains 方法。

同时我们也实现了获取首次出现的索引位置的 indexOf 方法;


```java
    // 获取首次出现的索引位置; 不存在则返回 -1
    public int indexOf(Object o) {
        for (int i = 0; i < size; i++) {
            if (o == data[i]) {
                return i;
            } else if (null == o || null == data[i]) {
                continue; // 判断 null
            } else if (o.equals(data[i])) {
                return i;
            }
        }
        return -1;
    }

    // 判断列表是否包含此元素
    public boolean contains(Object o) {
        return indexOf(o) >= 0;
    }
```

我们先实现一个简单的 clear 方法:



```java
    // 清空列表
    public void clear() {
        // 依次置空
        for (int i = 0; i < size; i++) {
            data[size] = null;
        }
        // 把长度重置为0
        size = 0;
    }
```

然后还有删除的方法, 移除数组元素的同时, 需要挪动后续的元素.

```java
    // 删除特定索引位置的元素
    public E remove(int index) {
        if (index >= size || index < 0) {
            return null;
        }
        // 暂存这个位置的元素
        E oldValue = (E) data[index];
        // 移除这个位置的元素
        data[index] = null;
        // 挪动后续位置的元素; 也可使用 System.arraycopy
        for (int i = index+1; i < size; i++) {
            data[i - 1] = data[i];
            data[i] = null; // 挪动 = 复制 + 删除
        }
        // size减1
        size--;
        // 返回该索引处之前的元素
        return oldValue;
    }
```


### v0.3.1 简单测试一下

编写测试代码:

```java
import org.junit.Assert;
class TestArrayList {
    public static void main(String[] args) {
        testV03();
    }

    public static void testV03() {
        // 创建列表
        ArrayList<Integer> arrayList = new ArrayList<Integer>();
        // 判断此时为empty
        Assert.assertTrue(arrayList.isEmpty());
        int num = 10;
        for (int i = 0; i < num; i++) {
            // 元素
            Integer item = Integer.valueOf(i);
            boolean addSuccess = arrayList.add(item);
            Assert.assertTrue("add必须成功", addSuccess);
            Assert.assertTrue("size必须等于i+1", arrayList.size() == i + 1);
            Assert.assertTrue("get必须等于item", item.equals(arrayList.get(i)));
            Assert.assertTrue("indexOf必须等于i", arrayList.indexOf(item) == i);
            Assert.assertTrue("contains必须返回true", arrayList.contains(item));
        }
        // 添加一个元素
        Integer toAdd = Integer.valueOf(num);
        arrayList.add(toAdd);
        // 删除最后1个元素
        Integer beRemoved = arrayList.remove(arrayList.size() - 1);
        Assert.assertTrue(toAdd.equals(beRemoved));

        // 清空
        arrayList.clear();
        // 判断此时为empty
        Assert.assertTrue(arrayList.isEmpty());
    }
}
```

执行, 没有报错, 通过校验。



### v0.4 初始容量与自动扩容



### v0.5 实现迭代器



### v0.6 实现List接口



### v0.7 抽取公共方法



### v0.8 适当进行性能优化



### v0.9 与标准库的ArrayList比对


### v1.0 初步可用版本





### 简单总结
