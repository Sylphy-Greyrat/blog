---
title: Spring Boot 消息队列
#icon: fab fa-markdown
order: 2
category:
  - MQ
  - SpringBoot
tag:
  - SpringBoot
  - 后端
  - rabbitMQ
date: 2024-01-24
icon: iconfont icon-rabbitmq
---

# Spring Boot 消息队列

## 调用方法

---

1. 同步调用

   ​	**发出一个功能调用时，在没有得到结果之前，该调用就不返回或继续执行后续操作**

   - 优点：
     - 时效性高，等待到结果后才返回
   - 缺点：
     - 扩展性差
     - 性能下降
     - 级联失败问题

   ![异步调用的展示](http://101.43.49.28:9000/blog/异步调用的展示.png)

2. 异步调用

   ​	**当一个异步过程调用发出后，调用者在没有得到结果之前，就可以继续执行后续操作。当这个调用完成后，一般通过状态、通知和回调来通知调用者。**

   - 优点：
     - 耦合度低，扩展性强
     - 异步调用，无需等待，性能好
     - 故障隔离，下游服务故障不影响上游业务
     - 缓存信息，流量削峰填谷
   - 缺点：
     - 不能立即得到调用结果，失效性差
     - 不确定下游业务执行是否成功
     - 业务安全依赖于 Broker（消息代理）的可靠性

   异步调用方式通常包含三个角色：

   1. 消息发送者：投递消息的人，就是原来的调用方
   2. 消息代理：管理、缓存、转发消息，你可以把它理解成微信服务器
   3. 消息接收者：接收和处理消息的人，就是原来的服务提供方

   ![异步调用的展示](http://101.43.49.28:9000/blog/异步调用的展示.png)

## 消息队列的相关技术

---

​	MQ (**M**essage**Q**ueue)，中文是消息队列，字面来看就是存放消息的队列。也就是异步调用中的 Broker。

|            | RabbitMQ                | ActiveMQ                          | RocketMQ   | kafka      |
| ---------- | ----------------------- | --------------------------------- | ---------- | ---------- |
| 公司/社区  | Rabbit                  | Apache                            | 阿里       | Apache     |
| 开发语音   | Erlang                  | Java                              | Java       | Scala&Java |
| 协议支持   | AMQP、XMPP、SMTP、STOMP | OpenWire、STOMP、REST、XMPP、AMQP | 自定义协议 | 自定义协议 |
| 可用性     | 高                      | 一般                              | 高         | 高         |
| 单机吞吐量 | 一般                    | 差                                | 高         | 非常高     |
| 消息延迟   | 微秒级                  | 毫秒级                            | 毫秒级     | 毫秒以内   |
| 消息可靠性 | 高                      | 一般                              | 高         | 一般       |

::: info

- 追加可用性：Kafka、RocketMQ、RabbitMQ
- 追求可靠性：RabbitMQ、RocketMQ
- 追求吞吐量：RocketMQ、Kafka
- 追求消息低延迟：RabbitMQ、Kafka

据统计，目前国内消息队列使用最多的还是 RabbitMQ

:::

## RabbitMQ

---

### RabbitMQ 简介

RabbitMQ 的整体架构及核心概率：

- virtual-host：虚拟主机，起到数据隔离的作用
- publisher：消息发送者
- consumer：消息的消费者
- queue：队列，存储消息
- exchange：交换机，负责路由消息

每个虚拟主机相互独立，有各自的 exchange、queue

![RabbitMQ 框架](http://101.43.49.28:9000/blog/RabbitMQ框架.png)

### 收发消息

#### 交换机

打开 RabbitMQ 管理网页的 Exchanges 选项卡，可以看到已经有多个交换机了：

![rabbitmq管理界面的Exchange选项卡](http://101.43.49.28:9000/blog/rabbitmq管理界面的Exchange选项卡.png)

​	点击任意交换机，即可进入交换机详情页面。（可利用控制台的 publish message 发送一天消息）：

![exchanges的详情页](http://101.43.49.28:9000/blog/exchanges的详情页.png)

![消息发送的具体操作](http://101.43.49.28:9000/blog/消息发送的具体操作.png)

​	这里是由控制台模拟了生产者发送的消息。由于没有消费者存在，最终消息丢失了，这样说明交换机没有存储消息的能力。

#### 队列

打开 Queues 选项卡，新建一个队列：

![rabbitmq管理界面的Queues选项卡](http://101.43.49.28:9000/blog/rabbitmq管理界面的Queues选项卡.png)

命名为 hello.queue1：

![创建hello.queue1队列的操作](http://101.43.49.28:9000/blog/创建hello.queue1队列的操作.png)

再以相同的方式，创建一个队列，密码为 hello.queue2，最终队列列表如下：

![队列列表](http://101.43.49.28:9000/blog/队列列表.png)

​	如果此时，我们再次向 amq.fanout 交换机发送一条消息。会发现消息依然会没有到达队列，原因是发送到交换机的消息，只会路由到与其绑定的队列，因此仅仅创建队列是不够的，我们还需要将其与交换机绑定。

#### 绑定关系

​	点击 Exchanges 选项卡，点击 amq.fanout 交换机，进入交换机详情页，然后点击 Bindings 菜单，在表单中填写要绑定的队列名称：

![绑定操作](http://101.43.49.28:9000/blog/绑定操作.png)

相同的方式，将 hello.queue2 也绑定到改交换机。 最终，绑定结果如下：

![绑定结果](http://101.43.49.28:9000/blog/绑定结果.png)

#### 发送消息

​	再次回到 exchange 页面，找到刚刚绑定的 amq.fanout，点击进入详情页，再次发送一条消息：

![消息发送的具体操作](http://101.43.49.28:9000/blog/消息发送的具体操作.png)

回到 Queues 页面，可以发现 hello.queue 中已经有一条消息了：

![消息结果](http://101.43.49.28:9000/blog/消息结果.png)

点击队列名称，进入详情页，查看队列详情，这次我们点击 get message：

![查看消息详情](http://101.43.49.28:9000/blog/查看消息详情.png)

可以看到消息到达队列了：

![消息内容](http://101.43.49.28:9000/blog/消息内容.png)

​	这个时候如果有消费者监听了 MQ 的 hello.queue1 或 hello.queue2 队列，自然就能接收到消息了。

### 数据隔离

#### 用户管理

点击 Admin 选项卡，首先会看到 RabbitMQ 控制台的用户管理界面：

![rabbitmq管理界面的Admin选项卡](http://101.43.49.28:9000/blog/rabbitmq管理界面的Admin选项卡.png)

​	这里的用户都是 RabbitMQ 的管理或运维人员。目前只有安装 RabbitMQ 时添加的 itheima 这个用户。仔细观察用户表格中的字段，如下：

- **Name**：itheima，也就是用户名
- **Tags**：administrator，说明 itheima 用户是超级管理员，拥有所有权限
- **Can access virtual host**：/，可以访问的 virtual host，这里的 / 是默认的 virtual host

​	对于小型企业而言，出于成本考虑，我们通常只会搭建一套 MQ 集群，公司内的多个不同项目同时使用。这个时候为了避免互相干扰， 我们会利用 virtual host 的隔离特性，将不同项目隔离。一般会做两件事情：

- 给每个项目创建独立的运维账号，将管理权限分离。
- 给每个项目创建不同的 virtual host，将每个项目的数据隔离。

比如，现在我们创建一个新的用户，命名为 hmall：

![创建用户](http://101.43.49.28:9000/blog/创建用户.png)

发现 hmall 用户此时没有任何 virtual host 的访问权限：

![hmall 用户的 virtualhost 访问权限](http://101.43.49.28:9000/blog/hmall用户的virtualhost访问权限1.png)

#### virtual host

先登出用户：

![登出用户](http://101.43.49.28:9000/blog/登出用户.png)

​	切换到刚刚创建的 hmall 用户登录，然后点击 Virtual Hosts 菜单，进入 virtual host 管理页：

![virtual host 管理页](http://101.43.49.28:9000/blog/virtualhost管理页1.png)

​	可以看到目前只有一个默认的 virtual host ，名字为 /。 我们可以给黑马商城项目创建一个单独的 virtual host ，而不是使用默认的 /。

![创建 virtual host](http://101.43.49.28:9000/blog/创建virtualhost.png)

创建完成后如图：

![virtual host 管理页](http://101.43.49.28:9000/blog/virtualhost管理页2.png)

​	由于我们是登录 hmall 账户后创建的 virtual host，因此回到 users 菜单，你会发现当前用户已经具备了对 /hmall 这个 virtual host 的访问权限了：

![hmall 用户的 virtualhost 访问权限](http://101.43.49.28:9000/blog/hmall用户的virtualhost访问权限2.png)

此时，点击页面右上角的 virtual host 下拉菜单，切换 virtual host 为  /hmall：

![切换 virtual host](http://101.43.49.28:9000/blog/切换virtualhost.png)

​	然后再次查看 queues 选项卡，会发现之前的队列已经看不到了： 这就是基于 virtual host 的隔离效果。

## SpringAMQP

---

​	将来我们开发业务功能的时候，肯定不会在控制台收发消息，而是应该基于编程的方式。由于 RabbitMQ 采用了 AMQP 协议，因此它具备**跨语言**的特性。任何语言只要遵循 AMQP 协议收发消息，都可以与 RabbitMQ 交互。并且 RabbitMQ 官方也提供了各种不同语言的客户端。 但是，RabbitMQ 官方提供的 Java 客户端编码相对复杂，一般生产环境下我们更多会结合 Spring 来使用。而 Spring 的官方刚好基于 RabbitMQ 提供了这样一套消息收发的模板工具：**SpringAMQP**。并且还基于 SpringBoot 对其实现了**自动装配**，使用起来非常方便。

SpringAmqp 的官方地址：[Spring AMQP](https://spring.io/projects/spring-amqp)

SpringAMQP 提供了三个功能：

- 自动声明队列、交换机及其绑定关系
- 基于注解的监听器模式、异步接收消息
- 封装了 RabbitTemplate 工具，用于发送消息

### AMQP 的使用

#### 导入依赖

~~~xml
<!--AMQP依赖，包含RabbitMQ-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
~~~

​	在之前的案例中，我们都是经过交换机发送消息到队列，不过有时候为了测试方便，我们也**可以直接向队列发送消息，跳过交换机**。

![跳过交换机的消息流程](http://101.43.49.28:9000/blog/跳过交换机的消息流程.png)

- publisher 直接发送消息到队列
- 消费者监听并处理队列中的消息

<center><b><font color='red'>注意：这种模式一般测试使用，很少在生产中使用</font></b></center>

为了方便测试，我们现在控制台新建一个队列：simple.queue

![](http://101.43.49.28:9000/blog/新建simple.queue队列1.png)

![新建 simple.queue 队列](http://101.43.49.28:9000/blog/新建simple.queue队列2.png)

#### 消息发送

首先配置 MQ 地址，在 publisher 服务的 application.yml 中添加配置：

~~~yml
spring:
  rabbitmq:
    host: 127.0.0.1 # MQ 的 IP
    port: 5672 # 端口
    virtual-host: /hmall # 虚拟主机
    username: hmall # 用户名
    password: 123 # 密码
~~~

然后在**发布者**服务中编写测试类 SpringAmqpTest ，并利用 RabbitTemplate 实现消息发送：

~~~java
@Autowired
private RabbitTemplate rabbitTemplate;

@Test
public void testSimpleQueue() {
    // 队列名称
    String queueName = "simple.queue";
    // 消息
    String message = "hello, spring amqp!";
    // 发送消息
    rabbitTemplate.convertAndSend(queueName, message);
}
~~~

打开控制台，可以看到消息已经发送到队列中：

![消息传到队列中](http://101.43.49.28:9000/blog/消息传到队列中.png)

接下来，我们再来实现消息接收。

#### 消息接收

首先配置MQ地址，在 consumer 服务的 application.yml 中添加配置：

```yml
spring:
  rabbitmq:
    host: 127.0.0.1 # MQ 的 IP
    port: 5672 # 端口
    virtual-host: /hmall # 虚拟主机
    username: hmall # 用户名
    password: 123 # 密码
```

​	然后在 **消费者**服务的 com.itheima.consumer.listener 包中新建一个类 SpringRabbitListener，代码如下：

```java
@Component
public class SpringRabbitListener {
    // 利用RabbitListener来声明要监听的队列信息
    // 将来一旦监听的队列中有了消息，就会推送给当前服务，调用当前方法，处理消息。
    // 可以看到方法体中接收的就是消息体的内容
    @RabbitListener(queues = "simple.queue")
    public void listenSimpleQueueMessage(String msg) throws InterruptedException {
        System.out.println("spring 消费者接收到消息：【" + msg + "】");
    }
}
```

运行结果：

![运行结果](http://101.43.49.28:9000/blog/运行结果1.png)

### WorkQueues 模型

​	Work queues，任务模型。简单来说就是**让多个消费者绑定到一个队列，共同消费队列中的消息**。

![Work Queues 模型的消息流程](http://101.43.49.28:9000/blog/WorkQueues模型的消息流程.png)

​	当消息处理比较耗时的时候，可能生产消息的速度会远远大于消息的消费速度。长此以往，消息就会堆积越来越多，无法及时处理。 此时就可以使用 work 模型，**多个消费者共同处理消息处理，消息处理的速度就能大大提高了**。

接下来，我们就来模拟这样的场景。 首先，我们在控制台创建一个新的队列，命名为 work.queue：

![新建 work.queue 队列](http://101.43.49.28:9000/blog/新建work.queue队列.png)

#### 消息发送

这次我们往队列中循环发送，模拟出一个**大量消息堆积**的队列。 

~~~java
/**
     * workQueue
     * 向队列中不停发送消息，模拟消息堆积。
     */
@Test
public void testWorkQueue() throws InterruptedException {
    // 队列名称
    String queueName = "simple.queue";
    // 消息
    String message = "hello, message_";
    for (int i = 0; i < 50; i++) {
        // 发送消息，每20毫秒发送一次，相当于每秒发送50条消息
        rabbitTemplate.convertAndSend(queueName, message + i);
        Thread.sleep(20);
    }
}
~~~

#### 消息接收

​	

要模拟多个消费者绑定同一个队列，我们在 consumer 服务的 SpringRabbitListener 中添加2个新的方法：

~~~java
@RabbitListener(queues = "work.queue")
public void listenWorkQueue1(String msg) throws InterruptedException {
    System.out.println("消费者1接收到消息：【" + msg + "】" + LocalTime.now());
    Thread.sleep(20);
}
 
@RabbitListener(queues = "work.queue")
public void listenWorkQueue2(String msg) throws InterruptedException {
    System.err.println("消费者2........接收到消息：【" + msg + "】" + LocalTime.now());
    Thread.sleep(200);
}
~~~

注意到这两消费者，都设置了 Thead.sleep，模拟任务耗时：

- 消费者1 sleep 了20毫秒，相当于每秒钟处理50个消息
- 消费者2 sleep 了200毫秒，相当于每秒钟处理5个消息

#### 测试

​	启动 ConsumerApplication 后，在执行 publisher 服务中刚刚编写的发送测试方法 testWorkQueue。 最终结果如下：

消费者1和消费者2竟然**每人消费了25条消息**：

- 消费者1很快完成了自己的25条消息
- 消费者2却在缓慢的处理自己的25条消息

​	也就是说消息是**平均分配**给每个消费者，并没有考虑到消费者的处理能力。导致1个消费者空闲，另一个消费者忙的不可开交。**没有充分利用每一个消费者的能力**，最终消息处理的耗时远远超过了1秒。这样显然是有问题的。

#### 公平轮询

​	在 spring 中有一个简单的配置，可以解决这个问题。我们修改 **consumer 服务**的 application.yml 文件，添加配置：

~~~yml
spring:
  rabbitmq:
    listener:
      simple:
        prefetch: 1 # 每次只能获取一条消息，处理完成才能获取下一个消息
~~~

::: info prefetch配置的作用

​	在配置中，prefetch: 1表示每个消费者每次只能从队列中预取1个消息，消费完就能拿下一次，**不需要等轮询**。它可以帮助保证每个消息在被消费者处理时都能得到较为均匀的分配，避免某个消费者处理速度慢而导致其他消费者空闲的情况。**如果不配置该选项的话，那么 rabbitmq 采用的就是一个公平轮询的方式，将消息依次发给一个消费，等他消费完了再发下一个给另外的消费者**

:::

### 交换机类型

​	在之前的两个测试案例中，都没有交换机，生产者直接发送消息到队列。而一旦引入交换机，消息发送的模式会有很大变化：

![包含交换机的消息流程](http://101.43.49.28:9000/blog/包含交换机的消息流程.png)

可以看到，在订阅模型中，多了一个 exchange 角色，而且过程略有变化：

- **Publisher**：生产者，不再发送消息到队列中，而是发给交换机
- **Exchange**：交换机，一方面，接收生产者发送的消息。另一方面，知道如何处理消息，例如递交给某个特别队列、递交给所有队列、或是将消息丢弃。到底如何操作，取决于 Exchange 的类型。
- **Queue**：消息队列也与以前一样，接收消息、缓存消息。不过队列一定要与交换机绑定。
- **Consumer**：消费者，与以前一样，订阅队列，没有变化

​	<font color='red'>Exchange（交换机）只负责转发消息，不具备存储消息的能力，因此如果没有任何队列与 Exchange 绑定，或者没有符合路由规则的队列，那么消息会丢失！</font>

**交换机的类型有四种：**

- **Fanout**：广播，将消息交给所有绑定到交换机的队列。我们最早在控制台使用的正是 Fanout 交换机
- **Direct**：订阅，基于 RoutingKey（路由 key）发送给订阅了消息的队列
- **Topic**：通配符订阅，与 Direct 类似，只不过 RoutingKey 可以使用通配符
- **Headers**：头匹配，基于 MQ 的消息头匹配，用的较少。

#### Fanout 交换机

​	Fanout，英文翻译是扇出，我觉得在 MQ 中叫广播更合适。 在广播模式下，消息发送流程是这样的：

![Fanout 交换机的消息流程](http://101.43.49.28:9000/blog/Fanout交换机的消息流程.png)

Fanout 交换机需求如下：

1. 可以有多个队列
2. 每个队列都要绑定到 Exchange（交换机）
3. 生产者发送的消息，只能发送到交换机
4. 交换机把消息发送给绑定过的**所有队列**
5. 订阅队列的消费者**都能拿到消息**

##### 声明队列和交换机

在控制台创建队列 fanout.queue1:

![创建 fanout.queue1 队列](http://101.43.49.28:9000/blog/创建fanout.queue1队列.png)

在控制台创建队列 fanout.queue2:

![创建 fanout.queue2 队列](http://101.43.49.28:9000/blog/创建fanout.queue2队列.png)

然后再创建一个交换机：

![创建 hmall.fanout 交换机](http://101.43.49.28:9000/blog/创建hmall.fanout交换机.png)

然后绑定两个队列到交换机：

![fanout.queue1绑定到hmall.fanout](http://101.43.49.28:9000/blog/fanout.queue1_bind_hmall.fanout.png)

![fanout.queue2绑定到hmall.fanout](http://101.43.49.28:9000/blog/fanout.queue2_bind_hmall.fanout.png)

##### 消息发送

在 publisher 服务的 SpringAmqpTest 类中添加测试方法：

~~~java
@Test
public void testFanoutExchange() {
    // 交换机名称
    String exchangeName = "hmall.fanout";
    // 消息
    String message = "hello, everyone!";
    rabbitTemplate.convertAndSend(exchangeName, "", message);
}
~~~

##### 消息接收

在 consumer 服务的 SpringRabbitListener 中添加两个方法，作为消费者：

~~~java
@RabbitListener(queues = "fanout.queue1")
public void listenFanoutQueue1(String msg) {
    System.out.println("消费者1接收到Fanout消息：【" + msg + "】");
}

@RabbitListener(queues = "fanout.queue2")
public void listenFanoutQueue2(String msg) {
    System.out.println("消费者2接收到Fanout消息：【" + msg + "】");
}
~~~

##### 总结

交换机的作用：

- 接收 publisher 发送的消息
- 将消息按照规则路由到与之绑定的队列
- 不能缓存消息，路由失败，消息丢失
- FanoutExchange 的会将消息路由到每个绑定的队列

#### Direct 交换机

​	在 Fanout 模式中，一条消息，会被所有订阅的队列都消费。但是，在某些场景下，我们希望不同的消息被不同的队列消费。这时就要用到 Direct 类型的 Exchange。

![Direct 交换机的消息流程](http://101.43.49.28:9000/blog/Direct交换机的消息流程.png)

在Direct模型下：

- 队列与交换机的绑定，不能是任意绑定了，而是要指定一个 RoutingKey（路由 key）
- 消息的发送方在 向 Exchange 发送消息时，也必须指定消息的  RoutingKey。
- Exchange 不再把消息交给每一个绑定的队列，而是根据消息的 Routing Key 进行判断，只有队列的 Routingkey 与消息的 Routing key 完全一致，才会接收到消息

Direct 交换机需求如下：

1. 声明一个名为 hmall.direct 的交换机
2. 声明队列 direct.queue1，绑定 hmall.direct，bindingKey 为 blud 和 red
3. 声明队列 direct.queue2，绑定 hmall.direct，bindingKey 为 yellow 和 red
4. 在 consumer 服务中，编写两个消费者方法，分别监听 direct.queue1 和 direct.queue2
5. 在 publisher 中编写测试方法，向 hmall.direct 发送消息

##### 声明队列和交换机

首先在控制台声明两个队列 direct.queue1 和 direct.queue2，这里不再展示过程：

![创建direct.queue1和direct.queue2两个队列](http://101.43.49.28:9000/blog/创建direct.queue1和direct.queue2两个队列.png)

然后声明一个direct类型的交换机，命名为 hmall.direct：

![创建hmall.direct交换机](http://101.43.49.28:9000/blog/创建hmall.direct交换机.png)

然后使用 red 和 blue 作为 key，绑定 direct.queue1 到 hmall.direct：

![direct.queue1 绑定 hmall.direct 用 red 做 key](http://101.43.49.28:9000/blog/direct.queue1绑定hmall.direct用red做key.png)

![direct.queue1绑定hmall.direct用blue做key](http://101.43.49.28:9000/blog/direct.queue1绑定hmall.direct用blue做key.png)

​	同理，使用 red 和 yellow 作为 key，绑定 direct.queue2 到 hmall.direct，步骤略，最终结果：

![hmall.direct 的绑定情况](http://101.43.49.28:9000/blog/hmall.direct的绑定情况.png)

##### 消息接收

在 consumer 服务的 SpringRabbitListener 中添加方法：

~~~java
@RabbitListener(queues = "direct.queue1")
public void listenDirectQueue1(String msg) {
    System.out.println("消费者1接收到direct.queue1的消息：【" + msg + "】");
}

@RabbitListener(queues = "direct.queue2")
public void listenDirectQueue2(String msg) {
    System.out.println("消费者2接收到direct.queue2的消息：【" + msg + "】");
}
~~~

##### 消息发送

在 publisher 服务的 SpringAmqpTest 类中添加测试方法：

~~~java
@Test
public void testSendDirectExchange() {
    // 交换机名称
    String exchangeName = "hmall.direct";
    // 消息
    String message = "红色警报！日本乱排核废水，导致海洋生物变异，惊现哥斯拉！";
    // 发送消息
    rabbitTemplate.convertAndSend(exchangeName, "red", message);
}
~~~

由于使用的 red 这个 key，所以两个消费者都收到了消息：

![发送 key 为 red 的消息的运行结果](http://101.43.49.28:9000/blog/发送key为red的消息的运行结果.png)

我们再切换为 blue 这个 key：

~~~java
@Test
public void testSendDirectExchange() {
    // 交换机名称
    String exchangeName = "hmall.direct";
    // 消息
    String message = "最新报道，哥斯拉是居民自治巨型气球，虚惊一场！";
    // 发送消息
    rabbitTemplate.convertAndSend(exchangeName, "blue", message);
}
~~~

结果会只有消费者1收到了消息

![发送key为blue的消息的运行结果](http://101.43.49.28:9000/blog/发送key为blue的消息的运行结果.png)

##### 总结

Direct 交换机与 Fanout 交换机的差异：

- Fanout 交换机将消息路由给每一个与之绑定的队列
- Direct 交换机根据 RoutingKey 判断路由给哪个队列
- 如果多个队列具有相同的 RoutingKey，则与 Fanout 功能类似

#### Topic 交换机

​	尽管使用 direct 交换机改进了我们的系统，但是它仍然存在局限性——比方说我们的交换机绑定了多个不同的 routingKey，在 direct 模式中虽然能做到有选择性地接收日志，但是它的选择性是单一的，就是说我的一条消息，只能被一个相同 routingKey 的绑定缩消费，但是如果我们想要在让它的选择性变得多元，比如**划分一个子组，一个消息可以根据一个组别的队列进行投递**，就需要用到 Topic 模式 

Topic 类型 Exchange 可以让队列在绑定 BindingKey 的时候使用**通配符**！

BindingKey 一般都是有一个或多个**单词**组成，多个单词之间以“.”，分割，例如：item.insert 通配符规则：

- **#**：匹配一个或多个词
- *：匹配不多不少恰好1个词

>
>
>举例：
>
>- `item.#`：能够匹配`item.spu.insert` 或者 `item.spu`
>- `item.*`：只能匹配`item.spu`

![Topic 交换机的消息流程](http://101.43.49.28:9000/blog/Topic交换机的消息流程.png)

![Topic 交换机的例子](http://101.43.49.28:9000/blog/Topic交换机的例子.png)

##### 声明队列和交换机

​	首先，在控制台按照图示例子创建队列、交换机，并利用通配符绑定队列和交换机。此处步骤略。最终结果如下：

![hmall.topic 的绑定情况](http://101.43.49.28:9000/blog/hmall.topic的绑定情况.png)

##### 消息发送

在 publisher 服务的 SpringAmqpTest 类中添加测试方法：

~~~java
/**
 * topicExchange
 */
@Test
public void testSendTopicExchange() {
    // 交换机名称
    String exchangeName = "hmall.topic";
    // 消息
    String message = "喜报！孙悟空大战哥斯拉，胜!";
    // 发送消息
    rabbitTemplate.convertAndSend(exchangeName, "china.news", message);
}
~~~

##### 消息接受

在 consumer 服务的 SpringRabbitListener 中添加方法：

~~~java
@RabbitListener(queues = "topic.queue1")
public void listenTopicQueue1(String msg){
    System.out.println("消费者1接收到topic.queue1的消息：【" + msg + "】");
}

@RabbitListener(queues = "topic.queue2")
public void listenTopicQueue2(String msg){
    System.out.println("消费者2接收到topic.queue2的消息：【" + msg + "】");
}
~~~

##### 总结

Direct 交换机与 Topic 交换机的差异：

- Topic 交换机接收的消息 RoutingKey 必须是多个单词，以 \**.** 分割
- Topic 交换机与队列绑定时的 bindingKey 可以指定通配符
- **#**：代表0个或多个词
- *：代表1个词

### API 声明队列和交换机

​	在之前我们都是基于 RabbitMQ 控制台来创建队列、交换机。但是在实际开发时，队列和交换机是程序员定义的，将来项目上线，又要交给运维去创建。那么程序员就需要把程序中运行的所有队列和交换机都写下来，交给运维。在这个过程中是很容易出现错误的。 因此推荐的做法是由程序启动时检查队列和交换机是否存在，如果不存在自动创建。

#### 基本 API

SpringAMQP 提供了一个 Queue 类，用来创建队列：

![Queue 类](http://101.43.49.28:9000/blog/Queue类.png)

SpringAMQP 还提供了一个 Exchange 接口，来表示所有不同类型的交换机：

![Exchange 接口及其子类](http://101.43.49.28:9000/blog/Exchange接口及其子类.png)

​	我们可以自己创建队列和交换机，不过 SpringAMQP 还提供了 <font color='red'>**ExchangeBuilder**</font>来简化这个过程： 

![ExchangeBuilder 的结构](http://101.43.49.28:9000/blog/ExchangeBuilder的结构.png)

而在绑定队列和交换机时，则需要使用BindingBuilder来创建Binding对象：

![BindingBuilder 的结构](http://101.43.49.28:9000/blog/BindingBuilder的结构.png)

#### fanout 示例

在 consumer 中创建一个**配置类**，声明队列和交换机：

![Fanout 交换机的消息流程](http://101.43.49.28:9000/blog/Fanout交换机的消息流程.png)

~~~java
@Configuration
public class FanoutConfig {
    /**
     * 声明交换机
     * @return Fanout类型交换机
     */
    @Bean
    public FanoutExchange fanoutExchange(){
        return new FanoutExchange("hmall.fanout");
    }

    /**
     * 第1个队列
     */
    @Bean
    public Queue fanoutQueue1(){
        return new Queue("fanout.queue1");
    }

    /**
     * 绑定队列和交换机
     */
    @Bean
    public Binding bindingQueue1(Queue fanoutQueue1, FanoutExchange fanoutExchange){
        return BindingBuilder.bind(fanoutQueue1).to(fanoutExchange);
    }

    /**
     * 第2个队列
     */
    @Bean
    public Queue fanoutQueue2(){
        return new Queue("fanout.queue2");
    }

    /**
     * 绑定队列和交换机
     */
    @Bean
    public Binding bindingQueue2(Queue fanoutQueue2, FanoutExchange fanoutExchange){
        return BindingBuilder.bind(fanoutQueue2).to(fanoutExchange);
    }
}
~~~

#### direct 示例

direct 模式由于要绑定多个 KEY，会非常麻烦，每一个 Key 都要编写一个 binding：

![Direct 交换机的消息流程](http://101.43.49.28:9000/blog/Direct交换机的消息流程.png)

~~~java
@Configuration
public class DirectConfig {

    /**
     * 声明交换机
     * @return Direct类型交换机
     */
    @Bean
    public DirectExchange directExchange(){
        return ExchangeBuilder.directExchange("hmall.direct").build();
    }

    /**
     * 第1个队列
     */
    @Bean
    public Queue directQueue1(){
        return new Queue("direct.queue1");
    }

    /**
     * 绑定队列和交换机
     */
    @Bean
    public Binding bindingQueue1WithRed(Queue directQueue1, DirectExchange directExchange){
        return BindingBuilder.bind(directQueue1).to(directExchange).with("red");
    }
    /**
     * 绑定队列和交换机
     */
    @Bean
    public Binding bindingQueue1WithBlue(Queue directQueue1, DirectExchange directExchange){
        return BindingBuilder.bind(directQueue1).to(directExchange).with("blue");
    }

    /**
     * 第2个队列
     */
    @Bean
    public Queue directQueue2(){
        return new Queue("direct.queue2");
    }

    /**
     * 绑定队列和交换机
     */
    @Bean
    public Binding bindingQueue2WithRed(Queue directQueue2, DirectExchange directExchange){
        return BindingBuilder.bind(directQueue2).to(directExchange).with("red");
    }
    /**
     * 绑定队列和交换机
     */
    @Bean
    public Binding bindingQueue2WithYellow(Queue directQueue2, DirectExchange directExchange){
        return BindingBuilder.bind(directQueue2).to(directExchange).with("yellow");
    }
}
~~~

<center><b>Topic和Direct基本是一样的配置方式，这里就不掩饰了</b></center>

#### 基于注解声明

基于 @Bean 的方式声明队列和交换机比较麻烦，Spring 还提供了基于注解方式来声明。

例如，我们同样声明 Direct 模式的交换机和队列：

~~~java
@RabbitListener(bindings = @QueueBinding(
    value = @Queue(name = "direct.queue1"),
    exchange = @Exchange(name = "hmall.direct", type = ExchangeTypes.DIRECT),
    key = {"red", "blue"}
))
public void listenDirectQueue1(String msg){
    System.out.println("消费者1接收到direct.queue1的消息：【" + msg + "】");
}

@RabbitListener(bindings = @QueueBinding(
    value = @Queue(name = "direct.queue2"),
    exchange = @Exchange(name = "hmall.direct", type = ExchangeTypes.DIRECT),
    key = {"red", "yellow"}
))
public void listenDirectQueue2(String msg){
    System.out.println("消费者2接收到direct.queue2的消息：【" + msg + "】");
}
~~~

声明 Topic 模式的交换机和队列：

~~~java
@RabbitListener(bindings = @QueueBinding(
    value = @Queue(name = "topic.queue1"),
    exchange = @Exchange(name = "hmall.topic", type = ExchangeTypes.TOPIC),
    key = "china.#"
))
public void listenTopicQueue1(String msg){
    System.out.println("消费者1接收到topic.queue1的消息：【" + msg + "】");
}

@RabbitListener(bindings = @QueueBinding(
    value = @Queue(name = "topic.queue2"),
    exchange = @Exchange(name = "hmall.topic", type = ExchangeTypes.TOPIC),
    key = "#.news"
))
public void listenTopicQueue2(String msg){
    System.out.println("消费者2接收到topic.queue2的消息：【" + msg + "】");
}
~~~

### 消息转化器

Spring 的消息发送代码接收的消息体是一个 **Object**：

![convertAndSend 方法](http://101.43.49.28:9000/blog/convertAndSend方法.png)

​	而在数据传输时，它会把你发送的消息序列化为字节发送给 MQ，接收消息的时候，还会把字节反序列化为 Java 对象。 只不过，默认情况下 Spring 采用的序列化方式是<font color='red'>**JDK序列化**</font>。众所周知，JDK 序列化存在下列问题：

1. 数据体积过大
2. 有安全漏洞
3. 可读性差

#### 配置 JSON 转换器

​	显然，JDK 序列化方式并不合适。我们希望消息体的体积更小、可读性更高，因此可以使用**JSON 方式**来做序列化和反序列化。

在 publisher 和 consumer 两个服务中都引入依赖：

~~~xml
<dependency>
    <groupId>com.fasterxml.jackson.dataformat</groupId>
    <artifactId>jackson-dataformat-xml</artifactId>
    <version>2.9.10</version>
</dependency>
~~~

<center><b><font color='red'>注意，如果项目中引入了 spring-boot-starter-web 依赖，则无需再次引入 Jackson 依赖。</font></b></center>

配置消息转换器，在 publisher 和 consumer 两个服务的启动类中添加一个 Bean 即可：

~~~java
@Bean
public MessageConverter messageConverter(){
    // 1.定义消息转换器
    Jackson2JsonMessageConverter jackson2JsonMessageConverter = new Jackson2JsonMessageConverter();
    // 2.配置自动创建消息id，用于识别不同消息，也可以在业务中基于ID判断是否是重复消息
    jackson2JsonMessageConverter.setCreateMessageIds(true);
    return jackson2JsonMessageConverter;
}
~~~

消息转换器中添加的 messageId 可以便于我们将来做幂等性判断。

此时，我们到 MQ 控制台**删除** object.queue 中的旧的消息。然后再次执行刚才的消息发送的代码，到 MQ 的控制台查看消息结构：

![收到的消息的消息结构](http://101.43.49.28:9000/blog/收到的消息的消息结构.png)

#### 消费者接收 Object

​	我们在 consumer 服务中定义一个新的消费者，**publisher 是用什么类型发送，那么消费者也一定要用什么类型接收**，格式如下：

~~~java
@RabbitListener(queues = "object.queue")
public void listenSimpleQueueMessage(Map<String, Object> msg) throws InterruptedException {
    System.out.println("消费者接收到object.queue消息：【" + msg + "】");
}
~~~

# MQ 的进阶用法

## 发送者的可靠性

---

​	首先，我们一起分析一下消息丢失的可能性有哪些。 消息从发送者发送消息，到消费者处理消息，需要经过的流程是这样的：

![消息推送流程](http://101.43.49.28:9000/blog/消息推送流程.png)

消息从生产者到消费者的每一步都可能导致消息丢失：

- **发送消息时丢失：**
  - 生产者发送消息时连接 MQ 失败
  - 生产者发送消息到达 MQ 后未找到 Exchange
  - 生产者发送消息到达 MQ 的 Exchange 后，未找到合适的 Queue
  - 消息到达 MQ 后，处理消息的进程发生异常
- **MQ 导致消息丢失：**
  - 消息到达 MQ，保存到队列后，尚未消费就突然宕机
- **消费者处理消息时：**
  - 消息接收后尚未处理突然宕机
  - 消息接收后处理过程中抛出异常

综上，我们要解决消息丢失问题，保证 MQ 的可靠性，就必须从3个方面入手：

- **确保生产者一定把消息发送到MQ**
- **确保MQ不会将消息弄丢**
- **确保消费者一定要处理消息**

### 生产者连接重试机制

首先第一种情况，就是<u>**生产者发送消息时，出现了网络故障，导致与 MQ 的连接中断。**</u>

为了解决这个问题，SpringAMQP 提供的消息发送时的**重试机制**。即：

<center><b>当 RabbitTemplate 与 MQ 连接超时后，多次重试</b></center>

修改 publisher 模块的 application.yaml 文件，添加下面的内容：

~~~yaml
spring:
  rabbitmq:
    connection-timeout: 1s # 设置MQ的连接超时时间
    template:
      retry:
        enabled: true # 开启超时重试机制
        initial-interval: 1000ms # 失败后的初始等待时间
        multiplier: 1 # 失败后下次的等待时长倍数，下次等待时长 = initial-interval * multiplier
        max-attempts: 3 # 最大重试次数
~~~

我们利用命令停掉 RabbitMQ 服务

然后测试发送一条消息，会发现会每隔1秒重试1次，总共重试了3次。消息发送的超时重试机制配置成功了！

::: info 注意

​	当网络不稳定的时候，利用重试机制可以有效提高消息发送的成功率。不过 SpringAMQP 提供的重试机制是**阻塞式**的重试，也就是说多次重试等待的过程中，当前线程是**被阻塞**的。 如果对于业务性能有要求，建议禁用重试机制。如果一定要使用，请合理配置等待时长和重试次数，当然也可以考虑使用异步线程来执行发送消息的代码。 

:::

### 生产者确认机制（发布确认）

​	一般情况下，只要生产者与 MQ 之间的网路连接顺畅，基本不会出现发送消息丢失的情况，因此大多数情况下我们无需考虑这种问题。 不过，在少数情况下，也会出现消息发送到 MQ 之后丢失的现象，比如：

- MQ 内部处理消息的进程发生了异常
- 生产者发送消息到达 MQ 后未找到 Exchange
- 生产者发送消息到达 MQ 的 Exchange 后，未找到合适的Queue，因此无法路由

​	针对上述情况，RabbitMQ 提供了生产者消息确认机制，包括 <u>**Publisher Confirm**</u> 和 <u>**Publisher Return**</u> 两种。在开启确认机制的情况下，当生产者发送消息给 MQ 后，MQ 会根据消息处理的情况返回不同的**回执**。 具体如图所示：

![消息处理返回的不同情况](http://101.43.49.28:9000/blog/消息处理返回的不同情况.png)

- 当消息投递到 MQ，但是路由失败时，通过 **Publisher Return** 返回异常信息，同时返回 ack 的确认信息，代表投递成功**（失败了还会返回 ack 是因为确认机制只能保证该消息是否到达 MQ，不管他是否被消费）**
- 临时消息投递到了 MQ，并且入队成功，返回 ACK，告知投递成功
- 持久消息投递到了 MQ，并且入队完成持久化，返回 ACK，告知投递成功
- 其它情况都会返回 NACK，告知投递失败

>
>
>其中`ack`和`nack`属于 **<font color='red'>Publisher Confirm</font>** 机制，`ack`是投递成功；`nack`是投递失败。而`return`则属于 **<font color='red'>Publisher Return</font>** 机制。 默认两种机制都是关闭状态，需要通过配置文件来开启。

>
>
>​	RabbitMQ 的发布确认机制<font color='red'>只能确保消息已经成功发布到消息队列，但无法直接知道消息是否被消费</font>。发布确认机制只告知发布者消息是否成功到达消息队列，而不涉及消息被消费的情况。
>
>​	如果需要知道消息是否被消费，可结合 RabbitMQ 的**消费者确认机制**（Consumer Acknowledgements）。在消费者从消息队列中接收到消息后，可以发送个确认消息给RabbitMQ来表示该消息已被成功消费。这种方式可以通过设置自动确认或手动确认来实现。

### 实现生产者确认

#### 开启生产者确认

在 publisher 模块的 application.yaml 中添加配置：

~~~yaml
spring:
  rabbitmq:
    publisher-confirm-type: correlated # 开启publisher confirm机制，并设置confirm类型
    publisher-returns: true # 开启publisher return机制
~~~

publisher-confirm-type 有三种模式：

1. **none**：关闭 confirm 机制
2. **simple**：同步阻塞等待 MQ 的回执
3. **correlated**：MQ 异步回调返回回执

<center><b>一般推荐使用 correlated，异步回调机制。</b></center>

#### 定义 ReturnCallback

​	**每个 RabbitTemplate 只能配置一个 ReturnCallback**，因此我们可以在配置类中统一设置。我们在 publisher 模块定义一个配置类：

![publichser 模块结构](http://101.43.49.28:9000/blog/publichser模块结构.png)

~~~java
@Slf4j
@AllArgsConstructor
@Configuration
public class MqConfig {
    private final RabbitTemplate rabbitTemplate;

    @PostConstruct
    public void init(){
        rabbitTemplate.setReturnsCallback(new RabbitTemplate.ReturnsCallback() {
            @Override
            public void returnedMessage(ReturnedMessage returned) {
                log.error("触发return callback,");
                log.debug("exchange: {}", returned.getExchange());
                log.debug("routingKey: {}", returned.getRoutingKey());
                log.debug("message: {}", returned.getMessage());
                log.debug("replyCode: {}", returned.getReplyCode());
                log.debug("replyText: {}", returned.getReplyText());
            }
        });
    }
}
~~~

~~~java
public void sendMessage(String exchange, String routingKey, Object message) {
    rabbitTemplate.send(exchange, routingKey, (Message) message);
    // 在发送消息的时候，如果消息没有被正确路由到指定的队列，将执行ReturnCallback的回调函数
}
~~~

::: info 说明

​	***@PostConstruct*** 是 Java EE 或 Spring 框架中的一个注解，用于指定一个方法在对象实例化后立即执行。通常在使用 IoC（控制反转）容器时，我们可以通过 @PostConstruct 注解来标记一个方法，在对象创建完成后执行一些初始化逻辑。

:::

#### 定义 ConfirmCallback

​	由于每个消息发送时的处理逻辑不一定相同，因此 ConfirmCallback 需要在每次发消息时定义。具体来说，是在调用 RabbitTemplate 中的 convertAndSend 方法时，多传递一个参数：

![convertAndSend 的多种构造](http://101.43.49.28:9000/blog/convertAndSend的多种构造.png)

这里的 CorrelationData 中包含两个核心的东西：

- **id**：消息的唯一标示，MQ 对不同的消息的回执以此做判断，避免混淆
- **SettableListenableFuture**：回执结果的 Future 对象

​	将来 MQ 的回执就会通过这个 Future 来返回，我们可以提前给 CorrelationData 中的 Future 添加回调函数来处理消息回执：

![SettableListenableFuture 类](http://101.43.49.28:9000/blog/SettableListenableFuture类.png)

向系统自带的交换机发送消息，并且添加 ConfirmCallback：

~~~java
@Test
void testPublisherConfirm() {
    // 1.创建CorrelationData
    CorrelationData cd = new CorrelationData();
    // 2.给Future添加ConfirmCallback
    cd.getFuture().addCallback(new ListenableFutureCallback<CorrelationData.Confirm>() {
        @Override
        public void onFailure(Throwable ex) {
            // 2.1.Future发生异常时的处理逻辑，基本不会触发
            log.error("send message fail", ex);
        }
        @Override
        public void onSuccess(CorrelationData.Confirm result) {
            // 2.2.Future接收到回执的处理逻辑，参数中的result就是回执内容
            if(result.isAck()){ // result.isAck()，boolean类型，true代表ack回执，false 代表 nack回执
                log.debug("发送消息成功，收到 ack!");
            }else{ // result.getReason()，String类型，返回nack时的异常描述
                log.error("发送消息失败，收到 nack, reason : {}", result.getReason());
            }
        }
    });
    // 3.发送消息
    rabbitTemplate.convertAndSend("hmall.direct", "q", "hello", cd);
}
~~~

运行结果如下：

![添加 ConfirmCallback 的运行结果](http://101.43.49.28:9000/blog/添加ConfirmCallback的运行结果.png)

​	可以看到，由于传递的 RoutingKey 是错误的，路由失败后，触发了 return callback，同时也收到了 ack。 当我们修改为正确的 RoutingKey 以后，就不会触发 return callback 了，只收到 ack。 而如果连交换机都是错误的，则只会收到 nack。

**注意**： **开启生产者确认比较消耗 MQ 性能，一般不建议开启**。而且大家思考一下触发确认的几种情况：

- 路由失败：一般是因为 RoutingKey 错误导致，往往是编程导致
- 交换机名称错误：同样是编程错误导致
- MQ 内部故障：这种需要处理，但概率往往较低。因此只有对消息可靠性要求非常高的业务才需要开启，而且**仅仅需要开启 ConfirmCallback 处理 nack 就可以了。**

#### confirm 模式细节处理

​	confirm 模式最大的好处在于是异步的，一旦发布一条消息，生产者应用程序就可以在等信道返回确认的同时继续发送下一条消息，当消息最终得到确认之后，生产者应用便可以通过回调方法来处理该确认消息，如果 RabbitMQ 因为自身内部错误导致消息丢失，就会发送一条 nack 消息， 生产者应用程序同样可以在回调方法中处理该 nack 消息。

![comfirm 模式的流程](http://101.43.49.28:9000/blog/comfirm模式的流程.png)

细节：

​	监听器要定义在发布消息的步骤前面，不然在发消息的过程中就无法捕捉发布确认结果，所以说要将其提前打开监听器再发布消息。

deliveryTag（一条消息的标记号）的初始值也是0L,但是标记发送的消息是从1开始的，1-65535，这样 getNextPublishSeqNo()（下一条消息的标记号）的值和 deliveryTag 的值就是对应的

![confirm 模式细节处理](http://101.43.49.28:9000/blog/confirm模式细节处理.png)

## MQ 的可靠性

---

​	消息到达 MQ 以后，如果 MQ 不能及时保存，也会导致消息丢失，所以 MQ 的可靠性也非常重要。

### 数据持久化

​	为了提升性能，默认情况下 MQ 的数据都是在内存存储的临时数据，重启后就会消失。为了保证数据的可靠性，必须配置数据持久化，包括：

- 交换机持久化
- 队列持久化
- 消息持久化

#### 交换机持久化

在控制台的 Exchanges 页面，添加交换机时可以配置交换机的 Durability 参数：

![Exchanges 配置 Druability 参数](http://101.43.49.28:9000/blog/Exchanges配置Druability参数.png)

设置为 Durable 就是持久化模式，Transient 就是临时模式。

#### 队列持久化

在控制台的 Queues 页面，添加队列时，同样可以配置队列的 Durability 参数：

![Queues 配置 Druability 参数](http://101.43.49.28:9000/blog/Queues配置Druability参数.png)

除了持久化以外，你可以看到队列还有很多其它参数。

::: info

​	RabbitMQ 的非持久队列确实是应该在生产者和消费者断开连接后就被销毁的，但是如果队列里还存在未被消费的消息，那么队列就不会被自动删除，直到所有的消息都被消费或备份。另外，如果设置了 auto_delete 参数为 false，也会导致队列不会自动删除。建议使用命令行或者管理界面查看队列状态，以确认队列是否已被删除。

:::

#### 消息持久化

​	在控制台发送消息的时候，可以添加很多参数，而消息的持久化是要配置一个 properties：

![消息持久化配置](http://101.43.49.28:9000/blog/消息持久化配置.png)

说明：在开启持久化机制以后，如果同时还开启了生产者确认，那么 MQ 会在消息持久化以后才发送 ACK 回执，进一步确保消息的可靠性。 不过出于性能考虑，为了减少 IO 次数，发送到 MQ 的消息并不是逐条持久化到数据库的，而是每隔一段时间批量持久化。一般间隔在100毫秒左右，这就会导致 ACK 有一定的延迟，因此建议生产者确认全部采用异步方式。

::: info 

​	持久化消息会同时写入***磁盘*** 和***内存***（加快读取速度），非持久化消息会暂存在内存中，只有***当内存不够用*** 时，才将消息**写入磁盘**（但一般重启之后，在磁盘中的非持久化消息就没有了）。

![](http://101.43.49.28:9000/blog/写进磁盘的非持久化消息.png)

​	<font color='red'>**消息持久化这个方法并不能保证消息100%不丢失**</font>，如果在当消息刚准备存储在磁盘的时候 但是还没有存储完，消息还在缓存的一个间隔点。此时并没有真正写入磁盘。如果一旦服务崩溃宕机，消息还是会丢失。

:::

### LazyQueue

​	在默认情况下，RabbitMQ 会将接收到的信息保存在**内存中**以降低消息收发的延迟。但在某些特殊情况下，这会导致消息积压，比如：

- 消费者宕机或出现网络故障
- 消息发送量激增，超过了消费者处理速度
- 消费者处理业务发生阻塞

​	一旦出现消息堆积问题，RabbitMQ 的内存占用就会越来越高，直到触发内存预警上限。此时 RabbitMQ 会将内存消息刷到磁盘上，这个行为成为 PageOut，PageOut 会耗费一段时间，并且会阻塞队列进程。因此在这个过程中 RabbitMQ 不会再处理新的消息，生产者的所有请求都会被阻塞。

​	为了解决这个问题，从 RabbitMQ 的<u>***3.6.0版本***</u>开始，就增加了 Lazy Queues 的模式，也就是惰性队列。惰性队列的特征如下：

- 接收到消息后直接存入磁盘而非内存
- 消费者要消费消息时才会从磁盘中读取并加载到内存（也就是懒加载）
- 支持数百万条的消息存储

​	而在*<u>**3.12版本**</u>*之后，LazyQueue 已经成为所有队列的默认格式。因此官方推荐升级MQ为3.12版本或者所有队列都设置为 LazyQueue 模式。

#### 控制台配置 Lazy 模式

在添加队列的时候，添加 x-queue-mod=lazy 参数即可设置队列为 Lazy 模式：

![Queues 配置 Lazy 模式](http://101.43.49.28:9000/blog/Queues配置Lazy模式.png)

#### 代码配置 Lazy 模式

​	在利用 SpringAMQP 声明队列的时候，添加 x-queue-mod=lazy 参数也可设置队列为 Lazy 模式：

~~~java
@Bean
public Queue lazyQueue(){
    return QueueBuilder
        .durable("lazy.queue")
        .lazy() // 开启Lazy模式
        .build();
}
~~~

这里是通过 QueueBuilder 的 lazy() 函数配置 Lazy 模式，底层源码如下：

![lazy() 源码](http://101.43.49.28:9000/blog/lazy()源码.png)

当然，我们也可以基于注解来声明队列并设置为 Lazy 模式：

~~~java
@RabbitListener(queuesToDeclare = @Queue(
    name = "lazy.queue",
    durable = "true",
    arguments = @Argument(name = "x-queue-mode", value = "lazy")
))
public void listenLazyQueue(String msg){
    log.info("接收到 lazy.queue的消息：{}", msg);
}
~~~

#### 更新已有队列为 lazy 模式

对于已经存在的队列，也可以配置为 lazy 模式，但是要通过设置 policy 实现。 可以基于命令行设置 policy：

~~~bash
rabbitmqctl set_policy Lazy "^lazy-queue$" '{"queue-mode":"lazy"}' --apply-to queues
~~~

命令解读：

- rabbitmqctl：RabbitMQ 的命令行工具
- set_policy：添加一个策略
- Lazy：策略名称，可以自定义
- "^lazy-queue$"：用正则表达式匹配队列的名字
- '{"queue-mode":"lazy"}'：设置队列模式为lazy模式
- --apply-to queues：策略的作用对象，是所有的队列

当然，也可以在控制台配置 policy，进入在控制台的 Admin 页面，点击 Policies，即可添加配置：

![Admin 页面配置全部队列为 Lazy](http://101.43.49.28:9000/blog/Admin页面配置全部队列为Lazy.png)

## 惰性队列 VS 持久化队列

---

​	RabbitMQ 的惰性队列是指在队列中添加消息时会将其**暂存到磁盘**上，而不是保存在内存中。相反，持久化队列是指消息可以被保存在队列中并***在 RabbitMQ 服务重启时保留***。

​	惰性队列的主要优点在于它可以避免内存溢出和性能问题。当许多消息被添加到队列中时，若使用持久化队列，会占用大量的内存。但使用惰性队列时，消息在必要时被加载到 RAM 中，因而保证了高效的内存利用率。惰性队列适用于需要处理大量消息的极端情况，并且长时间运行，数据量增加的情况下，更适合使用。

​	持久化队列主要适用于需要**确保即使在 RabbitMQ 宕机或重启的情况下仍能找回的消息**。持久化队列将队列中的消息保存到磁盘上，因此可以确保消息不会丢失。**持久化队列适用于数据量小，特别是小型应用场景下使用**。

<center><font color='red'>总之，对于性能要求高的大型应用程序，可以考虑使用惰性队列；而对于小型应用程序，特别是需要保证消息的完整性和不可丢失性的应用程序，持久化队列更加适用。</font></center>

## 队列的销毁注意细节

---

1. 当队列被显式地删除时，队列将被销毁。
2. 当最后一个绑定队列的消费者关闭其通道/连接时，队列将被删除。 如果显式地将 queue.unused-queue-ttl 参数设置为非零值，则队列可能会在未使用一段时间后被自动删除。
3. 当 RabbitMQ 服务器重启时，非持久队列会被自动删除。
4. 如果将 x-expires 参数设置为非零值，则队列可能在未使用一段时间后被自动删除。
5. 如果队列被指定为具有自动删除属性，则队列将在完全消耗或关闭时自动删除。

​	**请注意，如果队列中未设置消息/元素计数，则即使队列未在消费者中使用过，也不会被自动删除。**
​	RabbitMQ 的非持久化队列在生产者和消费者断开连接后会被销毁。这是因为非持久化队列的生存期仅限于存在连接的时候。一旦所有消费者和生产者都断开连接，队列就会被删除。如果您需要在 RabbitMQ 断开连接后仍要使用队列，请创建一个持久化队列。持久化队列会将队列的元数据和消息保存在磁盘上，即使 RabbitMQ 重启或断电，也能保证数据不会丢失

## 消费者的可靠性

---

​	当 RabbitMQ 向消费者投递消息以后，需要知道消费者的处理状态如何。因为消息投递给消费者并不代表就一定被正确消费了，可能出现的故障有很多，比如：

- 消息投递的过程中出现了网络故障
- 消费者接收到消息后突然宕机
- 消费者接收到消息后，因处理不当导致异常

​	一旦发生上述情况，消息也会丢失。因此，RabbitMQ 必须知道消费者的处理状态，一旦消息处理失败才能重新投递消息。 

### 消费者确认机制

​	为了确认消费者是否成功处理消息，RabbitMQ 提供了**消费者确认机制**（**Consumer Acknowledgement**）。即：***当消费者处理消息结束后，应该向RabbitMQ 发送一个回执，告知 RabbitMQ 自己消息处理状态***。回执有三种可选值：

- **ack：**成功处理消息，RabbitMQ 从队列中删除该消息
- **nack：**消息处理失败，RabbitMQ 需要再次投递消息
- **reject：**消息处理失败并拒绝该消息，RabbitMQ 从队列中删除该消息

::: info

​	一般 reject 方式用的较少，除非是消息格式有问题，那就是开发问题了。因此大多数情况下我们需要将消息处理的代码通过 try catch 机制捕获，消息处理成功时返回 ack，处理失败时返回 nack。

:::

​	由于消息回执的处理代码比较统一，因此 SpringAMQP 帮我们实现了消息确认。并允许我们通过**配置文件**设置 ACK 处理方式，有三种模式：

- **none：**不处理。即消息投递给消费者后立刻 ack，消息会立刻从 MQ 删除。非常不安全，不建议使用
- **manual：**手动模式。需要自己在业务代码中调用 api，发送 ack 或 reject，存在业务入侵，但更灵活
- **auto：**
- 自动模式。SpringAMQP 利用 AOP 对我们的消息处理逻辑做了环绕增强，当业务正常执行时则自动返回 ack， 当业务出现异常时，根据异常判断返回不同结果：
  - 如果是**业务异常**，会自动返回 nack；
  - 如果是**消息处理或校验异常**，自动返回reject；

通过下面的配置可以修改 SpringAMQP 的 ACK 处理方式：

~~~yml
spring:
  rabbitmq:
    listener:
      simple:
        acknowledge-mode: none # 不做处理
~~~

修改 consumer 服务的 SpringRabbitListener 类中的方法，模拟一个消息处理的异常：

~~~java
@RabbitListener(queues = "simple.queue")
public void listenSimpleQueueMessage(String msg) throws InterruptedException {
    log.info("spring 消费者接收到消息：【" + msg + "】");
    if (true) {
        throw new MessageConversionException("故意的");
    }
    log.info("消息处理完成");
}
~~~

测试可以发现：当消息处理发生异常时，消息依然被 RabbitMQ 删除了。

我们再次把确认机制修改为 auto：

~~~yml
spring:
  rabbitmq:
    listener:
      simple:
        acknowledge-mode: auto # 自动ack
~~~

​	在异常位置打断点，再次发送消息，程序卡在断点时，可以发现此时消息状态为 unacked（未确定状态）：

![队列显示 unacked(未确定状态)](http://101.43.49.28:9000/blog/队列显示unacked(未确定状态).png)

​	放行以后，由于抛出的是**消息转换异常**，因此 Spring 会自动返回 reject，所以消息依然会被删除：

![队列消息被删除](http://101.43.49.28:9000/blog/队列消息被删除.png)

我们将异常改为**RuntimeException**类型：

~~~java
@RabbitListener(queues = "simple.queue")
public void listenSimpleQueueMessage(String msg) throws InterruptedException {
    log.info("spring 消费者接收到消息：【" + msg + "】");
    if (true) {
        throw new RuntimeException("故意的");
    }
    log.info("消息处理完成");
}
~~~

​	在异常位置打断点，然后再次发送消息测试，程序卡在断点时，可以发现此时消息状态为 unacked（未确定状态）：

![队列显示 unacked(未确定状态)](http://101.43.49.28:9000/blog/队列显示unacked(未确定状态).png)

​	放行以后，由于抛出的是业务异常，所以 Spring 返回 ack，最终消息恢复至 Ready 状态，并且没有被 RabbitMQ 删除：

![消息恢复至 Ready 状态](http://101.43.49.28:9000/blog/消息恢复至Ready状态.png)

​	当我们把配置改为 auto 时，消息处理失败后，会回到 RabbitMQ，并重新投递到消费者。

#### 消息应答策略的选择讨论

**自动应答（手动应答的好处是可以批量应答并且减少网络拥堵）**

​	消息发送后立即被认为已经传送成功，这种模式需要在高吞吐量和数据传输安全性方面做权衡,因为这种模式如果消息在接收到之前，消费者那边出现连接或者 channel 关闭，那么消息就丢失了,当然另一方面这种模式消费者那边可以传递过载的消息，没有对传递的消息数量进行限制，当然这样有可能使得消费者这边由于接收太多还来不及处理的消息，导致这些消息的积压，最终使得内存耗尽，最终这些消费者线程被操作系统杀死，所以这种模式仅适用在消费者可以高效并以 某种速率能够处理这些消息的情况下使用。（自动应答没有什么批量的概念，因为接收到就立马应答了，哪里会等到后边再一起应答）

::: info 

​	设置了自动应答后，消费者在接收到消息后就会立马自动应答，然后 rabbitMQ 就会立马将该消息从队列中删除，但是这是不安全的，**要知道，我们接收消息的目的还是使用消息，如果说在接收到消息后在时候消息的时候，由于报错等一系列因素导致的数据丢失了，那么我们就没有后悔的余地了，因为队列中的消息已经被删除。**所以说，<font color='red'>我们最好采用手动应答的方式</font>，在接收到消息，并处理了消息的流程的最后再进行手动应答，进行消息在队列中删除的过程，这样子哪怕在处理消息的过程中丢失了消息都能在队列中再拿一份出来

:::

### 失败重试机制

​	当消费者出现异常后，消息会不断 **requeue（重入队）**到队列，再重新发送给消费者。如果消费者再次执行依然出错，消息会再次 requeue 到队列，再次投递，直到消息处理成功为止。 极端情况就是消费者一直无法执行成功，那么消息 requeue 就会**无限循环**，导致 MQ 的消息处理飙升，带来不必要的压力：

​	当然，上述极端情况发生的概率还是非常低的，不过不怕一万就怕万一。为了应对上述情况 Spring 又提供了**消费者失败重试机制**：

::: info

**在消费者出现异常时利用本地重试，而不是无限制的 requeue 到 mq 队列。**

:::

修改 **consumer 服务**的 application.yml 文件，添加内容：

~~~yml
spring:
  rabbitmq:
    listener:
      simple:
        retry:
          enabled: true # 开启消费者失败重试
          initial-interval: 1000ms # 初识的失败等待时长为1秒
          multiplier: 1 # 失败的等待时长倍数，下次等待时长 = multiplier * last-interval
          max-attempts: 3 # 最大重试次数
          stateless: true # true无状态；false有状态。如果业务中包含事务，这里改为false
~~~

::: info 

​	<font color='red'>stateless 配置是</font> RabbitMQ 中一个重要的属性，用于定义消息的传递方式。当将队列和<font color='red'>交换机</font>配置为无状态时，它们不会在磁盘上持久化消息。这意味着，如果 RabbitMQ 服务被重启或崩溃，所有未处理的消息都会丢失。Stateless 配置适用于那些对消息持久性要求不高、可丢失的场景，例如临时数据的传递或不需要保留的日志信息等。<font color='red'>stateless</font> **为false便是不加持久化，这也是为什么说如果包含了事务就不需要考虑用持久化来确保数据的完整性。**

:::

重启 consumer 服务，重复之前的测试。可以发现：

- 消费者在失败后消息没有重新回到 MQ 无限重新投递，而是在本地重试了3次
- 本地重试3次以后，抛出了 AmqpRejectAndDontRequeueException 异常。查看 RabbitMQ 控制台，发现消息被删除了，说明最后 SpringAMQP 返回的是 <font color='red'>reject</font>

结论：

- **开启本地重试时，消息处理过程中抛出异常，不会 requeue 到队列，而是在消费者本地重试**
- **重试达到最大次数后，Spring 会返回 reject，消息会被丢弃** 

### 失败处理策略

​	在之前的测试中，本地测试达到最大重试次数后，消息会被丢弃。这在某些对于消息可靠性要求较高的业务场景下，显然不太合适了。 因此 Spring 允许我们自定义重试次数耗尽后的消息处理策略，这个策略是由 MessageRecovery 接口来定义的，它有3个不同实现：**（策略模式）**

- **RejectAndDontRequeueRecoverer：**重试耗尽后，直接 reject，丢弃消息。**默认就是这种方式**
- **ImmediateRequeueMessageRecoverer：**重试耗尽后，返回 nack，消息重新入队
- **RepublishMessageRecoverer：**重试耗尽后，将失败消息投递到指定的交换机

比较优雅的一种处理方案是 RepublishMessageRecoverer，失败后将消息投递到一个指定的，专门存放异常消息的队列，后续由人工集中处理。

1. 在 consumer 服务中定义处理失败消息的交换机和队列

   ~~~java
   @Bean
   public DirectExchange errorMessageExchange(){
       return new DirectExchange("error.direct");
   }
   @Bean
   public Queue errorQueue(){
       return new Queue("error.queue", true);
   }
   @Bean
   public Binding errorBinding(Queue errorQueue, DirectExchange errorMessageExchange){
       return BindingBuilder.bind(errorQueue).to(errorMessageExchange).with("error");
   }
   ~~~

2. 定义一个 RepublishMessageRecoverer，关联队列和交换机

   ~~~java
   @Bean
   public MessageRecoverer republishMessageRecoverer(RabbitTemplate rabbitTemplate){
       return new RepublishMessageRecoverer(rabbitTemplate, "error.direct", "error");
   }
   ~~~

完整代码如下：

~~~java
@Configuration
@ConditionalOnProperty(name = "spring.rabbitmq.listener.simple.retry.enabled", havingValue = "true")
public class ErrorMessageConfig {
    @Bean
    public DirectExchange errorMessageExchange(){
        return new DirectExchange("error.direct");
    }
    @Bean
    public Queue errorQueue(){
        return new Queue("error.queue", true);
    }
    @Bean
    public Binding errorBinding(Queue errorQueue, DirectExchange errorMessageExchange){
        return BindingBuilder.bind(errorQueue).to(errorMessageExchange).with("error");
    }

    @Bean
    public MessageRecoverer republishMessageRecoverer(RabbitTemplate rabbitTemplate){
        return new RepublishMessageRecoverer(rabbitTemplate, "error.direct", "error");
    }
}
~~~

### 业务幂等性

​	何为幂等性？ **幂等**是一个数学概念，用函数表达式来描述是这样的：f(x) = f(f(x))，例如求绝对值函数。 在程序开发中，则是指同一个业务，执行一次或多次对业务状态的影响是一致的。例如：

- 根据 id 删除数据
- 查询数据
- 新增数据

但数据的更新往往不是幂等的，如果重复执行可能造成不一样的后果。比如：

- 取消订单，恢复库存的业务。如果多次恢复就会出现库存重复增加的情况
- 退款业务。重复退款对商家而言会有经济损失。

​	所以，我们要尽可能避免业务被重复执行。 然而在实际业务场景中，由于意外经常会出现业务被重复执行的情况，例如：

- 页面卡顿时频繁刷新导致表单重复提交
- 服务间调用的重试
- MQ 消息的重复投递

​	我们在用户支付成功后会发送 MQ 消息到交易服务，修改订单状态为已支付，就可能出现消息重复投递的情况。如果消费判断，很有可能导致消息被消费多次，出现业务故障。举例：

1. 假如用户刚刚支付完成，并且投递消息到交易服务，交易服务更改订单为**已支付**状态。
2. 由于某种原因，例如网络故障导致生产者没有得到确认，隔了一段时间后**重新投递**给交易服务。
3. 但是，在新投递的消息被消费之前，用户选择了退款，将订单状态改为了**已退款**状态。
4. 退款完成后，新投递的消息才被消费，那么订单状态会被再次改为**已支付**。业务异常。

因此，我们必须想办法保证消息处理的幂等性。这里给出两种方案：

- 唯一消息 ID
- 业务状态判断

#### 唯一消息 ID

以下为思路：

1. 每一条消息都生成一个唯一的 id，与消息一起投递给消费者。
2. 消费者接收到消息后处理自己的业务，业务处理成功后将消息 ID 保存到数据库
3. 如果下次又收到相同消息，去数据库查询判断是否存在，存在则为重复消息放弃处理。

​	我们该如何给消息添加唯一 ID 呢？ 其实很简单，**SpringAMQP 的 MessageConverter 自带了 MessageID 的功能**，我们只要开启这个功能即可。

以 Jackson 的消息转换器为例：

~~~java
@Bean
public MessageConverter messageConverter(){
    // 1.定义消息转换器
    Jackson2JsonMessageConverter jjmc = new Jackson2JsonMessageConverter();
    // 2.配置自动创建消息id，用于识别不同消息，也可以在业务中基于ID判断是否是重复消息
    jjmc.setCreateMessageIds(true);
    return jjmc;
}
~~~

#### 业务判断

​	业务判断就是基于业务本身的逻辑或状态来判断是否是重复的请求或消息，不同的业务场景判断的思路也不一样。 例如我们当前案例中，处理消息的业务逻辑是把订单状态从未支付修改为已支付。因此我们就可以在执行业务时判断订单状态是否是未支付，如果不是则证明订单已经被处理过，无需重复处理。

相比较而言，消息 ID 的方案需要改造原有的数据库，所以我更推荐使用业务判断的方案。

以支付修改订单的业务为例，我们需要修改 OrderServiceImpl 中的 markOrderPaySuccess 方法：

~~~java
 @Override
    public void markOrderPaySuccess(Long orderId) {
        // 1.查询订单
        Order old = getById(orderId);
        // 2.判断订单状态
        if (old == null || old.getStatus() != 1) {
            // 订单不存在或者订单状态不是1，放弃处理
            return;
        }
        // 3.尝试更新订单
        Order order = new Order();
        order.setId(orderId);
        order.setStatus(2);
        order.setPayTime(LocalDateTime.now());
        updateById(order);
    }
~~~

上述代码逻辑上符合了幂等判断的需求，但是**由于判断和更新是两步动作，因此在极小概率下可能存在线程安全问题。**

我们可以合并上述操作为这样：

~~~java
@Override
public void markOrderPaySuccess(Long orderId) {
    // UPDATE `order` SET status = ? , pay_time = ? WHERE id = ? AND status = 1
    lambdaUpdate()
            .set(Order::getStatus, 2)
            .set(Order::getPayTime, LocalDateTime.now())
            .eq(Order::getId, orderId)
            .eq(Order::getStatus, 1)
            .update();
}
~~~

注意看，上述代码等同于这样的 SQL 语句：

~~~sql
UPDATE `order` SET status = ? , pay_time = ? WHERE id = ? AND status = 1
~~~

我们在 where 条件中除了判断 id 以外，还加上了 status 必须为1的条件。如果条件不符（说明订单已支付），则 SQL 匹配不到数据，根本不会执行。

### 兜底方案

​	虽然我们利用各种机制尽可能增加了消息的可靠性，但也不好说能保证消息100%的可靠。万一真的 MQ 通知失败该怎么办呢？ 有没有其它兜底方案，能够确保订单的支付状态一致呢？

其实思想很简单：既然 MQ 通知不一定发送到交易服务，那么交易服务就必须自己**主动去查询**支付状态。这样即便支付服务的 MQ 通知失败，我们依然能通过主动查询来保证订单状态的一致。 流程如下：

![兜底方案的流程](http://101.43.49.28:9000/blog/兜底方案的流程.png)

​	图中黄色线圈起来的部分就是 MQ 通知失败后的兜底处理方案，由交易服务自己主动去查询支付状态。

​	不过需要注意的是，交易服务并不知道用户会在什么时候支付，如果查询的时机不正确（比如查询的时候用户正在支付中），可能查询到的支付状态也不正确。 那么问题来了，我们到底该在什么时间主动查询支付状态呢？

​	这个时间是无法确定的，因此，通常我们采取的措施就是利用**定时任务**定期查询，例如每隔20秒就查询一次，并判断支付状态。如果发现订单已经支付，则立刻更新订单状态为已支付即可。 定时任务大家之前学习过，具体的实现这里就不再赘述了。

至此，消息可靠性的问题已经解决了。

综上，支付服务与交易服务之间的订单状态一致性是如何保证的？

- 首先，支付服务会正在用户支付成功以后利用 MQ 消息通知交易服务，完成订单状态同步。
- 其次，为了保证 MQ 消息的可靠性，我们采用了生产者确认机制、消费者确认、消费者失败重试等策略，确保消息投递的可靠性
- 最后，我们还在交易服务设置了定时任务，定期查询订单支付状态。这样即便 MQ 通知失败，还可以利用定时任务作为兜底方案，确保订单支付状态的最终一致性。

## 应答和发布的区别

---

::: info 

**应答功能属于消费者**，消费完消息告诉 RabbitMQ 已经消费成功。可以删了

**发布功能属于生产者**，生产消息到 RabbitMQ，RabbitMQ 需要告诉生产者是否收到消息。生产者根据该消息来进行考虑要不要再发一次还是怎么样

:::

​	其实二者并没有什么关联，应答是为了确保消息真正被用好了，确保传递过来的消息被删除前都是合理处理后再进行删除操作，与生产者无关，它只要管自己要的数据处理好就行；而发布是为了确保生产者自身的消息没有发送错误，确保生产者消息传输的安全性，它不用管消费者处理得怎么样，它只需要管自己的消息都发出去了。

## 备份交换机

​	有了 mandatory 参数和回退消息，我们获得了对无法投递消息的感知能力，有机会在生产者的消息无法被投递时发现并处理。但有时候，我们并不知道该如何处理这些无法路由的消息（将回退的消息的处理麻烦），最多打个日志，然后触发报警，再来手动处理。而通过日志来处理这些无法路由的消息是很不优雅的做法，特别是当生产者所在的服务有多台机器的时候，手动复制日志会更加麻烦而且容易出错。而且设置 mandatory 参数会增加生产者的复杂性（对备份消息的处理麻烦），需要添加处理这些被退回的消息的逻辑。如果既不想丢失消息，又不想增加生产者的复杂性，该怎么做呢？

​	前面在设置死信队列的文章中，我们提到，可以为队列设置死信交换机来存储那些处理失败的消息，可是这些不可路由消息根本没有机会进入到队列(因为进死信队列的前提是先进入队列中，再进行判断是否进入死信队列，你现在队列都进不了，何来死信队列的说法呢？)，因此无法使用死信队列来保存消息。 在 RabbitMQ 中，有一种备份交换机的机制存在，可以很好的应对这个问题。

### 备份交换机的定义

备份交换机可以理解为 RabbitMQ 中交换机的“备胎”

### 原理步骤

​	当我们为某一个交换机声明一个对应的备份交换机时，就是为它创建一个备胎，当交换机接收到一条不可路由消息时，将会把这条消息转发到备份交换机中，由备份交换机来进行转发和处理，通常备份交换机的类型为 Fanout ，这样就能把所有消息都投递到与其绑定的队列中，然后我们在备份交换机下绑定一个队列，这样所有那些原交换机无法被路由的消息，就会都进入这个队列了。当然，我们还可以建立一个报警队列，用独立的消费者来进行监测和报警。

![备份交换机的原理步骤](http://101.43.49.28:9000/blog/备份交换机的原理步骤.png)

​	当 RabbitMQ 发现一个消息无法被投递到目标队列时，它会将该消息发送到备份交换机。备份交换机是一种特殊的交换机，可以通过配置让 RabbitMQ 发送无法被路由的消息到指定的备份交换机。

::: info

​	Mandatory 参数与备份交换机可以一起使用的时候，如果两者同时开启，消息究竟何去何从？谁优先级高，经过上面结果显示答案是备份交换机优先级高。

:::

## 延迟消息

​	在电商的支付业务中，对于一些库存有限的商品，为了更好的用户体验，通常都会在用户下单时立刻扣减商品库存。例如电影院购票、高铁购票，下单后就会锁定座位资源，其他人无法重复购买。

​	但是这样就存在一个问题，假如用户下单后一直不付款，就会一直占有库存资源，导致其他客户无法正常交易，最终导致商户利益受损！

​	因此，电商中通常的做法就是：对于超过一定时间未支付的订单，应该立刻取消订单并释放占用的库存。

​	例如，订单支付超时时间为30分钟，则我们应该在用户下单后的第30分钟检查订单支付状态，如果发现未支付，应该立刻取消订单，释放库存。

但问题来了：如何才能准确的实现在下单后第30分钟去检查支付状态呢？

像这种在一段时间以后才执行的任务，我们称之为延迟任务，而要实现延迟任务，最简单的方案就是利用 MQ 的延迟消息了。

在 RabbitMQ 中实现延迟消息也有两种方案：

- 死信交换机+TTL
- 延迟消息插件

### 死信交换机

当一个队列中的消息满足下列情况之一时，可以成为死信（dead letter）：

- 消费者使用 basic.reject 或  basic.nack 声明消费失败，并且消息的 requeue 参数设置为 false
- 消息是一个过期消息，超时无人消费
- 要投递的队列消息满了，无法投递

​	如果一个队列中的消息已经成为死信，并且这个队列通过 dead-letter-exchange 属性指定了一个交换机，那么队列中的死信就会投递到这个交换机中，而这个交换机就称为死信交换机（Dead Letter Exchange）。而此时加入有队列与死信交换机绑定，则最终死信就会被投递到这个队列中。

死信交换机的作用如下：

1. 收集那些因处理失败而被拒绝的消息
2. 收集那些因队列满了而被拒绝的消息
3. 收集因 TTL（有效期）到期的消息

### 延迟消息

​	前面两种作用场景可以看做是把死信交换机当做一种消息处理的最终兜底方案，与消费者重试时讲的 RepublishMessageRecoverer 作用类似。

​	而最后一种场景，大家设想一下这样的场景： **如图，有一组绑定的交换机（ttl.fanout）和队列（ttl.queue）。但是ttl.queue没有消费者监听，而是设定了死信交换机 hmall.direct，而队列 direct.queue1 则与死信交换机绑定，RoutingKey 是 blue：**

![](http://101.43.49.28:9000/blog/延迟消息流程1.png)

​	假如我们现在发送一条消息到 ttl.fanout，RoutingKey为blue，并设置消息的**有效期**为5000毫秒：

![](http://101.43.49.28:9000/blog/延迟消息流程2.png)

注意：尽管这里的 ttl.fanout 不需要 RoutingKey，但是当消息变为死信并投递到死信交换机时，会沿用之前的 RoutingKey，这样 hmall.direct 才能正确路由消息。

​	消息肯定会被投递到 ttl.queue 之后，由于没有消费者，因此消息无人消费。5秒之后，消息的有效期到期，成为死信：

![](http://101.43.49.28:9000/blog/延迟消息流程3.png)

死信被再次投递到死信交换机 hmall.direct，并沿用之前的 RoutingKey，也就是 blue：

![](http://101.43.49.28:9000/blog/延迟消息流程4.png)

​	由于 direct.queue1 与 hmall.direct 绑定的 key 是 blue，因此最终消息被成功路由到 direct.queue1，如果此时有消费者与 direct.queue1 绑定， 也就能成功消费消息了。但此时已经是5秒钟以后了：

![](http://101.43.49.28:9000/blog/延迟消息流程5.png)

​	也就是说，publisher 发送了一条消息，但最终 consumer 在5秒后才收到消息。我们成功实现了**延迟消息**。  

### 总结

**注意：** RabbitMQ 的消息过期是基于追溯方式来实现的，也就是说当一个消息的 TTL 到期以后**不一定会立刻**被移除或投递到死信交换机，而是在消息恰好处于**队首**时才会被处理。 当队列中消息堆积很多的时候，过期消息可能不会被按时处理，因此你设置的 TTL 时间不一定准确。

## DelayEachange 插件

---

​	基于死信队列虽然可以实现延迟消息，但是太麻烦了。因此 RabbitMQ 社区提供了一个延迟消息插件来实现相同的效果。 官方文档说明：[Scheduling Messages with RabbitMQ | RabbitMQ - Blog](https://blog.rabbitmq.com/posts/2015/04/scheduling-messages-with-rabbitmq)

### 下载

​	插件下载地址：https://github.com/rabbitmq/rabbitmq-delayed-message-exchange 由于我们安装的 MQ 是 3.8 版本，因此这里下载 3.8.17 版本：

::: info 安装流程

1. 下载好对应版本的 DelayExchange 插件
2. 将插件移进 RabbitMQ 插件目录
3. 运行 rabbitmq-plugins enable rabbitmq_delayed_message_exchange 命令

:::

### 声明延迟交换机

基于注解方式：

~~~java
@RabbitListener(bindings = @QueueBinding(
    value = @Queue(name = "delay.queue", durable = "true"),
    exchange = @Exchange(name = "delay.direct", delayed = "true"),
    key = "delay"
))
public void listenDelayMessage(String msg){
    log.info("接收到delay.queue的延迟消息：{}", msg);
}
~~~

基于 @Bean 的方式：

~~~java
@Slf4j
@Configuration
public class DelayExchangeConfig {

    @Bean
    public DirectExchange delayExchange(){
        return ExchangeBuilder
            .directExchange("delay.direct") // 指定交换机类型和名称
            .delayed() // 设置delay的属性为true
            .durable(true) // 持久化
            .build();
    }

    @Bean
    public Queue delayedQueue(){
        return new Queue("delay.queue");
    }

    @Bean
    public Binding delayQueueBinding(){
        return BindingBuilder.bind(delayedQueue()).to(delayExchange()).with("delay");
    }
}
~~~

### 发送延迟消息

发送消息时，必须通过 x-delay 属性设定延迟时间：

~~~java
@Test
void testPublisherDelayMessage() {
    // 1.创建消息
    String message = "hello, delayed message";
    // 2.发送消息，利用消息后置处理器添加消息头
    rabbitTemplate.convertAndSend("delay.direct", "delay", message, new MessagePostProcessor() {
        @Override
        public Message postProcessMessage(Message message) throws AmqpException {
            // 添加延迟消息属性
            message.getMessageProperties().setDelay(5000);
            return message;
        }
    });
}
~~~

::: info 注意

​	延迟消息插件内部会维护一个本地数据库表，同时使用 Elang Timers 功能实现计时。如果消息的延迟时间设置较长，可能会导致堆积的延迟消息非常多，会带来较大的 CPU 开销，同时延迟消息的时间会存在误差。 因此，**不建议设置延迟时间过长的延迟消息**。

:::

## 优先级队列

---

### 使用场景

​	在我们系统中有一个订单催付的场景，我们的客户在天猫下的订单，淘宝会及时将订单推送给我们，如果在用户设定的时间内未付款那么就会给用户推送一条短信提醒，很简单的一个功能对吧。

​	但是，tmall 商家对我们来说，肯定是要分大客户和小客户的对吧，比如像苹果，小米这样大商家一年起码能给我们创造很大的利润，所以理应当然，他们的订单必须得到优先处理，而曾经我们的后端系统是使用 redis 来存放的定时轮询，大家都知道 redis 只能用 List 做一个简简单单的消息队列，并不能实现一个优先级的场景，所以订单量大了后采用 RabbitMQ 进行改造和优化，**如果发现是大客户的订单给一个相对比较高的消息优先级， 否则就是默认优先级**。

### 实现步骤

声明队列的时候添加优先级

设置队列的最大优先值，最大可以设置到255，官网推荐 1-10 如果设置太高比较吃内存和 CPU

![设置代码](http://101.43.49.28:9000/blog/设置代码.png)

::: info 注意事项

​	队列实现优先级需要做的事情有如下：队列需要设置为优先级队列，消息需要设置消息的优先级，消费者需要等待消息已经发送到队列中才去消费，因为这样才有机会对消息进行排序

:::

​	RabbitMQ 的优先级队列将消息的优先级与队列的优先级相结合，以确保高优先级的消息首先被处理。这样做的确切原因是，优先级队列的作用是**确保高优先级的消息在队列中具有更高的权重**，以便它们更快地被处理。如果只设置了消息的优先级，而没有为队列设置优先级，则消息可能会被放置在具有低优先级的队列中，从而导致高优先级的消息被延迟处理。因此，为队列设置优先级是允许正确的优先级排序的必要步骤。**（就是说，你如果想要设置优先级消息，那你只能在优先级队列中操作）**

**注意**：要等所有的消息都发到 MQ 队列中才能开放消费者获取消息，因为优先机队列的原理是见给所有的消息再 MQ 队列中进行排序，将优先级高的消息排序到队列的前端，这样子消费者以获取的就是队列最前的消息，也就是优先级最高的消息

## 订单状态同步问题

---

交易服务中利用延迟消息实现订单支付状态的同步。其大概思路如下：

![订单状态同步思路](http://101.43.49.28:9000/blog/订单状态同步思路.png)

​	假如订单超时支付时间为30分钟，理论上说我们应该在下单时发送一条延迟消息，延迟时间为30分钟。这样就可以在接收到消息时检验订单支付状态，关闭未支付订单。 但是大多数情况下用户支付都会在1分钟内完成，我们发送的消息却要在 MQ 中停留30分钟，额外消耗了 MQ 的资源。因此，我们最好多检测几次订单支付状态，而不是在最后第30分钟才检测。 例如：我们在用户下单后的第10秒、20秒、30秒、45秒、60秒、1分30秒、2分、...30分分别设置延迟消息，如果提前发现订单已经支付，则后续的检测取消即可。 这样就可以有效避免对 MQ 资源的浪费了。

**优化后的实现思路如下：**

![优化后的订单状态同步思路](http://101.43.49.28:9000/blog/优化后的订单状态同步思路.png)

​	由于我们要多次发送延迟消息，因此需要先定义一个记录消息延迟时间的消息体：

~~~java
@Data
public class MultiDelayMessage<T> {
    /**
     * 消息体
     */
    private T data;
    /**
     * 记录延迟时间的集合
     */
    private List<Long> delayMillis;

    public MultiDelayMessage(T data, List<Long> delayMillis) {
        this.data = data;
        this.delayMillis = delayMillis;
    }
    public static <T> MultiDelayMessage<T> of(T data, Long ... delayMillis){
        return new MultiDelayMessage<>(data, CollUtils.newArrayList(delayMillis));
    }

    /**
     * 获取并移除下一个延迟时间
     * @return 队列中的第一个延迟时间
     */
    public Long removeNextDelay(){
        return delayMillis.remove(0);
    }

    /**
     * 是否还有下一个延迟时间
     */
    public boolean hasNextDelay(){
        return !delayMillis.isEmpty();
    }
}
~~~

### 定义常量

在**消息发送模块**中定义一个常量类用于记录交换机、队列、RoutingKey 等常量：

~~~java
public interface MqConstants {
    String DELAY_EXCHANGE = "trade.delay.topic";
    String DELAY_ORDER_QUEUE = "trade.order.delay.queue";
    String DELAY_ORDER_ROUTING_KEY = "order.query";
}
~~~

### 抽取共享 MQ 配置

​	在**消息发送模块**中，我们将 mq 的配置抽取到 nacos 中，方便各个微服务共享配置。 在 nacos 中定义一个名为 shared-mq.xml 的配置文件，内容如下：

```yml
spring:
  rabbitmq:
    host: ${hm.mq.host:192.168.150.101} # 主机名
    port: ${hm.mq.port:5672} # 端口
    virtual-host: ${hm.mq.vhost:/hmall} # 虚拟主机
    username: ${hm.mq.un:hmall} # 用户名
    password: ${hm.mq.pw:123} # 密码
    listener:
      simple:
        prefetch: 1 # 每次只能获取一条消息，处理完成才能获取下一个消息
```

这里只添加一些基础配置，至于生产者确认，消费者确认配置则由微服务根据业务自己决定。

在需要的模块下添加共享配置：

![nacos 共享配置 rabbitmq](http://101.43.49.28:9000/blog/nacos共享配置rabbitmq.png)

### 下单业务

1. 在**消息发送模块**中引入依赖

   ~~~xml
    <!--amqp-->
     <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-amqp</artifactId>
     </dependency>
   ~~~

2. 在**消息发送模块**中添加消息发送的代码：

   ~~~java
   @Test
   void testPublisherDelayMessage() {
       try {
           MultiDelayMessage<Long> msg = MultiDelayMessage.of(order.getId(),
                                                              10000L, 10000L, 10000L, 10000L, 10000L, 10000L, 20000L, 20000L, 20000L,
                                                              60000L, 60000L, 60000L, 300000L, 600000L, 600000L);
           rabbitTemplate.convertAndSend(MqConstants.DELAY_EXCHANGE, MqConstants.DELAY_ORDER_ROUTING_KEY, msg);
       } catch (AmapException e) {
           log.error("消息发送异常", e);
       }
       return order.getId();
   }
   ~~~

### 编写查询支付状态接口

由于 MQ 消息处理时需要查询支付状态，因此我们要在**支付服务模块**定义一个这样的接口，并提供对应的 FeignClient. 首先，在 **api 模块**定义三个类：

- **PayOrderDTO**：支付单的数据传输实体
- **PayClient**：支付系统的 Feign 客户端
- **PayClientFallback**：支付系统的 fallback 逻辑

PayOrderDTO 代码如下：

~~~java
@Data
@ApiModel(description = "支付单数据传输实体")
public class PayOrderDTO {
    @ApiModelProperty("id")
    private Long id;
    @ApiModelProperty("业务订单号")
    private Long bizOrderNo;
    @ApiModelProperty("支付单号")
    private Long payOrderNo;
    @ApiModelProperty("支付用户id")
    private Long bizUserId;
    @ApiModelProperty("支付渠道编码")
    private String payChannelCode;
    @ApiModelProperty("支付金额，单位分")
    private Integer amount;
    @ApiModelProperty("付类型，1：h5,2:小程序，3：公众号，4：扫码，5：余额支付")
    private Integer payType;
    @ApiModelProperty("付状态，0：待提交，1:待支付，2：支付超时或取消，3：支付成功")
    private Integer status;
    @ApiModelProperty("拓展字段，用于传递不同渠道单独处理的字段")
    private String expandJson;
    @ApiModelProperty("第三方返回业务码")
    private String resultCode;
    @ApiModelProperty("第三方返回提示信息")
    private String resultMsg;
    @ApiModelProperty("支付成功时间")
    private LocalDateTime paySuccessTime;
    @ApiModelProperty("支付超时时间")
    private LocalDateTime payOverTime;
    @ApiModelProperty("支付二维码链接")
    private String qrCodeUrl;
    @ApiModelProperty("创建时间")
    private LocalDateTime createTime;
    @ApiModelProperty("更新时间")
    private LocalDateTime updateTime;
}
~~~

PayClient 代码如下：

~~~java
@FeignClient(value = "pay-service", fallbackFactory = PayClientFallback.class)
public interface PayClient {
    /**
     * 根据交易订单id查询支付单
     * @param id 业务订单id
     * @return 支付单信息
     */
    @GetMapping("/pay-orders/biz/{id}")
    PayOrderDTO queryPayOrderByBizOrderNo(@PathVariable("id") Long id);
}
~~~

PayClientFallback 代码如下：

~~~java
@Slf4j
public class PayClientFallback implements FallbackFactory<PayClient> {
    @Override
    public PayClient create(Throwable cause) {
        return new PayClient() {
            @Override
            public PayOrderDTO queryPayOrderByBizOrderNo(Long id) {
                return null;
            }
        };
    }
}
~~~

最后，在**支付服务模块**的 PayController 中实现该接口：

~~~java
@ApiOperation("根据id查询支付单")
@GetMapping("/biz/{id}")
public PayOrderDTO queryPayOrderByBizOrderNo(@PathVariable("id") Long id){
    PayOrder payOrder = payOrderService.lambdaQuery().eq(PayOrder::getBizOrderNo, id).one();
    return BeanUtils.copyBean(payOrder, PayOrderDTO.class);
}
~~~

### 消息监听

接下来，我们在**监听模块**下编写一个监听器，监听延迟消息，查询订单支付状态，代码如下：

~~~java
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderStatusListener {
 
    private final IOrderService orderService;
 
    private final PayClient payClient;
 
    private final RabbitTemplate rabbitTemplate;
 
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = MqConstants.DELAY_ORDER_QUEUE, durable = "true"),
            exchange = @Exchange(name = MqConstants.DELAY_EXCHANGE, type = ExchangeTypes.TOPIC),
            key = MqConstants.DELAY_ORDER_ROUTING_KEY
    ))
    public void listenOrderCheckDelayMessage(MultiDelayMessage<Long> msg) {
        // 1.获取消息中的订单id
        Long orderId = msg.getData();
        // 2.查询订单，判断状态：1是未支付，大于1则是已支付或已关闭
        Order order = orderService.getById(orderId);
        if (order == null || order.getStatus() > 1) {
            // 订单不存在或交易已经结束，放弃处理
            return;
        }
        // 3.可能是未支付，查询支付服务
        PayOrderDTO payOrder = payClient.queryPayOrderByBizOrderNo(orderId);
        if (payOrder != null && payOrder.getStatus() == 3) {
            // 支付成功，更新订单状态
            orderService.markOrderPaySuccess(orderId);
            return;
        }
        // 4.确定未支付，判断是否还有剩余延迟时间
        if (msg.hasNextDelay()) {
            // 4.1.有延迟时间，需要重发延迟消息，先获取延迟时间的int值
            int delayVal = msg.removeNextDelay().intValue();
            // 4.2.发送延迟消息
            rabbitTemplate.convertAndSend(MqConstants.DELAY_EXCHANGE, MqConstants.DELAY_ORDER_ROUTING_KEY, msg,
                    message -> {
                        message.getMessageProperties().setDelay(delayVal);
                        return message;
                    });
            return;
        }
        // 5.没有剩余延迟时间了，说明订单超时未支付，需要取消订单
        orderService.cancelOrder(orderId);
    }
}
~~~



