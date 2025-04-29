---
title: Session 和过滤器技术
#icon: fab fa-markdown
order: 2
category:
  - Maven
tag:
  - 会话与过滤器
  - 后端
date: 2022-06-30
icon: iconfont icon-ilter
---
# Session 和过滤器技术

## 会话的概述

---

- 会话：从打开浏览器，到访问网页，到最终关闭浏览器，整个过程就是一次会话。
- 会话的特点：包含多个请求，一次完整的会话针对一个用户。

### 会话管理技术：

1. cookie 技术，客户端技术。

2. session 技术，服务端技术。

购物车案例：买完商品后，加入购物车，买的商品存到什么对象比较合适？

1. 使用 request 域对象保存商品信息。

   ![request 域保存信息流程](https://sylphy-1321175878.cos.ap-guangzhou.myqcloud.com/request域保存信息流程.png)

   结论：使用 request 保存商品信息不可以，因为每次发送请求，就会产生一个新的请求对象。

2. 使用 ServletContext 对象保存商品信息。

   ![ServletContext 域保存信息流程](https://sylphy-1321175878.cos.ap-guangzhou.myqcloud.com/ServletContext域保存信息流程.png)

   结论：使用 ServletContext 对象保存商品信息，可以，但是不合理。

因此在开发中，保存会话过程中产生的数据，采用会话管理技术，也就是使用 cookie 和 session 技术来保存会话过程产生的数据。

## Cookie 对象

---

- Cookie 的概述

  ​	    Cookie 是一种会话管理技术，它是用来保存会话过程中产生的数据，然后在浏览器和服务器交互时，会使用 Cookie 里面保存的数据。

  ![Cookie 的执行原理](https://sylphy-1321175878.cos.ap-guangzhou.myqcloud.com/Cookie的执行原理.png)

  注意：首次访问服务器，浏览器不会携带 cookie 到服务端。

- Cookie 常用的 api

  1. 得到 cookie 对象：Cookie cookie = new Cookie(String key,String value);

  2. 回写（响应）cookie 到浏览器端：response.addCookie(cookie);

  3. 得到 cookie 的名称：String key = cookie.getName();

     得到 cookie 的值：String value = cookie.getValue();

  4. 给 cookie 设置生命时长：setMaxAge(int sr);

     比如：cookie.setMaxAge(60\*60\*24*7)，说明cookie能存活7天;

     cookie 分类：

     1. 会话级别 cookie，浏览器关闭，cookie 对象就销毁了
     2. 持久化 cookie，通过 setMaxAge() 方法设置

  5. 给 cookie 设置路径，设置域名：

     setPath(路径的 url)，setDomain(域名);

     比如：域名就是服务器名称，例如：`www.baidu.com`

  6. 得到 cookie：Cookie[] cookies = request.getCookies();

## Session 对象

---

### Session 的概述

session 是一种会话管理技术，session 用来保存会话过程中的数据，保存的数据存储到服务器端。

![Session 实现原理分析](https://sylphy-1321175878.cos.ap-guangzhou.myqcloud.com/Session实现原理分析.png)

原理：基于 cookie 实现的，更确切的说是基于会话级别的 cookie 实现的。

### HttpSession API

- 常用方法：

  1. 得到 session 的 id(JESSIONID 对应的值)：***getId()***;

  2. 设置 session 的生命时长：***setMaxInactiveInterval(int interval);***

  3. 销毁 session：***invalidate();***

     得到 session：***HttpSession session = getSession();***

  4. 其他方法去这里查询：[***JAVA-EE-api***](..\JAVA_EE_api_中英文对照版.chm)

- session 域对象：作用范围一次完整的会话(包含多个请求)

  1. 存值：***serAttribute(String key,Object obj);***
  2. 取值：***Object obj = getAttribute(String key);***
  3. 移除：***removeAttribute(String key);***

- 总结域对象：request 域对象、session 域对象、servletContext 域对象，作用范围依次变大。

## Filter过滤器对象

---

### Filter的概述

​		在开发中，通过浏览器访问服务器端的目标资源，过滤器实现拦截功能，如果过滤器判断是合理的请求，就放行，允许访问目标资源。下图为大概流程：![Filter 拦截过程](https://sylphy-1321175878.cos.ap-guangzhou.myqcloud.com/Filter拦截过程.png)

- 常用方法：
  1. ***init()*** 方法：在过滤器对象被创建后，执行初始化方法
  2. ***doFilter()*** 方法：在这个方法里面实现拦截和放行
  3. ***destory()*** 方法：在过滤器销毁后，执行。

- 普通的过滤器：

  ```java
  @WebFilter(filterName = "EncodingFilter")
  public class EncodingFilter implements Filter {
      @Override
      public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("过滤器"+this.getClass().getName()+"完成初始化...");
      }
      @Override
      public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException{
          HttpServletRequest req = (HttpServletRequest) request;
          HttpServletResponse resp = (HttpServletResponse) response;
          req.setCharacterEncoding("UTF-8");
          resp.setCharacterEncoding("UTF-8");
          resp.setContentType("text/html");
          chain.doFilter(request,response);
      }
      @Override
      public void destroy(){
          System.out.println("过滤器"+this.getClass().getName()+"被销毁...");
      }
  }
  ```

- 用户权限过滤器

  ```java
  public class AuthenFilter implements Filter {
      public void destroy() {
      }
      public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
          HttpServletRequest request = (HttpServletRequest)req;
          HttpServletResponse response =(HttpServletResponse)resp;
          HttpSession session = request.getSession();
          if(session.getAttribute("LoginUser")== null){
              response.sendRedirect(request.getContextPath()+"/login.jsp");
          }else {
          chain.doFilter(req, resp);
          }
      }
      public void init(FilterConfig config) throws ServletException {    }
  }
  ```

