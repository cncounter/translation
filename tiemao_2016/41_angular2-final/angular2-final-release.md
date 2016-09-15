# Angular, version 2: proprioception-reinforcement

# Today, at a special meetup at Google HQ, we announced the final release version of Angular 2, the full-platform successor to Angular 1\.

What does "final" mean? Stability that's been validated across a wide range of use cases, and a framework that's been optimized for developer productivity, small payload size, and performance. With ahead-of-time compilation and built-in lazy-loading, we’ve made sure that you can deploy the fastest, smallest applications across the browser, desktop, and mobile environments. This release also represents huge improvements to developer productivity with the Angular CLI and styleguide.

Angular 1 first solved the problem of how to develop for an emerging web. Six years later, the challenges faced by today’s application developers, and the sophistication of the devices that applications must support, have both changed immensely. With this release, and its more capable versions of the Router, Forms, and other core APIs, today you can build amazing apps for any platform. If you prefer your own approach, Angular is also modular and flexible, so you can use your favorite third-party library or write your own.

From the beginning, we built Angular in collaboration with the open source development community. We are grateful to the large number of contributors who dedicated time to submitting pull requests, issues, and repro cases, who discussed and debated design decisions, and validated (and pushed back on) our RCs. We wish we could have brought every one of you in person to our meetup so you could celebrate this milestone with us tonight!

