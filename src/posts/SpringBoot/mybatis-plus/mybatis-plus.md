---
title: Mybatis-plus
#icon: fab fa-markdown
order: 2
category:
  - SpringBoot
tag:
  - SpringBoot
  - 后端
  - Mybatis
date: 2022-08-24
icon: iconfont icon-mybatisplus
---

# Mybatis-plus

---

相关依赖

~~~xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.3.1</version>
</dependency>
~~~

## Mybatis-plus 介绍

- 特性：

  1. 无侵入：只做增强不做改变，引入它不会对现有工程产生影响，如丝般顺滑。
  2. 损耗小：启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作，BaseMapper。
  3. 强大的 CRUD 操作：内置通用 Mapper 、通用 Service，仅仅通过少量配置即可实现单表大部分 CRUD 操作，更有强大的条件构造器，满足各类使用需求，以后简单的 CRUD 操作，无需自行编写。
  4. 支持 Lambda 形式调用：通过 Lambda 表达式，方便的编写各类查询条件，无需再担心字段写错
  5. 支持主键自动生成：支持多达 4 种主键策略（内含分布式唯一 ID 生成器 - Sequence），可自由配置，完美解决主键问题
  6. 支持 ActiveRecord 模式：支持 ActiveRecord 形式调用，实体类只需继承 Model 类即可进行强大的 CRUD 操作**支持自定义全局调用操作**：支持全局通用方法注入（Write once, use anywhere）
  7. 内置代码生成器：采用代码或者 Maven 插件可快速生成 Mapper、Model、Service
  8. Controller 层代码，支持模版引擎，更有超多自定义配置等您来使用（自动帮你生成代码）
  9. 内置分页插件：基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页等同于普通 List 查询。分页插件支持多种数据库：支持 Mysql、MariaDB、Oracle、DB2、H2、HSQL、SQLite、Postgre、SQLServer 等多种数据库
  10. 内置性能分析插件：可输出 Sql 语句以及其执行时间，建议开发测试时启用该功能，能快速揪出慢查询
  11. 内置全局拦截插件：提供全表 delete、update 操作智能分析阻断，也可自定义拦截规则，预防误操作

  Mybatis-plus 详细指南：

## Mybatis-plus 实现单表 CRUD 操作

1. 导入相关依赖

   在 pom.xml 文件中添加 mybatis-plus 的依赖，具体代码如下：

   ~~~xml
   <!--   Mybatis-plus 插件   -->
   <dependency>
       <groupId>com.baomidou</groupId>
       <artifactId>mybatis-plus-boot-starter</artifactId>
       <version>3.5.3.1</version>
   </dependency>

2. application 配置文件

   对于演示 mybatis-plus 的基本⽤法，在配置文件 application.yml 中只需要配置基本的数据连接参数即可，和 mybatis 项目配置相同。同时，日志输出配置也只需将原来 mybatis 修改为 mybatis-plus 即可。

   ~~~yaml
   #数据源配置
   spring:
     jpa:
       open-in-view: false
     datasource:
       url: jdbc:mysql://159.75.225.74:3344/test?characterEncoding=utf-8&useSSL=false&serverTimezone=UTC&rewriteBatchedStatements=true
       username: root
       password: rootpassword
       driver: com.mysql.cj.jdbc.Driver
   #配置 Mybatis 相关属性
   mybatis-plus:
     configuration:
       # 打印输出 SQL 语句
       log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

3. 编写 Entity 实体类

   ~~~java
   @Data
   @Builder
   @AllArgsConstructor
   @NoArgsConstructor
   public class Teacher {
       Long id;
       String name;
       String office;
       Integer age;
       String cellphone;
       String email;
   }
   ~~~

