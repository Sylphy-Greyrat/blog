---
title: SpringBoot
#icon: fab fa-markdown
order: 2
category:
  - SpringBoot
tag:
  - SpringBoot 的概述
  - 后端
date: 2022-07-10
icon: iconfont icon-bxl-spring-boot
---
# Spring Boot

## Spring Boot 的概述

---

- Spring Boot 是基于 Spring 框架开发的全新框架，其设计目的是简新 Sping 应用的初始化搭建和开发过程。

- Spring Boot 整合了许多框架和第三方库配置，几乎可以达到“开箱即用”

  优点：

  1. 可***快速构建***独立的 Spring 应用
  2. 直接嵌入***Tomcat*** 、***Jetty*** 和 ***Undertow*** 服务器(无需部署 WAR 文件)
  3. 提供***依赖启动器***简化构建配置
  4. 极大程度的**自动化**配置 Spring 和***第三方库***
  5. 提供***生产就绪***功能
  6. ***极少***的***代码生成***和 ***XML 配置***

## JSP技术

---

1. JSP (Java Server Pages)的概述

   - 在 HTML 中嵌入 Java 脚本语音
   - 由应用服务器中的 JSP 引擎来编译和只行嵌入的 Java 脚本语言命令
   - 然后将生成的整个页面信息返回给客户端

