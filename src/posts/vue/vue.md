---
date: 2022-07-12
title: Vue2
#icon: fab fa-markdown
category:
  - Vue
tag:
  - Vue2
  - 前端
icon: iconfont icon-vuejs
---

# Vue 2

相关网站：[Vue.js 官网](https://v2.cn.vuejs.org/) 、[尚硅谷Vue技术_课程简介 bilibili](https://www.bilibili.com/video/BV1Zy4y1K7SH/?p=1&vd_source=2114d23407468f3c2bdd77326437e044)

## Vue 的概述

---

1. Vue 是一套用于构建用户界面的渐进式 JavaScript 框架
   - 说明：渐进式是 Vue 可以自底向上逐层的应用，其中：
     - 简单应用：只需一个轻量小巧的核心库
     - 复杂应用：可以引入各式各样的 Vue 插件
2. Vue 的特点
   1. 采用<font color='red'>组件化</font>模式，提高代码复用率、且让代码更好维护。
   2. <font color='red'>声明式</font>编码，让编码人员无需直接操作 DOM，提高开发效率
   3. 使用<font color='red'>虚拟 DOM </font>+ 优秀的<font color='red'> Diff 算法</font>，尽量复用 DOM 节点。

## Vue 开发环境

---

- 引入 vue 

  1. 通过 \<script> 标签本地下载 vue.js 引入进开发文档

     ~~~html
     <script type="text/javascript" src="../vue.js"></script>
     ~~~

  2. 通过 CDN 引入

     ~~~html
     <script src="https://cdn.bootcdn.net/ajax/libs/vue/3.3.4/vue.cjs.js"></script>
     ~~~

- Vue Devtools 安装（浏览器插件）

  1. Chrome：[Vue.js devtools - Chrome 应用商店 (google.com)](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  2. Edge：[Vue.js devtools - Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/vuejs-devtools/olofadcdnkkjdfgjcmjaadnlehnnihnl)
  3. Firefox：[Vue.js devtools – Get this Extension for 🦊 Firefox (en-US) (mozilla.org)](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## Vue 的使用

---

1. 想让 Vue 工作，就必须创建一个 Vue 实例，且要传入一个配置对象；

2. root 容器里的代码依然符合 html 规范，只不过混入了一些特殊的 Vue 语法；

3. root 容器里的代码被称为( Vue 模版 )；

4. Vue 实例和容器是一一对应的；

5. 真实开发中只有一个 Vue 实例，并且会配合着组件一起使用；

6. {{xxx}}中的xxx要写 js 表达式，且 xxx 可以自动读取到 data 中的所有属性；

7. 一旦 data 中的数据发生改变，那么模版中用到该数据的地方也会自动更新；

8. 创建 data 时可以进行分组，使得可以同时出现重复命名的数据

   ~~~html
   <body>
       <div id="root">  <!--容器-->
           <h1>hello {{name}}，{{Date.now()}}</h1>	//Date.now()输出当前的时间戳
       </div> 
   </body>
   <script type="text/javascript">
       Vue.config.productionTip = false  //阻止 Vue 在启动时生成生产提示。
       // 创建 Vue 实例
       new Vue({
           el:'#root', // el 用于指定当前 Vue 实例为哪个容器服务，值通常为 css 选择器字符串。
           data:{  //data 中用于存储数据，数据供 el 所指定的容器去使用，值我们暂时先写成一个对象。
               name:'ozh'
           }
       })
   </script>
   ~~~

   - 注意区分：js 表达式和 js 代码(语句)
     1. 表达式：一个表达式会生成一个值，可以放在任何一个需要值的地方：
        1. a
        2. a+b
        3. demo(1)
        4. x === y ? ‘a’ : ‘b’
     2. js 代码(语句)
        1. if(){}
        2. for(){}

## Vue 模版语法

---

1. 插值语法：

   - 功能：用于解析标签体内容。
   - 写法：{{xxx}}，xxx 是 js 表达式，且可以直接读取到 data 中的所有属性。

2. 指令语法：

   - 功能：用于解析标签（包括：标签属性、标签体内容、绑定事件……）。
   - 举例：v-bind:href=“xxx” 或简写为 :href=“xxx”，xxx 同样要写 js 表达式，且可以直接读取到 data 中的所有属性。
   - 备注：Vue 中有很多的指令，且形式都是：v-????，此处仅拿 v-bind 举例。

   ~~~html
   <body>
     <div id="root">
       <h1>hello {{name}}</h1>
       <hr/>
       <h1>指令语法</h1>
       <a v-bind:href="school.url" x="hello">点击进{{school.name}}1</a>
       <a :href="school.url" x="hello">点击进{{school.name}}2</a>
     </div>
   </body>
   <script type="text/javascript">
       Vue.config.productionTip = false  //阻止 Vue 在启动时生成生产提示。
       // 创建 Vue 实例
       new Vue({
           el:'#root', // el 用于指定当前 Vue 实例为哪个容器服务，值通常为 css 选择器字符串。
           data:{  //data 中用于存储数据，数据供 el 所指定的容器去使用，值我们暂时先写成一个对象。
               name:'ozh',
               school:{
                   url:'http://www.baidu.com',
                   name:'百度'
               }
           }
       })
   </script>
   ~~~

## Vue 数据绑定

---

1. 单向绑定( v-bind )：数据只能从 data 流向页面

2. 双向绑定( v-model )：数据不仅能从 data 流向页面，还可以从页面流向 data。

   备注：

   1. 双向绑定一般都应用子啊表单类元素上（如：input 、select 等）
   2. v-model:value 可以简写为 v-model, 因为 v-model 默认搜集的就是 value 的值

~~~html
<body>
  <div id="root">
<!--      普通写法：-->
<!--      单向数据绑定：<input type="text" v-bind:value="name"><br/>-->
<!--      双向数据绑定：<input type="text" v-model:value="name"><br/>-->
<!--      简写：-->
      单向数据绑定：<input type="text" :value="name"><br/>
      双向数据绑定：<input type="text" v-model="name"><br/>
  </div>
</body>
<script type="text/javascript">
    Vue.config.productionTip = false  //阻止 Vue 在启动时生成生产提示。
    // 创建 Vue 实例
    new Vue({
        el:'#root', // el 用于指定当前 Vue 实例为哪个容器服务，值通常为 css 选择器字符串。
        data:{  //data 中用于存储数据，数据供 el 所指定的容器去使用，值我们暂时先写成一个对象。
            name:'ozh'
        }
    })
</script>
~~~

## el 与 data 的写法

---

+ el：

  1. new Vue 时候配置 el 属性；
  2. 先创建 Vue 实例，随后再通过 xxx.$mount(‘#root’) 指定 el 的值。

+ data：

  1. 对象式

  2. 函数式

     备注：目前选择哪种写法都行，<font color='grend'>但使用组件时，data 必须使用<u>函数式</u>，否则会报错</font>。

  :::tabs

  @tab 第一种写法

  ~~~html
  <script type="text/javascript">
      Vue.config.productionTip = false  //阻止 Vue 在启动时生成生产提示。
      // 创建 Vue 实例
      new Vue({
          el:'#root', // el 用于指定当前 Vue 实例为哪个容器服务，值通常为 css 选择器字符串。
          data:{  //对象式
              name:'ozh'
          }
      })
  </script>
  ~~~

  @tab 第二种写法

  ~~~html
  <script type="text/javascript">
      Vue.config.productionTip = false  //阻止 Vue 在启动时生成生产提示。
      // 创建 Vue 实例
      const v = new Vue({
          data(){  //函数式
              console.log('@@@',this)     //此处的 this 是 Vue 实例对象
              return{
                  name:'ozh'
              }
          }
      })
      v.$mount('#root')   //用于指定当前 Vue 实例为哪个容器服务，值通常为 css 选择器字符串。
  </script>
  ~~~

  :::

  注意：如何使用 data()=>{} 则 this 为全局对象
