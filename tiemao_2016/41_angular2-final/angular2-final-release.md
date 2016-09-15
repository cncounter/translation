# Angular, version 2: proprioception-reinforcement

# 角,版本2:proprioception-reinforcement


Today, at a special meetup at Google HQ, we announced the final release version of Angular 2, the full-platform successor to Angular 1.

今天,在一个特殊的聚会在谷歌总部,我们宣布的最终发布版本2角,角1 全平台的继任者。


What does "final" mean? Stability that's been validated across a wide range of use cases, and a framework that's been optimized for developer productivity, small payload size, and performance. With ahead-of-time compilation and built-in lazy-loading, we’ve made sure that you can deploy the fastest, smallest applications across the browser, desktop, and mobile environments. This release also represents huge improvements to developer productivity with the Angular CLI and styleguide.

“最终”是什么意思?稳定的验证跨广泛的用例,和一个框架,优化了开发人员的生产力,小载荷大小和性能.提前编译和内置的延迟加载,我们确保您可以部署的最快,最小的应用程序在浏览器、桌面和移动环境.这个版本也代表了巨大的改进开发人员的生产力和角CLI格式指南。


Angular 1 first solved the problem of how to develop for an emerging web. Six years later, the challenges faced by today’s application developers, and the sophistication of the devices that applications must support, have both changed immensely. With this release, and its more capable versions of the Router, Forms, and other core APIs, today you can build amazing apps for any platform. If you prefer your own approach, Angular is also modular and flexible, so you can use your favorite third-party library or write your own.

角1首先解决如何开发的问题对于一个新兴的网络.六年后,今天的应用程序开发人员所面临的挑战和复杂的设备,应用程序必须支持,都极大的改变了.这个版本,它更有能力版本的路由器,形式,和其他核心api,今天你可以构建惊人的应用平台.如果你喜欢你自己的方法,角也是模块化和灵活的,所以你可以使用你喜欢的第三方库或编写自己的。


From the beginning, we built Angular in collaboration with the open source development community. We are grateful to the large number of contributors who dedicated time to submitting pull requests, issues, and repro cases, who discussed and debated design decisions, and validated (and pushed back on) our RCs. We wish we could have brought every one of you in person to our meetup so you could celebrate this milestone with us tonight!

从一开始,我们建立了角与开源开发社区合作.我们感激贡献者大量的专门的时间来提交请求,问题,和繁殖情况下,讨论和辩论的设计决策,和验证(推迟)我们的RCs。我们希望我们能够把每一个带你亲自到我们聚会你可以今晚和我们庆祝这个里程碑!


