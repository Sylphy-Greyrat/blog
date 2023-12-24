---
title: SpringBoot 缓存管理
#icon: fab fa-markdown
order: 2
category:
  - SpringBoot
tag:
  - SpringBoot
  - 后端
date: 2023-11-18
icon: iconfont icon-Redis
---

# Spring Boot 缓存管理

​		<font color='cornflowerblue'>缓存</font>是分布式系统中的重要组件，主要解决数据库数据的<font color='cornflowerblue'>高并发访问</font>。在实际开发中，尤其是用户<font color='cornflowerblue'>访问量较大</font>的网站，用户对<font color='cornflowerblue'>高频热点数据</font>的访问非常频繁，为了提高服务器<font color='cornflowerblue'>访问性能</font>、减少数据库的压力、提高用户体验，使用缓存显得尤其重要。

- 主要注解

  1. @EnaleCaching

     @EnableCaching 是由 Spring 框架提供的，Spring Boot 框架对该注解进行了继承，该注解需要配置在类上（在 Spring Boot 中，通常配置在项目启动类上），用于<font color='cornflowerblue'>开启基于注解的缓存支持</font>。

  2. @Cacheable

     @Cacheable 注解也是由 Spring 框架提供的，可以作用于类或方法（通常用在数据查询方法上），用于对方法结果进行缓存存储。

     @Cacheable 注解的执行顺序是，<font color='cornflowerblue'>先进行缓存查询，如果为空则进行方法查询，并将结果进行缓存；如果缓存中有数据，不进行方法查询，而是直接使用缓存数据</font>。
  
     | 属性名           | 说明                                                         |
     | ---------------- | ------------------------------------------------------------ |
     | value/cacheNames | 指定缓存空间的名称，比配属性。这两个属性二选一使用           |
     | key              | 指定缓存数据的 key，默认使用方法参数值，可以使用 SpEL 表达式 |
     | keyGengerator    | 指定缓存数据的 key 的生成器，与 key 属性二选一使用           |
     | cacheManager     | 指定缓存管理器                                               |
     | cacheResolver    | 指定缓存解析器，与 cacheManager 属性二选一使用               |
     | condition        | 指定在符合某条件下，进行数据缓存                             |
     | unless           | 指定在符合某条件下，不进行数据缓存                           |
     | sync             | 指定是否使用异步缓存，默认 false                             |
  
  3. @CachePut
  
     @CachePut 注解是由 Spring 框架提供的，可以作用于<font color='cornflowerblue'>类或方法</font>（通常用在数据更新方法上），该注解的作用是<font color='cornflowerblue'>更新缓存数据</font>。@CachePut 注解的执行顺序是，<font color='cornflowerblue'>先进行方法调用，然后将方法结果更新到缓存中</font>。
  
     @CachePut注解也提供了多个属性，这些属性与@Cacheable注解的属性完全相同。
  
  4. @CacheEvict
  
     @CacheEvict 注解是由 Spring 框架提供的，可以作用于<font color='cornflowerblue'>类或方法</font>（通常用在数据删除方法上），该注解的作用是<font color='cornflowerblue'>删除缓存数据</font>。@CacheEvict 注解的默认执行顺序是，<font color='cornflowerblue'>先进行方法调用，然后将缓存进行清除</font>。
  
     @CacheEvict 注解也提供了多个属性，这些属性与 @Cacheable 注解的属性基本相同，除此之外，还额外提供了两个特殊属性 <font color='cornflowerblue'>allEntries</font> 和 <font color='cornflowerblue'>beforeInvocation</font>。
  
     - allEntries 属性：
       - allEntries 属性表示是否清除指定缓存空间中的所有缓存数据，默认值为 false（即默认只删除指定 key 对应的缓存数据）。
     - beforeInvocation 属性：
       - beforeInvocation 属性表示是否在方法执行之前进行缓存清除，默认值为 false（即默认在执行方法后再进行缓存清除）。
  
  5. @Caching 
  
     @Caching 注解用于针对复杂规则的数据缓存管理，可以作用于类或方法，在 @Caching 注解内部包含有Cacheable、put 和 evict 三个属性，分别对应于 @Cacheable、@CachePut 和 @CacheEvict 三个注解。
  
     示例：
  
     ~~~java
     @Caching(cacheable={@Cacheable(cacheNames ="comment",key = "#id")},
     	put = {@CachePut(cacheNames = "comment",key = "#result.author")})
     	public Comment getComment(int comment_id){
     	return commentRepository.findById(comment_id).get();
     }
     ~~~
  
  6. @CacheConfig
  
     @CacheConfig 注解使用在类上，主要用于统筹管理类中所有使用 @Cacheable、@CachePut 和 @CacheEvict 注解标注方法中的公共属性，这些公共属性包括有 <font color='cornflowerblue'>cacheNames、keyGenerator、cacheManager和cacheResolver</font>。
  
     示例：
  
     ~~~java
     @CacheConfig(cacheNames = "comment")
     @Service
     public class CommentService {
         @Autowired
         private CommentRepository commentRepository;
         @Cacheable
         public Comment findById(int comment_id){
             Comment comment = commentRepository.findById(comment_id).get();
             return comment;
         }
     }
  
