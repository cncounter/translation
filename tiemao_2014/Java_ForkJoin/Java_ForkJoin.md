# Java框架ForkJoin入门简介



## 1. 简介

这些笔记面向初次接触并行编程的学生, 介绍 Java ForkJoin 框架(JSR-166)最基础的内容。 这些材料仅够用于编写基本的并行 map 和 reduce 操作, 供教学之用。 重点放在上手所需的少数几个类和方法上。 另有单独的讲义和一个编程项目, 更详细地讲解这个库的优势、如何使用它来编程、渐进复杂度保证等内容。

我们关注的是如何使用 Java 的这个库, 而不是它内部是如何实现的。 其他环境也有类似的工具, 例如 Cilk、面向 C/C++ 的 Intel Thread Building Blocks(TBB), 以及 C# 的任务并行库(Task Parallel Library)。

我们先说明需要哪个 Java 版本, 然后介绍手动编写基本的分治并行算法所需的 3、4 个类, 接着给出一个完整可运行的程序作为模板, 再提一下可能踩到的几个坑, 最后讨论测量计算耗时的最佳实践, 以及为什么串行版本有时看起来反而更快。

## 2. Java版本

这里不介绍如何判断你正在使用哪个 Java 版本, 但那显然是一个重要的考量。 你可能已经装了 Java 8(或更高版本), 那样的话就无需再做任何准备。

Java 8(或更高):

ForkJoin 框架是 Java 8 标准库的一部分, 本文后续大部分内容都假设你使用的是(任意版本的)Java 8。 如果不是, 请继续往下看。

Java 7:

ForkJoin 框架是 Java 7 标准库的一部分, 但 `ForkJoinPool` 类没有我们推荐使用的 `commonPool` 方法, 所以你需要像下文“快速上手”中描述的那样, 自己创建一个 `ForkJoinPool` 对象。

Java 6:

如果出于某些原因必须使用 Java 6, 你仍然可以使用 ForkJoin 框架, 但必须显式下载它, 并使用一些奇怪的参数, 具体细节见下文。

你需要一份 `jsr166.jar`。 新版本会不定期发布, 地址是 http://gee.cs.oswego.edu/dl/jsr166/dist/jsr166.jar 。 要创建一个使用该库的 Eclipse 项目, 可以按顺序执行下面的步骤。 其中某些步骤有替代做法(例如, 你可以把 `.jar` 文件放到别的目录), 但下面的做法应该可行。

1. 在 Eclipse 之外新建一个目录(文件夹), 把 `jsr166.jar` 和其他相关的 Java 代码放进去。 确保文件名就是 `jsr166.jar`, 如果浏览器在下载时莫名其妙改了名字, 就手动改回来。
2. 在 Eclipse 中新建一个 Java 项目。 选择 "Create project from existing source", 并选中上一步创建的目录。
3. 在该项目中, 从菜单选择 Project → Properties。 在 "Java Compiler" 下勾选 "Enable project specific settings", 并确保版本选择 Java 1.6(更早的版本无法工作)。
4. 在左侧包浏览器的文件列表中, 右键点击 `jsr166.jar`, 选择 "Add to Build Path"。
5. 为你的项目新建一个类。 定义一个可以运行的 `main` 方法。
6. 在 Run → Configurations 下新建一个配置。 在 Arguments 中, 上面照常填写程序参数。 但下面的 "VM arguments" 里你需要填写: `-Xbootclasspath/p:jsr166.jar`, 一字不差。

如果你改为从命令行运行 `javac` 和 `java`, 那么编译时需要把 `jsr166.jar` 加入构建路径, 并且运行 `javac` 和 `java` 时都需要加上 `-Xbootclasspath/p:jsr166.jar` 选项。

Java 5 及更早版本:

ForkJoin 框架在 Java 5 及更早版本中不可用。

## 3. 文档

由于 ForkJoin 框架是 Java 8 和 Java 7 的标准库, 你可以在[标准的文档位置](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html)查看所有类的 javadoc 文档, 不过这些文档包含的信息远超初学者所需。 这些类位于 `java.util.concurrent` 包中, 而方法往往定义(因而也被文档记录)在你所使用的类的父类里。

要想获取最新文档和可能即将发生的变化, JSR-166 的主站是 http://gee.cs.oswego.edu/dl/concurrency-interest/index.html 。 它包含的信息远超初学者所需, 所以我们才把基础内容提炼成了这些笔记。 如果你需要最新版本的 javadoc, 请看 http://gee.cs.oswego.edu/dl/jsr166/dist/jsr166ydocs/ 。

## 4. 快速上手

