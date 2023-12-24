---
title: SpringBoot 安全管理
#icon: fab fa-markdown
order: 2
category:
  - SpringBoot
tag:
  - SpringBoot
  - 后端
date: 2023-12-01
icon: iconfont icon-security
---

# Spring Boot 安全管理

## Spring Security

---

### Spring Security 的介绍

- Spring Security 是基于 Spring 生态圈的，用于提供安全访问控制解决方案的框架。
- Spring Security 的安全管理有两个重要概念，分别是 Authentication（认证）和 Authorization（授权）。

针对项目的安全管理。Spring 家族提供了安全框架 Spring Security。它是一个基于 Spring 生态圈的。用于提供安全访问控制解决方案的框架。为了方便 Spring Boot 项目的安全管理，Spring Boot 对 Spring Security 安全框架进行了整合支持，并提供了通用的自动化配置，从而实现了 Spring Security 安全框架中包含的多数安全管理功能，例如 MVC Security、WebFlux Security、OAuth2、Actuator Security。关于这几种安全管理功能的具体说明如下：

- MVC Security 是 Spring Boot 整合 Spring MVC 框架搭建的 Web 应用的安全管理。目前 Web 开发中，开发人员使用较多，较为熟系的是传统的 Spring MVC 框架，当然使用 Spring Boot 整合 MVC Security 实现安全管理功能不在少数。
- WebFlux Security 是 Spring Boot 整合 Spring WebFlux 框架搭建的 Web 应用的安全管理。Web 开发中的 Spring WebFlux 框架刚出现不久、文档不是很全、实际开发中使用也不是很多，但是集成了许多优秀特性，在 Web 开发中可能会越来越流行。
- OAuth2 是大型项目的安全管理框架，可以实现第三方认证、单点登录等功能。OAuth2 框架最为复杂，需要理解 OAuth 协议、配置认证服务器、提供第三方认证接口等，对于有这些需求的大型项目来说是非常适用的安全管理框架，不过当前 Spring Boot 版本还不支持 OAuth2 授权服务器。
- Actuator Security 用于对项目的一些运行环境提供安全监控。例如 Health 健康信息、Info 运行信息等，它主要作为系统指标供运维人员查看管理系统的运行情况。

项目安全管理是一个很大的话题，开发者可以根据实际项目需求，选择在项目中使用 Spring Securit 安全框架的全部或部分安全功能。

### MVC Security 安全配置

- 相关依赖

  ~~~xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  ~~~

- 配置介绍

  使用 Spring Boot 与 Spring MVC 进行 Web 开发时，如果项目引入 spring-boot-starter-security 依赖启动器，MVC Security 安全管理功能就会自动生效。其默认的安全配置是在 SecurityAutoConfiguration 和 UserDetailsServiceAutoConfiguration 在实现的，其中，SecurityAutoConfiguration 会导入并自动化配置 SpringBootWebSecurityConfiguration 用于启动 Web 安全管理，UserDetailsServiceAutoConfiguration 则用于配置用户身份信息。

  要完全关闭 Security 提供的 Web 应用默认安全配置，可以自定义 WebSecurityConfiguration 类型的 Bean 组件，但是不会关闭 UserDetailsServices、AuthenticationProvieder 或 AuthenticationManager 类型的 Bean 组件，另外，可以通过自定义 WebSecurityConfigurerAdapter 类型的 Bean 组件来覆盖默认访问规则，Spring Boot 提供了非常多方便的方法，可用于覆盖请求映射和静态资源的访问规则。

  MVC Secruity 安全配置与 WebSecurityConfigurerAdapter 类的关系非常密切，这里通过 Spring Secruity API 查看其主要方法：

  | 方法                                         | 描述                             |
  | -------------------------------------------- | -------------------------------- |
  | configure(AuthenticationManagerBuilder auth) | 定制用户认证管理器来实现用户认证 |
  | configure(HttpSecurity http)                 | 定制基于HTTP请求的用户访问控制   |

  WebSecurityConfigurerAdapter 类中包含有两个非常重要的配置方法，分别是 configure(AuthenticationManagerBuilder auth) 和 configure(HttpSecurity http)。

