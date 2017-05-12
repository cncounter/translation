# Java模块化系统在JCP投票中未获通过


2017年5月8日,星期一, JSR-376的公开预览版投票结果确定, 最后有10票赞成，13 票反对，该请求未能通过。 投票结果如下图所示:

![The EC has not approved this ballot](01_jsr_376_result.png)

可能你已经从其他渠道看到这张图片了, 如果你感兴趣,可以查看该结果页面: [https://jcp.org/en/jsr/results?id=5959](https://jcp.org/en/jsr/results?id=5959)

当然, 如果对JSR-376的详细信息感兴趣,请点击: [https://jcp.org/en/jsr/detail?id=376](https://jcp.org/en/jsr/detail?id=376)

下面是几个缩略词的简单说明:

- JSR: Java Specification Requests, 直译为 Java规范请求,如 JVM规范,Java语言规范等等。每个规范,都类似于流程审批,由 JCP 专家委员会负责审核。

- JCP: Java Community Process, 直译为 Java 社区进程。

- EG: Expert Group, 专家组

接下来我们看看详细的投票记录, 挺有意思的, 如果不感兴趣, 直接跳过即可。


###  投票记录


投票开始的第一天, 2017-04-25日, Oracle 投了赞成票(Yes).
------------------------------------------------------------------------------
第四天, 星期五, 2017-04-28日, IBM 投了反对票(No), 反对的理由是:
IBM's vote reflects our position that the JSR is not ready at this time to move beyond the Public Review stage and proceed to Proposed Final Draft.  The JSR 376 Expert Group and the public have raised a number of reasonable issues and concerns with the current public review draft of the specification that warrant further discussion and resolution.  We advocate work continuing amongst all members of the Expert Group to address the issues documented on the mailing lists.  IBM would like to see closer consensus amongst the entire Expert Group before this specification proceeds to the next step.

IBM认为, 此 JSR 目前还存在一些问题, 不能通过公共审查阶段(Public Review), 当然也还不适合进入最终草案(Proposed Final Draft)。 JSR 376专家组和公众们对目前公布的规范草案密切关注,并提出了一些合理的问题, 需要进一步讨论和解决。 我们主张: 专家组的所有成员继续开展工作，以解决邮件列表中提到的问题。 在本规范进行到下一步之前, IBM希望整个专家组中达成更紧密的共识。
------------------------------------------------------------------------------
第二天, 星期三, 2017-04-26日, Intel 投了赞成票(Yes).
------------------------------------------------------------------------------
第二天, 星期三, 2017-04-26日, NXP Semiconductors 投了赞成票(Yes).
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08日, Keil, Werner 投了反对票(No), 反对的理由是:
I understand IBM's and others reason for their "No" vote and heard many similar concerns by e.g. the OSGi community or contributors behind major build systems like Maven, Gradle or Ant. Most of their concerns are still unanswered by the EG or Spec Leads, which at this point I does not make this JSR seem ready yet.

我理解IBM和其他人反对的理由, 并听到许多类似的说法。 OSGi社区, 以及主要构建工具（如Maven，Gradle 和 Ant）的贡献者们, 大部分都还没有得到 EG 或 Spec Leads 的回答，基于这一点，我认为这个 JSR 还未准备充分。
------------------------------------------------------------------------------
2017-05-03日, 星期三, Hazelcast 投了反对票(No), 反对的理由是:
From our point of view the lack of consensus inside the EG is a dangerous sign, that either not all issues are clarified the way they have to or that certain issues were marked solved from a single point of view. Overall, we acknowledge, that the state made big progress over the last months and a lot of issues were addressed with the community but it seems that the state for a public review ballot is not yet right. 
In addition, problems with popular build tools don't seem like a good starter. Our understanding of the EC is, that part of the work is to prevent the Java ecosystem from harm and in the current state the JSR376 cannot be seen as ready for that matter.

以我们的观点来看，EG内部缺乏共识是一个危险的迹象，既不是所有的问题都被澄清, 或者从单一的角度来看，某些问题也尚未得到明确的解决。 总的来说，我们承认，过去几个月来，还是取得了很大的进步，社区中也解决了很多问题，但现在进行公开审查投票似乎还太早了一点。
此外，流行的构建工具中存在的问题看起来也不太完美。 我们专家组的意见是，决不能破坏 Java的整个生态，目前来看，JSR376 不能算是准备就绪的状态。
------------------------------------------------------------------------------
2017-05-03日, 星期三, Red Hat 投了反对票(No), 反对的理由是:
Red Hat is voting NO on this JSR. The Red Hat middleware team, other members of the EC and Java community members, have mentioned publicly and in more detail our concerns (here
https://developer.jboss.org/blogs/scott.stark/2017/04/14/critical-deficiencies-in-jigsawjsr-376-java-platform-module-system-ec-member-concerns and here
https://developer.jboss.org/servlet/JiveServlet/download/38-155022/JSR376.pdf). We have also discussed with our own OpenJDK team, which made good counter arguments to several of the concerns, but in the end we believe a NO vote is the correct course of action. In previous votes and comments on the EG list we have articulated the view that from a middleware/SE developer perspective we believe that Jigsaw does not fulfil its original goals of being a module system which can be used by the likes of Java EE. We understand that after inception the original goals of the EG were initially changed to try to focus it on a module system to be used solely to modularise the JVM and that caused some architecture and implementation approaches which made it difficult for it to be a module system to be used by SE and EE developers. Unfortunately during the lifetime of the EG the goal appeared to switch back to trying to make it a module system for Java developers but previous implementation decisions appear not to have been revisited or could not be changed and as a result the expectations around Jigsaw have not been met by the implementation. Therefore, we are worried about the impact of the current implementation on the wider Java community, particularly existing projects and products including, but also beyond, Java EE. We have raised several issues within the EG list to try to rectify a few of these things in what we believe would have been a minimally invasive manner but they have been rejected. Furthermore, we believe that there has been insufficient consensus in the EG for a series of changes so dramatic to the JVM and which could have an equally dramatic impact on the Java communities, as well as a lack of openness on receiving and discussing community input. We believe that a more considered evaluation of all input and consensus gathering should not take too much time and would result in something which would be better received by the entire Java ecosystem.
------------------------------------------------------------------------------
2017-05-05日, 星期五, Goldman Sachs & Co. 投了赞成票(Yes).
------------------------------------------------------------------------------
2017-05-07日, 星期天, Software AG 投了反对票(No), 反对的理由是:
Software AG is concerned about the lack of a healthy consensus among the members of the Expert Group. Although we understand that a perfect consensus and zero outstanding issues may be unachievable, we believe that a healthier consensus is possible.We also believe that such a consensus would result in a healthier Java ecosystem and a smoother industry transition to a modular Java world.
Assuming the ‘No’ vote carries, we hope the specification lead would take advantage of the 30 days afforded under the JCP process to attempt to form a healthier consensus within the EG.  We would appreciate specific attention being paid to the migration path for existing software in a modular world and on the co-existence of the specification with existing established Java practices and build systems (#ModuleNameInManifest, #CyclicDependences, #AutomaticModuleNames, #AvoidConcealedPackageConflicts, #MultiModuleJARs)

We look forward to being able to vote ‘Yes’ on a draft that has stronger backing from its EG in a future ballot.
------------------------------------------------------------------------------
2017-05-07日, 星期天, Azul Systems, 公司 投了赞成票(Yes).
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, MicroDoc 投了赞成票(Yes).
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, Gemalto M2M GmbH 投了赞成票(Yes).
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, Credit Suisse 投了反对票(No), 反对的理由是:
Credit Suisse represents customers of the Java technology in the EC. With JSR 376, two main concerns exists (i.e., automatic modules, reflection) that potentially conflict with an easy adoption of this JSR. Our understanding is that solutions have been proposed in the EG and it seems to be beneficial to give the EG some more time to get consensus on these important topics.
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, SAP SE 投了反对票(No), 反对的理由是:
We absolutely recognize the tremendous achievements and the great work that has been carried out until now - by the expert group members as well as (and especially) by the spec lead himself. While the JPMS is in pretty good shape for the modularisation of the Java platform itself, we think that there are still some rough edges for libraries and frameworks outside the Java platform which should be addressed and agreed upon before the final approval of the specification.

We acknowledge the open development of the JPMS in the context of the "Project Jigsaw" within the OpenJDK. But we are at the same time concerned about the growing tension between the OpenJDK JEP and the JCP JSR processes. During the development and up to now it has not always been clear what in the development of the JPMS/Jigsaw is considered an implementation detail and what will be part of the standard specification. Features like the binary format of modules and runtime images, the jlink tool and new class attributes like hashes and versions are examples for non-standardised implementation details.

What we are especially concerned about however, is the lack of direct communication within the expert group. Assuming this JSR won't be approved with the required two-thirds majority, we would expect the expert group and spec lead to use the additional 30 days for regular meetings in order to sort out the remaining issues and come up with a new, more sustainable and forward looking proposal. While we're aware that it won't be possible to remedy all concerns, we think that the last days have clearly demonstrated that good compromises are still possible (e.g. the "automatic modules issue") and we're confident that the additional time could be used to submit a better specification for the reconsideration vote.

Finally, we adjure all members and the spec lead to come back to the table and communicate directly to each other instead of blaming each other through blogs and open letters!
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, London Java Community 投了反对票(No), 反对的理由是:
We echo SAP's comments in that we absolutely recognize the tremendous achievements and the great work that has been carried out until now by the EG members as well as (and especially) by the Spec Lead himself.

The LJC is voting "No" on the spec *as it was submitted* at the start of the voting period.  During the 14 day voting period, great progress was made by the Spec Lead and the EG to reach consensus on some very difficult issues such as #AutomaticModuleNames.  However, there are still on going conversations on some of those issues and there simply has not been enough time spent by the ecosystem to discuss some of the new designs in enough depth or enough time spent implementing and testing prototypes based on the latest spec, e.g. The Eclipse ejc compiler or the latest Automatic Module Naming design in Maven.

If required, we very much look forward to being able to vote ‘YES’ in <= 30 days on a version that has had that little bit of extra time for the EG (and the ecosystem) to discuss / implement / test some of these difficult spec items. Certainly the last 14 days have shown that consensus can be reached even when viewpoints have started in opposing corners, and we think another short time period to really bed in the last sticking points is needed.
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, V2COM 投了赞成票(Yes), 并说明了原因:
V2COM shares other EC members' concerns, but we believe that all major concerns can be addressed between this ballot and the next ballot. 
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, Grimstad, Ivar 投了反对票(No), 反对的理由是:
I am voting "No" on the specification as it was submitted at the start of the voting period.  The discussion during the 14 day voting period has been very good, and I applaud the progress being made by the Spec Lead and EG in this period. Especially the latest Automatic Module Naming proposal.

With continued discussion and these changes incorporated in spec, I look forward to vote "Yes" in a potential reconsideration ballot.
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, Twitter 公司投了反对票(No), 反对的理由是:
We see the introduction of the Java Platform Module System (JPMS) in Java 9 as a desirable and worthwhile addition to the Java platform. We also appreciate the enormous and difficult task it has been to retrofit a mature and widely-used language like Java with a module system 20 years later. And we are thankful to the JSR lead, the Expert Group (EG), and everyone involved for their dedication and all the hard work it has taken to make it a reality.

Our main concern is that it is likely that this JSR will prove disruptive to Java developers, while ultimately not providing the benefits that would be expected of such a system. We are worried that this will delay wide-scale adoption of this important technology. We hope that if the JPMS accomplishes some of its original goals more comprehensively (in particular, collisions in non-exported package names are arguably incompatible with the "non-interference" and "strong encapsulation" goals) it can address real pain points that Java developers have today (e.g., dealing with multiple copies of the same package by hiding them as non-exported packages). This would encourage more developers to rapidly adopt modular development.

Finally, we think broader consensus among the JSR lead and the EG members is necessary for such an important JSR.
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, SouJava 投了赞成票(Yes), 并说明了原因:
SouJava votes YES for the Java Platform Module System specification. 

As others have said, we agree there has been a tremendous achievement in this effort by the team, in something many believed would never succeed. But the uneasiness of a specification that was not agreed by the EG it was ready for public review led the discussions inside SouJava towards a NO vote. 

The movement of the Spec Lead in the last few weeks changed the general sentiment, and we are thankful for the effort of solving the issues. 

We agree with the London Java Community and others that the specification AS WAS SUBMITTED for public review is lacking. We understand that the Spec Lead should focus on an initial release that will be improved later, and we were even willing to accept some compromising on the tooling issues. 

But if the specification does not support independent implementations, it's a bigger problem. Independent implementations are the primary objective of the JCP, and we do not intend to keep the yes vote if the situation persists. 

------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, Fujitsu Limited 投了赞成票(Yes), 并说明了原因:
There are a lot of concerns, but we hope EG members will resolve them by the next ballot.
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, Eclipse Foundation, Inc 投了反对票(No), 反对的理由是:
Like LJC, the Eclipse Foundation is voting "No" on the spec *as it was submitted* at the start of the voting period. The Eclipse Foundations looks forward to a revised specification which will enable independent implementations. The recent conversations have been very positive, and we feel that the expert group is moving into the right direction. However, the draft spec that are have been asked to vote on do contain a number of serious deficiencies, as documented by the recent conversations on the various mailing lists. We feel that the spec will be significantly improved by an opportunity to complete those conversations and include them in a revised draft.



------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, Hewlett Packard Enterprise 投了反对票(No), 反对的理由是:
While recognizing progress made by expert group and lead, Hewlett Packard enterprise prefers to allow expert group to address inputs, resolve open issues and come up with updated draft.  
------------------------------------------------------------------------------
最后一天, 星期一, 2017-05-08, Tomitribe 投了反对票(No), 反对的理由是:
Tomitribe’s no vote is tempered with a concern the specification does in fact make it through the JCP process successfully.  The risk of passing this JSR through to the next stage is that should it fail the Final Approval Ballot, the spec lead and EG have only 30 days to resolve all issues or the specification fails permanently per JCP rules.

We echo sentiments of other voters in applauding the progress in the last 14 days.  While the 30 days window afforded by a No vote will not gain a perfect consensus, we do believe it will help significantly.  It allows time for the dust to settle; with all the changes in the last 2 weeks, what exactly will be presented for a final vote is in some ways less clear.  

We see positives in opting for a 30 fixed window for feedback to and from the EC as it keeps pressure which is critical for momentum.  JSR-299 (CDI 1.0) went 9 months between its Public Review Ballot and Final Approval Ballot, delaying Java EE 5 significantly.  We would not want to see the same happen here.  The 30 day window applies both to the spec lead and essentially to the EG who knows we'll be voting immediately after.

Though a No vote feels like rejection we ultimately believe it is the most supportive vote for gaining a greater level of consensus we believe is necessary from a JSR, while still keeping time pressure.

------------------------------------------------------------------------------













相关链接:



向JCP执行委员会发出的公开信:

http://datamarket.atman360.com/133091











JCP的Twitter地址: [https://twitter.com/jcp_org](https://twitter.com/jcp_org)




