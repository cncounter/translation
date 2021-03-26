# 从0开始实现Java跳表



我们先写, 如果有不清楚的, 可以去参考 LinkedList 的实现。


## 1. 基础数据结构

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


## 2. 增加add方法

然后增加方法:

```

/**
 * 跳表
 */
public class SkipList<E> {
    // 节点
    public static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;

        public Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }

    // 首节点
    Node<E> first;

    // 添加元素
    public boolean add(E e) {
        // 加到末尾
        addLast(e);
        return true;
    }

    // 加到末尾
    public void addLast(E e) {
        // 如果一个节点都没有
        if (null == first) {
            first = new Node<E>(null, e, null);
            return;
        }
        // 取得最后一个节点
        Node<E> last = getLastNode();
        Node<E> newNode = new Node<E>(last, e, null);
        // 关联上
        if (null != last) {
            last.next = newNode;
        }
    }

    private Node<E> getLastNode() {
        Node<E> cursor = first;
        // 只要 next 不为null, 则一直遍历
        while (null != cursor && null != cursor.next) {
            cursor = cursor.next;
        }
        return cursor;
    }

}
```

写个main方法来测试一下:

```java

class TestSkipList {
    public static void main(String[] args) {
        SkipList<Integer> numberList = new SkipList<Integer>();
        int num = 10;
        for (int i = 0; i < num; i++) {
            numberList.add(i);
        }
        SkipList.Node<Integer> cursor = numberList.first;
        while (null != cursor && null != cursor.next) {
            cursor = cursor.next;
            System.out.println("Node.value=" + cursor.item);
        }
    }
}
```

输出的内容为:

```java
Node.value=1
Node.value=2
Node.value=3
Node.value=4
Node.value=5
Node.value=6
Node.value=7
Node.value=8
Node.value=9
```

然后接着写。
