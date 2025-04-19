---
title: SpringBoot 视图
#icon: fab fa-markdown
order: 2
category:
  - SpringBoot
tag:
  - SpringBoot
  - 后端
date: 2022-08-24
icon: iconfont icon-thymeleaf
---

# Spring Boot 视图

## 视图技术

----

​		前端模版引擎技术的出现，使前端开发人员无需关注后端业务的具体实现。只关注自己页面的呈现效果即可，并且解决了前端代码错综复杂的问题，实现了前后端分离开发。Spring Boot 框架对很多常用的模版引擎技术提供了整合支持，具体介绍如下：

- FreeMarker：FreeMarker 是一个基于模版生成输出文本( HTML 页面、电子邮件、配置文件等)的模版引擎，同时它不是面向最终用户的，而是一个 Java 类库，是一款程序员可以嵌入所开发产品的组件。
- Groory：Groory 是一种基于 JVM( Java 虚拟机)的敏捷开发语言，它结合了 Python 、Ruby 和 Smalltalk 的许多强大特性。Groory 代码能够与 Java 代码很好地结合，也能扩展现有代码。由于 Groory 运行在 JVM 上的特性。因此 Groory 可以使用其他 Java 语言编写的库。
- Thymeleaf：Thymeleaf 是适用于 Web 和独立环境的现代服务器端 Java 模版引擎，该模版主要以静态 HTML 页面嵌入标签属性，浏览器可以直接打开模版文件，便于前后端联调。
- Mustache：Mustache 是轻逻辑的模版引擎( Logic-less templates )，它是一个 JS 模版，用于对 JS 的分离展示，Mustache 的优势在于可以应用在 JavaScript 、PHP 、Python 、Perl 等多种编程语言中。 

​		Spring Boot 不太支持常用的 JSP 模版，并且没有提供对应的整合配置，这是因为使用嵌入式 Servlet 容器的 Spring Boot 应用程序对于 JSP 模版存在一些限制，具体如下：

- Spring Boot 默认使用嵌入式 Servlet 容器以 JAR 包方式进行项目打包部署，这种 JAR 包方式不支持 JSP 模版。
- 如果使用 Undertow 嵌入式容器部署 Spring Boot 项目，也不支持 JSP 模版。

## Thymeleaf 视图技术 

---

### Thymeleaf 常用标签

| th:标签        | 说明                                         |
| -------------- | -------------------------------------------- |
| th:insert      | 页面片段包含(类似 JSP 中的 include 标签)     |
| th:replace     | 页面片段包含(类似 JSP 中的 include 标签)     |
| th:each        | 元素遍历(类似 JSP 中的 c:forEach 标签)       |
| th:if          | 条件判断，如果为真                           |
| th:unless      | 条件判断，如果为假                           |
| th:switch      | 条件判断，进行选择性匹配                     |
| th:case        | 条件判断，进行选择性匹配                     |
| th:object      | 变量声明                                     |
| th:with        | 变量声明                                     |
| th:attr        | 通用属性修改                                 |
| th:attrprepend | 通用属性修改，将计算结果追加前缀到现有属性值 |
| th:attrappend  | 通用属性修改，将计算结果追加后缀到现有属性值 |
| th:value       | 属性值修改，指定标签属性值                   |
| th:href        | 用于设定链接地址                             |
| th:src         | 用于设定链接地址                             |
| th:text        | 用于指定标签显示的文本内容                   |
| th:utext       | 用于指定标签显示的文本内容，对特殊标签不转义 |
| th:fragment    | 声明片段                                     |
| th:remove      | 移除片段                                     |

### Thymeleaf 基础语法

1. 相关依赖：

   ~~~xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-thymeleaf</artifactId>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-test</artifactId>
   </dependency>
   ~~~

2. 配置文件：

   ~~~properties
   #模版缓存：开启
   spring.thymeleaf.cache=false
   #模版编码
   spring.thymeleaf.encoding=UTF-8
   #模版样式
   spring.thymeleaf.mode=HTML5
   #指定模版页面存放路径
   spring.thymeleaf.prefix=classpath:/templates/
   #指定模版页面名称的后缀
   spring.thymeleaf.suffix=.html
   ~~~

