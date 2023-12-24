---
title: Ajax
#icon: fab fa-markdown
category:
   - node.js
tag:
   - ajax
   - 前端
date: 2023-09-26
---
# AJAX

## 有关 Ajax 的一些 npm 下载

---


1. nodemon：自动重新启动应用程序。

   :::tabs

   @tab 全局安装

   ~~~
   npm i -g nodemon
   ~~~

   @tab 本地安装

   ~~~
   npm i -D nodemon
   ~~~

   @tab 使用

   ~~~
   nodemon .\文件名.js
   ~~~

   :::

2. CORS：解决跨域问题

   ~~~
   npm install cors
   ~~~

## 原生 Ajax

---

### 原生 Ajax 的 GET 请求

- 当点击 button 按钮时提交 GET 请求

::: tabs#nativeajax
@tab html

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AJAX GET 请求</title>
    <style>
        #result{
            width: 200px;
            height: 100px;
            border: solid 1px #90b;
        }
    </style>
</head>
<body>
    <button>点击发送请求</button>
    <div id="result"></div>
    <script>
        const btn = document.getElementsByTagName('button')[0];        // 获取 button 元素
        // 绑定事件
        btn.onclick = function () {
            const xhr = new XMLHttpRequest();            // 1. 创建对象
            xhr.open('GET','http://localhost:8000/button');            // 2. 初始化 设置请求方法和 url
            xhr.send();            // 3. 发送
            // 4. 事件绑定 处理服务端返回的结果
            // on when 当……时候
            // readystate 是 xhr 对象中的属性，表示状态 0 1 2 3 4
            // change 改变
            xhr.onreadystatechange = function (){
                // 判断（服务端返回了所有的结果）
                if (xhr.readyState === 4){
                    // 判断响应状态码 200 404 403 401 500
                    // 2xx 成功
                    if (xhr.status >= 200 && xhr.status < 300){
                        // 处理结果 行 头 空行 体
                        // 1. 响应行
                        // console.log(xhr.status);//状态码
                        // console.log(xhr.statusText);//状态字符串
                        // console.log(xhr.getAllResponseHeaders());//所有响应头
                        // console.log(xhr.response);//响应体
                        // 设置 result 的文本
                        result.innerHTML = xhr.response;
                    }else {}
                }
            }
        }
    </script>
</body>
</html>
~~~
@tab javascript
~~~javascript
const express = require('express');	// 1. 引入 express
const app = express();	// 2. 创建应用对象
// 3. 创建路由规则
// request 是对请求报文的封装
// response 是对响应报文的封装
app.get('/button',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*');    // 设置响应头  设置允许跨域
    response.send('HELLO Ajax GET');    // 设置响应体
})
// 4. 监听端口启动服务
app.listen(8000,()=>{
    console.log("服务已经启动，8000 端口监听中......");
})
~~~
:::

### 原生 Ajax 的 POST 请求

- 当鼠标移动进 \<div> 中时发出 POST 请求

::: tabs#nativeajax
@tab html

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AJAX POST 请求</title>
    <style>
        #result{
            width: 200px;
            height: 100px;
            border: solid 1px #903;
        }
    </style>
</head>
<body>
    <div id="result"></div>
    <script>
        const result = document.getElementById('result');	    // 获取元素对象
        // 绑定事件
        result.addEventListener("mouseover", function (){
            const xhr = new XMLHttpRequest();        // 1. 创建对象
            xhr.open('POST','http://localhost:8000/mouseover');        // 2. 初始化 设置请求方法和 url
            // 设置请求头
            xhr.setRequestHeader('Content-Type','application/x-www-from-urlencoded');
            xhr.setRequestHeader('name','ozh');
            // 3. 发送
            // xhr.send('a=100&b=200&c=300')
            // xhr.send('a:100&b:200&c:300')
            xhr.send();
            // 4. 事件绑定 处理服务端返回的结果
            xhr.onreadystatechange = function (){
                // 判断（服务端返回了所有的结果）
                if (xhr.readyState === 4){
                    if (xhr.status >= 200 && xhr.status < 300){
                        // 处理服务端返回的结果
                        result.innerHTML = xhr.response;
                    }else {}
                }
            }
        })
    </script>
</body>
</html>
~~~

@tab javascript