### 自定义用户认证

- 内存身份认证

  1. 自定义 WebSecurityConfigurerAdapter 配置类

     ~~~java
     @EnableWebSecurity  // 开启MVC security安全支持
     public class SecurityConfig extends WebSecurityConfigurerAdapter{
     }
     ~~~

     - 注：@EnableWebSecurity 注解是一个组合注解，主要包括 @Configuration 注解、@Import({WebSecurityConfiguration.class, SpringWebMvcImportSelector.class}) 注解和 @EnableGlobalAuthentication 注解

  2. 使用内存进行身份认证

     SecurityConfig 类中重写 configure(AuthenticationManagerBuilder auth) 方法，并在该方法中使用内存身份认证的方式自定义了认证用户信息。定义用户认证信息时，设置了两个用户名和密码以及的角色信息。

     ~~~java
     @EnableWebSecurity  // 开启MVC security安全支持
     public class SecurityConfig extends WebSecurityConfigurerAdapter{
         @Override
         protected void configure(AuthenticationManagerBuilder auth) throws Exception {
             //  密码需要设置编码器
             BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
             // 1、使用内存用户信息，作为测试使用
             auth.inMemoryAuthentication().passwordEncoder(encoder)
                 .withUser("shitou").password(encoder.encode("123456")).roles("common")
                 .and()
                 .withUser("李四").password(encoder.encode("123456")).roles("vip");
         }
     }

- JDBC 身份认证

  1. 数据准备

     | 表名                 | 说明           |
     | -------------------- | -------------- |
     | t_customer           | 用户表         |
     | t_authority          | 用户权限表     |
     | t_customer_authority | 用户权限关联表 |

  2. 添加 JDBC 连接数据库的依赖启动器

     ~~~xml
     <dependency>
     	<groupId>org.springframework.boot</groupId>
     	<artifactId>spring-boot-starter-jdbc</artifactId>
     </dependency>
     <dependency>
     	<groupId>mysql</groupId>
     	<artifactId>mysql-connector-java</artifactId>
     	<scope>runtime</scope>
     </dependency>
     ~~~

  3. 进行数据库连接配置

  4. 使用 JDBC 进行身份验证

     在 SecurityConfig 类中的 configure(AuthenticationManagerBuilder auth) 方法中使用 JDBC 身份认证的方式进行自定义用户认证，使用 JDBC 身份认证时，首先需要对密码进行编码设置（必须与数据库中用户密码加密方式一致）；然后需要加载 JDBC 进行认证连接的数据源 DataSource；最后，执行 SQL 语句，实现通过用户名 username 查询用户信息和用户权限。

     ~~~java
     @EnableWebSecurity  // 开启MVC security安全支持
     public class SecurityConfig extends WebSecurityConfigurerAdapter{
         @Autowired
         private DataSource dataSource;
         @Override
         protected void configure(AuthenticationManagerBuilder auth) throws Exception {
             // 2、使用JDBC进行身份认证
             String userSQL ="select username,password,valid from t_customer " +
                 "where username = ?";
             String authoritySQL="select c.username,a.authority from t_customer c,t_authority a,"+
                 "t_customer_authority ca where ca.customer_id=c.id " +
                 "and ca.authority_id=a.id and c.username =?";
             auth.jdbcAuthentication().passwordEncoder(encoder)
                 .dataSource(dataSource)
                 .usersByUsernameQuery(userSQL)
                 .authoritiesByUsernameQuery(authoritySQL);
         }
     }