3. Thymeleaf 标准表达式

   | 说明                                                         | 表达式语法 |
   | ------------------------------------------------------------ | ---------- |
   | 变量表达式( 获取上下文中的变量值 )                           | ${}        |
   | 选择变量表达式( 用于从被选定对象获取属性值 )                 | *{}        |
   | 消息表达式( 用于 Thymeleaf 模版也能国际化内容的动态替换和展示 ) | #{}        |
   | 链接 URL 表达式( 用于页面跳转或者资源的引入 )                | @{}        |
   | 片段表达式( 用来标记一个片段模版，并根据需要移动或传递给其他模版 ) | ~{}        |

4. Thymeleaf 内置对象

   ​		Thymeleaf 中提供了一些内置对象，并且在这些对象中提供了一些方法，方便我们来调用。获取这些对象，需要使用 <u>***#对象名***</u> 来引用

   - 一些环境相关对象

     | 对象            | 作用                                             |
     | --------------- | ------------------------------------------------ |
     | #ctx            | 获取 Thymeleaf 自己的 Context 对象               |
     | #requset        | 如果是web程序，可以获取 HttpServletRequest 对象  |
     | #response       | 如果是web程序，可以获取 HttpServletResponse 对象 |
     | #session        | 如果是web程序，可以获取 HttpSession对象          |
     | #servletContext | 如果是web程序，可以获取 HttpServletContext 对象  |

   - Thymeleaf 提供的全局对象

     | 对象       | 作用                               |
     | ---------- | ---------------------------------- |
     | #dates     | 处理 java.util.date 的工具对象     |
     | #calendars | 处理 java.util.calendar 的工具对象 |
     | #numbers   | 用来对数字格式化的方法             |
     | #strings   | 用来处理字符串的方法               |
     | #bools     | 用来判断布尔值的方法               |
     | #arrays    | 用来护理数组的方法                 |
     | #lists     | 用来处理 List 集合的方法           |
     | #sets      | 用来处理 Set 集合的方法            |
     | #maps      | 用来处理 Map 集合的方法            |

5. Thymeleaf 逻辑语句

   1. 条件语句

      ​		在 Thymeleaf 之中对于逻辑可以使用如下的⼀些运算符来完成，例如：and、or、关系比较 **<font color='orange'>（>、<、>=、<=、 ==、!=、lt、gt、le、ge、eq、ne）</font>** 。

      1. th:if

         例如：如果 experssion 是 true ，本句话就会显示，否则就不显示。

      2. th:unless

         ~~~html
         <h2 th:unless="${score > 70}"> 别做梦了，安心听课学习吧！</h2>
         ~~~

         ​		除非 score 大于70。意思是只有当条件不成立的时候，才显示文本内容。条件成立时则不显示。

      3. th:switch th:switch /th:case)

         ~~~html
         <div th:switch="${role}">
             <p th:case="'admin'">User 是管理员</p>
             <p th:case="'manager'">User 是经理</p>
             <p th:case="*">User 是其他神秘⻆⾊</p>
         </div>
         ~~~

         ​		如果 role 为 admin 则输出 <u>User 是管理员</u> ，再如果为 manager 则输出 <u>User 是经理</u> 否则就输出 <u>User 是其他神秘角色</u>

   2. 循环迭代语句

      ​		循环也是非常频繁使用的需求，使用 th:each 指令来完成。

      例如：要遍历用户列表的信息

      ~~~html
      <tr th:each="user : ${users}">
          <td th:text="${user.name}"></td>
          <td th:text="${user.age}"></td>
      </tr>
      ~~~

      - ${users} 是要遍历的集合，可以是一下类型：

        1. Iterable，实现了 Iterable 接口的类
        2. Enumeration，枚举
        3. Interator，迭代器
        4. Map，遍历得到的是 Map.Entry
        5. Array，数组及其他一切符合数组结果的对象

      - 可以添加 stat 对象，获取迭代的对象状态。

        ~~~html
        <tr th:each="user,stat : ${users}">
        </tr>
        ~~~

        - stat 对象包含以下属性：
          1. index，从0开始的角度
          2. count，元素的个数，从1开始
          3. size，总元素个数
          4. current，当前遍历到的元素
          5. even/odd，返回是否为奇偶，boolean 值
          6. first/last，返回是否为第一或最后，boolean 值 

### Thymeleaf 模版片段