4. 编写 Mapper 接口类

   和 Mybatis 一样，需要编写 Mapper 接口类，所有的数据库操作都在 Mapper 接口类中实现。只不过使用了 Mybatis-plus 的 Mapper 类变得更为简单，只需要继承一个 BaseMapper 的泛型接口，传入 Teacher 对象类型即可。该 Mapper 类无语编写任何方法，即可实现基本的 CRUD 操作。同时，TeacherMapper 还具有 BaseMapper 提供的所有功能，包括各种查询等，对于程序员来说，大大简化了基本操作的代码编写。

   TeacherMapper 代码如下：

   ~~~java
   @Mapper
   public interface TeacherMapper extends BaseMapper<Teacher> {
   }
   ~~~

   ::: tip 注意

   需要在启动类中配置 @MapperScan(“mapper 包所在路径”)，告诉启动类在启动前需要扫描 mapper 包下的所有接口。

   参考代码如下：

   ~~~java
   @SpringBootApplication
   @MapperScan("com.example.mybatisplus.mapper")
   public class MybatisPlusApplication {
       public static void main(String[] args) {
           SpringApplication.run(MybatisPlusApplication.class, args);
       }
   }
   ~~~

   :::

5. 单元测试和结果分析

   经过上面的配置和简单代码编写后，既可以对 mapper 类进行单元测试。由上可见，使用 Mybatis-plus，可以非常方便实现了数据库的常用操作。

   1. 查询操作

      1. 查询所有记录

         ~~~java
         @Autowired
         TeacherMapper teacherMapper;
         @Test
         public void ListAll(){
             List<Teacher> teacherList = teacherMapper.selectList(null);
             teacherList.forEach(System.out::println);
         }
         ~~~

         此处使用的是 BaseMapper 的 selectList() 查询接口，该接口的声明如下：

         ~~~java
         // 根据 entity 条件，查询全部记录
         List<T> selectList(@Param("ew") Wrapper<T> queryWrapper);
         ~~~

         该接口可以传入一个 Wrapper 类型的查询对象，此处我们传入一个 null 对象，表示查询所有记录。

      2. 查询单个记录

         Mybatis-plus 的 BaseMapper 提供用于查询单个接口的 api 为 selectOne() 以及 selectById()，其中 selectById(Long id) 能够根据主键 id 查询对象记录。例如查询 id=1 的教师对象，参考代码如下：

         ~~~java
         @Autowired
         TeacherMapper teacherMapper;
         @Test
         public void getId(){
             Teacher teacher = teacherMapper.selectById(3L);
             System.out.println(teacher);
         }
         ~~~

   2. 插入操作

      插⼊操作需要注意两点：一个插入时候不需要手动确定主键 id 值，另外一个插入之后需要在对象中回填 id，获得新纪录的主键。例如插入一个新的教师记录，参考代码如下：

      ~~~java
      @Autowired
      TeacherMapper teacherMapper;
      @Test
      public void add(){
          Teacher teacher = Teacher.builder().age(22).cellphone("13142525551").email("hfq@163.com")
              .name("张三").office("明德楼201").build();
          int result = teacherMapper.insert(teacher);
          System.out.println("插入记录数："+result+";新纪录的id："+teacher.getId());
      }
      ~~~

      上述代码中，我们使用了 builder() 构建者模式来简化了 teacher 对象的创建。调用 mapper 的 insert() 接口实现对象插入操作，该方法的返回值表示影响的记录数，该方法同时将新纪录的主键 id 回填到 teacher 对象的 id 属性中。

      ::: tip 注意

      Mybatis-plus 默认的主键生成方式采用了雪花算法。雪花算法( snowflflake )是 Twitter 开源的分布式 ID 生成算法，结果是一个 long 型的 ID。其核心思想是：使用 41bit 作为毫秒数，10bit 作为机器的 ID（5个 bit 是数据中心，5个 bit 的机器ID ），12bit 作为毫秒内的流水号（意味着每个节点在每毫秒可以产生 4096 个 ID ），最后还有一个符号位，永远是 0。可以保证几乎全球唯一。

      如果需要使用 MySQL 数据库的自增主键策略，需要手动在实体类中指定主键策略。在 Teacher 类的主键 id 上使用 @Tableid 修改主键策略，参考代码如下：

      ~~~java
      public class Teacher{
         @TableId(type = IdType.AUTO)
          Long id;
          ……
      }
      ~~~

      type = IdType.AUTO 表示使用数据库自身定义的 id 生成策略，即自增 id。Mybatis-plus 支持的主键策略如下：

      ~~~java
      public enum IdType {
          AUTO(0),    // 数据库id自增
          NONE(1),    // 未设置主键
          INPUT(2),   // 手动输入
          ID_WORKER(3),   // 默认的全局唯一id
          UUID(4),    // 全局唯一id uuid
          ID_WORKER_STR(5);   //ID_WORKER字符串表达法
      }
      ~~~

      :::

   3. 删除操作

      删除操作使用的接口 api 为 deleteById()，例如要删除刚才插入的教师记录，只需要传入 id=21 的 Long 类型值即可，参考代码如下:

      ~~~java
      @Test
      public void delete() {
          int result = teacherMapper.deleteById(24L);
          System.out.println("删除记录数：" + result);
      }
      ~~~

   4. 更新操作

      BaseMapper 提供的修改对象记录的接口为 updateById(entity)，该 api 能够根据 对象的 id 值更新原来的属性。参考代码如下:

      ~~~java
      @Test
      public void update(){
          Teacher teacher = teacherMapper.selectById(1L);
          teacher.setOffice("厚德楼807");
          teacher.setCellphone("20561");
          teacherMapper.updateById(teacher);
          System.out.println(teacherMapper.selectById(1L));
      }
      ~~~

