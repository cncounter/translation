# console.time & console.timeEnd

The console.time and console.timeEnd methods allow developers to time any routine and get a duration in milliseconds.  Since JavaScript performance is becoming increasingly important, it's good to know basic techniques for benchmarking routines.  One of the most basic benchmarking tools is console.time with console.timeEnd.


console.time starts the time and console.timeEnd stops the timer and spits out the duration:

	// Kick off the timer
	console.time('testForEach');

	// (Do some testing of a forEach, for example)

	// End the timer, get the elapsed time
	console.timeEnd('testForEach');

	// 4522.303ms (or whatever time elapsed)


Passing a timer name as the first argument allows you to manage concurrent timers.  The console.timeEnd call immediately spits out the elapsed time in milliseconds.

There are more advanced techniques for performance testing and benchmarking but console.time/timeEnd provide a quick manual method for speed testing!



https://davidwalsh.name/console-time