​		在系统开发中，很多页面有公共的内容，例如导航栏、菜单、页脚等，这些公共内容可以提取放在⼀个称为“模板 片段”的公共页面里面，其它页面可以引用这个“模板片断”，从而减少代码量，实现整个页面的“模版化”。

​		Thymeleaf 的模版片段使用分为两部分：<u>定义模版片段</u>、<u>引用模版片段</u>

1. 定义模版片段

   ​		模版片段可以是 html 标签，也可以使用 th:fragment 属性定义片段。

   - 例如：创建⼀个 fragement 文件夹，在该目录下新建⼀个 footer.html 文件,定义⼀个名称为 footer 的模版片段：

     ~~~html
     <!DOCTYPE html>
     <html lang="en">
     <head>
     	<meta charset="UTF-8">
             <title>Title</title>
     </head>
     <body>
         <h2>学生信息列表</h2>
         <div th:fragment = "foorer" >
                 © 2021 &copy; Thymeleaf Footer
         </div>
     </body>
     </html>
     ~~~

2. 引用模版片段

   ​		引用模版片段的指令包括：th:insert 、th:replace 和 th:include 。

   1. th:insert 、th:replace 、th:include 语法：

      1. 使用 insert 语法插入代码片段，fragement 将插入到 div 中
      2. 使用 replace 语法插入代码片段，fragement 取代整个 div 
      3. 使用 include 语法插入代码片段，fragement 的内容将取代 div 文本内容

   2. th:insert 、th:replace 、th:include 的区别

      1. th:insert 当前标签里面插入模板中的标签
      2. th:replace 替换当前标签为模板中的标签
      3. th:include 前标签里面插入模板中的标签

   3. 将参数传入模版片段

      - 引用语法：

        ~~~
        ~{footer::fragement( 参数1=‘value1’ , 参数2=‘value2’ )}
        ~~~

   4. 片断块引用

      ​		可以使用 th:block 定义片断块，th:block 是一个属性容器，可以在里面添加任何的 th 属性。

      例如：表格的循环体中一般在 tr 中用 th:each ，也可以用 th:block 改写。

### Thymeleaf 国际化页面

1. 编写多语言国际化文件及配置文件(放在 static 文件中新建文件的 i18n 文件下)

   新建多语言文件名，例下：login.properties 、login_zh_CN.properties 、login_en_US.properties等

2. 编写配置文件

   ​		打开项目的 application.properties 全局配置文件，在该文件中添加添加国际化文件基础名设置

   ~~~properties
   #配置国际化文件基础名
   spring.messages.basename=i18n.login
   ~~~

   - 其中 i18n 表示国际化文件相对项目类路径 resources 的位置，login 表示多语言文件的前缀名

3. 定制区域化解析器 MyLocalResovel

   ​		创建一个用于定制国际化功能区域信息解析器的自定义配置类 MyLocalResovel ，MyLocalResovel 自定义区域解析器配置类实现了 LocalResovel 接口，并重写了其中的 resolveLocale() 方法进行自定义语言解析，最后使用 ***@Bean*** 注解将当前配置类注册成 Spring 容器中的一个类型为 LocaleResolver 的 Bean 组件，这样就可以覆盖默认的 LocaleResolver 组件。

## JavaScript 和 Ajax 技术

---

​		JavaScript (简称“JS”)是一种有函数优先的轻量级，解释型或即时编译型的编程语言。虽然它是作为开发 Web 页面的脚本语言而出名，但是它也被用到了很多非浏览器环境中，JavaScript 基于原型编程、多范式的动态脚本语言，并且支持面向对象、命令式、声明式、函数式编程范式。

- 相关网站：[Element UI - 开发者手册 - 腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/doc/1270)

### JavaScript 基本语法

1. 基本数据类型

   - Number(ES5) : typeof() 返回"number"。用于任何类型的数字(整数或者浮点数)。
   - String(ES5) : typeof() 返回"string"。用于字符串。一个字符串可以包含一个或多个字符，所以没有单独的单字符类型。
   - Boolean(ES5) : typeof() 返回"boolean"。用于 true 和 false。
   - Null(ES5): typeof() 返回"object"。用于未知的值 --- 只有⼀个 null 值的独立类型。
   - Undefined(ES5): typeof() 返回"undefined"。⽤于未定义的值 --- 只有一个 undefined 值的独立类型。
   - Symbol(ES6): typeof() 返回"symbol"。用于唯一的标识符。

