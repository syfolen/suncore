/**
 * PureMVC Standard Framework for TypeScript - Copyright © 2012 Frederic Saunier
 * PureMVC Framework - Copyright © 2006-2012 Futurescale, Inc.
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of Futurescale, Inc., PureMVC.org, nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
declare module puremvc {
    /**
     * 命令接口，实现此接口的对象允许通过registerCommand注册
     */
    interface ICommand {

        /**
         * 命令执行接口
         */
        execute(...args: any[]): void;
    }

    /**
     * PureMVC外观类
     */
    class Facade {
        /**
         * 调试模式，为true时会输出日志，默认为: true
         */
        static DEBUG: boolean;

        /**
         * 单例
         */
        static inst: Facade;

        /**
         * 获取单例对象
         */
        static getInstance(): Facade;

        /**
         * 初始化MsgQ配置（优先于模型类）
         */
        protected $initMsgQ(): void;

        /**
         * 初始化模型类（优先于控制类）
         */
        protected $initializeModel(): void;

        /**
         * 初始化视图类
         */
        protected $initializeView(): void;

        /**
         * 初始化控制类（优先于视图类）
         */
        protected $initializeController(): void;

        /**
         * 为MMI层模块注册命令前缀
         * 说明：
         * 1. 只有通过此方法注册过的MsgQ模块才允许使用模型或视图接口
         */
        protected $regMMICmd(msgQMod: suncore.MsgQModEnum, prefix: string): void;

        /**
         * 注册MsgQ模块的命令前缀
         * 说明：
         * 1. 通过消息前缀来限制消息在模块内传递
         * 2. 每个模块仅允许注册一次
         */
        protected $regMsgQCmd(msgQMod: suncore.MsgQModEnum, prefix: string): void;

        /**
         * 注册监听
         * @receiveOnce: 是否为一次性监听，默认为: false
         * @priority: 响应优先级，值越大，优先级越高，默认为：suncom.EventPriorityEnum.MID
         * @args[]: 回调参数列表，默认为: null
         * 说明：
         * 1. 若需覆盖参数，请先调用removeObserver移除监听后再重新注册
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: suncom.EventPriorityEnum, args?: any[]): void;

        /**
         * 移除监听
         */
        removeObserver(name: string, method: Function, caller: Object): void;

        /**
         * 查询是否存在观察者
         * @method: 若为null，则只校验caller
         * @caller: 若为null，则只校验method
         */
        hasObserver(name: string, method: Function, caller?: Object): boolean;

        /**
         * 注册命令
         * @cls: 命令被响应时，会构建cls实例并执行其execute方法
         * @其余参数请参考registerObserver接口
         * 说明：
         * 1. 命令不可重复注册
         */
        registerCommand(name: string, cls: new () => ICommand, priority?: suncom.EventPriorityEnum, args?: any[]): void;

        /**
         * 移除命令
         */
        removeCommand(name: string): void;

        /**
         * 查询是否存在命令
         */
        hasCommand(name: string): boolean;

        /**
         * 注册数据代理类实例
         * 说明：
         * 1. 同一类型的实例不可重复注册
         */
        registerProxy(proxy: Proxy<any>): void;

        /**
         * 移除数据代理类实例
         */
        removeProxy(name: string): void;

        /**
         * 获取数据代理类实例
         * 说明：
         * 1. 若实例不存在，则会返回: null
         */
        retrieveProxy(name: string): Proxy<any>;

        /**
         * 查询是否存在数据代理类实例
         */
        hasProxy(name: string): boolean;

        /**
         * 注册视图中介者实例
         * 说明：
         * 1. 同一类型的实例不可重复注册
         */
        registerMediator(mediator: Mediator<any>): void;

        /**
         * 移除视图中介者实例
         */
        removeMediator(name: string): void;

        /**
         * 获取视图中介者实例
         * 说明：
         * 1. 若实例不存在，则会返回: null
         */
        retrieveMediator(name: string): Mediator<any>;

        /**
         * 查询是否存在视图中介者实例
         */
        hasMediator(name: string): boolean;

        /**
         * 派发通知
         * @data: 参数对象，允许为任意类型的数据，传递多个参数时可指定其为数组，若需要传递的data本身就是数组，则需要传递[data]
         * @cancelable: 通知是否允许被取消，默认为: true
         */
        sendNotification(name: string, data?: any, cancelable?: boolean): void;

        /**
         * 通知取消
         * 说明：
         * 1. 未响应的回调都将不再执行
         */
        notifyCancel(): void;
    }

    /**
     * 通知派发者
     */
    class Notifier {
        /**
         * 是否己销毁
         */
        protected $destroyed: boolean;

        constructor(msgQMod?: suncore.MsgQModEnum);

        /**
         * 销毁对象
         */
        destroy(): void;

        /**
         * 获取PureMVC外观引用
         */
        protected readonly facade: Facade;

        /**
         * 获取消息派发者MsgQ消息模块标识
         */
        readonly msgQMod: suncore.MsgQModEnum;

        /**
         * 是否己销毁
         */
        readonly destroyed: boolean;
    }

    /**
     * 数据代理类
     */
    class Proxy<T> extends Notifier {
        /**
         * 数据模型，未初始化时值为：void 0
         */
        protected $data: T;

        constructor(name: string, data?: T);

        /**
         * 注册回调（此时己注册）
         */
        onRegister(): void;

        /**
         * 移除回调（此时己移除）
         */
        onRemove(): void;

        /**
         * 获取数据模型
         */
        getData(): T;

        /**
         * 指定数据模型
         */
        setData(data: T): void;
    }

    /**
     * 简易命令
     */
    abstract class SimpleCommand extends Notifier implements ICommand {

        abstract execute(...args: any[]): void;
    }

    /**
     * 复合命令
     */
    abstract class MacroCommand extends Notifier implements ICommand {

        /**
         * 初始化复合命令
         * 说明：
         * 1. 一个复合命令通常由多个简易命令组成
         */
        protected abstract $initializeMacroCommand(): void;

        /**
         * 添加子命令
         * 说明：
         * 1. 当复合命令被执行时，子命令将按照被添加的顺序先后执行
         */
        protected $addSubCommand(cls: new () => ICommand): void;

        execute(): void;
    }

    /**
     * 视图中介者
     */
    class Mediator<T> extends Notifier {
        /**
         * 视图组件实例，未初始化时值为：null
         */
        protected $viewComponent: T;

        constructor(name: string, viewComponent?: T);

        /**
         * 指定通知处理函数，接口说明请参考: Facade.registerObserver
         */
        protected $handleNotification(name: string, method: Function, priority?: suncom.EventPriorityEnum, args?: any[]): void;

        /**
         * 列举感兴趣的通知
         */
        listNotificationInterests(): void;

        /**
         * 注册回调（此时己注册）
         */
        onRegister(): void;

        /**
         * 移除回调（此时己移除）
         */
        onRemove(): void;

        /**
         * 获取视图组件实例
         */
        getViewComponent(): T;

        /**
         * 指定视图组件实例
         */
        setViewComponent(view: T): void;
    }

    /**
     * 互斥锁，用于实现模块之间的消息互斥
     */
    namespace MutexLocker {

        /**
         * 备份快照，并锁定target指定的模块
         */
        function backup(target: Object): void;

        /**
         * 恢复快照中的数据（自动从上次备份的快照中获取）
         */
        function restore(): void;
    }

}