---
title: MVC 设计模式
#icon: fab fa-markdown
order: 2
category:
  - Maven
tag:
  - MVC
  - 后端
date: 2022-07-11
icon: iconfont icon-MVCkaifamoshi
---
# MVC 设计模式

## MVC 设计模式的概述

---

MVC 模式是 Web 开发中最常用的一种设计模式，规范了 Web 数据流的流程，通过数据、视图以及控制分离的方法来组织代码，提高了软件的灵活性和复用性，同时使程序具有对象化特征，也更容易维护。

- MVC包括以下三种对象：
  1. 模型层（Model）：指从物理世界中抽象出来的对象模型，是应用逻辑的反应；它封装了数据和对数据的操作，是实际进行数据处理的地方（模型层与数据库才有交互）。
  2. 视图层（View）：是应用和用户之间的接口，它负责将应用显示给用户和显示模型的状态。
  3. 制器（Controller）:控制器负责视图和模型之间的交互，控制对用户输入的响应、响应方式和流程；它主要负责两方面的动作，一是把用户的请求分发到相应的模型，二是吧模型的改变及时地反映到视图上。

## MVC 的数据流程和实现方法

---

- MVC 设计模式流程

  1. 用户发起 HTTP 请求。
  2. Web 服务器接收到请求后，根据请求的url地址将请求转发到相应的 servlet 进行处理。注意：控制器是和用户交互的接口。
  3. Servlet 获取用户请求的相关参数，并根据用户的请求调用模型层相应操作接口。
  4. 模型层调用数据库查询接口，进行数据查询。
  5. 数据库返回相关的查询结果。
  6. 模型层对相应的查询结果进行处理，并返回给控制器。
  7. 控制器将封装好的查询结果传递给视图页面。
  8. 视图页面获取查询结果，并进行页面渲染输出。

  MVC 设计模式流程如下图所示：

  ![MVC 设计模式流程](https://sylphy-1321175878.cos.ap-guangzhou.myqcloud.com/MVC设计模式流程.png)

  MVC模式各个组件所对应的技术如下图所示：

  ![MVC 模式的各个组件](https://sylphy-1321175878.cos.ap-guangzhou.myqcloud.com/MVC模式的各个组件.png)

## EL 表达式

---

### EL 表达式的概述

- EL 在开发中，通常是用来获取域对象中保存的值，基本语法：${域对象的名称}。

   比如说：request.setAttribute("key","value123");	${key},获取的值就是"value123"。

   如果域对象的名称写错了，使用 EL 表达式获取值，获取的是""而不会获取NULL。

### EL 表达式的标识符

   在 EL 书写过程中，会使用一些符号来标记变量、函数名等，这些符号称之为标识符。
   书写规范：

1. 不能以数字开头
2. 不能包含 EL 中的关键字：and，or 等
3. 不能使用 EL 表达式的隐式对象
4. 不能包含特殊符号，比如：下划线、正斜杠等

### EL 中的变量

- 基本格式：${域对象的名称}，这个域对象的名称可以理解为就是 EL 中的变量，那这个变量就不需要定义了，可以直接使用。

### EL 中的常量

   1. 布尔常量：true 或 false
   2. 数字常量：整型、浮点常量，使用方法与 java 相似
   3. 字符串常量：使用方法与 java 相似，比如：${"EL 的字符串常量"}
   4. NULL 常量：${null}

### EL 中的运算符

   1. 点运算符：获取域对象中属性的值。比如：${user.name}

   2. 方括号运算符：在域对象里，有的属性包含特殊字符，所以用方括号的方式来获取值。

      比如：

      ~~~ jsp
      <%
      	Map<String,String> map = new HashMap<String,String>();
      	map.put("my-name","map的值");
      	request.setAttribute("user",map);
      %>
      ${user["my-name"]}
      ~~~

   3. 算术运算符:+ - * / ，比如：1+3=${1+3}  *返回 int 类型*

   4. 比较运算符：> < >= <= != ==，比如：1大于3吗： ${1>3}  *返回 boolean 类型*

   5. 逻辑运算符：&&(and)、||(or)、!(not)

   6. empty 运算符：用来判断与对象中的值是否存在，不存在返回为 true，否则返回的结果是 false。比如：${empty user.name}  *返回 boolean 类型*

   7. 三目运算符：参照 java 的用法。

### EL 中的隐式对象

   1. pageContext 对象：为了获取 jsp 中的隐式对象。比如：获取项目的路径：${pageContext.request.contextPath}

   2. web 域相关的对象

      域作用范围从小到大：pageContext -> request -> session -> application(servletContext)

      EL 表达式获取域对象中的值：如果域对象的名称相同，获取的是域对象作用范围最小的值。

      ​												与 pageContext 对象的 findAttribute 方法的效果一样的。

   3. param 和 paramValues 对象：获取表单提交的数据。

      比如：

      ~~~jsp
      num1:<input type="text" name="num1" /><br/>
      num2:<input type="text" name="num" /><br/>
      num3:<input type="text" name="num" /><br/>
      <input type="submit" name="提交" /> &nbsp;&nbsp; <input type="reset" name="重填" />
      <hr/>
      num1:${param.num1}<br/>
      num2:${paramValues.num[0]}<br/>
      num3:${paramValues.num[1]}<br/>
      ~~~

   4. cookie 对象：获取 cookie 的名称，获取 cookie 的值

      比如：

      ~~~jsp
      <% response.addCookie(new Cookie("userName","itcast")); %>
      获取cookie的对象：${cookie.userName}<br/>
      获取cookie的名称：${cookie.userName.name}<br/>
      获取cookie的值：${cookie.userName.value}<br/>
      ~~~

## JSTL

---

### JSTL 的概述

- JSTL：JavaServer Pages Standard Tag Libary，java 服务器段页面的标准标签库，其实就是在 jsp 页面上使用的标签库， JSTL 标签库有五个组成，通常使用核心标签库。
- ***在 jsp 页面上引入标签库：<%@ taglib  prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>***

### JSTL 的配置

1. 下载 JSTL 的 zip 包，并解压到目录中。

2. 将 jstl 相应的 jar 包添加到工程 lib 目录下。

   ![JSTL 的配置-1](https://sylphy-1321175878.cos.ap-guangzhou.myqcloud.com/JSTL的配置-1.png)

3. 在 IDEA 中配置 JSTL 的 tld 模板，***URL:```http://java.sun.com/jsp/jstl/core```。***

   ![JSTL 的配置-2](https://sylphy-1321175878.cos.ap-guangzhou.myqcloud.com/JSTL的配置-2.png)

4. 添加 JSTL jar 包，修复 artifact 的错误。

   ![JSTL 的配置-3](https://sylphy-1321175878.cos.ap-guangzhou.myqcloud.com/JSTL的配置-3.png)

### JSTL 中的 Core 标签

1. \<c:out>标签：***向网页输出内容***

   基本语法：

   1. \<c:out value="EL表达式获取值" default="值" escapeXml="true 或者 false">\</c:out>

      比如：

      ~~~jsp
      <c:out value="${param.username}" default="unknown" escapeXml="true"></c:out>
      <!-- 输出结果为 unknown -->
      ~~~

      

   2. \<c:out value="EL表达式获取值" escapeXml="true 或者 false"> 默认值 \</c:out>

       比如：

      ```jsp
      <c:out value="${param.username}" escapeXml="true">unknown</c:out>
        <!-- 输出结果为 unknown -->
      ```

   ***default***：如果 value 属性获取到了值，就输出这个值，如果没有获取到，就输出 default 属性对应的值。

   ***escapeXml(默认值为 true)***：如果值为true，就会把 html 标记当成普通的字符串输出，如果值为 false，就会正常解析 html 标记，正常输出。

2. \<c:if>标签：***进行条件判断，和 java 类中的 if 相似***

   基本语法：

   1. \<c:if test="条件表达式" var="变量名称" scope="域的范围">\</c:if>

   2. \<c:if test="条件表达式" var="变量名称" scope="域的范围">标签体内容\</c:if>***(在开发中常用)***

      比如：

      ~~~jsp
      <c:set var="key" value="1" scope="request" property="key"></c:set>
      <c:if test="${key==1}">
      	hello c:if标签
      </c:if>
      <!-- 输出结果为 hello c:if标签 -->
      ~~~

      

   ***test***：如果返回值为 true，就输出标签体内容，否则就不输出。

3. \<c:choose>标签：***进行条件判断，和 java 类中的 if ,else if(),else if()……else 相似***

   基本语法：

   ~~~jsp
   <c:choose>		<!-- if -->
   	<c:when test="条件表达式">标签体内容</c:when>		<!-- else if -->
   	<c:when test="条件表达式">标签体内容</c:when>
   	……
   	<c:otherwise>标签体内容</c:otherwise>		<!-- else -->
   </c:choose>
   ~~~

4. \<c:forEach>标签：***遍历域对象中的数组和集合，和 java 类中的 for 循环相似***

   基本语法：

   1. \<c:forEach var="yuanshu" items="数组或者集合中的值" begin="下标" end="结束的下标" step="遍历的增量">\</c:forEach>

      普通 for：for(int i=0;i<数组或者集合中的长度;i++){ yuanshu };

      比如：

      ~~~jsp
      <%
      	List colorsList = new ArrayList();
              colorsList.add("red");
      	colorsList.add("yellow");
      	colorsList.add("blue");
      	colorsList.add("green");
      	colorsList.add("black");
      	colorsList.add("gray");
      	request.setAttribute("list",colorsList);
      %>
      <br/>
      <c:forEach var="yy" items="${list}" begin="1" end="4" step="2">
      	${yy}<br/> 
      </c:forEach>
      <!-- 结果输出为yellow green -->
      ~~~

      

   2. \<c:forEach var="yuanshu" items="数组或者集合中的值">\</c:forEach>

      增强 for：for(String yuanshu : 数组或者集合){ yuanshu };

      比如：

      ~~~jsp
      <%
      	Map userMap = new HashMap();
      	userMap.put("Tom","123");
      	userMap.put("Make","123");
      	userMap.put("Lina","123");
      	request.setAttribute("map",userMap);
      %>
      <br/>
      <c:forEach var="m" items="${map}">
      	key: ${m.key}-----value:${m.value}<br/>
      </c:forEach>
      <!-- 结果输出为-->
      <!-- key: Tom-----value:123 -->
      <!-- key: Make-----value:123 -->
      <!-- key: Lina-----value:123 -->
      ~~~

   ***varStatus***：count 表示序号，index 表示索引(下标)，first 判断是否是第一个元素，last 判断是否是最后一个元素

5. \<c:param>标签和\<c:url>标签：***设置路径和传递参数。***

   基本语法：

   ~~~jsp
   <c:url var="变量名称" url="路径值">
   	<c:param name="属性名称" value="属性值"></c:param>
   	<c:param name="属性名称" value="属性值"></c:param>
   	……………………
   </c:url>
   ~~~

   开发的访问路径：

   1. 绝对路径：

      1. `http://localhost:8080/test/login.html`
      2. `/test/login.html`

   2. 相对路径：

      直接写访问的资源路径：比如：login.

6. \<c:set>标签：***获取值，和 java 类中的 setAttribute() 很相似***

   基本语法

   - \<c:set var="变量名称" value="变量值" scope="域的范围" property="对象的属性名称">\</c:set>

     比如：

     ~~~jsp
     <!-- 相当于request.setAttribute("key",1); -->
     <c:set var="key" value="1" scope="request" property="key"></c:set>
     <!-- 结果输出为 1 -->
     ~~~

## 其他设计模式

---

可以参考以下网址：[设计模式看了又忘，忘了又看？](https://juejin.cn/post/6844903854174126088)