~~~javascript
const cors = require("cors");    //引入 cors
const express = require('express');    // 1. 引入 express
const app = express();    // 2. 创建应用对象
app.use(cors());    //使用cors解决跨域问题
// 3. 创建路由规则
// request 是对请求报文的封装
// response 是对响应报文的封装
app.all('/mouseover',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*');       // 设置响应头  设置允许跨域
    response.setHeader('Access-Control-Allow-Header','*');    // 响应头
    response.send('HELLO Ajax POST');    // 设置响应体
})
// 4. 监听端口启动服务
app.listen(8000,()=>{
    console.log("服务已经启动，8000 端口监听中......");
})
~~~

:::

说明：

- POST 方法可以通过 <font color='cornflowerblue'>send()</font> 函数实现<font color='grend'>设置请求体</font>
- POST 方法可以通过 <font color='cornflowerblue'>setRequestHeader()</font> 函数实现<font color='grend'>设置请求头</font>

### 原生 Ajax - 服务端响应 JSON 数据

- 当触发键盘任意键时发出请求

::: tabs#nativeajax
@tab html

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>响应 JSON 数据</title>
    <style>
        #result{
            width: 200px;
            height: 100px;
            border: solid 1px #903;
        }
    </style>
</head>
<body>
    <div id="result"></div>
    <script>
        const result = document.getElementById('result');    // 获取元素对象
        // 绑定事件
        window.onkeydown = function (){
            const xhr = new XMLHttpRequest();        // 1. 创建对象
            xhr.open('GET','http://localhost:8000/json');        // 2. 初始化 设置请求方法和 url
            xhr.send();        // 3. 发送
            // 4. 事件绑定 处理服务端返回的结果
            xhr.onreadystatechange = function (){
                // 判断（服务端返回了所有的结果）
                if (xhr.readyState === 4){
                    if (xhr.status >= 200 && xhr.status < 300){
                        //1. 手动对数据转换
                        // let data = JSON.parse(xhr.response);
                        // console.log(data);
                        //2. 自动转换
                        result.innerHTML = xhr.response.name;
                    }else {}
                }
            }
        }
    </script>
</body>
</html>
~~~

@tab javascript

~~~javascript
const cors = require("cors"); 	//引入 cors
const express = require('express');	// 1. 引入 express
const app = express();	// 2. 创建应用对象
app.use(cors());	 //使用cors解决跨域问题
// 3. 创建路由规则
// request 是对请求报文的封装
// response 是对响应报文的封装
app.all('/json',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*');    // 设置响应头  设置允许跨域
    response.setHeader('Access-Control-Allow-Header','*');	    // 响应头
    //响应一个数据
    const data = {
        name: 'ozh'
    };
    let str = JSON.stringify(data);		    //对对象进行字符串转换
    response.send(str);	    // 设置响应体
})
// 4. 监听端口启动服务
app.listen(8000,()=>{
    console.log("服务已经启动，8000 端口监听中......");
})
~~~

:::

### 原生 Ajax 请求超时与网络异常


::: tabs#nativeajax
@tab html

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>请求超时与网络异常</title>
    <style>
        #result{
            width: 200px;
            height: 100px;
            border: solid 1px #90b;
        }
    </style>
</head>
<body>
    <button>点击发送请求</button>
    <div id="result"></div>
    <script>
        const btn = document.getElementsByTagName('button')[0];        // 获取 button 元素
        const result = document.getElementById('result');    // 获取元素对象
        // 绑定事件
        btn.addEventListener('click' ,function (){
            //超时设置 2s 设置
            xhr.timeout = 2000;
            // 超时回调
            xhr.ontimeout = function(){
                alert("网络异常，请稍后重试！！");
            }
            const xhr = new XMLHttpRequest();        // 1. 创建对象
            xhr.open('GET','http://localhost:8000/delay');	        // 2. 初始化 设置请求方法和 url
            xhr.send();	        // 3. 发送
            // 4. 事件绑定 处理服务端返回的结果
            xhr.onreadystatechange = function (){
                // 判断（服务端返回了所有的结果）
                if (xhr.readyState === 4){
                    if (xhr.status >= 200 && xhr.status < 300){
                        result.innerHTML = xhr.response.name;
                    }else {}
                }
            }
        })
    </script>
</body>
</html>
~~~

@tab javascript

~~~javascript
const cors = require("cors"); 	//引入 cors
const express = require('express');	// 1. 引入 express
const app = express();	// 2. 创建应用对象
app.use(cors());	 //使用cors解决跨域问题
// 3. 创建路由规则
// request 是对请求报文的封装
// response 是对响应报文的封装
app.get('/delay',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*');    // 设置响应头  设置允许跨域
    setTimeout(() => {
        // 设置响应体
        response.send('延时响应')
    }, 3000)
})
// 4. 监听端口启动服务
app.listen(8000,()=>{
    console.log("服务已经启动，8000 端口监听中......");
})
~~~

