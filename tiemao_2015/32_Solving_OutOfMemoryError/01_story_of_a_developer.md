Solving OutOfMemoryError (part 1) – story of a developer
==

Another day in the office. Except that you get another call from the operations saying they now have to restart your production application every three hours. And they seem to be somewhat annoyed with this. You have a feeling that their emotion is in correlation to the number of phone calls customer support is getting lately – which has skyrocketed in the past few weeks.

I’m sure you have been there. And I am also sure you wish you would never have to be there again.


All you have is a symptom: an OutOfMemoryError. You have no clue what causes it. You cannot reproduce the problem. You cannot see the log files in production. But you have to solve it. Not that you have the task in your job contract – you are just a developer – the reasons are rather related to your engineering pride and being a responsible human being.



> **广告:** Did you know that 20% of Java applications have memory leaks? Don’t kill your application – instead find and fix leaks with [Plumbr](https://plumbr.eu/memory-leak) in minutes.


And here we go again. Sleepless nights or weeks. Struggling with authorization issues and bureaucracy. Getting ignorant people find the correct data for you. Great. Just great. Having the boss breathe down on your neck does not help much either. “When will it be fixed?” I bet you’d rather estimate when the [P versus NP](http://en.wikipedia.org/wiki/P_versus_NP_problem) problem will be solved.


In this blog we are planning to write about everything related to the situations described above. The next posts will concentrate on how these situations are currently handled, what tools and techniques are popularly used and how you can benefit from them when in a similar situation. As we are a product development company, we might mention our own solutions somewhere along the way, but we promise it will be an interesting read nonetheless! The later blog posts in the series (thus far) include:



### Solving OutOfMemoryError 系列文章

- [Solving OutOfMemoryError (part 1) – story of a developer](01_story_of_a_developer.md)

- [Solving OutOfMemoryError (part 2) – why didn’t operations solve it?](02_why_did_not_operations_solve_it.md)

- [Solving OutOfMemoryError (part 3) – where do you start?](03_where_do_you_start.md)

- [Solving OutOfMemoryError (part 4) – memory profilers](04_memory_profilers.md)

- [Solving OutOfMemoryError (part 5) – JDK Tools](05_JDK_Tools.md)

- [Solving OutOfMemoryError (part 6) – Dump is not a waste](06_Dump_is_not_a_waste.md)



原文日期: 2011年08月29日

翻译日期: 2015年10月26日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
