# 认识 sun.misc.Unsafe


> ### 笼罩在迷雾之中的 `Unsafe` 私有API,有人认为应该废弃,也有人认为应该开放.



[2015年07月28日] Oracle 最近宣称要在 Java 9 中去除私有 API: `sun.misc.Unsafe`, 这就像点燃了炸药桶, 遭到 [许多开发者的抗议](http://www.javaworld.com/article/2952639/java-se/java-devs-abhor-oracles-plan-to-kill-private-api.html), 他们认为 [这会严重破坏Java的生态系统](http://blog.dripstat.com/removal-of-sun-misc-unsafe-a-disaster-in-the-making/)


开源博主 Rafael Winterhalter 在博文 "[Understanding sun.misc.Unsafe](https://dzone.com/articles/understanding-sunmiscunsafe)" 中说, [底层编程(low-level programming)](http://programmers.stackexchange.com/questions/22525/low-level-programming-whats-in-it-for-me) 中经常会使用到 unsafe , 这样程序员就能为特定需求而修改平台功能. 虽然 JNI (Java Native Interface) 是最安全(safest)的底层编程方式, 但因为限制更少， 开源项目都更青睐 Unsafe , .


Winterhalter 列举了如何使用 **`Unsafe`** 来绕过 Java编程中的一些限制:

> 第一次使用 `Unsafe` 是因为碰到了一个类,这个类只有一个超级难用的构造函数,我只需要一个实际的对象来代理里面的方法就行。<br/>
> 如果能创建子类那就 so easy; 如果类被表示为接口, 创建代理也很简单。但是这个笨重的构造函数,让我被坑死了(stuck)。通过使用`Unsafe`类, 妈妈再也不用担心我的代码^_^。



关于如何在Java代码中使用 **Unsafe** 及其适用场景, 请访问: "[Understanding sun.misc.Unsafe](https://dzone.com/articles/understanding-sunmiscunsafe)" 和 "[Java magic, Part 4: sun.misc.Unsafe ](http://mishadoff.com/blog/java-magic-part-4-sun-dot-misc-dot-unsafe/)" .



原文链接: [http://www.javaworld.com/article/2952869/java-platform/understanding-sun-misc-unsafe.html](http://www.javaworld.com/article/2952869/java-platform/understanding-sun-misc-unsafe.html)

原文日期: 2015年07月28日

翻译日期: 2016年01月19日


翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
