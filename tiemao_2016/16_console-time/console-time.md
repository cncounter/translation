# console.time & console.timeEnd

#  JavaScript基准测试: console.time 与 console.timeEnd


The console.time and console.timeEnd methods allow developers to time any routine and get a duration in milliseconds.  Since JavaScript performance is becoming increasingly important, it's good to know basic techniques for benchmarking routines.  One of the most basic benchmarking tools is console.time with console.timeEnd.

`console.time` 和 `console.timeEnd` 方法可以在任意代码中使用, 显示的结果是持续的时间, 以毫秒为单位. 由于JavaScript性能变得越来越重要, 所以了解基本的基准测试技术是挺好的。最基本的基准测试工具就是 **console.time** 与 **console.timeEnd** 的组合。

console.time starts the time and console.timeEnd stops the timer and spits out the duration:

`console.time` 启动一个计时器。然后调用 `console.timeEnd` 则停止计时器,并写出经过的时间:


	// 启动计时器(name=testForEach)
	console.time('testForEach');

	// (... 执行某些测试,如 forEach 循环之类)

	// 结束计时器,获取运行时间
	console.timeEnd('testForEach');

	// 4522.303ms (回显代码的运行时间)


Passing a timer name as the first argument allows you to manage concurrent timers.  The console.timeEnd call immediately spits out the elapsed time in milliseconds.

传入的第一个参数是计时器的 name, 以便管理多个并发计时器。调用 `console.timeEnd` 则立即写出运行时间,单位是 ms(毫秒)。


There are more advanced techniques for performance testing and benchmarking but console.time/timeEnd provide a quick manual method for speed testing!

**console.time/timeEnd** 提供了一种快速进行速度测试的手动方法! 在JS领域还有很多先进的性能/基准测试技术和工具。



翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)


翻译时间: 2016年4月30日

原文时间: 


原文链接: [https://davidwalsh.name/console-time](https://davidwalsh.name/console-time)
