
# yuicompressor-maven 插件合并JS与CSS

需要注意的是, yuicompressor插件仓库的地址是 HTTPS 协议。


> `pom.xml` 文件配置示例如下:



    <!-- ... -->
    <pluginRepositories>
        <pluginRepository>
            <name>oss.sonatype.org</name>
            <id>oss.sonatype.org</id>
            <url>https://oss.sonatype.org/content/groups/public</url>
        </pluginRepository>
    </pluginRepositories>

    <build>
        <finalName>cncounter</finalName>
        <!--指定测试配置路径-->
        <testResources>
            <testResource>
                <directory>src/test/resources</directory>
            </testResource>
        </testResources>
        <plugins>
            <plugin>
                <groupId>net.alchim31.maven</groupId>
                <artifactId>yuicompressor-maven-plugin</artifactId>
            </plugin>
            <!-- You should have this already in you pom.xml! -->
            <plugin>
                <artifactId>maven-war-plugin</artifactId>
                <version>2.3</version>
            </plugin>
        </plugins>
        <pluginManagement>
            <plugins>
                <!--
                使用方法:
                mvn clean net.alchim31.maven:yuicompressor-maven-plugin:compress package -X -DskipTests
                -->
                <plugin>
                    <groupId>net.alchim31.maven</groupId>
                    <artifactId>yuicompressor-maven-plugin</artifactId>
                    <version>1.5.1</version>
                    <configuration>
                        <encoding>UTF-8</encoding>
                        <!-- 忽略 js 错误警告 -->
                        <jswarn>false</jswarn>
                        <nosuffix>true</nosuffix>
                        <linebreakpos>1000</linebreakpos>
                        <!-- 此处为压缩配置-->
                        <excludes>
                            <exclude>**/*.js</exclude>
                            <exclude>**/*.css</exclude>
                        </excludes>
                        <warSourceDirectory>${basedir}/src/main/webapp</warSourceDirectory>
                        <webappDirectory>${project.build.directory}</webappDirectory>
                        <aggregations>
                            <aggregation>
                                <!-- 合并CSS-->
                                <insertNewLine>true</insertNewLine>
                                <inputDir>${project.basedir}/src/main/webapp/WEB-INF/resources/css</inputDir>
                                <output>${project.build.directory}/${project.build.finalName}/WEB-INF/resources/css/custom.all.min.css</output>
                                <includes>
                                    <include>*.css</include>
                                </includes>
                                <excludes>
                                    <exclude>**/*.js</exclude>
                                </excludes>
                            </aggregation>
                            <aggregation>
                                <!-- 合并JS-->
                                <insertNewLine>true</insertNewLine>
                                <inputDir>${project.basedir}/src/main/webapp/WEB-INF/app</inputDir>
                                <output>${project.build.directory}/${project.build.finalName}/WEB-INF/app/custom.all.min.js</output>
                                <includes>
                                    <include>**/**.js</include>
                                </includes>
                                <excludes>
                                    <exclude>**/*.css</exclude>
                                    <exclude>**/*.html</exclude>
                                </excludes>
                            </aggregation>
                        </aggregations>
                    </configuration>
                    <executions>
                        <execution>
                            <id>compress_js_css</id>
                            <phase>process-resources</phase>
                            <goals>
                                <goal>compress</goal>
                            </goals>
                        </execution>
                    </executions>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
    <!-- ... -->


日期： 2016年9月6日
参考: [https://gist.github.com/hatemalimam/9804007](https://gist.github.com/hatemalimam/9804007)