:::

### 原生 Ajax 取消请求


::: tabs#nativeajax
@tab html

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>取消请求</title>
</head>
<body>
    <button>点击发送</button>
    <button>点击取消</button>
    <script>
        const btns = document.getElementsByTagName('button');        // 获取对象元素
        let x = null;
        //标识变量
        let isSending = false;	//是否正在发送 Ajax 请求
        // 绑定事件
        btns[0].onclick = function (){
            if (isSending) x.abort();   //如果正在发送，则取消该请求，创建一个新的请求
            x = new XMLHttpRequest();
            //修改标识变量的值
            isSending = true;
            x.open('GET','http://localhost:8000/delay');
            x.send();
            xhr.onreadystatechange = function (){
                if (xhr.readyState === 4){
                    isSending = false;
                    if (xhr.status >= 200 && xhr.status < 300){
                        result.innerHTML = xhr.response.name;
                    }else {}
                }
            }
        }
        btns[1].onclick = function (){
            x.abort();
        }
    </script>
</body>
</html>
~~~

@tab javascript

~~~javascript
const cors = require("cors"); 	//引入 cors
const express = require('express');	// 1. 引入 express
const app = express();	// 2. 创建应用对象
app.use(cors());	 //使用cors解决跨域问题
// 3. 创建路由规则
// request 是对请求报文的封装
// response 是对响应报文的封装
app.get('/delay',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*');    // 设置响应头  设置允许跨域
    setTimeout(() => {
        // 设置响应体
        response.send('延时响应')
    }, 3000)
})
// 4. 监听端口启动服务
app.listen(8000,()=>{
    console.log("服务已经启动，8000 端口监听中......");
})
~~~

:::

说明：利用标识变量可以使多次点击请求变为一次请求

## jQuery 中的 AJAX

- [有关jQuery的其他介绍](../SpringBoot/SpringBoot视图#jquery)

### jQuery - AJAX 实现 POST 和 GET 请求方法

::: tabs#jQajax
@tab html

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>jQuery 发送 AJAX 请求</title>
    <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.3.1/css/bootstrap-grid.css" rel="stylesheet">
    <script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
</head>
<body>
    <div class="container">
        <h2 class="page-header">jQuery发送AJAX请求</h2>
        <button class="btn btn-primary">GET</button>
        <button class="btn btn-danger">POST</button>
        <button class="btn btn-info">通用型方法ajax</button>
    </div>
    <script>
        $('button').eq(0).click(function (){
            $.get('http://localhost:8000/jquery',{a:'100',b:'200'},function (data){
                console.log(data);
            },'json')
        })
        $('button').eq(1).click(function (){
            $.post('http://localhost:8000/jquery',{a:'100',b:'200'},function (data){
                console.log(data);
            })
        })
        $('button').eq(2).click(function (){
            $.ajax({
                // url
                url:'http://localhost:8000/jquery',
                // 参数
                data:{a:100,c:300},
                // 请求类型
                type: 'GET',
                // 响应体结果
                dataType: 'json',
                // 成功的回调
                success: function (data){
                    console.log(data);
                },
                // 超时时间 2s
                timeout: 4000,
                // 失败的回调
                error: function (){
                    console.log('出错了!!');
                },
                //头信息
                header:{
                    c:500,
                    b:600
                }
            })
        })
    </script>
</body>
</html>
~~~

@tab javascript

~~~javascript
const cors = require("cors"); 	//引入 cors
const express = require('express');	// 1. 引入 express
const app = express();	// 2. 创建应用对象
app.use(cors());	 //使用cors解决跨域问题
// 3. 创建路由规则
// request 是对请求报文的封装
// response 是对响应报文的封装
app.all('/jquery',(request,response)=>{
    response.setHeader('Access-Control-Allow-Origin','*');    // 设置响应头  设置允许跨域
    const data = {name:'ozh'}
    // response.send('hello jQuery Ajax');
    response.send(JSON.stringify(data));
})
// 4. 监听端口启动服务
app.listen(8000,()=>{
    console.log("服务已经启动，8000 端口监听中......");
})
~~~

:::

## AJAX 中的 axios

- 各种请求的 axios 格式如下：

  1. axios.request(config)
  2. ***axios.get(url[, config])***

  2. axios.delete(url[, config])
  3. axios.head(url[, config])
  4. axios.options(url[, config])
  5. ***axios.post(url[, data[, config]])***
  6. axios.put(url[, data[, config]])
  7. axios.patch(url[, data[, config]])

- 相关网站：[axios/axios: Promise based HTTP client for the browser and node.js (github.com)](https://github.com/axios/axios#axiosrequestconfig)

### 使用 axios 发出 AJAX 请求

::: tabs#axios
@tab html

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>axios 发送 AJAX 请求</title>
    <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.3.1/css/bootstrap-grid.css" rel="stylesheet">
    <script src="https://cdn.bootcdn.net/ajax/libs/axios/1.5.0/axios.js"></script></head>
<body>
    <button>GET</button>
    <button>POST</button>
    <button>AJAX</button>
    <script>
        const btns = document.querySelectorAll('button');
        //配置 baseURL
        axios.defaults.baseURL = 'http://localhost:8000';
        btns[0].onclick = function (){
            // GET 请求
            axios.get('/axios',{
                // url 参数
                params:{
                    id:299,
                    vip:1
                },
                //请求头信息
                headers:{
                    name:'ozh',
                    age:20
                }
            }).then(value => {
                console.log(value);
            });
        }
        btns[1].onclick = function (){
            // POST 请求
            axios.post('/axios',{
                //请求体
                username:'admin',
                password:'123'
            },{
                // url 参数
                params: {
                    id:100,
                    vip:2
                },
            })
        }
        btns[2].onclick = function (){
            axios({
                //请求方法
                method:'POST',
                //url
                url: '/axios',
                //url 参数
                params:{
                    vip:3,
                    level:213
                },
                //头信息
                headers:{
                    a:100,
                    b:200
                },
                //请求体参数
                data:{
                    username:'admin',
                    password:'123456'
                }
            }).then(respone=>{
                console.log(respone);
                //响应状态码
                console.log(respone.status);
                //响应状态字符串
                console.log(respone.statusText);
                //响应头信息
                console.log(respone.headers);
                //响应体
                console.log(respone.data);})
            })
        }
    </script>
