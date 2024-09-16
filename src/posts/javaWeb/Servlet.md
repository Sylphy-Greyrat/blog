---
title: Servlet
#icon: fab fa-markdown
order: 2
category:
  - Maven
tag:
  - Servlet
  - 后端
date: 2022-9-18
---
# Servlet

## Servlet 的配置

---

### Servlet 的概述

- Servlet 是一个运行在 web 服务器端的一个 java 程序，也可以认为就是一个 java 类，在使用 servlet 时，需要导入 javax.servlet 下的 jar 包，比如：**tomcat 服务器提供了 servlet 的 jar 包，所以在开发时用 tomcat 服务器就不需要再导入 servlet 的 jar 包**。

- Servlet 它是一个资源，是用来被用户访问的资源，同时是一个动态资源，它是由 sun 指定的 servlet 规范。

- Servlet 的作用：它是基于 Http 协议的，主要是用来接受客户端发送的请求，处理请求，把数据响应给客户端。

  ![Servlet 的用途](http://minio.ozh.asia/blog/Servlet的用途.png)

### Servlet 的依赖

在 pom.xml 文件中添加 Servlet 依赖。参考配置如下所示：

~~~xml
<!--引入Servlet依赖-->
 <dependency>
       <groupId>javax.servlet</groupId>
     <artifactId>javax.servlet-api</artifactId>
     <version>4.0.1</version>
 </dependency>
 
  <!--引入jsp依赖-->
 <dependency>
       <groupId>javax.servlet.jsp</groupId>
       <artifactId>jsp-api</artifactId>
       <version>2.2</version>
 </dependency>
~~~

## Servlet的使用

---

可以参考以下文档： [***JAVA-EE-api***](..\JAVA_EE_api_中英文对照版.chm)

- Servlet 的接口和实现类：

  Servlet 它是一个接口，在 javax.servlet 包下面。

  1. Servlet 方法总结：

     | 方法类型      | 方法名                                                       |
     | ------------- | ------------------------------------------------------------ |
     | void          | destroy() <br>Called by the servlet container to indicate to a servlet that the servlet is being taken out of service.<br>由 servlet 容器调用，指示将从服务中取出该 servlet。 |
     | ServletConfig | getServletConfig()<br>Returns a ServletConfig object, which contains initialization and startup parameters for this servlet.<br />返回 ServletConfig 对象，该对象包含此 servlet 的初始化和启动参数。 |
     | String        | getServletInfo()<br>Returns information about the servlet, such as author, version,  and copyright.<br>返回有关 servlet 的信息，比如作者、版本和版权。 |
     | void          | init (ServletConfig config)<br>Called by the servlet container to indicate to a servlet that the servlet is  being placed into service.<br>由 servlet 容器调用，指示将该 servlet 放入服务。 |
     | void          | service(ServletRequest req,ServletResponse res)<br>Called by the servlet container to allow the servlet to respond to a request.<br>由 servlet 容器调用，以允许 servlet 响应某个请求。 |
  
  2. GenericServlet 它是一个类，实现了 Servlet 接口

  3. HttpServlet 它是一个类，实现了 Servlet 接口，同时继承了 GenericServlet

- 创建 Servlet 三种方式

  1. 直接实现 Servlet 接口。

  2. 继承 GenericServlet 类。

  3. 继承 HttpServlet 类。

     一般在开发中，创建 Servlet，通常去继承这个 HttpServlet。

     比如：class MyServlet extends HttpServlet{ 重写自己所需的方法 }

## Servlet 技术-*处理 Http 请求*

---

### 使用 Servlet 接受参数

> - JavaServlet 中的 HttpServletRequest 提供了 getParameter() 接口用于获取客户端参数
>
> ~~~java
> public String getParameter(String name);
> ~~~
>
> ***说明：该方法的参数 name 为字符串类型，对应于前端的参数名，返回结果为 String 类型，以字符串形式表示所获取到的参数值。***
>
> > - 需要手动将获取到的字符串转换为整数类型。字符串类型转换为其他类型的参考代码如下：
> >
> > ~~~java
> > /*以下两句为如何以字符串形式表示所获取到的参数值。*/
> > String ageStr  = request.getParameter("age");
> >  Integer age = Double.parseInt(ageStr);
> > /**其中s为String类型*/
> >  byte b = Byte.parseByte(s);
> >  short t = Short.parseShort(s);
> >  int i = Integer.parseInt(s);
> >  long l = Long.parseLong(s);
> >  Float f = Float.parseFloat(s);
> >  Double d = Double.parseDouble(s);
> > ~~~
> >
> > > - **中文乱码产生的原因**：由于 tomcat 服务器使用的是西文 iso-8859-1 的编码方式，而浏览器通常使用中文的 GBK 或者 UTF-8 编码进行中文文字的表示，因此在使用 Servlet 接收中文数据时和输出中文数据时容易产生乱码，解决乱码的方式如下：
> > >
> > > ``` java
> > > //设置输出编码类型和文档类型
> > >  response.setCharacterEncoding("utf-8");
> > >  response.setContentType("text/html");
> > > ```

### 使用 Servlet 获取 Http 报文头部数据

- Http 报文头部包含了 Http 通信过程中的协议参数以及客户端浏览器的相关信息，使用 Servlet 可以获取 Http 头部参数，主要的方法如下：

  •      String getHeader(String name)：获取指定名称的请求头；

  •      Enumeration getHeaderNames()：获取所有请求头名称；

  •      int getIntHeader(String name)：获取值为int类型的请求头。

  ***通常为了更便捷的获取 Http 头部信息，我们会使用下面的 API 接口。***

  | 方法                           | 说明                                                         |
  | ------------------------------ | ------------------------------------------------------------ |
  | int  getContentLength()        | 获取请求正文的字节数，GET 请求没有正文，没有正文返回 -1      |
  | String  getContentType()       | 获取请求类型，如果请求是 GET，那么这个方法返回 null ；如果是 POST 请求，那么默认为 application/x-www-form-urlencoded |
  | String getMethod()             | 返回请求方法，例如：GET                                      |
  | Locale getLocale()             | 返回当前客户端浏览器支持的 Locale 。java.util.Locale 表示国家和言语，用于国际化 |
  | String  getCharacterEncoding() | 获取请求编码，如果没有 setCharacterEncoding() ，那么返回 null。表示使用 ISO-8859-1 编码 |
  | String  getContextPath()       | 返回上下文路径，例如：/项目名称                              |
  | String  getRequestURI()        | 返回请求URI路径，例如：/hello/oneServlet                     |
  | String  getServletPath()       | 返回Servlet路径，例如：/oneServlet                           |
  | String getRemoteAddr()         | 返回当前客户端的IP地址                                       |
  | int getServerPort()            | 返回服务器端口号，例如：80                                   |
  | String  getServletPath()       | 返回 Servlet 路径，例如：/oneServlet                         |

## Servlet 技术-*页面跳转*

---

### 页面跳转的方式

1. ***请求转发 forward***
2. ***重定向 redirect***

-  两种跳转方式的区别如下：
  1. 使用方法：请求转发使用的是分发器 forward() 方法，分发器由 request 对象获取;重定向使用的是 response 对象的 sendRedirect()。
  2. 浏览器地址栏：请求转发的浏览器URL地址栏不变；重定向浏览器 URL 的地址栏改变。
  3. 实现放：请求转发是服务器行为，重定向是客户端行为。
  4. 访问次数：转发是浏览器只做了一次访问请求；重定向是浏览器做了至少两次的访问请求。
  5. 数据传递：请求转发允许将对象数据传递到下一个目标资源，而重定新不可以。
  6. 资源范围：请求转发只能跳转到服务器内部资源；重定向可以调整到服务器外部。


#### ***请求转发 forward***

请求转发的工作流程如下：

1. 客户端发送 Http 请求数据给服务器。

2. 服务器接收请求数据并调用第一个 Servlet 处理逻辑。

3. 第一个 Servlet 处理完数据后调用 forward() 方法将请求传递给服务器内部的下一个Servlet。

4. 第二个 Servlet 处理完数据后将最终处理结果返回给客户端。

   具体过程如图所示：![request 实现请求转发的原理](http://minio.ozh.asia/blog/request实现请求转发的原理.png)

5. 页面跳转方式

   ~~~ java
   String dstUrl  = "/index.jsp";
   RequestDispatcher dispatcher = request.getRequestDispatcher(dstUrl);
   dispatcher.forward(request, response);
   //也可使用链式调用方式编写
   request.getRequestDispatcher(dstUrl).forward(request, response);
   ~~~

   

#### ***重定向 redirect***

1. 重定向的工作流程如下：

   1. 客户端发送 Http 请求数据给服务器。

   2. 服务器接收请求数据并调用一个 Servlet 处理逻辑。

   3. 服务器调用 sendRedirect() 方法将处理结果放进 HTTP 响应头中并返回给客户端。

   4. 客户端收到响应结果后，从 HTTP 响应头中取得相关信息，再次发送请求数据给服务器。

      具体过程如图所示：![response 实现重定向的原理](http://minio.ozh.asia/blog/response实现重定向的原理.png)

2. 页面跳转方式

   ~~~ java
   String dstUrl  = "/index.jsp";
   response.sendRedirect(dstUrl);
   ~~~

   

### 数据传递

- 使用请求转发实现页面跳转时，可以使用 ***request.setAttribute(key, value)*** ，其中 key 为属性名称，String 类型；value 可以为任意对象。通过请求转发可以传递任意类型数据。在下一个 servlet 或者页面可以通过 ***Object value = (Object) request.getAttribute(key)*** 读取传递的对象数据，默认类型为 Object 类型，需要进行类型转换。
- 使用重定向实现页面跳转，只能通过 url 进行传参，例如 dstUrl?key1=value&key2=value2 将 key1 和 key2 传递到下一个页面。但是此种传参方式只能传递字符串参数。

## Servlet技术-*Servlet生命周期*

---

### Servlet生命周期

- Servlet的生命分为以下四部分：Servlet实例化 --> 初始化 --> 服务 --> 销毁

  1. 实例化：对应与 new 方法。当 Servlet 第一次被访问时，Web 容器将会加载相应的 Servlet 到 Java 虚拟机并执行实例化，此时会生成一个 Servlet 对象。

  2. 初始化：对应于 init 方法。当 Servlet 容器创建后，会调用并且仅调用一次 init() 方法，用于初始化 Servlet 对象。无论有多少客户机访问 Servlet ，都不会重复执行 init()。

  3. 服务：对应 service 方法。service() 方法是 Servlet 的核心，负责响应客户的请求。每当一个客户请求一个 HttpServlet 对象，该对象的 service() 方法就要调用，而且传递给这个方法一个 ***“请求”( ServletRequest )*** 对象和一个 ***“响应” (ServletRsponse)*** 对象作为参数。实际执行中是根据 Http 请求方法调用响应的 do 功能。

  4. 销毁：对应 destroy 方法。destroy() 方法仅执行一次，只在 Web 服务器端停止并卸载 Servlet 时执行。当 Servlet 对象被销毁时，并释放其占用的资源。

     ![http 请求的过程](http://minio.ozh.asia/blog/http请求的过程.png)

- 在 Servlet 接口类中提供了 Servlet 生命周期中的3个方法定义，相关功能说明如下：
  1. ***init()***：负责初始化 Servlet 对象。
  2. ***service()***：负责响应客户端请求。
  3. ***destroy()***：当 Servlet 对象退出时，负责释放占用资源

- Servlet 生命周期的各个阶段

  ![Servlet 生命周期](http://minio.ozh.asia/blog/Servlet生命周期.png)

  注意： 1. 一个 Servlet 对象只有在第一次访问时被创建，之后将常驻内存，并使用该对象处理后的用户请求。

  ​	   2. 一个 Servlet 对象在处理不同的客户端请求时，往往使用多线程执行，即针对每一个客户端请求开启一个线程。

  ​	   3. Servlet 只有在 web 容器重启或者停止时候才会被销毁。

### Servlet处理请求的流程

1. 客户端发送请求给服务器。

2. 容器根据请求及 web.xml 判断对应的 Servlet 是否存在，如果不存在则返回 404。

3. 容器根据请求及 web.xml 判断对应的 Servlet 是否已经被实例化，若是相应的 Servlet 没有被实例化，则容器将会加载相应的 Servlet 到 Java 虚拟机并实例化。

4. 调用实例对象的 service() 方法，并开启一个新的线程去执行相关处理。调用 service() 方法，判断是调用 doGet() 方法还是 doPost() 方法。

5. 业务完成后响应相关的页面发送给客户端。
