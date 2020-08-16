# 数据结构与集合

数据结构与算法是编程人员必须掌握的技能。

## 对象与封装

一个对象，可以认为是一组数据。 例如:

```json
{
  "id": "tiemao",
  "name" : "铁锚",
  "url" : "https://renfufei.blog.csdn.net/"
}
```

当然，在面向对象程序设计时，一般将数据与对应的操作封装在一起，以保证“区域自治”，最终各种对象就能有序地结合在一起。


## 数组

数组是最简单也最常见的数据结构。

例如以下代码返回一个简单的 int 数组:

```java
public static int[] demoArray(int len) {
    int[] demoArray = new int[len];
    for (int i = 0; i < demoArray.length; i++) {
        demoArray[i] = i * 11;
    }
    System.out.println(demoArray); // [I@1d057a39
    System.out.println(demoArray.getClass()); // class [I
    return demoArray;
}
```

从中可以发现, 数组是一种特殊的对象类型。 `[I` 就是 `int[]` 对应的类名称。

如果元素类型换一个呢?

```java
public static Integer[] demoIntegerArray(int len) {
    Integer[] demoArray = new Integer[len];
    for (int i = 0; i < demoArray.length; i++) {
        demoArray[i] = i * 11;
    }
    // [Ljava.lang.Integer;@26be92ad
    System.out.println(demoArray);
    // class [Ljava.lang.Integer;
    System.out.println(demoArray.getClass());
    return demoArray;
}
```

虽然 `Object` 是所有对象类型的超类, 但数组类型并不能强转?

```java
private void testCast(Integer[] demoIntegerArray) {
    Object[] objArray = (Object[])demoIntegerArray;
    // class [Ljava.lang.Integer;
    System.out.println(objArray.getClass());
    // [Ljava.lang.Integer;@26be92ad
    System.out.println(objArray);
}
```


## List

List就是列表，和Array很相似，但封装了一些更容易使用的操作。

```java

```




new ArrayList();
Arrays.asList();
Collections.emptyList();


## Map



红黑树


## Set

## Optional

## Supplier

## Stream

## Comparator

## Collectors

## CollectionUtils

## StringUtils

## Objects




## Guava
