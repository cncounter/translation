# SwaggerUI 增加公共的Global全局Header

> 为了调试方便, 想要在 SwaggerUI 的 "Try it out" 页面中增加一个认证 Header, 一个个接口添加注解就太麻烦了，有没有什么方式可以全局生成呢? 网上找了很多资料都不生效, 最后终于搞定了, 所以才有了这篇文章。

## 简介

SwaggerUI 是一个自动为 SpringMVC Controller 接口生成接口文档的框架。 还通过注解添加额外的备注,提供更友好的信息。 

老版本的 Swagger UI 增加Header配置, 使用的是 `Docket`, 可以参考: [Global Header in Swagger-Ui Spring-Boot](https://dev.to/s2agrahari/global-header-in-swagger-ui-spring-boot-5188)

SwaggerUI, 现在改名叫做 springdoc-openapi, 相关的属性配置可以参考:

> https://springdoc.org/properties.html


普通的SpringBoot项目, 可以在 `pom.xml` 中使用如下依赖引入 SwaggerUI :


```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-ui</artifactId>
    <version>1.7.0</version>
</dependency>
```


简单的配置示例为:

```yml

springdoc:
  api-docs:
    # 启用 swaggerUI
    enabled: true   
    # 启用分组
    groups:
      enabled: true 
  # 指定需要扫描的包
  packages-to-scan: com.cncounter 
  swagger-ui:
    path: doc.html
  group-configs:
    - group: '1-前端接口'
      paths-to-match: /api/**
    - group: '2-系统内部接口'
      paths-to-match: /inter/**
    - group: '3-定时任务接口'
      paths-to-match: /job/**
    - group: '4-其他接口'
      paths-to-exclude:
        - /api/**
        - /inter/**
        - /job/**

```

## 问题描述

为了调试方便, 想要在 "Try it out" 页面中增加一个认证 Header. 


## 排查过程

SpringBoot方式的配置文件, 提供了 `group-configs` 选项,  这种方式目前只支持简单的配置, 不支持自定义行为;



最后在 Github 找到一个方案: 

链接: [Global headers aren't appearing in the Swagger UI #466](https://github.com/springdoc/springdoc-openapi/issues/466)

代码为:


```java
@Bean
public OpenApiCustomiser customerGlobalHeaderOpenApiCustomiser() {
	return openApi -> openApi.getPaths().values().stream().flatMap(pathItem -> pathItem.readOperations().stream())
			.forEach(operation -> operation.addParametersItem(new HeaderParameter().$ref("#/components/headers/Version")));
}
```

简单一试, 没有生效。 

增加了日志调试, 发现对应的Bean确实生成了,  但是没有调用。

## 解决方案

但是这哥们的方案也提供了一些思路。

按照Spring的套路, 应该是需要自己注册Bean, 于是翻阅代码, 搜索 `OpenApiCustomiser` , 找到了 `GroupedOpenApi` 类。


又找到了一篇Swagger老版本和新版本迁移的注解变化, 可参考:

> [Migrating from SpringFox](https://springdoc.org/migrating-from-springfox.html)


里面提到:


Replace swagger 2 annotations with swagger 3 annotations (it is already included with springdoc-openapi-ui dependency). Package for swagger 3 annotations is io.swagger.v3.oas.annotations.

```java

@Api → @Tag

@ApiIgnore → @Parameter(hidden = true) or @Operation(hidden = true) or @Hidden

@ApiImplicitParam → @Parameter

@ApiImplicitParams → @Parameters

@ApiModel → @Schema

@ApiModelProperty(hidden = true) → @Schema(accessMode = READ_ONLY)

@ApiModelProperty → @Schema

@ApiOperation(value = "foo", notes = "bar") → @Operation(summary = "foo", description = "bar")

@ApiParam → @Parameter

@ApiResponse(code = 404, message = "foo") → @ApiResponse(responseCode = "404", description = "foo")

```



那我们就加上 GroupedOpenApi 配置呗, 

具体的配置代码为:

```java
package com.cncounter.web.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.parameters.HeaderParameter;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.GroupedOpenApi;
import org.springdoc.core.customizers.OpenApiCustomiser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collection;
import java.util.List;

@Slf4j
@Configuration
public class SwaggerConfig {


    @Bean
    public OpenApiCustomiser customerGlobalHeaderOpenApiCustomiser() {
        log.info("[系统启动][SwaggerUI]initBean: customerGlobalHeaderOpenApiCustomiser");
        return new OpenApiCustomiser(){
            @Override
            public void customise(OpenAPI openApi) {
                Paths paths = openApi.getPaths();
                //log.info("[系统启动][SwaggerUI]paths="+paths.toString());
                Collection<PathItem> values = paths.values();
                for (PathItem pathItem : values) {
                    List<Operation> operations = pathItem.readOperations();
                    //
                    for (Operation operation : operations) {
                        HeaderParameter headerParameter = new HeaderParameter();
                        //headerParameter.setRequired(true);
                        headerParameter.setName("token");
                        operation.addParametersItem(headerParameter);
                    }
                }
            }
        };
    }

    @Bean
    public GroupedOpenApi adminApi(OpenApiCustomiser customerGlobalHeaderOpenApiCustomiser) {
        //log.info("[系统启动][SwaggerUI]initBean: adminApi");
        return GroupedOpenApi.builder()
                .group("1-前端接口")
                .pathsToMatch("/api/**")
                .addOpenApiCustomiser(customerGlobalHeaderOpenApiCustomiser)
                .build();
    }
}
```

同时需要把对应的 group-configs 配置注释掉:

```yml
  group-configs:
#    - group: '1-前端接口'
#      paths-to-match: /api/**
    - group: '2-系统内部接口'
      paths-to-match: /inter/**
```

## 其他思考


HeaderParameter 实际上是定制了 Parameter;

```java
public class HeaderParameter extends Parameter {
    private String in = "header";
    // ...
}
```


本文中的案例, 因为是已经有了 yml 配置文件, 只想最小化改动, 所以配置了一部分 Bean。


按照这个思路, 增加全局统一的其他参数也可以类似实现。 可以加更多 Header, 可以按分组来配置, 也可以加其他参数。


## 更多文档

- [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification/blob/3.0.1/versions/3.0.1.md)
- [OpenAPI Guide](https://swagger.io/docs/specification/about/)


原文链接: [https://github.com/cncounter/translation/](https://github.com/cncounter/translation/)
原文作者: 铁锚
原文日期: 2023年05月06日