- UserDetailsService 身份认证

  1. 定义查询用户及角色信息的服务接口

     CustomerService 业务处理类，用来通过用户名获取用户及权限信息

     ~~~java
     @Service
     public class CustomerService {
         @Autowired
         private CustomerRepository customerRepository;
         @Autowired
         private AuthorityRepository authorityRepository;
         @Autowired
         private RedisTemplate redisTemplate;
         // 业务控制：使用唯一用户名查询用户信息
         public Customer getCustomer(String username) {
             Customer customer = null;
             Object o = redisTemplate.opsForValue().get("customer_" + username);
             if (o != null) {
                 customer = (Customer) o;
             } else {
                 customer = customerRepository.findByUsername(username);
                 if (customer != null) {
                     redisTemplate.opsForValue().set("customer_" + username, customer);
                 }
             }
             return customer;
         }
         // 业务控制：使用唯一用户名查询用户权限
         public List<Authority> getCustomerAuthority(String username) {
             List<Authority> authorities = null;
             Object o = redisTemplate.opsForValue().get("authorities_" + username);
             if (o != null) {
                 authorities = (List<Authority>) o;
             } else {
                 authorities = authorityRepository.findAuthoritiesByUsername(username);
                 if (authorities.size() > 0) {
                     redisTemplate.opsForValue().set("authorities_" + username, authorities);
                 }
             }
             return authorities;
         }
     }

  2. 定义 UserDetailsService 用于封装认证用户信息

     UserDetailsService 是 Security 提供的进行认证用户信息封装的接口，该接口提供的 loadUserByUsername(String s) 方法用于通过用户名加载用户信息。使用 UserDetailsService 进行身份认证的时，自定义一个 UserDetailsService 接口的实现类，通过 loadUserByUsername(String s) 方法调用用户业务处理类中已有的方法进行用户详情封装，返回一个 UserDetails 封装类，来供 Security 认证使用。

     自定义一个接口实现类 UserDetailsServiceImpl 进行用户认证信息 UserDetailsService 封装，重写了 UserDetailsService 接口的 loadUserByUsername(String s) 方法，在该方法中，使用 CustomerService 业务处理类获取用户的用户信息和权限信息，并通过 UserDetails 进行认证用户信息封装。

     ~~~java
     @Service
     public class UserDetailsServiceImpl implements UserDetailsService {
         @Autowired
         private CustomerService customerService;
         @Override
         public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
             // 通过业务方法获取用户及权限信息
             Customer customer = customerService.getCustomer(s);
             List<Authority> authorities = customerService.getCustomerAuthority(s);
             // 对用户权限进行封装
             List<SimpleGrantedAuthority> list = authorities.stream().map(authority -> new SimpleGrantedAuthority(authority.getAuthority())).collect(Collectors.toList());
             // 返回封装的UserDetails用户详情类
             if (customer != null) {
                 UserDetails userDetails = new User(customer.getUsername(), customer.getPassword(), list);
                 return userDetails;
             } else {
                 // 如果查询的用户不存在（用户名不存在），必须抛出此异常
                 throw new UsernameNotFoundException("当前用户不存在！");
             }
         }
     }

  3. 使用 UserDetailsService 进行身份认证 

     ~~~java
     @EnableWebSecurity  // 开启MVC security安全支持
     public class SecurityConfig extends WebSecurityConfigurerAdapter {
         @Autowired
         private UserDetailsServiceImpl userDetailsService;
         @Override
         protected void configure(AuthenticationManagerBuilder auth) throws Exception {
             //  密码需要设置编码器
             BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
             //  使用UserDetailsService进行身份认证
             auth.userDetailsService(userDetailsService).passwordEncoder(encoder);
         }
     }
     ~~~

### 自定义用户访问控制