6. BaseMapper 提供的 CRUD 常用 api 接口总结如下：

   1. 查询：selectList(wrapper) 方法用于查询列表，可以传入一个 wrapper 查询对象，如果传入 null 表示查询所有记录；selectById(id) 表示传入 id 值根据 id 查询单个记录；selectByOne(wrapper) 传入 wrapper 对象表示查询单个记录；
   2. 插入：insert(entity) 表示插入一个新对象，主键 id 默认使用雪花算法生成 id，需要在实体类的 id 属性上添加 @TableId(type=IdType.AUTO)，实现自增 id 策略。插入成功后，新记录的主键 id 会自动回填到对象属性。
   3. 删除：deleteById(id) 实现根据主键 id 删除记录
   4. 更新：updateById(entity) 实现根据 id 更新对象记录
   5. 需要在 Application 启动类前添加 @MapperScan(“mapper 包路径”)指定扫描的 mapper 类的路径。


## 条件构造器 Wrapper

Mybatis-plus 另外一个强大的功能是提供了一个条件构造器 QueryWrapper，通过将查询的条件封装 QueryWrapper 对象中，Mybatis-plus 能够根据 QueryWrapper 对象自动生成相应的 SQL 语句，从而实现了多条件查询。注意：QueryWrapper 对象通常用于单表查询，对于多表关联查询，还是需要通过 mybatis 来完成。

QueryWrapper 查询的代码结构如下：

~~~java
QueryWrapper<Teacher> wrapper = new QueryWrapper<>();
...	// 构造查询条件
List<Teacher> teachers = teacherMapper.selectList(wrapper);
~~~

### Lambda 条件构造器

另外，上面利用 QueryWrapper 对象进行数据库查询，需要在代码中使用数据表的字段名，但是如果数据表字段发生变化，则同时需要修改代码。有时如果需要使用对象的属性字段查询，需要用到 LambdaQueryWrapper 查询对象。LambdaQueryWrapper 和 QueryWrapper 非常类似，只是在选择匹配字段时使用了 Teacher::getName 的方法替换了原来的 name 字符串。<u>***这种方式的好处在于使得查询字段是始终和对象属性保持一致，在数据库修改字段名无需修改代码。***</u>

~~~java
LambdaQueryWrapper<Teacher> teacher = new LambdaQueryWrapper<>();
teacher.eq(Teacher::getName,"张三");
System.out.println(teacherMapper.selectOne(teacher));
~~~