![Angular Homepage.png](https://lh6.googleusercontent.com/Eduq1SGmav17xp4hg91xMSt3DA1bS-zvZbo4TLwLf43Bu1XmIOSJyeb-H2HTeQEXHdTJvSVCMmuWXwZJpKwT_XmKpKEh-4x1eZgsmjRvu2YTKzPqSxn_XRkecD9rMqmOo0gMNybF)

![Angular Homepage.png](https://lh6.googleusercontent.com/Eduq1SGmav17xp4hg91xMSt3DA1bS-zvZbo4TLwLf43Bu1XmIOSJyeb-H2HTeQEXHdTJvSVCMmuWXwZJpKwT_XmKpKEh-4x1eZgsmjRvu2YTKzPqSxn_XRkecD9rMqmOo0gMNybF)


## What’s next?

## 接下来是什么?


Angular is now ready for the world, and we’re excited for you to join the thousands of developers already building with Angular 2\.  But what’s coming next for Angular?

角是现在准备世界,我们非常高兴你加入成千上万的开发人员已经构建2角\。但接下来会发生什么角?


A few of the things you can expect in the near future from the Angular team:

的一些事情你可以期待在不久的将来从角团队:


*   Bug fixes and non-breaking features for APIs marked as stable

不换行功能* Bug修复和api标记为稳定


*   More guides and live examples specific to your use cases

*更多的指导和生活例子特定于您的用例


*   More work on animations

*更多的工作动画


*   Angular Material 2

*角材料2


*   Moving WebWorkers out of experimental

*移动WebWorkers实验


*   More features and more languages for Angular Universal

*更多的功能和更多的角通用语言


*   Even more speed and payload size improvements

*更多的速度和载荷大小的改进


### Semantic Versioning

### 语义版本控制


We heard loud and clear that our RC labeling was confusing. To make it easy to manage dependencies on stable Angular releases, starting today with Angular 2.0.0, we will move to semantic versioning.  Angular versioning will then follow the MAJOR.MINOR.PATCH scheme as described by [semver](http://semver.org/spec/v2.0.0.html):

我们听到响亮和清晰,RC标签是令人困惑的。使其易于管理依赖于稳定的角释放,与角2.0.0从今天开始,我们将搬到语义版本控制.角版本将遵循主要版本。次要版本。号码补丁方案所描述的[semver](http://semver.org/spec/v2.0.0.html):


1.  the MAJOR version gets incremented when incompatible API changes are made to stable APIs,

1. 主要的版本不兼容的API更改时增加稳定的API,



2.  the MINOR version gets incremented when backwards-compatible functionality are added,

2. 小版本时增加向后兼容功能的添加,



3.  the PATCH version gets incremented when backwards-compatible bug are fixed.

3. 补丁版本时增加向后兼容错误是固定的。



Moving Angular to semantic versioning ensures rapid access to the newest features for our component and tooling ecosystem, while preserving a consistent and reliable development environment for production applications that depend on stability between major releases, but still benefit from bug fixes and new APIs.

移动角语义版本控制可以确保快速访问组件和工具的最新功能的生态系统,同时维护一个一致的和可靠的生产应用程序开发环境,依靠稳定之间的主要发行版,但仍然受益于bug修复和新的api。


### Contributors

### 贡献者


Aaron Frost, Aaron (Ron) Tsui, Adam Bradley, Adil Mourahi, agpreynolds, Ajay Ambre, Alberto Santini, Alec Wiseman, Alejandro Caravaca Puchades, Alex Castillo, Alex Eagle, Alex Rickabaugh, Alex Wolfe, Alexander Bachmann, Alfonso Presa, Ali Johnson, Aliaksei Palkanau, Almero Steyn, Alyssa Nicoll, Alxandr, André Gil, Andreas Argelius, Andreas Wissel, Andrei Alecu, Andrei Tserakhau, Andrew, Andrii Nechytailov, Ansel Rosenberg, Anthony Zotti, Anton Moiseev, Artur Meyster, asukaleido, Aysegul Yonet, Aziz Abbas, Basarat Ali Syed, BeastCode, Ben Nadel, Bertrand Laporte, Blake La Pierre, Bo Guo, Bob Nystrom, Borys Semerenko, Bradley Heinz, Brandon Roberts, Brendan Wyse, Brian Clark, Brian Ford, Brian Hsu, dozingcat, Brian Yarger, Bryce Johnson, CJ Avilla, cjc343, Caitlin Potter, Cédric Exbrayat,  Chirayu Krishnappa, Christian Weyer, Christoph Burgdorf, Christoph Guttandin, Christoph Hoeller, Christoffer Noring, Chuck Jazdzewski, Cindy, Ciro Nunes, Codebacca, Cody Lundquist, Cody-Nicholson, Cole R Lawrence, Constantin Gavrilete, Cory Bateman, Craig Doremus, crisbeto, Cuel, Cyril Balit, Cyrille Tuzi, Damien Cassan, Dan Grove, Dan Wahlin, Daniel Leib, Daniel Rasmuson, dapperAuteur, Daria Jung, David East, David Fuka, David Reher, David-Emmanuel Divernois, Davy Engone, Deborah Kurata, Derek Van Dyke, DevVersion, Dima Kuzmich, Dimitrios Loukadakis, Dmitriy Shekhovtsov, Dmitry Patsura, Dmitry Zamula, Dmytro Kulyk, Donald Spencer, Douglas Duteil, dozingcat, Drew Moore, Dylan Johnson, Edd Hannay, Edouard Coissy, eggers, elimach, Elliott Davis, Eric Jimenez, Eric Lee Carraway, Eric Martinez, Eric Mendes Dantas, Eric Tsang, Essam Al Joubori, Evan Martin, Fabian Raetz, Fahimnur Alam, Fatima Remtullah, Federico Caselli, Felipe Batista, Felix Itzenplitz, Felix Yan, Filip Bruun, Filipe Silva, Flavio Corpa, Florian Knop, Foxandxss, Gabe Johnson, Gabe Scholz, GabrielBico, Gautam krishna.R, Georgii Dolzhykov, Georgios Kalpakas, Gerd Jungbluth, Gerard Sans, Gion Kunz, Gonzalo Ruiz de Villa, Grégory Bataille, Günter Zöchbauer, Hank Duan, Hannah Howard, Hans Larsen, Harry Terkelsen, Harry Wolff, Henrique Limas, Henry Wong, Hiroto Fukui, Hongbo Miao, Huston Hedinger, Ian Riley, Idir Ouhab Meskine, Igor Minar, Ioannis Pinakoulakis, The Ionic Team, Isaac Park, Istvan Novak, Itay Radotzki, Ivan Gabriele, Ivey Padgett, Ivo Gabe de Wolff, J. Andrew Brassington, Jack Franklin, Jacob Eggers, Jacob MacDonald, Jacob Richman, Jake Garelick, James Blacklock, James Ward, Jason Choi, Jason Kurian, Jason Teplitz, Javier Ros, Jay Kan, Jay Phelps, Jay Traband, Jeff Cross, Jeff Whelpley, Jennifer Bland, jennyraj, Jeremy Attali, Jeremy Elbourn, Jeremy Wilken, Jerome Velociter, Jesper Rønn-Jensen, Jesse Palmer, Jesús Rodríguez, Jesús Rodríguez, Jimmy Gong, Joe Eames, Joel Brewer, John Arstingstall, John Jelinek IV, John Lindquist, John Papa, John-David Dalton, Jonathan Miles, Joost de Vries, Jorge Cruz, Josef Meier, Josh Brown, Josh Gerdes, Josh Kurz, Josh Olson, Josh Thomas, Joseph Perrott, Joshua Otis, Josu Guiterrez, Julian Motz, Julie Ralph, Jules Kremer, Justin DuJardin, Kai Ruhnau, Kapunahele Wong, Kara Erickson, Kathy Walrath, Keerti Parthasarathy, Kenneth Hahn, Kevin Huang, Kevin Kirsche, Kevin Merckx, Kevin Moore, Kevin Western, Konstantin Shcheglov, Kurt Hong, Levente Morva, laiso, Lina Lu, LongYinan, Lucas Mirelmann, Luka Pejovic, Lukas Ruebbelke, Marc Fisher, Marc Laval, Marcel Good, Marcy Sutton, Marcus Krahl, Marek Buko, Mark Ethan Trostler, Martin Gontovnikas, Martin Probst, Martin Staffa, Matan Lurey, Mathias Raacke, Matias Niemelä, Matt Follett, Matt Greenland, Matt Wheatley, Matteo Suppo, Matthew Hill, Matthew Schranz, Matthew Windwer, Max Sills, Maxim Salnikov, Melinda Sarnicki Bernardo, Michael Giambalvo, Michael Goderbauer, Michael Mrowetz, Michael-Rainabba Richardson, Michał Gołębiowski, Mikael Morlund, Mike Ryan, Minko Gechev, Miško Hevery, Mohamed Hegazy, Nan Schweiger, Naomi Black, Nathan Walker, The NativeScript Team, Nicholas Hydock, Nick Mann, Nick Raphael, Nick Van Dyck, Ning Xia, Olivier Chafik, Olivier Combe, Oto Dočkal, Pablo Villoslada Puigcerber, Pascal Precht, Patrice Chalin, Patrick Stapleton, Paul Gschwendtner, Pawel Kozlowski, Pengfei Yang, Pete Bacon Darwin, Pete Boere, Pete Mertz, Philip Harrison, Phillip Alexander, Phong Huynh, Polvista, Pouja, Pouria Alimirzaei, Prakal, Prayag Verma, Rado Kirov, Raul Jimenez, Razvan Moraru, Rene Weber, Rex Ye, Richard Harrington, Richard Kho, Richard Sentino, Rob Eisenberg, Rob Richardson, Rob Wormald, Robert Ferentz, Robert Messerle, Roberto Simonetti, Rodolfo Yabut, Sam Herrmann, Sam Julien, Sam Lin, Sam Rawlins, Sammy Jelin, Sander Elias, Scott Hatcher, Scott Hyndman, Scott Little, ScottSWu, Sebastian Hillig, Sebastian Müller, Sebastián Duque, Sekib Omazic, Shahar Talmi, Shai Reznik, Sharon DiOrio, Shannon Ayres, Shefali Sinha, Shlomi Assaf, Shuhei Kagawa, Sigmund Cherem, Simon Hürlimann (CyT), Simon Ramsay, Stacy Gay, Stephen Adams, Stephen Fluin, Steve Mao, Steve Schmitt, Suguru Inatomi, Tamas Csaba, Ted Sander, Tero Parviainen, Thierry Chatel, Thierry Templier, Thomas Burleson, Thomas Henley, Tim Blasi, Tim Ruffles, Timur Meyster, Tobias Bosch, Tony Childs, Tom Ingebretsen, Tom Schoener, Tommy Odom, Torgeir Helgevold, Travis Kaufman, Trotyl Yu, Tycho Grouwstra, The Typescript Team, Uli Köhler, Uri Shaked, Utsav Shah, Valter Júnior, Vamsi V, Vamsi Varikuti, Vanga Sasidhar, Veikko Karsikko, Victor Berchet, Victor Mejia, Victor Savkin, Vinci Rufus, Vijay Menon, Vikram Subramanian, Vivek Ghaisas, Vladislav Zarakovsky, Vojta Jina, Ward Bell, Wassim Chegham, Wenqian Guo, Wesley Cho, Will Ngo, William Johnson, William Welling, Wilson Mendes Neto, Wojciech Kwiatek, Yang Lin, Yegor Jbanov, Zach Bjornson, Zhicheng Wang, and many more...



With gratitude and appreciation, and anticipation to see what you'll build next, welcome to the next stage of Angular.

感谢和感激,期待接下来您将构建的,欢迎来到角的下一个阶段。


Posted <abbr title="2016-09-15T02:41:00.000Z" itemprop="datePublished">3 hours ago</abbr> by [Jules Kremer](https://plus.google.com/104150333906782649461)

发布 3小时前 由 [Jules Kremer](https://plus.google.com/104150333906782649461) 发布


Labels: [release](https://angularjs.blogspot.com/search/label/release) [meetups](https://angularjs.blogspot.com/search/label/meetups) [2.0](https://angularjs.blogspot.com/search/label/2.0) [angular](https://angularjs.blogspot.com/search/label/angular)

标签: [release](https://angularjs.blogspot.com/search/label/release) [meetups](https://angularjs.blogspot.com/search/label/meetups) [2.0](https://angularjs.blogspot.com/search/label/2.0) [angular](https://angularjs.blogspot.com/search/label/angular)




原文链接: [https://angularjs.blogspot.com/2016/09/angular2-final.html](https://angularjs.blogspot.com/2016/09/angular2-final.html)

原文日期: 2016年9月15日

翻译日期: 2016年9月15日
