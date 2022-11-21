## 简单算法


基本算法主要包括:

- 排序算法
- 查找算法

### 1. 插入排序

[维基百科](https://zh.wikipedia.org/wiki/%E6%8F%92%E5%85%A5%E6%8E%92%E5%BA%8F) 的说明如下:

> 插入排序（英语：Insertion Sort）是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。插入排序在实现上，通常采用in-place排序（即只需用到 `O(1)` 的额外空间的排序），因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间。
> 
> Insertion Sort 和打扑克牌时，从牌桌上逐一拿起扑克牌，在手上排序的过程相同。

一般来说，插入排序都采用in-place在数组上实现。

比如对于已存在的数组, 我们可以这样实现:

- 1、从第一个元素开始，该元素可以认为已经被排序；
- 2、取出下一个元素，在已经排序的元素序列中从后向前扫描
- 3、如果该元素（已排序）大于新元素，将该元素移到下一位置
- 4、重复步骤3，直到找到已排序的元素小于或者等于新元素的位置
- 5、将新元素插入到该位置后
- 6、重复步骤2~5


如果是将新元素加入数组:

- 7、将新元素置于数组末尾, 
- 8、将新元素与前一个元素比较。
- 9、如果前面的元素更大，则交换位置;
- 10、直到前面的元素小于或者等于新元素。


在插入排序算法中, 可以将源数组看做是2个逻辑上的视图(数组):

- 已排序部分
- 未排序部分

插入的意思, 是依次将未排序部分的元素, 插入到已排序部分的适当位置。




Java代码示例如下:


```java
package demo.algorithm;

import java.util.Arrays;
import java.util.Random;
import java.util.concurrent.atomic.AtomicBoolean;

// 插入排序算法
// 原则上尽量避免中间变量: 但在Java中, 栈内存和堆内存是2块不同的空间
// !!!不能创建新数组;
public class InsertionSort {
    // 排序: 默认使用升序
    public static void sort(int[] array) {
        // 防御式编程: 判空
        if (null == array) {
            return;
        }
        // 数组只有0个或者1个元素: 不需要排序
        if (array.length <= 1) {
            return;
        }
        // 从下标1开始遍历, 外层遍历: 从前往后
        for (int i = 1; i < array.length; i++) {
            // 当前索引位置: 初始为 i
            int curIndex = i;
            // 依次和前面的元素比较
            while (array[curIndex] < array[curIndex - 1]) {
                // 交换元素
                swap(array, curIndex, curIndex - 1);
                // 内层循环: 从后往前
                curIndex--;
                if (curIndex <= 0) {
                    // 内层循环的第2种退出条件;
                    // 第1种退出条件是while自带的判断条件
                    break;
                }
            } // end of while
        } // end of for
    }

    // 交换元素
    private static void swap(int[] array, int sourceIndex, int targetIndex) {
        //log("swap: 入口: ", "sourceIndex=" + sourceIndex, ";targetIndex=" + targetIndex, ";");
        //log("swap: 交换前: ", Arrays.toString(array));
        int tempValue = array[targetIndex];
        array[targetIndex] = array[sourceIndex];
        array[sourceIndex] = tempValue;
        //log("swap: 交换后: ", Arrays.toString(array));
    }

    // 测试: main方法
    public static void main(String[] args) {
        // 生成随机数组
        int[] array = randomArray(10);
        // 日志输出数组内容
        log("main: 排序前: ", Arrays.toString(array));
        // 排序
        sort(array);
        // 日志输出数组内容
        log("main: 排序后: ", Arrays.toString(array));
        // 检查是否符合升序
        // checkAsc(array);
    }

    // 是否开启日志;
    private static AtomicBoolean logOpenFlag = new AtomicBoolean(true);
    // 输出日志
    private static void log(String... str) {
        if (!logOpenFlag.get()) {
            return;
        }
        if (null == str) {
            return;
        }
        for (String s : str) {
            System.out.print(s);
        }
        System.out.println();
    }

    // 生成随机数组
    private static int[] randomArray(int length) {
        int[] array = new int[length];
        // 随机数; 此处没有指定种子
        Random random = new Random();
        for (int i = 0; i < array.length; i++) {
            // 范围: [0, bound)
            array[i] = random.nextInt(length * 2);
        }

        return array;
    }

}

```

某次执行的结果日志如下:

```
main: 排序前: [12, 16, 16, 0, 14, 10, 13, 17, 2, 17]
main: 排序后: [0, 2, 10, 12, 13, 14, 16, 16, 17, 17]
```

代码编写过程中, 如果有不确定的地方, 可以进行调试:

- 1. 增加日志来帮助我们理解过程, 这也称为暴力调试。
- 2. 使用断点调试、或者条件断点。