要学习基本的并行操作, 你只需要了解 2 到 4 个类:

1. `ForkJoinPool`: 这个类的实例用于在整个程序中运行你所有的 fork-join 任务。
2. `RecursiveTask<V>`: 你在池中运行它的子类, 并让它返回一个结果; 参见下面的示例。
3. `RecursiveAction`: 和 `RecursiveTask` 类似, 只是它不返回结果。
4. `ForkJoinTask<V>`: `RecursiveTask<V>` 和 `RecursiveAction` 的父类。 `fork` 和 `join` 都是定义在这个类中的方法。 你不会直接使用这个类, 但它包含了大部分有用的 javadoc 文档, 如果你想了解其他方法, 可以去看它。

所有类都在 `java.util.concurrent` 包中, 因此 import 语句通常写成这样:

```
  import java.util.concurrent.ForkJoinPool;
  import java.util.concurrent.RecursiveTask;
```

要使用这个库, 你需要一个 `ForkJoinPool` 对象。 在 Java 8 中, 调用静态方法 `ForkJoinPool.commonPool()` 即可获得你需要的对象。 在 Java 7 或 6 中, 你需要通过 `new ForkJoinPool()` 来创建池, 但只创建一次, 并把结果保存到某个类的静态字段中, 这样整个程序都能使用它:

```
  public static ForkJoinPool fjPool = new ForkJoinPool();
```

(这个构造函数会让池尽可能使用所有可用的处理器, 这是个不错的选择。 在 Java 8 中, 公共池对象也会这么做。)你并不希望程序中出现多个 `ForkJoinPool` 对象 —— 这个库虽然为高级用法提供了支持, 但即便是专家也不鼓励这么做。

池的职责就是把所有可以并行执行的任务收集起来, 并真正有效地利用可用的处理器。

## 5. 一个无用的示例

要使用池, 你需要为某个类型 `V` 创建 `RecursiveTask<V>` 的子类(或者创建 `RecursiveAction` 的子类)。 在子类中重写 `compute()` 方法。 然后对 `ForkJoinPool` 调用 `invoke` 方法, 传入一个 `RecursiveTask<V>` 类型的对象。 下面是一个很蠢的示例:

```
// define your class
class Incrementor extends RecursiveTask<Integer> {
   int theNumber;
   Incrementor(int x) {
     theNumber = x;
   }
   public Integer compute() {
     return theNumber + 1;
   }
}
// then in some method in your program use the global pool we made above:
int fortyThree = ForkJoinPool.commonPool().invoke(new Incrementor(42));
```

这个示例之所以蠢, 是因为它没有任何并行性。 我们只是把一个对象交给池, 池用某个处理器运行 `compute` 方法, 然后我们拿回结果。 我们完全可以这样写:

```
   int fortyThree = (new Incrementor(42)).compute();
```

尽管如此, 这个蠢示例还是说明了一件好事: 向 `compute()` 方法传递数据的惯用做法是, 通过构造函数传入, 然后存到字段中。 因为你重写了 `compute` 方法, 所以它必须接收零个参数并返回 `Integer`(或者你用于 `RecursiveTask` 的任何类型参数)。

在 Java 7 或 Java 6 中, 请记住 `ForkJoinPool.commonPool()` 是行不通的。 把该表达式替换为那个(静态)字段, 也就是你存放“程序运行期间只调用一次 `new ForkJoinPool()`”结果的地方。 从现在起, 我们假设你使用 Java 8 或更高版本, 但如果你需要 Java 7 或 Java 6, 请记住这个细节。

## 6. 一个有用的示例

非蠢示例的关键(从 `RecursiveTask` 这个名字就能得到不错的提示)在于, 你的 `compute` 方法可以创建其他 `RecursiveTask` 对象, 并让池并行运行它们。 首先创建另一个对象, 然后调用它的 `fork` 方法。 这会真正启动并行计算 —— `fork` 本身很快返回, 但此时已有更多计算正在进行。 当你需要结果时, 就对那个被 `fork` 的对象调用 `join` 方法。 `join` 方法会取回 `fork` 通过 `compute()` 算出的答案。 如果结果还没就绪, 那么 `join` 会阻塞(即不返回), 直到结果就绪。 所以要点是尽早调用 `fork`, 晚点调用 `join`, 中间去做其他有用的事情。

这些就是 `fork`、`join` 和 `compute` 如何运作的“规则”, 但在实践中, 你用这个框架编写的许多并行算法都有非常相似的形式, 用一个示例来看最清楚。 这个示例做的事情是对数组的所有元素求和, 利用并行性, 可能并行处理不同的 5000 个元素的分段。(类型 `long` / `Long` 和 `int` / `Integer` 一样, 只不过它们是 64 位而不是 32 位。 如果你的数据可能很大, 它们是个不错的选择 —— 求和结果很容易超过 2^32, 但超过 2^64 的可能性较小。)

