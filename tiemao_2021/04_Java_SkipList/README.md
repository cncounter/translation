# 从0开始实现Java跳表


首先是链表的数据结构.


```java
/**
 * 跳表
 */
public class SkipList<E> {
    // 节点
    public static class Node<E> {
        E item;
        Node<E> next;
    }
    // 首节点
    Node<E> first;
}
```
