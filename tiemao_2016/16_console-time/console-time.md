# console.time & console.timeEnd

# 托座。console.timeEnd & time


The console.time and console.timeEnd methods allow developers to time any routine and get a duration in milliseconds.  Since JavaScript performance is becoming increasingly important, it's good to know basic techniques for benchmarking routines.  One of the most basic benchmarking tools is console.time with console.timeEnd.

控制台。时间和控制台。timeEnd方法允许开发人员时间任何常规和得到一个持续时间,以毫秒为单位.由于JavaScript性能变得越来越重要,很高兴知道基本的技术基准测试例程。的一个最基本的基准测试工具是控制台。时间与控制台.timeEnd。

console.time starts the time and console.timeEnd stops the timer and spits out the duration:

控制台。时间开始时间和控制台。timeEnd停止计时器,写出时间:


	// Kick off the timer
	console.time('testForEach');

	// (Do some testing of a forEach, for example)

	// End the timer, get the elapsed time
	console.timeEnd('testForEach');

	// 4522.303ms (or whatever time elapsed)


Passing a timer name as the first argument allows you to manage concurrent timers.  The console.timeEnd call immediately spits out the elapsed time in milliseconds.

通过一个计时器名称作为第一个参数允许您管理并发计时器。控制台。timeEnd电话立即写出运行时间,以毫秒为单位。


There are more advanced techniques for performance testing and benchmarking but console.time/timeEnd provide a quick manual method for speed testing!

有更先进的技术性能测试和基准测试但控制台。时间/ timeEnd提供一个快速手动方法进行速度测试!


原文链接: [https://davidwalsh.name/console-time](https://davidwalsh.name/console-time)