```
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

class Sum extends RecursiveTask<Long> {
    static final int SEQUENTIAL_THRESHOLD = 5000;

    int low;
    int high;
    int[] array;

    Sum(int[] arr, int lo, int hi) {
        array = arr;
        low   = lo;
        high  = hi;
    }

    protected Long compute() {
        if(high - low <= SEQUENTIAL_THRESHOLD) {
            long sum = 0;
            for(int i=low; i < high; ++i)
                sum += array[i];
            return sum;
         } else {
            int mid = low + (high - low) / 2;
            Sum left  = new Sum(array, low, mid);
            Sum right = new Sum(array, mid, high);
            left.fork();
            long rightAns = right.compute();
            long leftAns  = left.join();
            return leftAns + rightAns;
         }
     }

     static long sumArray(int[] array) {
         return ForkJoinPool.commonPool().invoke(new Sum(array,0,array.length));
     }
}
```

这段代码是怎么工作的? 一个 `Sum` 对象接收一个数组以及该数组的一个区间。 `compute` 方法对区间内的元素求和。 如果区间中的元素少于 `SEQUENTIAL_THRESHOLD` 个, 就使用你在编程入门课上学过的那种简单 for 循环。 否则, 它会创建两个规模减半的 `Sum` 对象。 它用 `fork` 在并行计算左半部分的同时计算右半部分 —— 右半部分由该对象自己调用 `right.compute()` 完成。 要得到左半部分的结果, 它调用 `left.join()`。

为什么需要 `SEQUENTIAL_THRESHOLD`? 一直递归到 `high==low+1` 然后返回 `array[low]`, 这样是正确的。 但这会创建多得多的 `Sum` 对象并调用 `fork`, 所以尽管渐进复杂度相同, 最终效率却会低得多。

为什么我们要创建比处理器数量还多的 `Sum` 对象? 因为让合理数量的并行任务高效执行并以良好的方式调度, 是这个框架的职责。 通过拥有大量较小的并行任务, 它能做得更好, 尤其是当程序可用的处理器数量在执行期间发生变化(例如操作系统同时还在运行其他程序), 或者各个任务最终耗时不同的时候。

所以把 `SEQUENTIAL_THRESHOLD` 设为一个实践中合适的值是一种权衡。 ForkJoin 框架的文档建议持续创建并行子任务, 直到基本计算步骤的数量达到 100 多一点、小于 10,000 为止。 只要避免走极端, 具体数值并不关键。

## 7. 坑

使用这个库时有一些“坑”, 你可能需要留意:

1. 对两个子问题分别调用两次 `fork`, 然后再调用两次 `join`, 看起来可能更自然。 这自然比直接调用 `compute` 效率略低, 而且没有任何好处, 因为你创建的并行任务超过了有用的数量。 但事实证明它的效率会低得多, 原因与这个库当前的实现相关, 涉及那些自身几乎不做任何工作的任务在创建时的开销。

2. 记住, 调用

   ```
   join
   ```

   会阻塞, 直到结果就绪。 所以如果你看这段代码:

   ```
       left.fork();
       long rightAns = right.compute();
       long leftAns  = left.join();
       return leftAns + rightAns;
   ```

   你会发现顺序至关重要。 如果我们写成:

   ```
       left.fork();
       long leftAns  = left.join();
       long rightAns = right.compute();
       return leftAns + rightAns;
   ```

   那么我们整个数组求和算法就没有任何并行性, 因为每一步都会先把左边完全算完, 才开始算右边。 同样, 下面这个版本也没有并行性, 因为它先算右边再开始算左边:

   ```
       long rightAns = right.compute();
       left.fork();
       long leftAns  = left.join();
       return leftAns + rightAns;
   ```

3. 你不应该在 `RecursiveTask` 或 `RecursiveAction` 内部使用 `ForkJoinPool` 的 `invoke` 方法。 相反, 即使对象是 `RecursiveTask` 或 `RecursiveAction` 的另一个子类, 你也应该始终直接调用 `compute` 或 `fork`。 你在概念上可能在做一个“不同”的并行计算, 但它仍然是同一个并行任务的一部分。 只有串行代码才应该调用 `invoke` 来启动并行。 (该库较新的版本可能已经让这不那么成问题, 但如果你遇到问题, 这可能就是原因。)

