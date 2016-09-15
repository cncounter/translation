# Angular, version 2: proprioception reinforcement

# AngularJS 2: 前端开发的强悍尖兵


Today, at a special meetup at Google HQ, we announced the final release version of Angular 2, the full-platform successor to Angular 1.

今天, 在谷歌总部一个特殊的聚会上, 我们宣布 Angular 2 的final release 版本正式发布, 成为 Angular 1 的全平台继任者。


What does "final" mean? Stability that's been validated across a wide range of use cases, and a framework that's been optimized for developer productivity, small payload size, and performance. With ahead-of-time compilation and built-in lazy-loading, we’ve made sure that you can deploy the fastest, smallest applications across the browser, desktop, and mobile environments. This release also represents huge improvements to developer productivity with the Angular CLI and styleguide.

"final"是什么意思呢? 就是通过广泛测试后的稳定版, 对开发者友好并能大幅提升生产力的框架, 体积轻巧,性能优良. 通过预编译技术及内置延迟加载机制, 确保应用响应迅速,传输量小,并实现跨浏览器的兼容性,支持手机、桌面环境. 学习和使用 Angular CLI 与 styleguide, 开发者的生产力会有巨大的提高。


Angular 1 first solved the problem of how to develop for an emerging web. Six years later, the challenges faced by today’s application developers, and the sophistication of the devices that applications must support, have both changed immensely. With this release, and its more capable versions of the Router, Forms, and other core APIs, today you can build amazing apps for any platform. If you prefer your own approach, Angular is also modular and flexible, so you can use your favorite third-party library or write your own.

Angular 1 首先解决的是如何对新兴网络的开发问题. 六年后的今天, 开发人员所面临的挑战, 是必须支持各种复杂的设备, 而这些海量的设备还在迅速改变. 在 2.0 版本上, 通过更强大的Router, Forms,以及其他核心APIs, 可以在任何平台上开发各种应用. 如果你更喜欢自己的开发模式, Angular 也提供了模块化和各种灵活特性, 支持很多第三方库,或者自定义库。


From the beginning, we built Angular in collaboration with the open source development community. We are grateful to the large number of contributors who dedicated time to submitting pull requests, issues, and repro cases, who discussed and debated design decisions, and validated (and pushed back on) our RCs. We wish we could have brought every one of you in person to our meetup so you could celebrate this milestone with us tonight!

从一开始, 我们就与开源社区进行了广泛合作. 感激广大贡献者花费了大量的时间来提交 pull requests, issues,以及 repro cases ,讨论和争辩各种设计方案, 验证后(推送给)我们的RCs。期待你加入我们, 参加我们的聚会, 今晚和我们一起庆祝这个里程碑!


![Angular Homepage.png](https://lh6.googleusercontent.com/Eduq1SGmav17xp4hg91xMSt3DA1bS-zvZbo4TLwLf43Bu1XmIOSJyeb-H2HTeQEXHdTJvSVCMmuWXwZJpKwT_XmKpKEh-4x1eZgsmjRvu2YTKzPqSxn_XRkecD9rMqmOo0gMNybF)



## What’s next?

## 接下来是什么?


Angular is now ready for the world, and we’re excited for you to join the thousands of developers already building with Angular 2.  But what’s coming next for Angular?

Angular 现在万事俱备, 非常高兴你能加入 Angular 2 这个大家庭, 我们已经有成千上万的开发人员在使用 Angular 2. 那么未来的 Angular 会是什么样子呢?


A few of the things you can expect in the near future from the Angular team:

在不久的将来 Angular 团队将会干这些事情:


*   Bug fixes and non-breaking features for APIs marked as stable

* 修正BUG，保持API稳定的同时增加未完成的特性。


*   More guides and live examples specific to your use cases

* 增加更多的教程和示例


*   More work on animations

* 对动画方面的更多的改进


*   Angular Material 2

* Angular Material 2


*   Moving WebWorkers out of experimental

* 将 WebWorkers 发展到生产环境


*   More features and more languages for Angular Universal

* 更多 Angular 通用的功能和语言


*   Even more speed and payload size improvements

* 更快的速度和更小的体积改进


### Semantic Versioning

### 版本号语义(Semantic)


We heard loud and clear that our RC labeling was confusing. To make it easy to manage dependencies on stable Angular releases, starting today with Angular 2.0.0, we will move to semantic versioning.  Angular versioning will then follow the MAJOR.MINOR.PATCH scheme as described by [semver](http://semver.org/spec/v2.0.0.html):

我们注意到有很多说RC标签(版本号)令人迷惑的消息。为了使Angular 稳定版的版本易于管理,从 Angular 2.0.0 开始,,我们将加入版本语义. Angular 版本将遵循 MAJOR.MINOR.PATCH [大版本.小版本.补丁号码] 的模式, 此模式详情: [semver](http://semver.org/spec/v2.0.0.html):


1.  the MAJOR version gets incremented when incompatible API changes are made to stable APIs,

1. MAJOR 版本变更: 有不兼容的API加入到稳定版时。



2.  the MINOR version gets incremented when backwards-compatible functionality are added,

2. MINOR 版本变更： 增加向后兼容的功能时。



3.  the PATCH version gets incremented when backwards-compatible bug are fixed.

3. 补丁版本号变更: 增加向后兼容的BUG修正时。



Moving Angular to semantic versioning ensures rapid access to the newest features for our component and tooling ecosystem, while preserving a consistent and reliable development environment for production applications that depend on stability between major releases, but still benefit from bug fixes and new APIs.

增加 Angular 版本的语义, 可以确保快速访问组件和工具系统的最新特性/功能, 同时保持用于生产环境的大版本的一致和可靠, 当然对于 BUG 修复和新API也非常有用。



### 贡献者

Aaron Frost, Aaron (Ron) Tsui, Adam Bradley, Adil Mourahi, agpreynolds, Ajay Ambre, Alberto Santini, 等...(参见官网)



With gratitude and appreciation, and anticipation to see what you'll build next, welcome to the next stage of Angular.

感谢你们, 期待接下来您继续参与,欢迎进入 Angular 的下一阶段。


标签: [release](https://angularjs.blogspot.com/search/label/release) [meetups](https://angularjs.blogspot.com/search/label/meetups) [2.0](https://angularjs.blogspot.com/search/label/2.0) [angular](https://angularjs.blogspot.com/search/label/angular)




原文链接: [https://angularjs.blogspot.com/2016/09/angular2-final.html](https://angularjs.blogspot.com/2016/09/angular2-final.html)

原文作者: [Jules Kremer](https://plus.google.com/104150333906782649461)

原文日期: 2016年9月15日

翻译日期: 2016年9月15日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