![Angular Homepage.png](https://lh6.googleusercontent.com/Eduq1SGmav17xp4hg91xMSt3DA1bS-zvZbo4TLwLf43Bu1XmIOSJyeb-H2HTeQEXHdTJvSVCMmuWXwZJpKwT_XmKpKEh-4x1eZgsmjRvu2YTKzPqSxn_XRkecD9rMqmOo0gMNybF)

## What’s next?

Angular is now ready for the world, and we’re excited for you to join the thousands of developers already building with Angular 2\.  But what’s coming next for Angular?

A few of the things you can expect in the near future from the Angular team:

*   Bug fixes and non-breaking features for APIs marked as stable

*   More guides and live examples specific to your use cases

*   More work on animations

*   Angular Material 2

*   Moving WebWorkers out of experimental

*   More features and more languages for Angular Universal

*   Even more speed and payload size improvements

### Semantic Versioning

We heard loud and clear that our RC labeling was confusing. To make it easy to manage dependencies on stable Angular releases, starting today with Angular 2.0.0, we will move to semantic versioning.  Angular versioning will then follow the MAJOR.MINOR.PATCH scheme as described by [semver](http://semver.org/spec/v2.0.0.html):

1.  the MAJOR version gets incremented when incompatible API changes are made to stable APIs,

2.  the MINOR version gets incremented when backwards-compatible functionality are added,

3.  the PATCH version gets incremented when backwards-compatible bug are fixed.

Moving Angular to semantic versioning ensures rapid access to the newest features for our component and tooling ecosystem, while preserving a consistent and reliable development environment for production applications that depend on stability between major releases, but still benefit from bug fixes and new APIs.

### Contributors

Aaron Frost, Aaron (Ron) Tsui, Adam Bradley, Adil Mourahi, agpreynolds, Ajay Ambre, Alberto Santini, Alec Wiseman, Alejandro Caravaca Puchades, Alex Castillo, Alex Eagle, Alex Rickabaugh, Alex Wolfe, Alexander Bachmann, Alfonso Presa, Ali Johnson, Aliaksei Palkanau, Almero Steyn, Alyssa Nicoll, Alxandr, André Gil, Andreas Argelius, Andreas Wissel, Andrei Alecu, Andrei Tserakhau, Andrew, Andrii Nechytailov, Ansel Rosenberg, Anthony Zotti, Anton Moiseev, Artur Meyster, asukaleido, Aysegul Yonet, Aziz Abbas, Basarat Ali Syed, BeastCode, Ben Nadel, Bertrand Laporte, Blake La Pierre, Bo Guo, Bob Nystrom, Borys Semerenko, Bradley Heinz, Brandon Roberts, Brendan Wyse, Brian Clark, Brian Ford, Brian Hsu, dozingcat, Brian Yarger, Bryce Johnson, CJ Avilla, cjc343, Caitlin Potter, Cédric Exbrayat,  Chirayu Krishnappa, Christian Weyer, Christoph Burgdorf, Christoph Guttandin, Christoph Hoeller, Christoffer Noring, Chuck Jazdzewski, Cindy, Ciro Nunes, Codebacca, Cody Lundquist, Cody-Nicholson, Cole R Lawrence, Constantin Gavrilete, Cory Bateman, Craig Doremus, crisbeto, Cuel, Cyril Balit, Cyrille Tuzi, Damien Cassan, Dan Grove, Dan Wahlin, Daniel Leib, Daniel Rasmuson, dapperAuteur, Daria Jung, David East, David Fuka, David Reher, David-Emmanuel Divernois, Davy Engone, Deborah Kurata, Derek Van Dyke, DevVersion, Dima Kuzmich, Dimitrios Loukadakis, Dmitriy Shekhovtsov, Dmitry Patsura, Dmitry Zamula, Dmytro Kulyk, Donald Spencer, Douglas Duteil, dozingcat, Drew Moore, Dylan Johnson, Edd Hannay, Edouard Coissy, eggers, elimach, Elliott Davis, Eric Jimenez, Eric Lee Carraway, Eric Martinez, Eric Mendes Dantas, Eric Tsang, Essam Al Joubori, Evan Martin, Fabian Raetz, Fahimnur Alam, Fatima Remtullah, Federico Caselli, Felipe Batista, Felix Itzenplitz, Felix Yan, Filip Bruun, Filipe Silva, Flavio Corpa, Florian Knop, Foxandxss, Gabe Johnson, Gabe Scholz, GabrielBico, Gautam krishna.R, Georgii Dolzhykov, Georgios Kalpakas, Gerd Jungbluth, Gerard Sans, Gion Kunz, Gonzalo Ruiz de Villa, Grégory Bataille, Günter Zöchbauer, Hank Duan, Hannah Howard, Hans Larsen, Harry Terkelsen, Harry Wolff, Henrique Limas, Henry Wong, Hiroto Fukui, Hongbo Miao, Huston Hedinger, Ian Riley, Idir Ouhab Meskine, Igor Minar, Ioannis Pinakoulakis, The Ionic Team, Isaac Park, Istvan Novak, Itay Radotzki, Ivan Gabriele, Ivey Padgett, Ivo Gabe de Wolff, J. Andrew Brassington, Jack Franklin, Jacob Eggers, Jacob MacDonald, Jacob Richman, Jake Garelick, James Blacklock, James Ward, Jason Choi, Jason Kurian, Jason Teplitz, Javier Ros, Jay Kan, Jay Phelps, Jay Traband, Jeff Cross, Jeff Whelpley, Jennifer Bland, jennyraj, Jeremy Attali, Jeremy Elbourn, Jeremy Wilken, Jerome Velociter, Jesper Rønn-Jensen, Jesse Palmer, Jesús Rodríguez, Jesús Rodríguez, Jimmy Gong, Joe Eames, Joel Brewer, John Arstingstall, John Jelinek IV, John Lindquist, John Papa, John-David Dalton, Jonathan Miles, Joost de Vries, Jorge Cruz, Josef Meier, Josh Brown, Josh Gerdes, Josh Kurz, Josh Olson, Josh Thomas, Joseph Perrott, Joshua Otis, Josu Guiterrez, Julian Motz, Julie Ralph, Jules Kremer, Justin DuJardin, Kai Ruhnau, Kapunahele Wong, Kara Erickson, Kathy Walrath, Keerti Parthasarathy, Kenneth Hahn, Kevin Huang, Kevin Kirsche, Kevin Merckx, Kevin Moore, Kevin Western, Konstantin Shcheglov, Kurt Hong, Levente Morva, laiso, Lina Lu, LongYinan, Lucas Mirelmann, Luka Pejovic, Lukas Ruebbelke, Marc Fisher, Marc Laval, Marcel Good, Marcy Sutton, Marcus Krahl, Marek Buko, Mark Ethan Trostler, Martin Gontovnikas, Martin Probst, Martin Staffa, Matan Lurey, Mathias Raacke, Matias Niemelä, Matt Follett, Matt Greenland, Matt Wheatley, Matteo Suppo, Matthew Hill, Matthew Schranz, Matthew Windwer, Max Sills, Maxim Salnikov, Melinda Sarnicki Bernardo, Michael Giambalvo, Michael Goderbauer, Michael Mrowetz, Michael-Rainabba Richardson, Michał Gołębiowski, Mikael Morlund, Mike Ryan, Minko Gechev, Miško Hevery, Mohamed Hegazy, Nan Schweiger, Naomi Black, Nathan Walker, The NativeScript Team, Nicholas Hydock, Nick Mann, Nick Raphael, Nick Van Dyck, Ning Xia, Olivier Chafik, Olivier Combe, Oto Dočkal, Pablo Villoslada Puigcerber, Pascal Precht, Patrice Chalin, Patrick Stapleton, Paul Gschwendtner, Pawel Kozlowski, Pengfei Yang, Pete Bacon Darwin, Pete Boere, Pete Mertz, Philip Harrison, Phillip Alexander, Phong Huynh, Polvista, Pouja, Pouria Alimirzaei, Prakal, Prayag Verma, Rado Kirov, Raul Jimenez, Razvan Moraru, Rene Weber, Rex Ye, Richard Harrington, Richard Kho, Richard Sentino, Rob Eisenberg, Rob Richardson, Rob Wormald, Robert Ferentz, Robert Messerle, Roberto Simonetti, Rodolfo Yabut, Sam Herrmann, Sam Julien, Sam Lin, Sam Rawlins, Sammy Jelin, Sander Elias, Scott Hatcher, Scott Hyndman, Scott Little, ScottSWu, Sebastian Hillig, Sebastian Müller, Sebastián Duque, Sekib Omazic, Shahar Talmi, Shai Reznik, Sharon DiOrio, Shannon Ayres, Shefali Sinha, Shlomi Assaf, Shuhei Kagawa, Sigmund Cherem, Simon Hürlimann (CyT), Simon Ramsay, Stacy Gay, Stephen Adams, Stephen Fluin, Steve Mao, Steve Schmitt, Suguru Inatomi, Tamas Csaba, Ted Sander, Tero Parviainen, Thierry Chatel, Thierry Templier, Thomas Burleson, Thomas Henley, Tim Blasi, Tim Ruffles, Timur Meyster, Tobias Bosch, Tony Childs, Tom Ingebretsen, Tom Schoener, Tommy Odom, Torgeir Helgevold, Travis Kaufman, Trotyl Yu, Tycho Grouwstra, The Typescript Team, Uli Köhler, Uri Shaked, Utsav Shah, Valter Júnior, Vamsi V, Vamsi Varikuti, Vanga Sasidhar, Veikko Karsikko, Victor Berchet, Victor Mejia, Victor Savkin, Vinci Rufus, Vijay Menon, Vikram Subramanian, Vivek Ghaisas, Vladislav Zarakovsky, Vojta Jina, Ward Bell, Wassim Chegham, Wenqian Guo, Wesley Cho, Will Ngo, William Johnson, William Welling, Wilson Mendes Neto, Wojciech Kwiatek, Yang Lin, Yegor Jbanov, Zach Bjornson, Zhicheng Wang, and many more...

With gratitude and appreciation, and anticipation to see what you'll build next, welcome to the next stage of Angular.

Posted <abbr title="2016-09-15T02:41:00.000Z" itemprop="datePublished">3 hours ago</abbr> by [Jules Kremer](https://plus.google.com/104150333906782649461)

Labels: [release](https://angularjs.blogspot.com/search/label/release) [meetups](https://angularjs.blogspot.com/search/label/meetups) [2.0](https://angularjs.blogspot.com/search/label/2.0) [angular](https://angularjs.blogspot.com/search/label/angular)


原文链接: [https://angularjs.blogspot.com/2016/09/angular2-final.html](https://angularjs.blogspot.com/2016/09/angular2-final.html)

原文日期: 2016年9月15日