- 自定义用户访问控制

  自定义配置类 SecurityConfig，继续重写 configure(HttpSecurity http) 方法

  ~~~java
  @EnableWebSecurity  // 开启MVC security安全支持
  public class SecurityConfig extends WebSecurityConfigurerAdapter {
      @Override
      protected void configure(HttpSecurity http) throws Exception {
          // 自定义用户授权管理
          http.authorizeRequests()
              .antMatchers("/").permitAll()
              // 需要对static文件夹下静态资源进行统一放行
              .antMatchers("/login/**").permitAll()
              .antMatchers("/detail/common/**").hasRole("common")
              .antMatchers("/detail/vip/**").hasRole("vip")
              .anyRequest().authenticated()
              .and()
              .formLogin();
      }
  }
  ~~~

- 自定义用户登录

  1. 自定义用户登录页面

  2. 自定义用户登录跳转

     ~~~java
     // 向用户登录页面跳转
     @GetMapping("/userLogin")
     public String toLoginPage() {
         return "login/login";
     }
     ~~~

  3. 自定义用户登录控制

     ~~~java
     @EnableWebSecurity  // 开启MVC security安全支持
     public class SecurityConfig extends WebSecurityConfigurerAdapter {
         @Override
         protected void configure(HttpSecurity http) throws Exception {
             // 自定义用户授权管理
             http.authorizeRequests()
                 .antMatchers("/").permitAll()
                 // 需要对static文件夹下静态资源进行统一放行
                 .antMatchers("/login/**").permitAll()
                 .antMatchers("/detail/common/**").hasRole("common")
                 .antMatchers("/detail/vip/**").hasRole("vip")
                 .anyRequest().authenticated();
             // 自定义用户登录控制
             http.formLogin()
                 .loginPage("/userLogin").permitAll()
                 .usernameParameter("name").passwordParameter("pwd")
                 .defaultSuccessUrl("/")
                 .failureUrl("/userLogin?error");
         }
     }
     ~~~

- 自定义用户退出

  1. 在登录页面添加自定义用户退出链接

     ~~~html
     <form th:action="@{/mylogout}" method="post">
     	<input th:type="submit" th:value="注销" />
     </form>
     ~~~

     注：Spring Boot 项目中引入 Spring Security 框架后会自动开启 CSRF 防护功能（跨站请求伪造防护，此处作为了解即可，后续小节将详细说明），用户退出时必须使用 POST 请求；如果关闭了 CSRF 防护功能，那么可以使用任意方式的 HTTP 请求进行用户注销。

  2. 自定义用户退出控制

     在 SecurityConfig 类，重写 configure(HttpSecurity http) 方法进行用户退出控制，在该方法中添加如下代码：

     ~~~java
     @EnableWebSecurity  // 开启MVC security安全支持
     public class SecurityConfig extends WebSecurityConfigurerAdapter {
         @Override
         protected void configure(HttpSecurity http) throws Exception {
             // 自定义用户退出控制
             http.logout()
                 .logoutUrl("/mylogout")
                 .logoutSuccessUrl("/");
         }
     }
     ~~~

- 登录用户信息获取

  1. 使用 HttpSesion 获取用户信息及测试

     在 FilmeController 类中新增一个用于获取当前会话用户信息的 getUser() 方法，在该方法中通过获取当前 HttpSession 的相关方法遍历并获取了会话中的用户信息。

     在获取认证用户信息时，使用了 Authentication 的 getPrincipal() 方法，默认返回的也是一个 Object 对象，其本质是封装用户信息的 UserDetails 封装类，其中包括有用户名、密码、权限、是否过期等。

     ~~~java
     /**
       * 通过传统的HttpSession获取Security控制的登录用户信息
       * @param session
       */
     @GetMapping("/getuserBySession")
     @ResponseBody
     public void getUser(HttpSession session) {
         // 从当前HttpSession获取绑定到此会话的所有对象的名称
         Enumeration<String> names = session.getAttributeNames();
         while (names.hasMoreElements()){
             // 获取HttpSession中会话名称
             String element = names.nextElement();
             // 获取HttpSession中的应用上下文
             SecurityContextImpl attribute = (SecurityContextImpl) session.getAttribute(element);
             System.out.println("element: "+element);
             System.out.println("attribute: "+attribute);
             // 获取用户相关信息
             Authentication authentication = attribute.getAuthentication();
             UserDetails principal = (UserDetails)authentication.getPrincipal();
             System.out.println(principal);
             System.out.println("username: "+principal.getUsername());
         }
     }

  2. 使用 SecurityContextHolder 获取用户信息

     在 FilmeContrller 控制类中新增一个获取当前会话用户信息的 getUser2() 方法

     ~~~java
     /**
       * 通过Security提供的SecurityContextHolder获取登录用户信息
       */
     @GetMapping("/getuserByContext")
     @ResponseBody
     public void getUser2() {
         // 获取应用上下文
         SecurityContext context = SecurityContextHolder.getContext();
         System.out.println("userDetails: "+context);
         // 获取用户相关信息
         Authentication authentication = context.getAuthentication();
         UserDetails principal = (UserDetails)authentication.getPrincipal();
         System.out.println(principal);
         System.out.println("username: "+principal.getUsername());
     }
     ~~~