### 使用 QueryWrapper 实现动态查询

queryWrapper 的条件构造方法具有两种形式，例如判断字符串相等的方法 eq 如下：

~~~java
eq(R column, Object val)
eq(boolean condition, R column, Object val)
~~~

第⼀种方式前文已经介绍，根据字段名称和值进行匹对，在这种方式下，生成的 SQL 语句为 (column=val)；第二种形式比第一种多了一个参数 condition，该参数为 boolean 类型，condition 值为 true 时则构造 SQL 语句，为 false 则不构造 SQL，与 Mybatis 动态 SQL 中的 **\<if test="">** 相似。通过利用 condition，可以快速实现动态查询。例子如下：

::: tabs

@tab SQL语句

如果使用 Mybatis 实现，需要在 mapper 映射文件中编写下面的 SQL 语句。

~~~xml
<select id="listTeacher" resultType="Teacher">
    select * from teacher
    <where>
        <if test="name!=null and name!=''">
            and name like CONCAT('%', #{name}, '%')
        </if>
        <if test="age!=null">
            and age > #{name}
        </if>
        <if test="email!=null and email!=''">
            and email like CONCAT('%', #{email}, '%')
        </if>
    </where>
</select>
~~~

@tab QueryWrapper

使用 Mybatis-plus 的查询构造器实现，仅需要编写以下代码，不需要编写 SQL 语句。

~~~java
@Override
public List<Teacher> listTeacher(Teacher teacher) {
    QueryWrapper<Teacher> queryWrapper = new QueryWrapper<>();
    queryWrapper.like(StringUtils.isNotBlank(teacher.getName()),"name",
                      teacher.getName())
        .le(teacher.getAge()!=null, "age", teacher.getAge())
        .like(StringUtils.isNotBlank(teacher.getEmail()),"email",
              teacher.getEmail());
    return baseMapper.selectList(queryWrapper);
}
~~~

:::

在条件构造时，使用 StringUtils.isNotBlank(teahcer.getName()) 进行 name 是否为 null 或者空串判断，如果该参数没有值，则不针对该字段构造 SQL 语句。teacher.getAge()!=null 则是针对年龄参数的空值判断。

### 查询条件

| 函数名      | 说明                                    | 说明/例子                                                    |
| ----------- | --------------------------------------- | ------------------------------------------------------------ |
| eq          | 等于 =                                  | 例：eq(“name”, “老王”)—>name = ‘老王’                        |
| ne          | 不等于 <>                               | 例：ne(“name”, “老王”)—>name <> ‘老王’                       |
| gt          | 大于 >                                  | 例：gt(“age”, 18)—>age > 18                                  |
| ge          | 大于等于 >=                             | 例：ge(“age”, 18)—>age >= 18                                 |
| lt          | 小于 <                                  | 例：lt(“age”, 18)—>age < 18                                  |
| le          | 小于等于 <=                             | 例：le(“age”, 18)—>age <= 18                                 |
| between     | BETWEEN 值1 AND 值2                     | 例：between(“age”, 18, 30)—>age between 18 and 30            |
| notBetween  | NOT BETWEEN 值1 AND 值2                 | 例：notBetween(“age”, 18, 30)—>age not between 18 and 30     |
| like        | LIKE ‘%值%’                             | 例：like(“name”, “王”)—>name like ‘%王%’                     |
| notLike     | NOT LIKE ‘%值%’                         | 例：notLike(“name”, “王”)—>name not like ‘%王%’              |
| likeLeft    | LIKE ‘%值’                              | 例：likeLeft(“name”, “王”)—>name like ‘%王’                  |
| likeRight   | LIKE ‘值%’                              | 例：likeRight(“name”, “王”)—>name like ‘王%’                 |
| isNull      | 字段 IS NULL                            | 例：isNull(“name”)—>name is null                             |
| isNotNull   | 字段 IS NOT NULL                        | 例：isNotNull(“name”)—>name is not null                      |
| in          | 字段 IN (value.get(0), value.get(1), …) | 例：in(“age”,{1,2,3})—>age in (1,2,3)                        |
| notIn       | 字段 IN (value.get(0), value.get(1), …) | 例：notIn(“age”,{1,2,3})—>age not in (1,2,3)                 |
| inSql       | 字段 IN ( sql语句 )                     | 例：inSql(“age”, “1,2,3,4,5,6”)—>age in (1,2,3,4,5,6)        |
| notInSql    | 字段 NOT IN ( sql语句 )                 | 例：notInSql(“age”, “1,2,3,4,5,6”)—>age not in (1,2,3,4,5,6) |
| groupBy     | 分组：GROUP BY 字段                     | 例：groupBy(“id”, “name”)—>group by id,name                  |
| orderByAsc  | 排序：ORDER BY 字段, … ASC              | 例：orderByAsc(“id”, “name”)—>order by id ASC,name ASC       |
| orderByDesc | 排序：ORDER BY 字段, … DESC             | 例：orderByDesc(“id”, “name”)—>order by id DESC,name DESC    |
| orderBy     | 排序：ORDER BY 字段, …                  | 例：orderBy(true, true, “id”, “name”)—>order by id ASC,name ASC |
| having      | HAVING ( sql语句 )                      | 例：having(“sum(age) > 10”)—>having sum(age) > 10            |
| or          | 拼接 OR                                 | 注意事项：<br>主动调用 or 表示紧接着下一个方法不是用 and 连接！（不调用 or 则默认为使用 and 连接）<br>例：eq(“id”,1).or().eq(“name”,“老王”)—>id = 1 or name = ‘老王’ |
| and         | AND 嵌套                                | 例：and(i -> i.eq(“name”, “李白”).ne(“status”, “活着”))—>and (name = ‘李白’ and status <> ‘活着’) |
| apply       | 拼接 sql                                | 注意事项：<br/>该方法可用于数据库函数动态入参的 params 对应前面 sqlHaving内部的 {index} 部分，这样是不会有 sql 注入风险的，反之会有！<br/>例：apply(“id = 1”)—>id = 1 |
| last        | 无视优化规则直接拼接到 sql 的最后       | 无视优化规则直接拼接到 sql 的最后<br/>注意事项：<br/>只能调用一次，多次调用以最后一次为准<br/>有 sql 注入的风险，请谨慎使用<br/>例：last(“limit 1”) |
| exists      | 拼接 EXISTS ( sql语句 )                 | 例：exists(“select id from table where age = 1”)—>exists (select id from table where age = 1) |
| notExists   | 拼接 NOT EXISTS ( sql语句 )             | 例：notExists(“select id from table where age = 1”)—>not exists (select id from table where age = 1) |
| nested      | 正常嵌套 不带 AND 或者 OR               | 正常嵌套 不带 AND 或者 OR<br/>例：nested(i -> i.eq(“name”, “李白”).ne(“status”, “活着”))—>(name = ‘李白’ and status <> ‘活着’) |

## Mybatis-plus 的时间自动填充

在实际开发中，实体类通常会记录该记录的创建时间和修改时间。阿里巴巴开发手册指出，所有的数据库表： gmt_create、gmt_modified 几乎所有的表都要配置上！而且需要自动化！

首先在 teacher 表中添加记录的创建时间字段和修改时间字段，分别为 gmt_create，gmt_modified (使用其他命名也可以)，注意，要使用 datetime 类型，不要使用 timestamp 类型。 

~~~java
// 自动填充时间
@TableField(fill = FieldFill.INSERT)
Date createdTime;
@TableField(fill = FieldFill.INSERT_UPDATE)
Date updateTime;
~~~

Mybatis-plus 通过 @TableField 注解表示在进行哪种数据库操作时按照指定规则填充该字段信息。其中 fill = FieldFill.INSERT 表示在执行 insert 插入 SQL 语句时自动填充，fill = FieldFill.INSERT_UPDATE 则表示在 insert 和 update 类型的 SQL 语句时都会填充该字段。

FieldFill 具有下面几种类型：

~~~java
public enum FieldFill {
    DEFAULT,    // 默认不处理
    INSERT,     // 插入填充字段
    UPDATE,     // 更新填充字段
    INSERT_UPDATE   //插入和更新填充字段
}
~~~

处理类实现字段填充的规则，具体代码如下：

~~~java
@Slf4j
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {
    // 插入时的填充策略
    @Override
    public void insertFill(MetaObject metaObject){
        log.info("start insert fill …………");
        this.setFieldValByName("createdTime",new Date(),metaObject);
        this.setFieldValByName("updatedTime",new Date(),metaObject);
    }
    // 更新时的填充策略
    @Override
    public void updateFill(MetaObject metaObject){
        log.info("start update fill …………");
        this.setFieldValByName("updatedTime",new Date(),metaObject);
    }
}
~~~

此处 @Slf4j 表示引入 log 日志对象；@Component 则表示将该处理器类注入到 SPring 的 IOC 容器中。

上面代码定义了插入操作的填充规则，即是将字段 createdTime 设置为当前时间 new Date()，同时也填充了 updatedTime 的字段为 new Date()；

## 逻辑删除

::: tip

- 删除又分为逻辑删除和物理删除，那么它们有什么区别呢？
  1. 物理删除：真实删除，将对应数据从数据库中删除，之后查询不到此条被删除数据。
  2. 逻辑删除：假删除，将对应数据中代表是否被删除字段状态修改为“被删除状态”，之后在数据库中仍旧能看到此条数据记录。

:::

逻辑删除是为了方便数据恢复和保护数据本身价值等等的一种方案。在我们日常开发中，为了保留数据，经常会使用逻辑删除的方式进行数据删除。实现逻辑删除通常需要在数据表中添加一个标记字段，用于表示该记录是否已经被删除。例如，我们在 teacher 表中添加一个 is_deleted 字段，is_deleted=1 表示该记录已经被删除，is_deleted=0 表示该记录有效。当执行相关的查询操作时只需查询 is_deleted=1 的记录即可。这次操作均可以通过mybatis-plus 自动完成。实现逻辑删除的实现流程如下：

1. 修改实体类和数据表，添加 deleted 字段。在 Teacher 类中添加 isDeleted 字段，并添加 @TableLogic 注解， 表示该字段属于逻辑删除字段。同时添加 @TableField 注解，表示在插⼊新记录时自动填充该字段值。

   ~~~java
   //逻辑删除
   @TableLogic
   @TableField(fill = FieldFill.INSERT)
   Boolean isDeleted;
   ~~~

2. 在配置文件 appliation.yml 添加下面配置，指定逻辑删除字段的默认值

   ~~~yaml
   mybatis-plus:
     global-config:
       db-config:
         logic-delete-field: is_deleted  # 全局逻辑删除的实体字段名（since 3.3.0，配置后可以忽略不配置步骤2）
         logic-delete-value: 1 # 逻辑已删除值（默认为1）
         logic-not-delete-value: 0 # 逻辑未删除值（默认为0）
   ~~~

3. 结果测试。测试之前的 testDelete() 方法，观察控制台输出。可以看到，该方法执行的 SQL 由原来的 delete 已经变成了update，表示该记录并没有被真正删除，而是变成了更新操作。

>
>
>- 注意配置了逻辑删除后，在执行插入操作时，is_deleted 字段并不会赋予默认值。因此可以通过以下两种方式解决：
>
>  - 在数据库设置 is_deleted 字段默认值为0；
>
>  - 在对象中 isDeleted 字段前使用注解 @TableField(fill = FieldFill.INSERT)，配置为默认填充；
>
>    然后处理器中配置插入填充策略，参考代码如下：
>
>    ~~~java
>    @Override
>    public void insertFill(MetaObject metaObject){
>        // 设置逻辑删除字段，默认为0
>        this.setFieldValByName("isDeleted", 0, metaObject);
>    }
>    ~~~

## 枚举型数据的保存

在实际开发中，对于某些组合类型的数据，通常会使用枚举类型表示。例如，高校教师分为以下三种类型: 教师，行政⼈员和辅导员。具体实现过程如下

使用枚举类表示教师类型，参考代码如下：

~~~java
@Getter
public enum StaffType {
    TEACHER(1,"教师"),COUNSELLOR(2,"辅导员"),ADMINISTRATION_STAFF(3,"行政人员"), UNKNOWN(-1, "未知类型");
    StaffType(Integer code,String value){
        this.code = code;
        this.value = value;
    }
    // 保持数据使用int类型
    @EnumValue
    private Integer code;
    // 响应使用JSON类型，即字符串
    @JsonValue
    private String value;
    
    // 实现json数据的反序列化
    @JsonCreator
    public static StaffType valueOf(int code) {
        return Stream.of(StaffType.values()).filter(x -> x.code == code)
                .findFirst().orElse(StaffType.UNKNOWN);
    }
}
~~~

- @Getter 是由 lombok 插件提供的注解，自动生成该类对应的 getter 方法。StaffType 的构造函包含一个整数和字符串类型，属性 code 为保存在数据库的数据，保存整数类型；value 则对应于前端需要显示的字符串类型。这里用到了 @EnumValue 和 @JsonValue 两个注解。主要功能如下：
  - @EnumValue 注解：由 Mybatis-plus 提供，该注解表示写入数据库的属性以及字段类型
  - @JsonValue注解：由 jackson 包提供，表示在该类的实例序列化为 json 对象时，对应的类型。
- 通过 valueOf() 方法实现整数类型到枚举类型的转换，使用 @JsonCreator 注解，表示在 json 数据反序列化时调用。
  - valueOf() 方法需要添加 @JsonCreator 注解，否则无法实现 json 数据到枚举对象转换。
  - 在实际开发中，可以将 valueOf() 方法放到一个 BaseEnum 基类中，让所有的枚举类型继承该基类即可，实现代码重用。

## 通过 Service 提供的核心 API

1. Save 接口

   ~~~java
   // 插入一条记录（选择字段，策略插入）
   boolean save(T entity);
   // 插入（批量）
   boolean saveBatch(Collection<T> entityList);
   // 插入（批量）
   boolean saveBatch(Collection<T> entityList, int batchSize);
   ~~~

2. Remove 接口

   ~~~java
   // 根据 entity 条件，删除记录
   boolean remove(Wrapper<T> queryWrapper);
   // 根据 ID 删除
   boolean removeById(Serializable id);
   // 根据 columnByMap 条件，删除记录
   boolean removeByMap(Map<String, Object> columnMap);
   // 删除（根据 ID 批量删除）
   boolean removeByIds(Collection<? extends Serializable> idList);

3. Update 接口

   ~~~java
   // 根据 UpdateWrapper 条件，更新记录 需要设置sqlset
   boolean update(Wrapper<T> updateWrapper);
   // 根据 whereWrapper 条件，更新记录
   boolean update(T updateEntity, Wrapper<T> whereWrapper);
   // 根据 ID 选择修改
   boolean updateById(T entity);
   // 根据ID 批量更新
   boolean updateBatchById(Collection<T> entityList);
   // 根据ID 批量更新
   boolean updateBatchById(Collection<T> entityList, int batchSize);
   ~~~

4. 查询 Get 接口

   ~~~java
   // 根据 ID 查询
   T getById(Serializable id);
   // 根据 Wrapper，查询⼀条记录。结果集，如果是多个会抛出异常，随机取⼀条加上限制条件
   wrapper.last("LIMIT 1")
   T getOne(Wrapper<T> queryWrapper);
   // 根据 Wrapper，查询⼀条记录
   T getOne(Wrapper<T> queryWrapper, boolean throwEx);
   ~~~

5. 分页查询 Page 接口

   ~~~java
   // ⽆条件分⻚查询
   IPage<T> page(IPage<T> page);
   // 条件分⻚查询
   IPage<T> page(IPage<T> page, Wrapper<T> queryWrapper);
   // ⽆条件分⻚查询
   IPage<Map<String, Object>> pageMaps(IPage<T> page);
   // 条件分⻚查询
   IPage<Map<String, Object>> pageMaps(IPage<T> page, Wrapper<T> queryWrapper);
   ~~~

6. 使用链式调用的 Lambda 调用接口

   ~~~java
   @Test
   void testQueryLambda() {
       List list = teacherService.lambdaQuery().like(Teacher::getName, "张")
               .like(Teacher::getEmail, "6@163.com").gt(Teacher::getAge, 30).list();
       list.forEach(System.out::println);
   }
   
   @Test
   void lambdaUpdate() {
       boolean update = teacherService.lambdaUpdate().set(Teacher::getAge, 41)
               .eq(Teacher::getName, "李四").update();
       System.out.println(update);
   }
   ~~~

## 性能分析插件

- 相关依赖

  ~~~java
  <!--添加sql性能分析插件p6spy依赖-->
  <dependency>
      <groupId>p6spy</groupId>
      <artifactId>p6spy</artifactId>
      <version>3.9.1</version>
  </dependency>
  ~~~

p6spy 是一个开源项目，通常使用它来跟踪数据库操作，查看程序运行过程中执行的 sql 语句。、

性能分析插件用于分析每条 sql 语句执行的时间，方便进行 sql 优化。

使用性能分析插件过程如下：

1. 修改配置文件 application.yml。修改内容如下：

   1. 添加 driver-class-name 属性为 com.p6spy.engine.spy.P6SpyDriver
   2. 修改数据库 url 的前缀为 jdbc:p6spy:mysql。

   ~~~yaml
   spring:
     datasource:
       username: root
       password: rootpassword
       driver: com.mysql.cj.jdbc.Driver
       driver-class-name: com.p6spy.engine.spy.P6SpyDriver
       url: jdbc:p6spy:mysql://159.75.225.74:3344/test?

2. 创建 spy.properties 配置文件，并进行相应参数的配置。

   ~~~properties
   modulelist=com.baomidou.mybatisplus.extension.p6spy.MybatisPlusLogFactory,com.p6spy.engine.outage.P6OutageFactory
   # ⾃定义⽇志打印
   logMessageFormat=com.baomidou.mybatisplus.extension.p6spy.P6SpyLogger
   #⽇志输出到控制台
   appender=com.baomidou.mybatisplus.extension.p6spy.StdoutLogger
   # 使⽤⽇志系统记录 sql
   #appender=com.p6spy.engine.spy.appender.Slf4JLogger
   # 设置 p6spy driver 代理
   deregisterdrivers=true
   # 取消JDBC URL前缀
   useprefix=true
   # 配置记录 Log 例外,可去掉的结果集有 error,info,batch,debug,statement,commit,rollback,result,resultset.
   excludecategories=info,debug,result,commit,resultset
   # ⽇期格式
   dateformat=yyyy-MM-dd HH:mm:ss
   # 是否开启慢SQL记录
   outagedetection=true
   # 慢SQL记录标准 2 秒
   outagedetectioninterval=1
   ~~~

## 代码生成器

Mybatis-plus 还提供了代码生成器插件，通过该插件，可以快速生成项目开发中所需要的实体类、mapper 类、service 类和控制器等代码，简化了重复的人工操作，同时也减少错误和保证代码质量。

- 相关依赖

  ~~~xml
  <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>mybatis-plus-generator</artifactId>
      <version>3.5.1</version>
  </dependency>
  <dependency>
      <groupId>org.apache.velocity</groupId>
      <artifactId>velocity-engine-core</artifactId>
      <version>2.2</version>
  </dependency>
  ~~~