2. 引用数据类型

   - Object(ES5): typeof() 返回"object"。用于更复杂的数据结构。
   - *Function(ES5): typeof() 返回"function"，属于 object 。

3. 在 HTML 页面中引入 JavaScript 的方法有以下两种：

   1. 在 HTML 页面中编写 js 代码
   2. 引入 js 的代码文件到 HTML 页面

4. JavaScript 的基本使用

   1. 输出变量值

      例子：

      ~~~html
      <script>
        let price = 20.0;
        let  age = 20;
        let name = "Kim";
        let contactor = ['Jack','Tom','Mary'];
        let message = 'Hello world, JavaScript';
        function demo1(){
          alert(message);
          console.log(price+";"+age+";"+contactor+";"+message);
          console.log(message.length+";"+message.substring(12,message.length));
        }
        demo1();
      </script>
      ~~~

      ​		上述代码定义了数值类型变量 price ，整数变量 age ，字符串变量 name ，数组 contractory 以及字符串 message ，同时定义了函数 demo1() ，并调用该函数，直接打开页面可看到运行效果。

   2. 函数的定义和函数参数

      例子：

      ~~~html
      <script>
        function demo2(name,address,age,grade='大学3年级'){
            console.log(name+"住在"+address+";年龄为"+age+"岁;"+grade);
        }
        demo2(name,"中山市学院路1号",age);
      </script>
      ~~~

   3. 判断和循环结构

      例子：

      ~~~html
      <script>
        function demo3(age,arrays){
            if (age > 18) console.log("已经成年，允许上网吧");
            else console.log("未成年人，不能够上网吧");
            arrays.push('Jimmy');
            arrays.push('张飞');
            arrays.push('刘备');
            arrays.push('关羽');
            for (let item in arrays){
                console.log(item+":"+arrays[item]);
            }
        }
        demo3(5,contactor);
      </script>
      ~~~

      ​		此处的 item 为数组下标，并非数组元素本身。

   4. JSON 数据

      例子：

      ~~~html
      <script>
        function demo4(){
            let student = {
                name:"张三",
                age:28,
                gender:true,
                height:1.8,
                skills:['c++','java','python']
            };
            console.log(student.name+",年龄:"+student.age+",身高:"+student.height);
            let str = JSON.stringify(student);
            console.log(str);
            let str1 = JSON.parse(str);
            str1.age = 156;
            console.log(str1.age);
            console.log(student.age);
        }
        demo4();
      </script>
      ~~~

      ​		上述代码⾸先定义了⼀个 json 对象 student 。使用 student.name 即可获取该 json 对象的 name 属性，其他属性类 似。 在网络传输中，通常需要将 json 对象序列化为字符串进行传输，在 JavaScript 中，内置对象 JSON 提供了 stringify 的序列化方法，该方法将 json 对象序列化为 json 字符串。同时 JSON 还提供反序列化方法 JSON.parse() ，该方法可以将 json 字符串反序列化为 json 对象。

### ES6 的新特性