- 记住功能

  1. 基于简单加密的 Token 的方式

     在页面添加记住功能勾选框

     ~~~html
     <label>
     	<input type="checkbox" name="rememberme"> 记住我
     </label>
     ~~~

     在 SecurityConfig 类，重写 configure(HttpSecurity http) 方法进行记住功能配置

     ~~~java
     @EnableWebSecurity  // 开启MVC security安全支持
     public class SecurityConfig extends WebSecurityConfigurerAdapter {
         @Override
         protected void configure(HttpSecurity http) throws Exception {
             // 定制Remember-me记住我功能
             http.rememberMe()
                 .rememberMeParameter("rememberme")
                 .tokenValiditySeconds(200)
         }
     }

  2. 基于持久化 Token 方式

     1. 在数据库中创建一个存储 cookie 信息的持续登录用户表

     2. 在 SecurityConfig 类，重写 configure(HttpSecurity http) 方法进行记住功能配

        ~~~java
        @EnableWebSecurity  // 开启MVC security安全支持
        public class SecurityConfig extends WebSecurityConfigurerAdapter {
            @Autowired
            private DataSource dataSource;
            @Override
            protected void configure(HttpSecurity http) throws Exception {
                // 定制Remember-me记住我功能
                http.rememberMe()
                    .rememberMeParameter("rememberme")
                    .tokenValiditySeconds(200)
                    // 对cookie信息进行持久化管理
                    .tokenRepository(tokenRepository());
            }
            /**
             * 持久化Token存储
             */
            @Bean
            public JdbcTokenRepositoryImpl tokenRepository() {
                JdbcTokenRepositoryImpl jr = new JdbcTokenRepositoryImpl();
                jr.setDataSource(dataSource);
                return jr;
            }
        }
        ~~~