- Spring Boot 支持的缓存组件有：
  1. Generic
  2. JCache(JSR-107)(EhCache 3、Hazelcast、Infinispan等)
  3. EhCache 2.x
  4. Hazelcast
  5. Infinispan
  6. Couchbase
  7. Redis
  8. Caffeine
  9. Simple(默认)

## 基于注解的 Redis 缓存实现

---

1. 添加 Spring Data Redis 依赖启动器

   相关依赖

   ~~~xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>
   ~~~

2. Redis 服务连接配置

   ::: tabs

   @tab yml

   ~~~yaml
   spring:
     redis:
       host: 127.0.0.1
       port: 6379
       password: 123456
   ~~~

   @tab properties

   ~~~properties
   spring.redis.host=127.0.0.1
   spring.redis.port=6379
   spring.redis.password=123456
   ~~~

   :::

3. 使用 @Cacheable、@CachePut、@CahceEvict 注解定制缓存管理

   示例：

   ~~~java
   @Autowired
   private CommentRepository commentRepository;
   @Cacheable(cacheNames = "comment",unless = "#result==null")
   public Comment findById(int comment_id){
       Optional<Comment> optional = commentRepository.findById(comment_id);
       if(optional.isPresent()){
           return optional.get();
       }
       return null;
   }
   @CachePut(cacheNames = "comment",key = "#result.id")
   public Comment updateComment(Comment comment){
       commentRepository.updateComment(comment.getAuthor(), comment.getaId());
       return comment;
   }
   @CacheEvict(cacheNames = "comment")
   public void deleteComment(int comment_id){
       commentRepository.deleteById(comment_id);
   }

4. 基于注解的 Redis 查询缓存测试

5. 将缓存对象实现序列化

   ~~~java
   @Data
   @Entity(name = "t_comment")  
   public class Comment implements Serializable {
       @Id   
       @GeneratedValue(strategy = GenerationType.IDENTITY) 
       private Integer id;
       private String content;
       private String author;
       @Column(name = "a_id")  
       private Integer aId;
   }

6. 基于注解的 Redis 缓存查询测试

7. 基于注解的 Redis 缓存更新测试

8. 基于注解的 Redis 缓存删除测试

## 基于 API 的 Redis 缓存实现

---