</body>
</html>
~~~

@tab javascript

~~~javascript
const cors = require("cors"); 	//引入 cors
const express = require('express');	// 1. 引入 express
const app = express();	// 2. 创建应用对象
app.use(cors());	 //使用cors解决跨域问题
// 3. 创建路由规则
// request 是对请求报文的封装
// response 是对响应报文的封装
app.all('/axios',(request,response)=>{
    response.setHeader("Access-Control-Allow-Origin","*");    // 设置响应头  设置允许跨域
    response.setHeader("Access-Control-Allow-Header","*");	    // 响应头
    response.send('hello Ajax axios');
})
// 4. 监听端口启动服务
app.listen(8000,()=>{
    console.log("服务已经启动，8000 端口监听中......");
})
~~~

:::

### 使用 fetch 发送 AJAX 请求

::: tabs#axios
@tab html

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>fetch 发送 AJAX 请求</title>
<body>
    <button>AJAX请求</button>
    <script>
        const btn = document.querySelectorAll('button');
        btn.onclick = function (){
            fetch('http://localhost:8000/fetch',{
                //请求方法
                method:'POST',
                //请求头
                headers:{
                    name:'ozh'
                },
                //请求体
                // body: 'username=admin&&password=123456
                body:{
                    username:'admin',
                    password:123456
                }
            }).then(response => {
                return response.text();
            })
        }
    </script>
</body>
</html>
~~~

@tab javascript

~~~javascript
const cors = require("cors"); 	//引入 cors
const express = require('express');	// 1. 引入 express
const app = express();	// 2. 创建应用对象
app.use(cors());	 //使用cors解决跨域问题
// 3. 创建路由规则
// request 是对请求报文的封装
// response 是对响应报文的封装
app.all('/fetch',(request,response)=>{
    response.setHeader("Access-Control-Allow-Origin","*");    // 设置响应头  设置允许跨域
    response.setHeader("Access-Control-Allow-Header","*");	    // 响应头
    response.send('hello Ajax fetch');
})
// 4. 监听端口启动服务
app.listen(8000,()=>{
    console.log("服务已经启动，8000 端口监听中......");
})
~~~

:::

## 跨域

- 同源策略 (Same-Origin Policy) 最早由 Netscape 公司提出，是浏览器的一种安全策略。
- 同源：协议、域名、端口号 必须完全相同。
- 违背同源策略就是跨域

### 解决跨域