相关网站：[ES6 入门教程 - ECMAScript 6入门 ](https://es6.ruanyifeng.com/)

1. 不一样的变量声明：const 和 let

   ​		ES6 推荐使用 let 声明局部变量，相比之前的 var (无论声明在何处，都会被视为声明在函数的最顶部)

   - let 和 var 声明的区别

     ~~~html
     <script>
         var x = '全局变量';
         {
             let x = '局部变量';
             console.log(x);		//局部变量
         }
         console.log(x);		//全局变量
     </script>
     ~~~

   ​		let 表示声明变量，而 const 表示声明常量，两者都为块级作用域；const 声明的变量都会被认为是常量，意思就是它的值被设置完成后就不能再修改了：

   ~~~html
   <script>
   	const a = 1;
   	a = 0;		//报错
   </script>
   ~~~

   如果 const 的是一个对象，对象所包含的值是可以被修改的。

   ~~~html
   <script>
   	const student  = { name: 'cc' }
   	student.name = 'yy';	//不报错
   	student = { name: 'yy' };		//报错
   </script>
   ~~~

   - const 、let 和 var 的区别
     1. var 定义的变量，没有块的概念，可以跨块访问，不能跨函数访问。
     2. let 定义的变量，只能在块作用域里访问，不能跨块访问，也不能跨函数访问。
     3. const 用来定义常量，使用时必须初始化(即必须赋值)，只能在块作用域里访问，而且不能修改。

2. 模版字符串

   1. 基本的字符串格式化。将表达式嵌入字符串中进行凭借。用${}来界定；
   2. ES6 反引号(``)直接解决；

   ~~~html
   $("body").html(`This demostrates the output of HTML content to the page
   	,including student's ${name},${seatNumber},${sex} and so on.`)
   ~~~

3. 箭头函数( Arrow Functions )

   箭头函数最直观的三个特点：

   1. 不需要 function 关键字来创建函数
   2. 省略 return 关键字
   3. 继承当前上下文的 this 关键字

   ~~~html
   <script>
       //ES5
       var add = function (a,b){
           return a + b;
       }
       //使用箭头函数
       var add = (a,b) => a + b;
       //ES5
       [1,2,3].map((function(x)){
       	return x + 1;
        }).bind(this));
       //使用箭头函数
       [1,2,3].map( x => x+1 );
   </script>
   ~~~

   ​		当你的函数有且仅有⼀个参数的时候，是可以省略掉括号的。当你函数返回有且仅有⼀个表达式的时候可以省略 {} 和 return ；

4. 函数的参数默认值

   ~~~html
   <script>
       // ES6 之前，当未传入参数时，text = 'default'
       function printText(text){
           text = text || 'default';
           console.log(text);
       }
       // ES6
       function printText(text = 'default'){
           console.log(text);
       }
       printText('hello');		//输出 hello
       printText();	//输出 default
   </script>
   ~~~

### 面向对象的 JavaScript

​		ES6 中支持 class 语法，不过，ES6的class不是新的对象继承模型，它只是原型链的语法糖表现形式。JavaScript 使用原型继承：每个对象都从原型对象继承属性和方法。在 Java 或 Swift 等语言中使用的传统类作为创建对象的蓝图，在 JavaScript 中不存在，原型继承仅处理对象。原型继承可以模拟经典类继承。为了将传统的类引入 JavaScript ，ES2015 标准引入了 class 语法，其底层实现还是基于原型，只是原型继承的语法糖。

1. 定义：类关键字

   使用关键字 class 可以在 JS 中定义了一个类：

   ~~~html
   <script>
       class User{
       	//类的主体
       }
   </script>
   ~~~

   注：上面的代码定义了⼀个 User 类。 大括号 {} 里面是类的主体。此语法称为 class 声明。

   ​		当我们创建类的实例时，该类将变得非常有用。示例是包含类所描述的数据和行为的对象。使用 new 运算符实例化该类，语法：instance = new Class()。相关代码如下：

   ~~~html
   <script>
       let myUser = new User();
   </script>
   ~~~

2. 初始化：constructor()

   ​		constructor( param1 , param2 , ......) 是用于初始化实例的类主体中的一种特殊方法。在这里可以设置字段的初始值或进行类型的对象设置。相关代码如下：

   ~~~html
   <script>
       class User{
   	constructor(name){
       	    this.name = name;
     	  }
       }
   </script>
   ~~~

   ​		User 的构造函数有一个参数 name ，用于设置字段 this.name 的初始值，同时，一个 JavaScript 类最多可以有一个构造函数。

3. 字段

   > 类字段是保存信息的变量，字段可以附加到两个实体：
   >
   > 1. 类实例上的字段
   > 2. 类本身的字段(也称为静态字段)
   >
   > 字段有两种级别可访问性：
   >
   > 1. public：该字段可以在任何地方访问
   > 2. private：字段只能在类的主体中访问

   1. 公共实例字段：可以在类主体之外访问它。

   2. 私有实例字段：私有字段只能在类的主体中访问。

      ​		封装是⼀个重要的概念，它允许我们隐藏类的内部细节。使用封装类只依赖类提供的公共接口，而不耦合类的实现细节。当实现细节改变时，考虑到封装而组织的类更容易更新。隐藏对象内部数据的一种好方法是使用私有字段。这些字段只能在它们所属的类中读取和更改。类的外部世界不能直接更改私有字段。

      - 注：在字段名前面加上特殊的符号 <font color='grend'>#</font> 使其成为私有的，例如 #myField 。每次处理字段时都必须保留前缀 # 声明它、读取它或修改它。

   3. 公共静态字段：有助于定义类常量或存储特定于该类的信息。

