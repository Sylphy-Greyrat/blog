---
title: SpringBoot 数据访问
#icon: fab fa-markdown
order: 2
category:
  - SpringBoot
tag:
  - SpringBoot
  - 后端
  - Mybatis
date: 2023-09-15
icon: iconfont icon-mybatisplus
---
# Spring Boot 数据访问

## 整合 Mybatis 持久层技术

---

### Mybatis 基础

#### 相关依赖

~~~xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.4</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
~~~

#### Mybatis 简介

Mybatis 参考网址：[mybatis – MyBatis 3 | 配置](https://mybatis.org/mybatis-3/zh/configuration.html)

#### Spring Boot 整合 Mybatis

1. 概述

   ​		Spring Boot 默认采用整合 <font color='cornflowerblue'>SpringData</font> 的方式统一处理数据访问层，通过添加大量自动配置，引入各种数据访问模板 <font color='cornflowerblue'>xxxTemplate</font> 以及统一的 <font color='cornflowerblue'>Repository</font> 接口，从而达到简化数据访问层的操作。

   - Spring Boot 提供的常见数据库依赖启动器

     | 名称                             | 对应数据库                             |
     | :------------------------------- | -------------------------------------- |
     | spring-boot-starter-data-jpa     | - Spring Data JPA<br>- Hibernate       |
     | spring-boot-starter-data-mongodb | - MongoDB<br>- Spring Data MongoDB     |
     | spring-boot-starter-data-neo4j   | - Neo4j图数据库<br>- Spring Data Neo4j |
     | spring-boot-starter-data-redis   | - Redis                                |

2. Mybatis 基础配置

   连接数据库，需要在 appcation 文件中配置一下参数：

   1. 数据连接的 url 地址，注意如果是使用 mysql8 以上数据库，需要配置 unicode ，ssL ，时区等参数。
   2. 用户名 username**。
   3. 密码 password。

   ::: tabs#Configuration
   @tab yml

   ~~~yml
   #数据源配置
   spring:
        datasource:
             url:jdbc:mysql://localhost:3306/teaching_sys?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
             #159.75.225.74为数据库地址
    	     #3344为端口
    	     #test为数据库名
             username:root
             password:rootpassword
   #配置 Mybatis 相关属性
   mybatis:
     configuration:
       # 启动驼峰式转换
       map-underscore-to-camel-case: true
       # 打印输出 SQL 语句
       log-impl: org.apache.ibatis.logging.stdout.StdOutImpl  
       # 开启自增主键
       use-generated-keys: true
     # 指定实体类的别名的映射路径
     type-aliases-package: com.example.demo.demos.web.mybatis.entity
     # 指定 mapper.xml 文件的位置
     mapper-locations: classpath:mapper/*.xml
   ~~~
   @tab properties
   ~~~properties
   #数据源配置
   spring.datasource.url:jdbc:mysql://localhost:3306/teaching_sys?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
   spring.datasource.username:root
   spring.datasource.password:rootpassword
   #配置 Mybatis 相关属性
   mybatis.configuration.map-underscore-to-camel-case: true  # 启动驼峰式转换
   mybatis.configuration.log-impl: org.apache.ibatis.logging.stdout.StdOutImpl  # 打印输出 SQL 语句
   mybatis.configuration.use-generated-keys: true      # 开启自增主键
   mybatis.type-aliases-package: com.example.demo.demos.web.mybatis.entity      # 指定实体类的别名的映射路径
   mybatis.mapper-locations: classpath:mapper/*.xml     # 指定 mapper.xml 文件的位置
   ~~~
   :::


#### Mybatis操作数据库方式

​		Mybatis 提供两种操作数据库的方式，一个是使用注解，另外一种是使用 Mapper 映射文件，下面我们具体讲解两种方式的使用。

##### 基于注解

1. @Insert 实现插入记录功能

   ​		在插入操作中，对象的 id 值设置为空，该值由数据库自动生成。在 mysql 中，常将主键设置自增方式，没插入一个记录，主键 id 加 1。为获取新记录的主键，需要将属性 useGeneratedKeys 设置为 true ，同时设置 keyColumn (对应数据表主键字段)和 keyProperty (对象的主键属性)。新增主键值将回填到 teacher 对象中。示例代码如下：

   ~~~java
   	@Insert("insert into teacher(name,office,age,email,cellphone) values(#{name},#{office},#{age},#{email},#{cellphone})")
   	@Options(useGeneratedKeys = true,keyColumn = "id",keyProperty = "id")
   	public int add(Teacher teacher);
   ~~~

   ​		add 接口返回值为整数 int 类型，表示 <u>**SQL 语句执行影响的行数**</u>。上述代码中，#{ name } 表示将 teacher 的 name 属性作为参数传入 SQL 语句，其他的属性值类似。

2. @Select 注解：实现查询功能

   ​		查询方法的返回值分为返回单个对象和对象集合两种情形。其中返回单个对象的情况在上面已经介绍，下面将讲解返回对象集合情况。接口返回类型为 List 或者 Set 等集合数据类型。Mybatis 会自动将 SQL 语句执行得到的数据集转换为对象集合。示例代码如下：

   ~~~java
       @Select("select * from teacher")	//查询所有
       public List<Teacher> listAll();
   
       @Select("select * from teacher where name=#{name}")		//根据姓名查询
       public List<Teacher> findByName(String name);
   ~~~

3. @Update 注解：实现更新功能

   ​		更新操作和插入操作类似，都是会影响到数据库记录的操作。更新操作的返回值通常为整数 int 类型，表示操作影响的记录数。示例代码如下：

   ~~~java
       @Update("update teacher set name=#{name},office=#{office},age=#{age},email=#{email},cellphone=#{cellphone} where id=#{id}")
       public int update(Teacher teacher);
   ~~~

4. @Delete注解：实现删除功能

   ​		删除也是影响到数据库记录的操作，删除接口的返回值也为整数 int 类型。

   ~~~java
       @Delete("delete from teacher where id=#{id}")
       public int deleteById(long id);
   ~~~

##### 基于 Mapper XML 映射文件

​		另外一种使用 mybatis 的方式是通过映射文件完成 SQL 数据操作。基于 Mapper 映射文件的 Mybatis 应用功能更为强大，但是相对也较为复杂。首先在 resource 文件夹下创建⼀个 mapper 文件夹，用于存放每个对象的数据库接口 mapper 文件工程目录结构如下：![mapper 文件工程目录结构](http://101.43.49.28:9000/blog/mapper文件工程目录结构.png)

XML 映射文件如下：

~~~xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<!-- namespace 表示命名空间 -->
<mapper namespace="com.example.demo.demos.web.mybatis.mapper.StudentMapper">
</mapper>
~~~

#### 动态 SQL

​		动态 SQL 是 MyBatis 的强大特性之一。普通业务写的 SQL 往往比较简单，但是如果面对比较复杂的业务，往往需要写复杂的 SQL 语句，通过根据不同条件来拼接 SQL ，稍微不注意，由于引号，空格等缺失可能都会导致错误。利用动态 SQL ，可以彻底摆脱这种痛苦。

​		使用动态 SQL 并非一件易事，但借助可用于任何 SQL 映射语句中的强大的动态 SQL 语言，MyBatis 显著地提升了这一特性的易用性。

​		Mybatis 提供了机遇 OGNL 的表达式来完成动态 SQL ，在映射文件中，开发人员可以通过动态 SQL 灵活组装 SQL 语句，从而提高了 SQL 语句的准确性，也大大提高了开发效率。

- Mybatis 提供的动态 SQL 元素：
  1. if		***用于单条件判断***
  2. choose(when, otherwise)		***多条件判断***
  3. trim(where, set)		简化 SQL 中 where 的条件判断
  4. foreach		用于批量操作

##### if 标签

​		使用动态 SQL 最常见情景是根据条件包含 where 字句的一部分。例如：需要根据姓名和地址进行联合查询学生信息。

- 例子如下：

  1. Mapper 接口代码如下：

     ~~~java
     /*条件查找*/
         public List<Student> findByNameAndClassNo(@Param("name") String name, @Param("classNo") String classNo);
     ~~~

  2. Mapper XML 映射文件代码如下：

     ~~~xml
         <select id="findByNameAndClassNo" resultType="com.example.demo.demos.web.mybatis.entity.Student">
             select * from student where 1=1
             <if test="name != null">
                 and name like CONCAT('%',#{name},'%')
             </if>
             <if test="classNo != null">
                 and class_no like CONCAT('%',#{classNo},'%')
             </if>
         </select>
     ~~~

  这条语句提供了可选的查找学⽣功能。如果不传入 “name” 参数和 "home_address" 参数，查询所有的学生，如果传入了 “name” 参数，那么就会对 “name” ⼀列进行模糊查找并返回对应的结果，如果传入 “home_address” 参数，则同样进行模糊查询。代码中where 1=1 用于保证 SQL 语法***正确性***。如果没有添加 1=1 ，则当 name 和 home_address 都为空时，SQL 语句将变为 select * from student where ，成为⼀个非法的 SQL 语句。

##### where 标签

​		使用 “where” 标签会根据它包含的标签中是否有返回值，进行 “where” 关键词的插入。另外，<u><font color='pink'>如果标签返回的内容是以 ***AND*** 或 ***OR*** 开头的，则会***删除***</font></u>。使r用 where 标签之后将不在需要之前的 1=1 的条件，上述联合查询功能使用 where 标签实现的具体代码如下：

~~~xml
    <select id="findByNameAndClassNo" resultType="com.example.demo.demos.web.mybatis.entity.Student">
        select * from student
        <where>
            <if test="name != null and name != ''">
                or name like CONCAT('%',#{name},'%')
            </if>
            <if test="classNo != null and classNo != ''">
                and class_no like CONCAT('%',#{classNo},'%')
            </if>
        </where>
    </select>
~~~

##### set 标签

​		Set 标签用于动态更新语句。set 元素可以用于动态包含需要更新的列，忽略其它不更新的列。

- 例如：

  1. 程序只需要更新 student 非空的属性值，mapper 接口类代码为：

     ~~~java
     public int updateIfExists(Student student);
     ~~~

  2. Mapper XML 映射文件代码如下：

     ~~~xml
         <update id="updateIfExists">
             update student
             <set>
                 <if test="studentno != null and studentno != ''">student_no=#{studentno}</if>
                 <if test="name != null and name != ''">name=#{name}</if>
                 <if test="homeaddress != null and homeaddress != '' ">home_address=#{homeaddress}</if>
                 <if test="classno != null and classno != ''">class_no=#{classno}</if>
                 <if test="sex != null">sex=#{sex}</if>
                 <if test="birthday != null">birthday=#{birthday}</if>
                 <if test="enrolltime != null">enroll_time=#{enrolltime}</if>
             </set>
             where id=#{id}
         </update>
     ~~~
     

##### foreach 标签

​		批量操作是数据操作常常碰到的情景，例如要导⼊一个 excel 文件记录到数据中，往往需要使用批量插入的方式来提高效率，同时，批量删除和其他的批量处理也是业务中经常碰到的操作。此时，可以 foreach 标签来实现批量操作。foreach 可以遍历指定集合，动态构造所需的 SQL 语句，比如：

~~~xml
<select id="selectPostIn" resultType="domain.blog.Post">
    SELECT *
    FROM POST P
    WHERE ID in
    <foreach item="item" index="index" collection="list" open="(" separator="," close=")">
        #{item}
    </foreach>
</select>
~~~

​		foreach 元素的功能⾮常强⼤，它允许你指定⼀个集合，声明可以在元素体内使⽤的集合项（item）和索引（index）变量。它也允许你指定开头与结尾的字符串以及集合项迭代之间的分隔符。这个元素也不会错误地添加多余的分隔符，看它多智能！

- **提示** : 你可以将任何可迭代对象（如 List、Set 等）、Map 对象或者数组对象作为集合参数传递给 foreach。当使用可迭代对象或者数组时，index 是当前迭代的序号，item 的值是本次迭代获取到的元素。当使用 Map 对象（或者 Map.Entry 对象的集合）时，index 是键，item 是值。

常用的批量操作：

1. 批量插入数据：

   ~~~xml
   <!-- 批量插⼊-->
   <insert id="batchInsert" useGeneratedKeys="true" keyColumn="id" keyProperty="id">
       insert into student(student_no,name,home_address,class_no, sex, birthday,enroll_time) values
       <!-- collcetion对应集合名称, item对应集合元素, separator表示分隔符-->
       <foreach collection="list" item="s" separator=",">
           (#{s.studentNo},#{s.name},#{s.homeAddress},#{s.classNo},#{s.sex}, #{s.birthday}, #{s.enrollTime})
       </foreach>
   </insert>
   ~~~

   - 注意：和insert插入操作⼀样，需要使用 useGeneratedKeys 属性值才能获得主键id并回填到对象。

2. 批量删除：

   ~~~xml
   <!--批量删除-->
   <delete id="batchDelete">
       delete from student where id in (
       <foreach collection="list" item="student" separator="," >
           #{student.id}
       </foreach>
       )
   </delete>
   ~~~

##### SQL 片段 sql

​		有时候可能某个 sql 语句我们用的特别多，为了增加代码的重用性，简化代码，我们需要将这些代码抽取出来，然后使用时直接调用。代码片段的使用分为代码片段定义和使用两部分。

1. 定义片段

   ~~~xml
   <sql id="selectall">
       select id,class_no,student_no,name from student
   </sql>
   ~~~

2. 使用片段

   ~~~xml
   <select id="selectStudent" resultType="Student">
       <include refid="selectall"></include>
       where id=#{id}
   </select>

**script**

要在带注解的映射器接口类中使用动态 SQL，可以使用 script 元素。比如:

~~~java
    @Update({"<script>",
            "update Author",
            " <set>",
            " <if test='username != null'>username=#{username},</if>",
            " <if test='password != null'>password=#{password},</if>",
            " <if test='email != null'>email=#{email},</if>",
            " <if test='bio != null'>bio=#{bio}</if>",
            " </set>",
            "where id=#{id}",
            "</script>"})
    void updateAuthorValues(Author author);
~~~

### 对象关联和缓存

- 相关依赖

  ~~~xml
  <dependency>
      <groupId>com.github.pagehelper</groupId>
      <artifactId>pagehelper-spring-boot-starter</artifactId>
      <version>1.3.0</version>
  </dependency>
  ~~~

#### 对象关联

对象之间的关联主要分为以下三类：

![对象之间的关联](http://101.43.49.28:9000/blog/对象之间的关联.png)

#### 关联查询

##### ResultMap 的使用

​		<font color='cornflowerblue'>resultMap</font> 元素是 MyBatis 中最重要最强大的元素。它可以让你从 90% 的 JDBC ResultSets 数据提取代码中解放出来，并在一些情形下允许你进行一些 JDBC 不支持的操作。实际上，在为一些比如连接的复杂语句编写映射代码的时候，一份 <font color='cornflowerblue'>resultMap</font> 能够代替实现同等功能的长达数千行的代码。<font color='cornflowerblue'>ResultMap</font> 的设计思想是，对于简单的语句根本不需要配置显式的结果映射，而对于复杂一点的语句只需要描述它们的关系就行了。

- 在 Mybatis 中，最简单的结果映射方式就是使用 <font color='red'>resultType</font> 将结果集映射到 Java POJO 对象。但是这里有一个前提是，对象中的属性名称需要和数据表字段名称一一对应。

​		Mybatis 自动将查询到的结果集映射为 reesultType 对应的对象类型。但是，这个属于理想状态下，属性和字段名都完全一致的情况。在实际开发中，经常会存在不一致的情况，这时候需要 <font color='cornflowerblue'>resultMap</font> 登场了。

例子：

::: tabs

@tab 实体类

~~~java
@Data
@Builder
@NoArgsConstructor //添加默认构造函数
@AllArgsConstructor //添加全参数构造函数
public class Course {
    Long id;
    String courseName;
    int credit; 
    Boolean status;
}
~~~

上述代码和数据表设计存在下面不一致的地址：

1. courseName 字段为驼峰式命名，在数据表中使用 course_name 
2. status 字段为 boolean 类型，在数据表中存储为 smallint 类型

因此，我们可以使用 resultMap 完成上诉查询结果的映射。

- 在 CourseMapper.xml 文件中，定一个 ResultMap，id 为 courseBase，用于实现字段到属性的映射

@tab mapper映射

~~~xml
<select id="getById" resultMap="courseBase">
    select * from course where id = #{id}
</select>
<resultMap id="courseBase" type="com.example.mybatis.entity.Course">
    <!-- 表示主键 -->
    <!-- id表示主键, property表示实体类属性, column表示数据库字段 -->
    <id property="id" column="id"/>
    <result property="courseName" column="course_name"/>
    <!-- 定义普通属性-->
    <result property="creedit" column="creedit"/>
    <result property="semester" column="semester"/>
    <result property="status" column="status" javaType="boolean"/>
</resultMap>
~~~

上诉代码中，getById 接口的返回值不再是 resultTyper，而是改成为 ResultMap，表示查询得到的结果集将根据 ResultMap 的定义完成映射。

:::

​		在 resultMap 的中，需要单独定义每个字段和属性的映射关系，如果在此处没有定义，那么将获取不到该属性值。字段映射定义在一个标签中，属性 property 表示 Java POJO 类中的属性名； column 则表示对应的数据表中的列名。注意：需要先定义主键 id 的映射关系。

##### 1对1查询

在 Mybatis 中，可以使用以下三种方式来实现1对1查询：

1. 通过二次查询
2. 通过连表查询
3. 通过 Dto 对象封装查询结果

例子：

1. 嵌套查询

   嵌套查询本质上也是执行了二次查询，即是通过调用另外一个 SQL 查询语句来返回预期的复杂查询结果。

   > - mapper 接口类方法如下：
   >
   >   ~~~java
   >   public Course getDetails(@Param("id") Long id);
   >   ~~~
   >
   > - CourseMapper.xml 文件对应的实现方法如下：
   >
   >   ~~~xml
   >   <select id = "getDetails" resultMap="CourseDetails">
   >       select * from course where id = #{id}
   >   </select>
   >   <resultMap id="CourseDetails" type="com.example.mybatis.entity.Course">
   >       <id property="id" column="id"/>
   >       <association property = "teacher" column="teacher_id" javaType="Teacher" 
   >                    select="com.example.mybatis.mapper.TeacherMapper.getById"/>
   >   </resultMap>
   >   ~~~
   >
   >   注意：此处 getDetails 使用了 resultMap 封装查询的结果，关键点在于在对 resultMap 的定义时使用了标签来定义返回的教师对象。标签中的 property 对应 Course 中 Teacher 的属性，column 属性则对应于要进行二次查询传入的参数，即数据表关联的外键。javaType 表示二次查询返回的类型，select 则表示需要调用的查询教师信息的查询接口。
   >
   >   实现流程为将参数 teacher_id 传入了 TeacherMapper 的查询接口 getById，查询得到了一个 Teacher 类型的对象，再将该对象传入 course 对象中。以此实现course 的查询。

2. 嵌套结果

   嵌套查询的不需要编写复杂的 SQL 语句，但是需要执行多条 SQL 语句，以致影响查询的速度。为了对查询效率进行优化，上述查询可以在一条 SQL 语句中完成，因此需要下面用到的嵌套结果查询。嵌套结果查询的实现分为两部分：1.编写一个连表查询的 SQL 语句；2. 将查询结果映射到一个 ResultMap 中。

   >
   >
   >- mapper 接口类方法如下：
   >
   > ~~~java
   > public Course getCourseWithTeacher(@Param("id") Long id);
   >~~~
   >
   > - 使用其那套查询的 xml 映射文件代码如下：
   >
   > ~~~xml
   ><select id="getCourseWithTeacher" resultMap="CourseWithTeacher">
   >     select c.*,t.* from course c,teacher t where c.teacher_id = t.id and c.id = #{id}
   > </select>
   > <resultMap id="CourseWithTeacher" type="com.example.mybatis.entity.Course">
   >     <id property="id" column="id"/>
   >     <result property="courseName" column="course_name"/>
   >     <result property="credit" column="credit"/>
   >     <result property="semester" column="semester"/>
   >     <association property="teacher" javaType="Teacher">
   >         <result property="id" column="teacher_id"/>
   >         <result property="name" column="name"/>
   >         <result property="office" column="office"/>
   >         <result property="email" column="email"/>
   >         <result property="cellphone" column="cellphone"/>
   >     </association>
   > </resultMap>
   > ~~~
   > 
   > 上诉代码使用了连表查询获取所需的所有字段数据，然后将这些字段通过 ResultMap 映射到对应对象中。
   >
   >在 ResultMap 的表示中，同样使用了 association 表达了一对一的对象关联。property=“teacher” 表示 course 对象中关联的 teacher 的属性名，javaType=“Teacher” 表示关联的对象类型为 Teacher。
   >
   > association 的子元素 result 则表示 teacher 对象的属性和查询结果得到的字段之间的映射。例如表示查询得到的字段名 name 映射到 teacher 中的 name 属性。
   
3. 通过 DTO 对象封装查询结果

   上面两种查询在对象设计的时候都一个共同的地方，即是在 Course 类中引入一个 Teacher 类型的属性。在实际开发中，有时候通过对象属性来表达关联关系并不一定就能够很好表达现实查询需求。在 web 开发中，往往前端只是需要一个查询的结果即可。在这种情况下，我们可以选择更为简单的方式来实现关联的查询操作。

   此时，我们引入一个新的概念对象 DTO(Data tranfer object) 对象传输模型。在前后端分离的 Java EE 项目设计中，不少项目采用 DTO 的设计理念。DTO 通常指的是控制层到 service 层传递的数据参数封装。可以通过设计一个 DTO 类来封装查询的结果，从而将查询和原来的 POJO 类脱离。

   ![DTO 的设计理念](http://101.43.49.28:9000/blog/DTO的设计理念.png)

   > DTO 类往往按照方向分为从前端传入后端的 dto 和从后端返回前端的结果 dto。
   >
   > - CourseDto 类，如下：
   >
   >   ~~~java
   >   @Data
   >   public class CourseDto extends Course {
   >       String teacherName;
   >       String teacherEmail;
   >       String teacherOffice;
   >   }
   >   ~~~
   >
   >   上面 dto 类继承了 Course，注意，此处的 course 类属性和数据表字段对应，并没有包含 teacher 对象。
   >
   > - CourseMapper 类，如下：
   >
   >   ~~~java
   >   /** 使用 DTO 封装查询结果 **/
   >   @Select("select c.*, t.name as teacherName, t.office as teacherOffice, t.email as teacherEmail " +
   >               "from course c ,teacher t where c.teacher_id = t.id and c.id=#{id} ")
   >       public CourseDto getCourseDto(Long id);
   >   ~~~
   >
   >   使用 dto 方式的查询只需执行一条 SQL 语句，即可查询到所需结果
   >

##### 1对多查询

>- mapper 接口类方法如下：
>
>  ~~~java
>  public Student getStudentCourseList(Long id);
>  ~~~
>
>- Student 类，如下：
>
>  ~~~java
>  @Data
>  @Builder
>  @NoArgsConstructor //添加默认构造函数
>  @AllArgsConstructor //添加全参数构造函数
>  public class Student {
>      @Id
>      Long id;
>      String studentNo;
>      String name;
>      String homeAddress;
>      String classNo;
>      Integer sex;
>      Date birthday;
>      Date enrollTime;
>  
>      List<StudentCourse> courseList;
>  }
>  ~~~
>
>- StudentCourse 类，如下：
>
>  ~~~java
>  @Data
>  public class StudentCourse {
>      Long id;
>      Double score;
>      Integer status;
>      Long courseId;
>      Long studentId;
>      Integer creditHour;
>      Course course;
>  }
>  ~~~
>
>- StudentMapper.xml 文件对应的实现方法如下：
>
>  ~~~java
>  <resultMap id="studentCourse"
>             type="com.example.mybatis.entity.Student">
>      <id property="id" column="id"/>
>      <id property="name" column="name"/>
>      <id property="classNo" column="class_no"/>
>      <id property="studentNo" column="student_no"/>
>      <collection property="courseList"
>                  ofType="com.example.mybatis.entity.StudentCourse">
>          <id property="id" column="id"/>
>          <id property="score" column="score"/>
>          <id property="status" column="status"/>
>          <association property="course"
>                       javaType="com.example.mybatis.entity.Course">
>              <id property="id" column="id"/>
>              <id property="courseName" column="course_name"/>
>          </association>
>      </collection>
>  </resultMap>
>  <select id="getStudentCourseList"
>          resultMap="studentCourse">
>      select s.*, sc.*, c.*
>      from student s
>               left join student_course sc on s.id = sc.student_id
>               left join course c on sc.course_id = c.id
>      where s.id = #{id}
>  </select>

##### 分页查询

在实际开发中，当数据表的记录数很大时，一次查询将所有记录读取到内存的方法并不可取，容易导致内存溢出，系统变慢等问题。因此，需要通过分页查询来解决大量记录查询的问题。

分页查询可以分为服务器分页和前端分页。服务器分页指在数据库查询时根据用户提交的当前页和每页大小查询出该页所对应的记录，然后放给前端；前端分页指服务器查询所有的记录，返回给前端，前端再由 JavaScript 完成分页显示。实践中用的最多的还是服务器分页的实现方式。

不同数据库对分页查询的支持是不一样的，此处只以 Mysql 数据库为例子，讲解基于 Mysql 分页查询的实现原理。

MySQL 数据库实现分页使用 LIMIT 函数。LIMIT 子句可以用来限制由 SELECT 与句话返回过来的数据数量，它有一个或两个参数，如果给出两个参数，第一个参数指定返回的第一行在所有数据中的位置，从0开始(注意不是1)，第二个参数指定最多返回的记录数。

例如：下面查询返回工资最高的5个员工

:::tabs

@tab 第一种写法

~~~sql
select * from employee order by salary desc limit 0,5
~~~

@tab 第二种写法

~~~sql
select * from employee order by salary desc limit 5
~~~

:::

###### pagehelper 插件

依赖：

~~~xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.2.0</version>
</dependency>
~~~

pagehelper 是基于 Mybatis 中实现分页查询的一个插件，使用 pageHelper 可以很容易地实现数据库的分页查询。

pagehelper 是基于 Mybatis 拦截器技术实现的，通过拦截查询的 SQL 语句，在语句后面添加和分页相关的片段来实现。

创建一个 StudentService，在该类中实现分页查询接口，代码如下：

~~~java
@Service
public class StudentService {
    @Autowired
    StudentMapper studentMapper;
    /**
     * 分页查询
     * @param currentPage 当前查询页
     * @param pageSize 每页的记录数
     * @return
     */
    public PageInfo<Student> list(int currentPage, int pageSize) {
        String order = "student_no asc";
        PageHelper.startPage(currentPage, pageSize, order);
        List<Student> list = studentMapper.listAll();
        return new PageInfo<>(list);
    }
}
~~~

分页查询接口 list 接受两个参数：currentPage 表示用户当前需要查看的页码，pageSize 表示每页的大小。我们还可以定义查询结果的排序 student_no asc（按照学号降序排序）

分页查询通过 PageHelper 的静态方法 startPage，将所需的参数 currentPage，pageSize，order 传入到分页查询的语句中。然后执行普通查询的 mapper 接口方法，最后返回一个 PageInfo 对象。该对象封装到分页查询的结果。

#### Mybatis 缓存机制

##### Mybatis Session

SqlSession 是 Mybatis 最重要的构建之一，可以简单的认为 Mybatis 一系列的配置目的是生成类似 JDBS 生成的 Connection对象的 SqlSession 对象，这样才能与数据库开启“沟通”，通过 SqlSession 可以实现增删改查（当然现在更加推荐是使用 Mapper 接口形式）

![SqlSession 流程](http://101.43.49.28:9000/blog/SqlSession流程.png)

##### 一级缓存

同一个 SqlSession 对象，在参数和 SQL 完全一样的情况先，只执行一次 SQL 语句（如果缓存没有过期）也就是只有在参数和 SQL 完全一样的情况下，才会有这种情况。一级缓存是 SqlSession 级别的缓存。在操作数据库时需要构造 sqlSession 对象，在对象中有一个数据结构用于存储数据。

![一级缓存流程](http://101.43.49.28:9000/blog/一级缓存流程.png)

在同一个 SqlSession 中，MyBatis 会把执行的方法和参数通过算法生成缓存的键值，将键值和结果存放在一个 Map 中，如果后续的键值一样，则直接从 Map 中获取数据；

不同的 SqlSession 之间的缓存是相互隔离的；

用一个 SqlSession，可以通过配置使得在查询前清空缓存；

任何的 UPDATE，INSERT，DELETE 语句都会清空缓存。

##### 二级缓存

二级缓存存在于 SqlSessionFactory 生命周期中。二级缓存是 mapper 级别的缓存，多个 SqlSession 去操作同一个 Mapper 的 sql 语句，多个 SqlSession 可以共用二级缓存，二级缓存是跨 SqlSession 的。UserMapper 有一个二级缓存区域（按 namespace 分），其他 mapper 也有自己的二级缓存区域（按 namespace 分）。每一个 namespace 的 mapper 都有一个二级缓存区域，两个 mapper 的 namespace 如果相同，这两个 mapper 执行 sql 查询到数据将存在相同的二级缓存区域中。

![二级缓存流程](http://101.43.49.28:9000/blog/二级缓存流程.png)

二级缓存的开启分为两部分，一个是全局开启，一个是局部开启。当两者都开启时，二级缓存才起作用。***全局开启默认是开启，因此不需要做任何配置。如果需要关闭全局二级缓存，需要在 application 文件中添加 `cache-enabled: true` 的配置。***

需要开启局部二级缓存，只需在 mapper 映射文件中加入 cache 元素即可。`<cache/>`

## Spring Boot 整合 JPA

---

- Spring Data JPA 简介

  ​		Spring Data JPA 是 Spring 基于 <font color='cornflowerblue'>ORM 框架</font>、<font color='cornflowerblue'>JPA</font> 规范的基础上封装的一套 JPA 应用框架，它提供了<font color='cornflowerblue'>增删改查</font>等常用功能，使开发者可以用较少的代码实现数据操作，同时还易于扩展。

- 整合步骤：

  1. 在 pom 文件中添加 Spring Data JPA 依赖启动器

     ~~~xml
     <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-data-jpa</artifactId>
     </dependency>
     ~~~
  
  2. 编写 ORM 实体类
  
     - 例子：
  
       ~~~java
       @Entity(name = "course")	//该注解表示该类是一个与表有映射关系的实体类
       public class Course {
           @Id		//便是该属性映射的字段为主键字段
           @GeneratedValue(strategy = GenerationType.IDENTITY)		//主键生成策略
           Long id;
           @Column(name = "course_name")
           String courseName;
       }
  
  3. 编写 Repository 接口
  
     - 例子：
  
       ~~~java
       public interface CourseRepository extends JpaRepository<Course,Long> {
           public List<Course> findByCourseNameNotNull();
       
           @Query("SELECT c FROM course c WHERE c.teacherId = ?1")
           public List<Course> getCourseNamePaged1(Long teacherId, Pageable pageable);
       
           @Query(value = "SELECT * FROM course WHERE teacherId = ?1", nativeQuery = true)
           public List<Course> getCourseNamePaged2(Long teacherId, Pageable pageable);
       
           @Transactional	//事务控制（只要会出现修改内容都需要添加该注解）
           @Modifying	//该注解表示当前 SQL 语句会对数据库数据产生变更的语句
           @Query(value = "UPDATE course SET courseName = ?1 WHERE id = ?2", nativeQuery = true)
           public int updateCourseName(String courseName, Long id);
       }
       ~~~
  
       - 注：
         1.  使用Spring Data JPA 自定义 Repository 接口，必须继承 XXRepository<T, ID> 接口。
         2. nativeQuery = true 表示可以执行原生sql语句
  
       ![JPA的Repository继承](http://101.43.49.28:9000/blog/JPA的Repository继承.png)
  
  4. 编写单元测试进行接口方法测试及整合测试

## Spring Boot 整合 Redis

---

- Redis 简介

  ​		Redis 是一个<font color='cornflowerblue'>开源</font> ( BSD 许可) 的、内存中的<font color='cornflowerblue'>数据结构</font>存储系统，它可以用作<font color='cornflowerblue'>数据库</font>、<font color='cornflowerblue'>缓存</font>和<font color='cornflowerblue'>消息中间件</font>，并提供多种语言的 API。

- Redis 优点

  1. 存取速度快：Redis 速度非常快，每秒可执行大约 110000 次的设置操作，或者执行 81000 次的读取操作。
  2. 支持丰富的数据类型：Redis 支持开发人员常用的大多数数据类型，例如列表、集合、排序集和散列等。
  3. 操作具有原子性：所有 Redis 操作都是原子操作，这确保如果两个客户端并发访问，Redis 服务器能接收更新后的值。
  4. 提供多种功能：Redis 提供了多种功能特性，可用作非关系型数据库、缓存中间件、消息中间件等。

- 整合步骤

  1. 在 pom 文件中添加 <font color='cornflowerblue'>Spring Data Redis</font> 依赖启动器

     ~~~xml
     <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-data-redis</artifactId>
     </dependency>

  2. 编写实体类

     - 例子：

       ~~~java
       @RedisHash("course")	//该注解表示该类是一个与表有映射关系的实体类
       public class Course {
           @Id		//用于标识实体类主键
           Long id;
          @Indexed		//用于标识改属性会在 redis 数据库中生成二级索引
           String courseName;
           
           private Integer creedit;
       }

  3. 编写 <font color='cornflowerblue'>Repository</font> 接口

     - 例子：

       ~~~java
       public interface CourseRepository extends CrudRepository<Course,Long> {
           List<Course> getCourseNamePaged1(Long teacherId, Pageable pageable);
       }
       ~~~

  4. 在全局配置文件 application.properties 中添加 <font color='cornflowerblue'>Redis</font> 数据库连接配置

     ::: tabs

     @tab yaml

     ~~~yaml
     spring:
       redis:
         host: 127.0.0.1	# redis 服务器地址
         port: 6379	# redis 连接端口
         password: 123456	# redis 服务连接密码
     ~~~

     @tab properties

     ~~~properties
     # redis 服务器地址
     spring.redis.host=127.0.0.1
     # redis 连接端口
     spring.redis.port=6379
     # redis 服务连接密码
     spring.redis.password=123456
     ~~~

     :::

  5. 编写单元测试进行接口方法测试以及整合测试