- CSRF 防护功能

  1. CSRF 防护功能关闭

     1. 创建数据修改页面

        ~~~html
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
        <head>
            <meta charset="UTF-8">
            <title>用户修改</title></head>
        <body>
        <div align="center">
            <form method="post" action="/updateUser">
                用户名: <input type="text" name="username"/><br/>
                密&nbsp;&nbsp;码: <input type="password" name="password"/><br/>
                <button type="submit">修改</button>
            </form>
        </div>
        </body>
        </html>
        ~~~

     2. 编写后台控制层方法，编写的 toUpdate() 方法用于向用户修改页面跳转，updateUser() 方法用于对用户修改提交数据处理。其中，在 updateUser() 方法中只是演示了获取的请求参数，没有具体的业务实现。

        ~~~java
        @Controller
        public class CSRFController {
            // 向用户修改页跳转
            @GetMapping("/toUpdate")
            public String toUpdate() {
                return "csrf/csrfTest";
            }
            // 用户修改提交处理
            @ResponseBody
            @PostMapping(value = "/updateUser")
            public String updateUser(@RequestParam String username, @RequestParam String password,
                                     HttpServletRequest request) {
                System.out.println(username);
                System.out.println(password);
                String csrf_token = request.getParameter("_csrf");
                System.out.println(csrf_token);
                return "ok";
            }
        }
        ~~~

     整合 Spring Security 安全框架后，项目默认启用了 CSRF 安全防护功能，项目中所有涉及到数据修改方式的请求都会被拦截。

     针对这种情况，可以有两种处理方式：

     1. 直接关闭 Security 默认开启的 CSRF 防御功能

        配置类 SecurityConfig，在重写的 configure(HttpSecurity http) 方法中进行关闭配置即可

        ~~~java
        @EnableWebSecurity  // 开启MVC security安全支持
        public class SecurityConfig extends WebSecurityConfigurerAdapter {
            @Override
            protected void configure(HttpSecurity http) throws Exception {
                // 可以关闭Spring Security默认开启的CSRF防护功能
                http.csrf().disable();
            }
        }

     2. 配置 Security 需要的 CSRF Token

        1. 针对 From 表单数据修改的 CSRF Token 配置

           ~~~html
           <form method="post" action="/updateUser">
               <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}"/>
               用户名: <input type="text" name="username"/> <br/>
               密&nbsp;&nbsp;码: <input type="password" name="password"/> <br/>
               <button type="submit">修改</button>
           </form>

        2. 针对 Ajax 数据修改请求的 CSRF Token 配置

           在页面的 \<head> 标签中添加 \<meta> 子标签，并配置 CSRF Token 信息

           ~~~html
           <head>
           	<meta name="_csrf" th:content="${_csrf.token}"/>
           	<meta name="_csrf_header" th:content="${_csrf.headerName}"/>
           </head>
           ~~~

           在具体的 Ajax 请求中获取 \<meta> 子标签中设置的 CSRF Token 信息并绑定在 HTTP 请求头中进行请求验证

           ~~~javascript
           $(function () {
           	var token = $("meta[name='_csrf']").attr("content");
           	var header = $("meta[name='_csrf_header']").attr("content");
           	$(document).ajaxSend(function(e, xhr, options) {
           		xhr.setRequestHeader(header, token);
           	});
           });
           ~~~

### Security 管理前端页面

1. 添加 thymeleaf-extras-springsecurity5 依赖启动器

   ~~~xml
   <dependency>
   	<groupId>org.thymeleaf.extras</groupId>
   	<artifactId>thymeleaf-extras-springsecurity5</artifactId>
   </dependency>

2. 修改前端页面，使用 Security 相关标签进行页面控制

   在页面中引入 Security 安全标签

   ~~~html
   <html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org" 
         xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity5">
       <head>
           <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
           <title>影视直播厅</title>
       </head>
       <body>
           <div sec:authorize="isAnonymous()">
               <h2 align="center">游客您好，如果想查看电影<a th:href="@{/userLogin}">请登录</a></h2></div>
           <div sec:authorize="isAuthenticated()">
               <h2 align="center"><span sec:authentication="name" style="color: #007bff"></span>
                   您好，您的用户权限为<span sec:authentication="principal.authorities"
                                   style="color:darkkhaki"></span>，您有权观看以下电影</h2>
               <form th:action="@{/mylogout}" method="post">
                   <input th:type="submit" th:value="注销" />
               </form>
           </div>
           <div sec:authorize="hasRole('common')">
               <h3>普通电影</h3>
               <ul><li><a th:href="@{/detail/common/1}">我不是药神</a></li>
                   <li><a th:href="@{/detail/common/2}">夏洛特烦恼</a></li></ul>
           </div>
           <div sec:authorize="hasAuthority('ROLE_vip')">
               <h3>VIP专享</h3>
               <ul><li><a th:href="@{/detail/vip/1}">速度与激情</a></li>
                   <li><a th:href="@{/detail/vip/2}">猩球崛起</a></li></ul>
           </div>
       </body>
   </html>
   ~~~

   