4. 在调试未捕获的异常时, 常见做法是查看调试器中的“栈轨迹(stack trace)”: 异常发生时调用栈上的方法。 对于 fork-join 计算来说, 这没那么简单, 因为对 `compute` 的调用发生在与概念上的调用者(也就是调用 `fork` 的代码)不同的线程中。 这个库和调试器会尽量提供有用的信息, 包括运行 `compute` 的线程以及调用 `fork` 的线程的栈信息, 但它可能很难读懂, 而且其中包含许多与库实现相关的调用, 你应该忽略它们。 你可能会发现, 在 `compute` 的调用内部捕获异常并只打印该栈轨迹, 调试起来会更容易。

5. 在性能方面, 有很多原因会导致 fork-join 计算比你预期的更慢, 甚至比该算法的串行版本还慢。 参见下一节。

## 8. 计时问题

写一个简单的 fork-join 程序, 并把它的性能与解决同一问题的串行程序做比较, 是很自然的事。 但由于种种合理的原因, 这比你想象的要棘手。 下面我们列出各种原因以及应对方法。 当你没有看到预期的并行加速时, 可以把这当作一份检查清单。 其中一些问题对现代系统上的任何微基准测试都适用, 另一些则更针对并行。

1. 计时要足够长: 要比较两段代码的运行时间, 确保它们各自至少运行几秒钟。 你可以把关心的计算放进一个循环里, 但如何避免产生人为的副作用, 见下文。
2. 数据元素要足够多: 例如, 对于针对数组的计算, 请使用至少一百万个元素的数组。
3. 确认处理器数量符合你的预期: 只有 1 个处理器时, 并行计算不太可能“胜出”; 如果操作系统提供的处理器数量没有你想象的那么多, 也不会产生你预期的结果。 你可以做的一件事是, 给 `ForkJoinPool` 构造函数传入一个明确的数字(例如 1、2、4、8), 看看更大的数字(直到你预期可用的处理器数量)是否会带来更好的性能。
4. 预热这个库: 框架本身就是 Java 代码, 而 Java 实现需要“一段时间”才能判定这些代码对性能至关重要并加以优化。 出于计时的目的, 最好在正式计时之前先运行几次 fork-join 计算, 否则第一次较慢的运行会主导结果。
5. 每个元素上要做足够的计算: 像把数字相加这样非常简单的操作耗时太短, 许多计算机会受限于从内存取数据的时间, 这可能会妨碍有效利用并行。 虽然对一千万个元素的数组求和的 fork-join reduce 可能比串行版本更快, 但对类似长度的数组执行 `out[i] = in1[i]+in2[i]` 的 map 却未必, 因为执行三次内存操作和一次加法可能会让处理器互相等待访存。 试试更复杂的操作, 比如 `out[i] = (Math.abs(in[i-1])+Math.abs(in[i])+Math.abs(in[i+1]))/3`, 或者干脆就用 `out[i] = in[i]in[i]`。
6. 使用你的计算结果: 聪明的编译器可能会跳过它能判断出程序不会用到的计算。 在算出结果并完成计时之后, 做点什么, 比如把答案打印出来。 为了避免打印整个大数组, 你可以随机选取数组中的一个元素来打印。
7. 不要使用非常简单的输入: 有些编译器可能聪明到能发现像 `arr[i] = i` 这样有规律的简单数组可以被优化, 从而使串行代码“不公平地”变快。(确实不公平: 没人会用这种输入来对数组求和, 我们有常数时间算法来计算从 1 到 n 的整数和。)也许可以用随机元素填充数组, 或者至少在初始化之后把其中几个元素改成别的值。
8. 每次迭代使用略有不同的输入: 出于上面各种原因(计时足够长、预热库), 你可能会在循环中多次执行同样的计算。 编译器同样可能“注意到”串行或并行代码在各次迭代中做着同样的事情, 从而避免不必要的计算, 导致你计时的并不是你以为的东西。 你应该可以通过在迭代之间交换几个数组元素来“迷惑”编译器。
9. 仔细检查你的串行切换阈值: 确保你的 fork-join 代码正确判断何时切换到串行算法。 你希望有大量的小任务, 但每个任务仍应执行几千到几万次算术运算。 如果太低, 任务创建的开销会拖慢 fork-join 代码。 如果太高, 会让处理器闲置, 这自然也会拖慢速度。



原文链接: [Beginner's Introduction to Java's ForkJoin Framework](http://homes.cs.washington.edu/~djg/teachingMaterials/grossmanSPAC_forkJoinFramework.html)

翻译人员: [铁锚](http://blog.csdn.net/renfufei)

翻译日期: 2014-12-19日

原文日期: 2012-03-25日更新
