---
title: Maven
#icon: fab fa-markdown
order: 2
category:
  - Maven
tag:
  - Maven
date: 2022-6-27
icon: iconfont icon-Maven
---
# MAVEN

## maven 的主体框架

---

![maven的主体框架](http://minio.sylphy.me/blog/maven的主体框架.png)

## maven 的安装与配置

---

1. 下载 JDK

   在 Java 官⽅⽹站 下载并安装 JDK 7.0 及以上版本， JDK 的安装和配置请参考：

   1. [JDK官网](https://www.oracle.com/java/technologies/)
   2. [JDK环境配置](https://blog.csdn.net/xhmico/article/details/122390181)

2. 下载 maven

   1. [maven 官网](https://maven.apache.org/download.cgi)

   2. [maven 环境配置](https://blog.csdn.net/u012660464/article/details/114113349)***（以下重点）***

      * 配置 Maven 本地仓库：

        在 settings 标签内添加 localRepository 标签，设置本地 Maven 仓库路径，相应的依赖将会 被下载到该⽬录下。相关配置如下：

        ~~~maven
         <!-- 配置本地仓库 -->
        <localRepository>E:\repository</localRepository>
        ~~~

      * Maven 中央仓库换国内源

        由于默认的中央仓库服务器在国外，为了加速 jar 包访问速度，需要将仓库配置为阿⾥云源仓库。在settings.xml ⽂ 件中找到 mirrors 标签，添加阿⾥源的地址，参考配置如下所示：

        ~~~maven
        <mirrors>
            <mirror>
                <id>alimaven</id>
                <name>aliyun maven</name>
                <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
                <mirrorOf>central</mirrorOf>
            </mirror>
        </mirrors>
        ~~~

## maven 项目常用命令

***

| MAVEN常用命令                                                                 |
|:--------------------------------------------------------------------------|
| 1. mvn clean : 清理,清理 target 下的⽬标⽂件                                        |
| 2. mvn package : 打包,将源码编译后打包为 jar/war,到 target 下                          |
| 3. mvn compile: 编译源代码                                                     |
| 4. mvn clean package : 清理且打包,⼀起运⾏                                         |
| 5. mvn clean package -maven.test.skip=true : 清理且打包,同时跳过 test 测试           |
| 6. mvn clean compile package -maven.test.skip=true : 清理编译且打包,同时跳过 test 测试 |
| 7. mvn test-compile : 运⾏测试                                                |
| 8. mvn depoly: 部署,将⽣产的⽬标⽂件上传到本地仓库和公司仓库                                    |
| 9. mvn jetty:run : 调⽤ Jetty 插件的 Run ⽬标在 Jetty Servlet 容器中启动 web 应⽤        |

## maven项目的生命周期

***

| ***验证***       | ***处理描述***                              |
| ---------------- |-----------------------------------------|
| 验证（validate） | 验证项⽬是否正确，所有必要的信息可⽤。                     |
| 编译（compile）  | 编译项⽬的源代码。                               |
| 测试（test）     | 使⽤合适的单元测试框架测试编译的源代码。这些测试不应该要求代码被打包或部署 。 |
| 打包（package）  | 采⽤编译的代码，并以其可分配格式（如 JAR）进⾏打包。            |
| 验证（verify）   | 对集成测试的结果执⾏任何检查，以确保满⾜质量标准 。              |
| 安装（install）  | 将软件包安装到本地存储库中，⽤作本地其他项⽬的依赖项 。            |
| 部署（deploy）   | 在构建环境中完成，将最终的包复制到远程存储库以与其他开发⼈员和项⽬共享。    |