2. JSP页面组成

   ![JSP 页面组成](http://minio.sylphy.me/blog/JSP页面组成.png)

3. JSP 执行过程

   - Web 容器处理 JSP 文件请求需要经过3个阶段：
     1. 翻译阶段：JSP 文件会被 Web 容器中的 JSP 引擎转换成 Java 源码
     2. 编译阶段：Java 源码会被编译成可执行的字节码
     3. 执行阶段：容器接受了客户端的请求后，执行编译成字节码的 JSP 文件；处理完请求后，容器把生产的页面反馈给客户端进行显示

4. Form 表单的请求处理

   - 用户通过表单控件输入并提交信息

   - JSP 获得表单数据，进行逻辑处理

   - JSP 根据处理结果，转向不同的结果页面

     ![Form 表单的处理过程](http://minio.sylphy.me/blog/Form表单的处理过程.png)

5. JSP 常用内置对象

   - JSP 内置对象是 Web 容器创建的一组对象

   - JSP 内置对象是可以直接在 JSP 页面使用的对象，无需使用“new”获取实例

   - JSP 内置对象的名称是 JSP 的保留字

   - 常用内置对象：

     1. ***out 对象***：用于向客户端输出数据

        常用方法：

        - print()：在页面中打印出字符串信息

     2. ***request 对象***：主要用于处理客户请求

        常用方法：

        | 方法名称                                  | 说明                                                         |
        | :---------------------------------------- | ------------------------------------------------------------ |
        | String getParameter(String name)          | 根据页面表单组件名称获取页面提交数据                         |
        | String[] getParameterValues(String name)  | 获取一个页面表单组件对应多个值时的用户的请求数据             |
        | void setCharacterEncoding(String charset) | 指定每个请求的编码<br>在调用 ***request.getParameter()*** 之前进行设定，可以解决中文乱码问题 |
        | request.getRequestDispatcher(String path) | 返回一个 javax.servlet.RequestDispatcher 对象，该对象的 ***forward()*** 方法用于转发请求 |

     3. ***response 对象***：用户响应客户请求并向客户端输出信息

        常用方法：

        - void sendRedirect(String location)：将请求重新定位到一个不同的URL

## Spring Boot配置

---

1. Maven 构建 Spring Boot 项目：

   1. Spring Boot 依赖：

       ~~~xml
           <!-- 引入Spring Boot依赖
               1.统一进行版本控制
               2.让当前项目具有spring boot特性
               3.加载指定的配置文件
           -->
           <parent>
               <artifactId>spring-boot-dependencies</artifactId>
               <groupId>org.springframework.boot</groupId>
               <version>2.3.3.RELEASE</version>
           </parent>
           <dependencies>
               <!--引入Web场景依赖启动器，引入spring boot相关依赖-->
               <dependency>
                   <groupId>org.springframework.boot</groupId>
                   <artifactId>spring-boot-starter-web</artifactId>
               </dependency>
           </dependencies>
       ~~~

   2. 主程序启动类：

       ~~~java
       import org.springframework.boot.SpringApplication;
       import org.springframework.boot.autoconfigure.SpringBootApplication;
       @SpringBootApplication  //该类为主程序启动类
       public class Main {
               public static void main(String[] args) {
       		SpringApplication.run(Main.class);
               }
       }
       ~~~
       
   3. 创建一个用于 Web 访问的 Controller
   
       ~~~java
       import org.springframework.web.bind.annotation.GetMapping;
       import org.springframework.web.bind.annotation.RestController;
       
       @RestController     //该注解为组合注解，@ResponseBody+@Controller
       public class test {
               @GetMapping("/test")   //GetMapping相当于RequestMapping(value="/hello, method = RequestMethod.GET)
               public String hello(){
       		return "hello spring boot"；
               }
       }
       ~~~
   
2. Spring Initializr 构建 Spring Boot 项目


 ## 单元测试

---

1. 依赖

   ~~~xml
   <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-test</artifactId>
               <scope>test</scope>
   </dependency>
   ~~~

   

2. 测试文件例子

   ~~~java
   @RunWith(SpringRunner.class)    //测试启动器，并加载Spring Boot测试注解
   @SpringBootTest     //标记Spring Boot单元测试，并加载项目的applicationcontext上下文环境
   class DemoApplicationTests {
   	@Autowired
   	private test www;
   	@Test
           void contextLoads() {
           String hello = www.hello();
   		System.out.println(hello);
           }
   }
   ~~~

## 热部署

---

1. 依赖

   ~~~xml
   <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-devtools</artifactId>
   </dependency>
   ~~~

2. 设置

   ![单元测试设置-1](http://minio.sylphy.me/blog/单元测试设置-1.png)

   ![单元测试设置-2](http://minio.sylphy.me/blog/单元测试设置-2.png)

## Spring Boot 依赖管理

---

1. spring-boot-starter-parent 依赖

   spring-boot-starter-parent 依赖是通过\<properties>标签对一些常用技术框架的依赖文件进行了***统一版本号管理***。

2. spring-boot-starter-web 依赖

   spring-boot-starter-web 依赖启动器的主要作用是提供 Web 开发场景所需的底层所有依赖文件，它对 Web ***开发场景所需的依赖文件***进行了***统一管理***。

## Spring Boot自动配置

---

- ***@SpringBootApplication***
  - ***@SpringBootConfiguration***：表示spring boot配置类
  - ***@EnableAutoConfiguration***：表示开启自动配置功能
    - ***@AutoConfigurationPackage***：帮助自动配置包
    - ***@Import({AutoConfigurationImportSelector.class})***：导入其他配置类
      - getAutoConfigurationEntry：自动将一些配置类进行扫描导入 ***(这个方法在AutoConfigurationImportSelector.class 中)***
  - ***@ComponentScan***：帮助进行包扫描 ***(只扫描所在的包及其子包)***

Spring Boot 应用的启动入口是 ***@SpringBootApplication*** 注解标注类中的main()方法；

- 其中 ***@SpringBootApplication*** 为一个组合注解，包含 ***@SpringBootConfiguration*** 、***@EnableAutoConfiguration*** 、***@ComponentScan*** 三个核心注解。

## Spring Boot执行流程

---

1. 初始化 Spring Application 实例：
   1. 判断当前项目类型：查看 classpath 类路径 webApplicationType 下是否存在某个特征类
   2. 应用的初始化器设置：获取所有可用的应用初始化器类 ApplicationContextInitializer
   3. 应用的监听设置：获取所有可用的监听器类 ApplicationListener
   4. 设置项目启动类：this.mainApplicationClass = this.deduceMainApplicationClass()
   
2. 初始化Spring Boot项目启动：
   1. 获取并运行监听器：获取监听器并运行
   
   2. 准备项目运行环境：对项目环境进行预设置
   
   3. 应用上下文装配：对项目应用上下文 ApplicationContext 的预配置
   
   4. 启动上下文：运行监听器启动配置号的应用上下文
   
   5. 运行自定义执行器：调用项目中自定义执行器
   
   6. 持续运行上下文：使监听器持续运行配置好的应用上下文
   
      ![Spring Boot项目启动流程](http://minio.sylphy.me/blog/SpringBoot项目启动流程.png)

## 配置文件属性值注入

---

1. 使用 ***@ConfigurationProperties*** 注入属性

   - 相关注解：
     1. ***@Component***：生成当前类的实例对象存到 IOC 容器中
     2. ***@ConfigurationProperties(prefix = "xxx")*** ：将配置文件中的前缀为 xxx 的每个属性的值映射到当前类中是变量上

   使用 ***@ConfigurationProperties*** 注解批量注入属性值时，要保证配置文件中的属性与对应实体类的属性***一致*** ，否则无法正确获取并注入属性值。

2. 使用 ***@Value*** 注入属性

   - 相关注解：
     1. ***@Component***
     2. ***@Value("${test.xxx}")***

   使用 ***@Value*** 注解对每一个属性注入设置，免去了属性 setXX() 方法

***

两种注解的对比分析：

| 对比点           | @ConfigurationProperties | @Value   |
|---------------| ------------------------ | -------- |
| 底层框架          | Spring Boot              | Spring   |
| 功能            | 批量注入配置文件中的属性 | 单个注入 |
| 属性 setXX() 方法 | 需要                     | 不需要   |
| 复杂类型属性注入      | 支持                     | 不支持   |
| 松散绑定          | 支持                     | 不支持   |
| JSR303 数据校验   | 支持                     | 不支持   |
| SpEL 表达式      | 不支持                   | 支持     |

## Spring Boot 自定义配置

---

​		如若使用了 ***@Configuration*** 则还需添加 ***@EnableConfigurationProperties(xxx.class)*** 用以开启配置类的属性注入功能

1. 使用 ***@PropertySource*** 加载配置文件

   - 相关注解：
     1. ***@PropertySource("classpath:xxx.properties")***：指定自定义配置文件的位置和名称
     2. ***@Configuration***：自定义配置类，Spring容器组件(也可使用 ***@Component*** 注解代替)

2. 使用 ***@ImportResource*** 加载 XML 配置文件

   - 相关注解：

     1. ***@ImportResource("classpath:xxx.xml")***：指定 XML 文件位置

   - 注意在测试类中需要引入 ***ApplicationContext*** 实体类 Bean，并新增一个测试方法进行输出测试

     ~~~java
     @Autowired
     private ApplicationContext applicationContext;
     @Test
     @ImportResource("classpath:xxx.xml")
     void contextLoads() {
     	System.out.println(applicationContext.containsBean("xxx"));
     }
     //用以测试实体类Bean是否引入成功
     ~~~
     

3. 使用 ***@Configuration*** 编写自定义配置类

   - 相关注解：

     1. ***@Configuration***：定义一个配置类
     2. ***@Bean***：进行组件配置

     ~~~java
     @Configuration
     public class test {
             @Bean(name = "xxx")   //将标注方法的返回值存到spring容器中
             public test xxx(){
     		return new test();
     	}
     }
     ~~~

   - 测试类与上一步写法一样

## 多环境配置

---

在实际开发中，应用程序通常需要部署不同的运行环境中，例如开发环境、测试环境、生产环境等。不同的环境可能需要不同的环境配置，针对这种情况，不可能手活动变更配置文件来适应不同的开发环境，此时就需要对项目进行***多环境配置***。

1. profile文件多环境配置

   1. 多环境配置文件格式：application-{profile}.properties	***注：{profile} 为对应具体的环境标识***

   2. 激活指定环境的方式

      1. 通过命令行方式激活指定环境的配置文件

         1. 使用 MVN 的 mvn package 指令打包

         2. 使用终端进入 target 查找 jar 包，输入以下代码

            ~~~
            java -jar 名称.jar --spring.profiles.active = {profile}
            ~~~

      2. 在全局配置文件设置 spring.profiles.actice 属性激活

         - 在 application.properties 文件下输入 spring.profiles.actice = \{profile}

2. @profile注解多环境配置

   - 相关注解：
     1. @Profile(value = “{profile}”)：作用于类，通过 value 属性指定环境配置
   - 在全局配置文件设置 spring.profiles.actice 属性激活
     - 在application.properties文件下输入spring.profiles.actice = \{profile}

## 随机值设置以及参数间引用

---

1. 随机值设置

   1. 语法格式：${random.xx}	***注：xx 表示需要指定生成的随机数类型和范围。***

   2. 示例代码：

      ~~~properties
      #在application.properties文件下
      #配置随机数
      my.secret = ${random.value}
      #配置随机数为整数
      my.number = ${random.int}
      #配置随机数为uuid类型
      my.uuid = ${random.uuid}
      #配置小于10的随机整数
      my.int = ${random.int(10)}
      #配置范围在[1024,2048]之间的随机整数
      my.int = ${random.int[1024,2048]}
      ~~~

2. 参数间引用

   1. 语法格式：${xx}	***注：xx 表示先前在配置文件中已经配置过的属性名。***

   2. 示例代码：

      ~~~properties
      Tom.age = ${random.int[20,30]}
      Tom.description = Tom的年龄可能是 ${Tom.age}
      ~~~

