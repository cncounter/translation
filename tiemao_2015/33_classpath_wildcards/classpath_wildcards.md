Spring 中的 `classpath*:`  与 `classpath:`
==

> Spring可以通过指定 `classpath*:` 与 `classpath:` 前缀加路径的方式从 classpath 加载文件,如 bean 的定义文件. `classpath*:` 的出现是为了从多个jar文件中加载相同的文件. 而 `classpath:` 只能加载找到的第一个文件.
>
> 本段引自 [http://blog.csdn.net/kkdelta/article/details/5507799](http://blog.csdn.net/kkdelta/article/details/5507799)


I recently resolved a build problem nestled deep within the esoterica of spring resource loading. The behavior of classpath: URLs is explained at length in the Spring documentation, but, sadly, this is probably the last place a developer of my disposition would look. The problem (which I describe in more detail beyond the fold) was that we were unable to load hibernate mapping files from our Spring configured integration tests even though they gave us no trouble in our web application. The solution was to replace the “classpath:” prefix of our mappingLocation URI with “classpath*:”.


最近填平了一个 Spring 加载资源时的深坑。虽然 [Spring文档](http://docs.spring.io/autorepo/docs/spring/3.2.x/spring-framework-reference/html/resources.html#resources-app-ctx-wildcards-in-resource-paths) 里详细地解释了 `classpath: URLs` 有关的东西, 但作为一个码农,这种文档平时肯定是不会看的。问题是这样的, 在 webapp 里面一切正常, 但在跑单元测试时就是加载不到 Hibernate 的 mapping 文件。最后是将前缀  “ `classpath:` ” 换成  “ `classpath*:` ” 就解决了。



In this project, we are storing our Hibernate mapping files as separate files located in the package of the class they map (i.e. “Foo.hbm.xml” stored in “src/main/java/com/example/”). We inherited the persisted classes and Hibernate and Spring configuration from another project. The sessionFactory configuration in spring specified the mappingLocations as “classpath:**/*.hbm.xml” which worked fine when we deployed the web application.


在项目中, 我们将每个 Hibernate 映射文件单独存放在对应类的同一个 package 下(如 “ `Foo.hbm.xml` 存放在 “ `src/main/java/com/example/` ” 里面)。并且从另一个项目继承了 持久化类, Hibernate 以及 Spring 的配置。spring 中配置的 `sessionFactory` 指定了 `mappingLocations` 为 “`classpath:**/*.hbm.xml`”, 部署为 web 应用之后一切良好。


We soon ran into problems when we added integration tests to test new DAO functionality. The test configuration was not able to find any hibernate mappings even though we were using the same “classpath:**/*.hbm.xml” URI. After a few hours of hair-pulling and a deep tour of the Spring source, we realized that the problem was that our test Spring configuration was in a different classpath root from the Hibernate mappings, even though both directories were in the test’s classpath.



但很快就碰到坑了, 也就是用集成测试来测试新的 DAO 功能时。测试的配置死活找不到 hibernate 的映射文件, 使用相同的URI 也不行 “`classpath:**/*.hbm.xml`” 。拆开 Spring 的源码后才搞明白, 我们测试中的 Spring 配置文件和 Hibernate 的映射文件不属于同一个 classpath root , 虽然两个目录都加到了测试的  classpath 中。



When you use ‘classpath:’ for an Ant style wildcard search, Spring uses a single classpath directory for the search. The documentation is vague, but it seems the directory returned will be the first one provided by ClassLoader.getResources(“”). In our case, it returned the ‘/target/test-classes’ directory that contains applicationTest.xml and our test classes, instead of ‘/target/classes’ which contains application.xml and all the *.hbm.xml files.


当使用 ‘`classpath:`’ 加上 Ant 风格的通配符时, Spring查找的是单个 classpath 目录。虽然文档没有明确说明, 但应该是会返回 `ClassLoader.getResources(“”)` 匹配的第一个目录。在我们的例子中, 它返回的是‘`/target/test-classes`’ 目录, 其中包含了 `applicationTest.xml` 和测试类, 而没有查找 ‘/target/classes’ 目录, 这里面却包含了  `application.xml` 和所有的 `*.hbm.xml` 文件。




Using the ‘classpath*:’ prefix fixes the problem. It indicates that the resource loader should look in all directories on the classpath, so making this change solved our problem. Apparently Spring maintains both prefixes because limitations in the Classloader (at the specification level) make it difficult to search for resources in the classpath root when performing wildcard searches across all classpath directories. This suggest it might be good practice to always create a directory to contain resources you might otherwise want to put in the classpath root and always use the ‘claspath*:’ prefix.


后来我们使用 ‘`classpath*:`’ 前缀解决了这个问题。这个前缀让资源加载器(resource loader) 应去扫描 classpath 中的所有目录。因为规范中 ClassLoader 的限制, 导致Spring 在进行通配符(wildcard)查找时很难去扫描所有 classpath 下的 root 路径, 所以 Spring 兼容了这两种前缀。通过这次填坑, 我们认为最佳实践是创建一个目录来存放可能需要放到 classpath 里面的资源, 并使用 “ `claspath*:` ” 这种前缀形式。


> **相关链接** : [附6.7.2 在 resource path 中使用通配符(wildcard)](http://docs.spring.io/autorepo/docs/spring/3.2.x/spring-framework-reference/html/resources.html#resources-app-ctx-wildcards-in-resource-paths)


原文链接: [Using classpath*: vs. classpath: when loading Spring resources.](http://blog.carbonfive.com/2007/05/17/using-classpath-vs-classpath-when-loading-spring-resources/)


翻译日期: 2015年11月18日

翻译人员: [铁锚 http://blog.csdn.net/renfufei](http://blog.csdn.net/renfufei)
