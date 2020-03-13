# suncore

## 核心库，封装了客户端时间轴机制，模块通讯机制等

***

## 常用特性列举

#### System 提供了时间轴的使用接口，主要有：

* 获取指定模块的时间戳与帧时间间隔

* 添加指定模块的各种类型消息

* 添加或移除指定模块的定时器

* 支持不同分组的任务并发执行，且支持任务的取消

* 更多请参考 Sytem 和 ModuleEnum 和 MessagePriorityEnum 的说明

#### MsgQ 提供了模块通讯机制

* 模块消息发送接口：MsgQ.send

* 模块消息获取接口：MsgQService.$dealMsgQMsg

* 更多请参考 MsgQ 和 MsgQService 和 Mutex 的说明

#### 其它接口请参考 NotifyKey 中的消息说明

***

## 一些罗里吧嗦的话

#### 关于 ModuleEnum 与 Message 机制（消息机制）

* 消息机制主要用于处理表现层中的业务，如场景构建、资源的加载等等

* 消息机制主要依赖于 Timeline 的实现，即游戏时间轴

* 当时间轴被停止时，无论是消息，还是定时器，都将自动被停止或注销

* 请注意，除了Task之外，其它类型的消息是不可取消的

* 范例：目前 sunui 中的场景跳转机制是基于 Message 实现的

#### 关于 MsgQ 的模块化机制

* MsgQ 是在 puremvc-suncore 框架下工作的，主要设计目的是彻底分离逻辑层和表现层

* MsgQ 允许你的项目被分为不同的模块，当 MsgQ 机制被启用时

  * MsgQ 将限制 puremvc 的 sendNotification 仅允许在模块内进行通讯
  
  * MsgQ 将限制 Notifier 或 Object 对象仅允许监听自己模块的消息

  * MsgQ 将限制 puremvc.Mediator 和 puremvc.Proxy 相关的接口仅允许在 MMI 层被访问

  * MsgQ 提供了 MsgQ.send 方法来支持模块间的通讯

* MsgQ 对 puremvc 的消息传递和监听限制是在 Mutex 和 MutexLocker 中实现的

* MsgQ 机制默认是关闭的，如想开启请重写 Facade 的 $initMsgQ 方法并通过 $regMsgQCmd 来注册模块命令

* 在发布项目时，建议关闭 MsgQ 机制

* 范例：sunnet 中有 MsgQ 的使用范例