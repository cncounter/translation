# spring通过QQ邮箱发送Email

spring-context-support很早就内置支持邮件发送。

当然, 官方文档明确指出, 需要依赖 JavaMail 这个库。


在这个年代, 我们很少自己搭建 smtp 服务器来发送邮件, 一般都是使用邮件提供商的服务。 例如 QQ邮箱, 企业邮箱, 163, 或者阿里云之类的厂商。

注册一个账号， 然后参考邮件服务商的帮助中心, 以及账户设置页面, 获取smtp服务器端口信息, 以及你注册的账号和密码, 保存到一个比较安全的地方。


## 相关依赖。

pom.xml中的依赖如下:

```
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context-support</artifactId>
    <version>4.0.7.RELEASE</version>
</dependency>
<dependency>
    <groupId>javax.mail</groupId>
    <artifactId>mail</artifactId>
    <version>1.4.7</version>
</dependency>
```


## 简单测试代码

下面是简单的测试代码。 实际使用时请参考本文末尾的相关链接。把代码组织好看一点,好用一点。

```
package com.cncounter.test.spring;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;

public class TestSpringEmail {
    public static void main(String[] args) {
        //
        sendTextEmail();
    }
    public static void sendTextEmail() {
        //
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        // 参考QQ邮箱帮助中心
        mailSender.setHost("smtp.qq.com"); // QQ邮箱smtp发送服务器地址
        //mailSender.setPort(465); // QQ这个端口不可用
        mailSender.setPort(587);// 端口号
        mailSender.setUsername("10001@qq.com"); // 使用你自己的账号
        mailSender.setPassword("usbusbcnzztbsbtob"); // 授权码-发短信获取
        // 邮件信息
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("10001@qq.com"); // 发件人邮箱
        msg.setTo("10086@vip.qq.com"); // 收件人邮箱
        msg.setSubject("测试Spring邮件"); // 标题
        msg.setText("您的订单号码: 20181120075; 请勿告诉别人!"); // 文本信息
        try {
            mailSender.send(msg);
            System.out.println("邮件发送成功!"); // 没有报错就是好消息 :-)
        } catch (MailException ex) {
            System.err.println("发送失败:" + ex.getMessage());
        }
    }
}

```

如果需要发送附件, 发送图片, 发送HTML等, 请参考下面的相关链接。


## 相关链接

Spring Email使用教程: <http://www.baeldung.com/spring-email>

spring集成Email文档: <https://docs.spring.io/spring/docs/current/spring-framework-reference/integration.html#mail>

日期: 2018年3月1日