1. 使用 Redsi API 进行业务数据缓存管理

   编写一个进行业务处理的类 ApiCommentService，使用 @Autowired 注解注入 Redis API 中常用的 RedisTemplate (类似于 Java 基础 API 中的 JdbcTemplate )；然后在数据查询、修改和删除三个方法中，根据业务需求分别进行数据缓存查询、缓存存储、缓存更新和缓存删除。同时，Comment 数据对应缓存管理的 key 值都手动设置了一个前缀 “comment_”，这是针对不同业务数据进行缓存管理设置的唯一 key，避免与其他业务缓存数据的 key 重复

   代码示例：

   ~~~java
   @Autowired
   private RedisTemplate redisTemplate;
   public Comment findById(int comment_id){
       Object object =  redisTemplate.opsForValue().get("comment_"+comment_id);
       if (object!=null){
           return (Comment)object;}else {
           Optional<Comment> optional = commentRepository.findById(comment_id);
           if(optional.isPresent()){Comment comment= optional.get();
   	    redisTemplate.opsForValue().set("comment_"+comment_id,comment,1,TimeUnit.DAYS);return comment;
   	}else {return null;}
       }
   }
   public Comment updateComment(Comment comment){
       commentRepository.updateComment(comment.getAuthor(), comment.getaId());
       redisTemplate.opsForValue().set("comment_"+comment.getId(),comment);
       return comment;
   }
   public void deleteComment(int comment_id){
       commentRepository.deleteById(comment_id);
       redisTemplate.delete("comment_"+comment_id);
   }

2. 编写 Web 访问层 Controller 文件

   在类上加入了 @RequestMapping(“/api”) 注解用于窄化请求，并通过 @Autowired 注解注入了新编写的 ApiCommentService 实例对象，然后调用 ApiCommentService 中的相关方法进行数据查询、修改和删除。

   代码示例：
   ~~~java
   @Autowired
   private ApiCommentService apiCommentService;
   @GetMapping("/get/{id}")
   public Comment findById(@PathVariable("id") int comment_id){
       Comment comment = apiCommentService.findById(comment_id);
       return comment;
   }
   @GetMapping("/update/{id}/{author}")
   public Comment updateComment(@PathVariable("id") int comment_id,@PathVariable("author") String author){
       Comment comment = apiCommentService.findById(comment_id);
       comment.setAuthor(author);
       Comment updateComment = apiCommentService.updateComment(comment);
       return updateComment;
   }
   @GetMapping("/delete/{id}")
   public void deleteComment(@PathVariable("id") int comment_id){
       apiCommentService.deleteComment(comment_id);
   }

3. 基于 API 的 Redis 缓存实现的相关配置

   1. 基于 API 的 Redis 缓存实现不需要 <font color='cornflowerblue'>@EnableCaching</font> 注解开启基于注解的缓存支持。
   2. 基于 API 的 Redis 缓存实现需要再 Spring Boot 项目的 pom.xml 文件中引入 <font color='cornflowerblue'>Redis</font> 依赖启动器，并在配置文件中进行 <font color='cornflowerblue'>Redis 服务连接配置</font>，同时将进行数据存储的 Comment 实体类<font color='cornflowerblue'>实现序列化接口</font>。
   3. 缓存测试与基于注解的 Redis 缓存实现的测试完全一样。

## 自定义 Redis 缓存序列化

---