4. 方法

   字段保存数据，但是修改数据的能力是由属于类的一部分的特殊功能实现的：<font color='gree'>方法</font>

   <u>JavaScript 类同时支持实例和静态方法。</u>

   1. 实例方法

      ​		在类方法和构造函数中，this 值等于类实例。使用 this 来访问实例数据：this.field 或者调用其他方法：this.method() 。方法也可以是私有的。为了使方法私有前缀，名称以<font color='grend'>＃</font>开头即可。

      - getters 和 setter 

        ​		getter 和 setter 模仿常规字段，但是对如何访问和更改字段具有更多控制。在尝试获取字段值时执行 getter ，而在尝试设置值时使用 setter 。相关代码如下：

        ~~~html
        <script>
            class User{
                #nameValue;		//为了确保 User 的 name 属性不能为空，将私有字段 #nameValue 封装在 getter 和 setter 中
        	constructor(name){
            	    this.name = name;
          	  }
                get name(){
                    return this.#nameValue;
                }
                set name(name){
                    if(name === ""){
                        throw new Error('name field of User cannot be empty');
                    }
                    this.#nameValue = name;
                }
            }
            const user  = new User("Fundebug");
            user.name;		// getter 被调用，=> 'Fundebug'
            user.name = "Code";		// setter 被调用
            user.name = "";		// setter 抛出一个错误
        </script>
        ~~~

   2. 静态方法

      静态方法是直接附加到类的函数，它们持有与类相关的逻辑，而不是类的实例。要创建一个静态方法，请使用特殊的关键字 static 和一个常规的方法语法: static myStaticMethod()

      使用静态方法时，要注意两条规则：

      - 静态方法可以访问静态字段。
      - 静态方法不能访问实例字段。

      静态方法可以是私有的。同样，它们遵循私有规则：只能在类主体中调用私有静态方法。

      ~~~html
      <script>
          class User{
      	#name	//私有变量
              age;	//共有变量
              address = "中山市学院路1号";
              static TYPE_ROLE = '管理员';	//静态变量
              static TYPE_COMMON = '普通用户';	//静态变量
              constructor(name, age){		//构造函数
                  this.#name = name;
                  this.age = age;
              }
              show(){		//公有方法
                  console.log("姓名：" + this.#name + "；年龄：" + this.age +"；地址：" + this.address)
              }
              #getName(){		//私有⽅法,只能被内部⽅法调⽤
                  return this.#name;
              }
              static showRole(){		//静态方法
                  console.log("静态变量" + User.TYPE_ROLE);
              }
              //私有属性的getter和setter⽅法
              get name(){
                  return this.#name;
              }
              set name(name){
                  this.#name = name;
              }
          }
          let user = new User('John Smith', 30);
          user.show();	//调用对象方法
          User.showRole();	//调用静态方法
          console.log(user.address)	//'中山市学院路1号'
          console.log(user.name)		//通过 get 函数方法，结果'John Smith'
          console.log(user.name)		//undefined
      </script>
      ~~~

### DOM 元素操作与 jquery