1. JSONP

   ​		JSONP (JSON with Padding)，是一个非官方的跨域解决方案，纯粹凭借程序员的聪明才智开发出来，<font color='orange'>只支持 GET 请求</font>

   - JSONP 就是利用 script 标签的跨域能力来发送请求。

   - JSONP 的使用：

     1. 动态的创建一个 script 标签

        ~~~javascript
        var script = document.createElement("script");
        ~~~

     2. 设置 script 的 src，设置回调函数

     3. 将 script 插入到文档中

   - 案例：

     1. 原生 JSONP

        ::: tabs#jsonp
        @tab html

        ~~~html
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>JSONP 案例</title>
        <body>
            用户名：<input type="text" id="username">
            <p></p>
            <script>
                //获取 input 元素
                const input = document.querySelector('input');
                const p = document.querySelector('p');
                //声明 handle 函数
                function handle(data){
                    input.style.border = "soild 1px #f00"
                    p.innerHTML = data.msg;
                }
                //绑定事件
                input.onblur = function (){
                    //获取用户的输入值
                    let username = this.value;
                    //向服务器端发送请求 检测用户名是否存在
                    //1.创建 script 标签
                    const script = document.createElement('script');
                    //2.设置标签的 src 属性
                    script.src = 'http://127.0.0.1:8000/jsonp';
                    //3.将 script 插入到文档中
                    document.body.appendChild(script);
                }
            </script>
        </body>
        </html>
        ~~~

        @tab javascript

        ~~~javascript
        const express = require('express');	// 1. 引入 express
        const app = express();	// 2. 创建应用对象
        // 3. 创建路由规则
        // request 是对请求报文的封装
        // response 是对响应报文的封装
        app.all('/jsonp',(request,response)=>{
            // response.send('console.log("hello jsonp")')
            const data = {
                exist:1,
                msg:'用户名已经存在'
            }
            //将数据转化为字符串
            let str = JSON.stringify(data);
            //返回结果
            response.end(`handle(${str})`);
        })
        // 4. 监听端口启动服务
        app.listen(8000,()=>{
            console.log("服务已经启动，8000 端口监听中......");
        })
        ~~~

        :::

     2. jQuery 发送 JSONP 请求

        ::: tabs#jsonp
        @tab html

        ~~~html
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>jQuery - JSONP</title>
            <style>
                #result{
                    width: 300px;
                    height: 100px;
                    border: solid 1px #089;
                }
            </style>
            <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js"></script>
        <body>
            <button>点击发送 jsonp 请求</button>
            <div id="result"></div>
            <script>
                $('button').eq(0).click(function (){
                    $.getJSON('http://127.0.0.1:8000/jQurey-jsonp?callback=?',function (data){
                        $('#result').html(`
                            名称：${data.name}<br>
                            城市：${data.city}
                        `)
                    })
                })
            </script>
        </body>
        </html>
        ~~~

        @tab javascript

        ~~~javascript
        const express = require('express');	// 1. 引入 express
        const app = express();	// 2. 创建应用对象
        // 3. 创建路由规则
        // request 是对请求报文的封装
        // response 是对响应报文的封装
        app.all('/jQurey-jsonp',(request,response)=>{
            // response.send('console.log("hello jsonp")')
            const data = {
                name:'ozh',
                city:['北京','上海','深圳','广州']
            };
            //将数据转化为字符串
            let str = JSON.stringify(data);
            //接受 callback 参数
            let cb = request.query.callback;
            //返回结果
            response.end(`${cb}(${str})`);
        })
        // 4. 监听端口启动服务
        app.listen(8000,()=>{
            console.log("服务已经启动，8000 端口监听中......");
        })
        ~~~

        :::

2. CORS

   ​		CORS (Cross-Origin Resource Sharing)，跨域资源共享。CORS 是官方的跨域解决方案，它的特点是不需要再客户端做任何特殊的操作，完全在服务器中进行处理，支持 GET 和 POST 请求。跨域资源共享标准新增了一组 HTTP 首部字段，允许服务器声明哪些源站通过浏览器有权访问哪些资源。

   - CORS 是通过设置一个响应头来告诉浏览器，该请求允许跨域，浏览器收到该响应以后就会对响应放行。

   - CORS 的使用：

     - 服务端设置：

       ~~~javascript
       router.get("/案例",(request,response)=>{
           response.setHeader("Access-Control-Allow-Origin","*");    // 设置响应头  设置允许跨域
           response.setHeader("Access-Control-Allow-Header","*");	    // 响应头
           response.setHeader("Access-Control-Allow-Method","*");	    // 响应方法
       })
       ~~~

       