- 自定义 RedisTemplate

  1. Redis API 默认序列化机制

     基于 Redis API 的 Redis 缓存实现是使用 RedisTemplate 模版进行数据缓存操作的，这里打开 RedisTemplate 类

     1. 使用 RedisTemplate 进行 Redis 数据缓存操作时，内部默认使用的是 <font color='cornflowerblue'>JdkSerializationRedisSerializer </font>序列化方式，所以进行数据缓存的实体类必须实现 JDK 自带的序列化接口（例如 Serializable）；
     2. 使用 RedisTemplate 进行 Redis 数据缓存操作时，如果自定义了缓存序列化方式 <font color='cornflowerblue'>defaultSerializer</font>，那么将使用自定义的序列化方式。

  2. 自定义 RedisTemplate 序列化机制

     在项目中引入 Redis 依赖后，Spring Boot 提供的 RedisAutoConfiguration 自动配置会生效。打开 RedisAutoConfiguration 类

     1. 在 Redis 自动配置类中，通过 Redis 连接工厂 <font color='cornflowerblue'>RedisConnectionFactory </font>初始化了一个 <font color='cornflowerblue'>RedisTemplate</font>；该类上方添加了 <font color='cornflowerblue'>@ConditionalOnMissingBean</font> 注解（顾名思义：当某个 Bean 不存在时生效），用来表明如果开发者自定义了一个名为 <font color='cornflowerblue'>redisTemplate </font>的 Bean，则该默认初始化的 <font color='cornflowerblue'>RedisTemplate </font>会被覆盖。
     2. 如果想要使用自定义序列化方式的 <font color='cornflowerblue'>RedisTemplate </font>进行数据缓存操作，可以参考上诉核心代码创建一个名为 <font color='cornflowerblue'>redisTemplate</font> 的 Bean 组件，并在该组将中设置对应的<font color='cornflowerblue'>序列化</font>方式即可

     在项目中创建一个 Redis 自定义配置类 RedisConfig，通过 @Configuration 注解定义了一个 RedisConfig 配置类，并使用 @Bean 注解注入了一个默认名称为方法名的 redisTemplate 组件（注意，该 Bean 组件名称必须是 redisTemplate）。在定义的 Bean 组件中，自定义了一个 RedisTemplate，使用自定义的 Jackson2JsonRedisSerializer 数据序列化方式；在定制序列化方式中，定义了一个 ObjectMapper 用于进行数据转换设置。

     代码示例：
     ~~~java
     @Bean
     public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
         RedisTemplate<Object, Object> template = new RedisTemplate();
         template.setConnectionFactory(redisConnectionFactory);
         // 使用JSON格式序列化对象，对缓存数据key和value进行转换
         Jackson2JsonRedisSerializer jacksonSeial = new Jackson2JsonRedisSerializer(Object.class);
         // 解决查询缓存转换异常的问题
         ObjectMapper om = new ObjectMapper();
         // 指定要序列化的域，field,get和set,以及修饰符范围，ANY是都有包括private和public
         om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
         // 指定序列化输入的类型，类必须是非final修饰的，final修饰的类，比如String,Integer等会跑出异常
         om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
         jacksonSeial.setObjectMapper(om);
         // 设置RedisTemplate模板API的序列化方式为JSON
         template.setDefaultSerializer(jacksonSeial);
         return template;
     }
     ~~~

  3. 效果测试

- 自定义 RedisCacheManager

  1. Redis 注解默认序列化机制

     1. Spring Boot 整合 Redis 组件提供的缓存自动配置类 <font color='cornflowerblue'>RedisCacheConfiguration</font>，其内部是通过 Redis 连接工厂 <font color='cornflowerblue'>RedisConnectionFactory </font>定义了一个缓存管理器 <font color='cornflowerblue'>RedisCacheManager</font>；同时定制 RedisCacheManager 时，也默认使用了 <font color='cornflowerblue'>JdkSerializationRedisSerializer </font>序列化方式。
     2. 如果想要使用自定义序列化方式的 RedisCacheManager 进行数据缓存操作，可以创建一个名为 <font color='cornflowerblue'>cacheManager </font>的 <font color='cornflowerblue'>Bean 组件</font>，并在该组件中设置对应的<font color='cornflowerblue'>序列化</font>方式即可。

  2. 自定义 RedisCacheManager

     在 RedisConfig 类中添加方法 cacheManager，该方法主要由三部分组成：

     ~~~java
     @Bean
     public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
         // 分别创建String和JSON格式序列化对象，对缓存数据key和value进行转换
         RedisSerializer<String> strSerializer = new StringRedisSerializer();
         Jackson2JsonRedisSerializer jacksonSeial = new Jackson2JsonRedisSerializer(Object.class);
         // 解决查询缓存转换异常的问题
         ObjectMapper om = new ObjectMapper();
         om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
         om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
         jacksonSeial.setObjectMapper(om);
         // 定制缓存数据序列化方式及时效
         RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                 .entryTtl(Duration.ofDays(1))   // 设置缓存有效期为1天
                 .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(strSerializer))
                 .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(jacksonSeial))
                 .disableCachingNullValues();   // 对空数据不进行缓存
         RedisCacheManager cacheManager = RedisCacheManager.builder(redisConnectionFactory).cacheDefaults(config).build();
         return cacheManager;
     }
  
  3. 效果测试