![DOM 树](http://101.43.49.28:9000/blog/DOM树.png)

 DOM 是⼀棵树（tree）。树上有 Node（节点），Node 分为 Document（html）、Element（元素）和 Text（文本），以及其他不重要的。

#### jquery

1. jquery 的引入

   1. 从 http://jquery.com/download/ 下载 jQuery 库

      提供以下两个版本下载

      - Production version - 用于实际的网站中，已被精简和压缩。
      - Development version - 用于测试和开发（未压缩，是可读的代码）

   2. 从 CDN 中载入 jQuery, 如从 Google 中加载 jQuery

      1. Staticfile CDN：

         ~~~html
         <head>
             <script src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js"></script>
         </head>
         ~~~

      2. 百度 CDN：

         ~~~html
         <head>
             <script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
         </head>
         ~~~

      3. 又拍云 CDN：

         ~~~html
         <head>
             <script src="https://upcdn.b0.upaiyun.com/libs/jquery/jquery-2.0.2.min.js"></script>
         </head>
         ~~~

      4. 新浪 CDN：

         ~~~html
         <head>
             <script src="https://lib.sinaapp.com/js/jquery/2.0.2/jquery-2.0.2.min.js"></script>
         </head>
         ~~~

      5. Google CDN：

         ~~~html
         <head>
             <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
         </head>
         ~~~

      6. Microsoft CDN：

         ~~~html
         <head>
             <script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-1.9.0.min.js"></script>
         </head>
         ~~~
      
      7. 国内的加速网站：[BootCDN - Bootstrap 中文网开源项目免费 CDN 加速服务](https://www.bootcdn.cn/)

2. jquery 的使用：https://www.w3cschool.cn/jquery/dict.html


#### Ajax 异步通信技术

1. Ajax 的工作原理

   AJAX = Asynchronous JavaScript and XML (异步的 JavaScript 和 XML)

   AJAX 不是新的编程语言，而是一种使用现有标准的新方法。

   AJAX 最大的优点是在不重新加载整个页面的情况下，可以与服务器交换数据并更新部分网页内容。

   AJAX 不需要任何浏览器插件，但需要用户允许 JavaScript 在浏览器上执行。

2. $.ajax()

   | 常用选项参数 | 介绍                                                         |
   | ------------ | ------------------------------------------------------------ |
   | url          | 请求地址                                                     |
   | type         | 请求方法，默认为 get                                         |
   | dataType     | 服务端响应数据类型                                           |
   | contentType  | 请求体内容类型，默认 application/x-www-form-urlencoded       |
   | data         | 需要传递到服务端的数据，如果 GET 则通过 URL 传递，如果 POST 则通过请求 |
   | timeout      | 请求超时时间                                                 |
   | beforeSend   | 请求发起之前触发                                             |
   | success      | 请求成功之后触发（响应状态码 200）                           |
   | error        | 请求失败触发                                                 |
   | complete     | 请求完成触发（不管成功与否）                                 |
   | headers      | 请求头                                                       |

3. $.get()

   GET 请求快捷方法 $.get(url, data, callback)

   原生 AJAX 方法：

   ~~~html
   $.ajax({
       url:"http://localhost:3000/comments",
       type: "get",
       dataType: "json",
       data: {"id": 2},
       success: function(data){
           console.log(data);
       }
   })
   ~~~

   化简后的方法直接发送 GET 请求：

   ~~~html
   $.get("http://localhost:3000/comments",{"id":2},function(data){
   	console.log(data);
   })
   ~~~

4. $.post()

   POST 请求快捷方法 $.post(url, data, callback)

   原生 AJAX 方法：

   ~~~html
   $.ajax({
           url:"http://localhost:3000/comments",
           type: "get",
           dataType: "json",
   	data: {"postId": 2, "content": "bad"},
           success: function(data){
               console.log(data);
           }
       })
   ~~~

   化简后的方法直接发送 POST 请求：

   ~~~html
   $.post("http://localhost:3000/comments",{"postId": 2, "content": "bad"},function(data){
   	console.log(data);
   })
   ~~~

5. ajaxSetup()

   ~~~html
   $.ajaxSetup({
   	url: "http://localhost:3000/users",
   	type: "post"
   })
   $.ajax({
   	data: {"name": "polly", "age": 17, "class": 4}
   })
   $.ajax({
   	data: {"name": "james", "age": 12, "class": 4}
   })
   ~~~

#### axios

相关教学：[3分钟让你学会axios在vue项目中的基本用法（建议收藏）](https://blog.csdn.net/qq_39765048/article/details/117688019?utm_source=miniapp_weixin)

axios 推荐在 vue 框架中使用，它也是对原生 XHR 的封装。它有以下几大特性：

1. 支持 node 端和浏览器端：同样的 API ，node 和浏览器全支持，平台切换无压力

2. 支持 Promise ：使用 Promise 管理异步，告别传统 callback 方式

3. 丰富的配置项：支持拦截器等高级配置

4. 简单使用

   ~~~html
   axios({
   	method: 'GET',
   	url: url,
   })
   .then(res => {console.log(res)})
   .catch(err => {console.log(err)})
   ~~~

   
