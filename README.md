# suncore

## 这是客户端游戏的时间轴机制

## 主要接口定义在System类中，另外可参考ModuleEnum和MessagePriorityEnum的说明

## 除了System，另外常用的接口应当是SimpleTask和AbstractTask

## 使用前请先注册CREATE_TIMELINE和REMOVE_TIMELINE命令，然后派发CREATE_TIMELINE命令来初始化系统

## 具体请参考TestClass


### 实现说明

#### Engine.ts

* 该类为此框架底层驱动类，理论上建议整个项目中只有这个类拥有 update() 方法，如此将使游戏中的循环变得可控。

* 若有其它类需要执行帧回调，请侦听 suncore.NotifyKey.ENTER_FRAME 事件。此事件的存在可令帧循环在不需要的时候进行移除，以减少不必要的开销

#### TimeStamp 与 Timeline 模块

* 这两个类都是框架的自定义时间轴，TimeStamp属于场景时间轴，Timeline属于游戏时间轴。

* TimeStamp 的时间在场景加载完成之后开始流逝，在场景退出之前停止流逝。

* Timeline 的时间在游戏开始之后开始流逝，在游戏暂停或停止时停止流逝。此时间轴主要由游戏开发者自己根据实际开发需求进行开启和关闭。

* TimeStamp 与 Timeline 相互独立互不影响，如游戏暂停时，场景时间依然会进行流逝。

* 故框架中存在三个时间戳：

  * 系统时间戳，获取方法为 suncore.System.engine.getTime(); 此时间轴在整个项目运行期间永远不会停止。
  * 场景时间戳，获取方法为 suncore.System.timeStamp.getTime(); 此时间轴在场景切换时停止
  * 游戏时间戳，获取方法为 suncore.System.timeline.getTime(); 此时间轴只在游戏暂停时亦会停止。

* 基于三个不同的时间轴，可以实现消息、逻辑及定时器的不同挂靠方式，从而从而使某些特殊的需求的实现变得简单，例如：

  * 当用户选择暂停游戏时，场景控件中的逻辑可依赖于场景时间轴的时间差实现功能，一定时间之后，游戏继续时，游戏内的组件不会因为游戏的暂停带来的时间变动而产生异常，因为那段时间的游戏时间轴也是暂停的。
  * 若有系统事件发生，比如断网等，此时可能场景和游戏的时间轴都需要暂停，而重连倒计时则需要继续工作，此时则可以创建依赖于系统时间轴的定时器，来完成重连工作，当重连完成时，可继续场景和游戏的时间轴，使逻辑继续执行而避免因掉线时间产生异常。

* Timeline 亦可开启帧同步模式，用于基于帧同步技术的客户端逻辑开发，但由于工作中并未有接触需要帧同步的项目，故此处只作了部分预留。

#### 定时器

* 基于 TimeStamp 和 Timeline 的设计思想，故框架弃用了引擎的定时器，实现了自己的定时器，使用接口请参考 common 模块中的 System 文件

* 这个定时器会使你觉得在实际开发中使用起来更加方便，可控性也会更好。

#### 消息机制

* 此处的消息为Message而非MVC中的Notification，Message为框架消息，Message的执行基于Laya的frameLoop()函数来实现，合理的使用消息并为消息指定不同的消息类型将使优化游戏的工作变得更为容易。

* 需要说明的事，消息的处理实际上是依赖于三条不同的时间轴，故你可以将系统、场景及游戏中的逻辑以不同的类型进行划分，并分别挂靠至各自的消息队列中，由于消息回调中亦可能产生新的消息，回调地狱不可避免，所以极有可能由于某个消息引起过量的回调导致队列中消息数量膨胀过度，此时若还是继续处理消息，则很可能使这一帧需要消耗几百毫秒甚至几秒的时间来处理逻辑，导致游戏出现非常严重的卡顿，为了避免这种情况的发生，故所有新的消息将会进入一个临时队列，在正式队列中的所有消息处理完毕之后，再对临时队列中的消息进行处理，然后将它们全部放入下一帧来执行，保证游戏的连贯性。

* 按照游戏实际需求的不同，将消息分为不同的类型，典型的代表类型如下：

  * PRIORITY_0：主要用于处理逻辑，如超大地图寻路算法或复杂AI逻辑拆分后的片断算法。
  * PRIORITY_HIGH：Image、Label等小组件的创建，每帧十个不会消耗太多性能
  * PRIORITY_NOR：复杂的自定义组件的创建。
  * PRIORITY_LOW：复杂的特效或动画创建逻辑，每帧一个保证不会引起游戏卡顿。
  * PRIORITY_LAZY：特殊的消息类型，满足一些特殊的需求，如：消消乐中，水果的掉落逻辑，可定义为类型。它将在所有验证、爆炸、消除等动作完成之后才会执行；另外如场景的加载和初始化，应当在场景中的所有其它对象及这些对象初始化过程中即时产生的依赖对象亦初始化完毕之后，再进行加载，亦可将场景的加载消息定义为此类型的消息，使之最后执行。
  * PRIORITY_TASK：用于实现有序的，且持续的任务队列，如游戏的启动，场景的切换等等。
  * 其它消息类型请参考 $ suncore/message/MessagePriorityEnum.ts

* 请合理使用消息及消息类型来优化你的游戏逻辑。

#### Task

* Task是特殊的消息类型，常规消息通常以suncom.IHandler作为回调函数，在消息产生回调时立即完成，而Task则不同。

* Task消息往往并不能在当前帧完成，它采用标记的方式，允许任务在一定时间之后或特定的条件完成时，将标记done置为true的方式来终结任务，所以Task类型的消息往往可以形成一个任务队列，用于完成复杂的逻辑

* 常见的Task应用场景包括如复杂的场景加载和初始化，音效和预置组件的批量加载与销毁，或一些有先后顺序的自定义的任务等等。

* 常见的Task类型见目录 $ suncore/task

