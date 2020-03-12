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
     * 控制器接口
     */
    interface IController {
    }

    /**
     * 外观类接口
     */
    interface IFacade {

        /**
         * 注册观察者
         * @receiveOnce: 是否只响应一次，默认为：false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为：1
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number): IObserver;

        /**
         * 移除观察者
         */
        removeObserver(name: string, method: Function, caller: Object): void;

        /**
         * 查询是否存在观察者
         */
        hasObserver(name: string, method: Function, caller: Object): boolean;

        /**
         * 注册命令
         */
        registerCommand(name: string, cls: new () => ICommand): void;

        /**
         * 移除命令
         */
        removeCommand(name: string): void;

        /**
         * 查询是否存在指定命令
         */
        hasCommand(name: string): boolean;

        /**
         * 注册模型代理
         */
        registerProxy(proxy: IProxy): void;

        /**
         * 移除模型代理
         */
        removeProxy(name: string): void;

        /**
         * 获取模型代理
         */
        retrieveProxy(name: string): IProxy;

        /**
         * 查询是否存在指定模型代理
         */
        hasProxy(name: string): boolean;

        /**
         * 注册视图中介者对象
         */
        registerMediator(mediator: IMediator): void;

        /**
         * 移除视图中介者对象
         */
        removeMediator(name: string): void;

        /**
         * 获取视图中介者对象
         */
        retrieveMediator(name: string): IMediator;

        /**
         * 查询是否存在指定视图中介者对象
         */
        hasMediator(name: string): boolean;

        /**
         * 派发命令通知
         * @cancelable: 事件是否允许取消，默认为：false
         */
        sendNotification(name: string, args?: any, cancelable?: boolean): void;

        /**
         * 取消当前命令的派发
         */
        notifyCancel(): void;
    }

    /**
     * 消息派发者接口
     */
    interface INotifier {
        /**
         * MsgQ消息模块标识，默认为MMI
         */
        readonly msgQMod: suncore.MsgQModEnum;
    }

    /**
     * 观察者对象接口
     */
    interface IObserver {
    }

    /**
     * 数据代理类接口
     */
    interface IProxy extends INotifier {

        /**
         * 注册回调（此时己注册）
         */
        onRegister(): void;

        /**
         * 移除回调（此时己移除）
         */
        onRemove(): void;
    }

    /**
     * 视图类接口
     */
    interface IView {
    }

    /**
     * 命令接口
     */
    interface ICommand extends INotifier {

        /**
         * 执行接口
         */
        execute(...args: Array<any>): void;
    }

    /**
     * 视图中介者对象接口
     */
    interface IMediator extends INotifier {

        /**
         * 注册回调（此时己注册）
         */
        onRegister(): void;

        /**
         * 移除回调（此时己移除）
         */
        onRemove(): void;

        /**
         * 获取视图对象
         */
        getViewComponent(): any;

        /**
         * 注册感兴趣的事件列表
         */
        listNotificationInterests(): void;
    }

    /**
     * 控制类（命令集合）
     */
    class Controller implements IController {

        static inst: IController;
    }

    /**
     * 外观类
     */
    class Facade implements IFacade {

        static inst: IFacade;

        static getInstance(): IFacade;

        /**
         * 初始化MsgQ模块数据
         */
        protected $initMsgQ(): void;

        /**
         * 初始化模型集合
         */
        protected $initializeModel(): void;

        /**
         * 初始化视图集合
         */
        protected $initializeView(): void;

        /**
         * 初始化控制器集合
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
         */
        protected $regMsgQCmd(msgQMod: suncore.MsgQModEnum, prefix: string): void;

        /**
         * 注册观察者
         * @receiveOnce: 是否只响应一次，默认为：false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为：1
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number): IObserver;

        /**
         * 移除观察者
         */
        removeObserver(name: string, method: Function, caller: Object): void;

        /**
         * 查询是否存在观察者
         */
        hasObserver(name: string, method: Function, caller: Object): boolean;

        /**
         * 注册命令
         */
        registerCommand(name: string, cls: new () => ICommand): void;

        /**
         * 移除命令
         */
        removeCommand(name: string): void;

        /**
         * 查询是否存在指定命令
         */
        hasCommand(name: string): boolean;

        /**
         * 注册模型代理
         */
        registerProxy(proxy: IProxy): void;

        /**
         * 移除模型代理
         */
        removeProxy(name: string): void;

        /**
         * 获取模型代理
         */
        retrieveProxy(name: string): IProxy;

        /**
         * 查询是否存在指定模型代理
         */
        hasProxy(name: string): boolean;

        /**
         * 注册视图中介者对象
         */
        registerMediator(mediator: IMediator): void;

        /**
         * 移除视图中介者对象
         */
        removeMediator(name: string): void;

        /**
         * 获取视图中介者对象
         */
        retrieveMediator(name: string): IMediator;

        /**
         * 查询是否存在指定视图中介者对象
         */
        hasMediator(name: string): boolean;

        /**
         * 派发命令通知
         * @cancelable: 事件是否允许取消，默认为：false
         */
        sendNotification(name: string, args?: any, cancelable?: boolean): void;

        /**
         * 取消当前命令的派发
         */
        notifyCancel(): void;
    }

    /**
     * 消息派发者
     */
    class Notifier implements INotifier {

        constructor(msgQMod?: suncore.MsgQModEnum);

        /**
         * 获取PureMVC外观引用
         */
        protected readonly facade: IFacade;

        /**
         * 获取消息派发者MsgQ消息模块标识
         */
        readonly msgQMod: suncore.MsgQModEnum;
    }

    /**
     * 数据代理类
     */
    class Proxy extends Notifier implements IProxy {
        /**
         * 代理所持有的数据
         */
        protected $data: any;

        constructor(name: string, data?: any);

        /**
         * 注册回调（此时己注册）
         */
        onRegister(): void;

        /**
         * 移除回调（此时己移除）
         */
        onRemove(): void;
    }

    /**
     * 简单命令抽象类
     */
    abstract class SimpleCommand extends Notifier implements ICommand {

        /**
         * 执行接口
         */
        abstract execute(...args: Array<any>): void;
    }

    /**
     * 视图类（视图集合）
     */
    class View implements IView {

        static inst: IView;
    }

    /**
     * 复合命令抽象类
     */
    abstract class MacroCommand extends Notifier implements ICommand {

        /**
         * 初始化复合命令
         */
        abstract initializeMacroCommand(): void;

        /**
         * 添加子命令
         */
        addSubCommand(cls: new () => ICommand): void;

        /**
         * 执行复合命令
         */
        execute(): void;
    }

    /**
     * 视图中介者对象
     */
    class Mediator extends Notifier implements IMediator {
        /**
         * 视图对象
         */
        protected $viewComponent: any;

        constructor(name: string, viewComponent?: any);

        /**
         * 注册回调（此时己注册）
         */
        onRegister(): void;

        /**
         * 移除回调（此时己移除）
         */
        onRemove(): void;

        /**
         * 获取视图对象
         */
        getViewComponent(): any;

        /**
         * 注册感兴趣的事件列表
         */
        listNotificationInterests(): void;

        /**
         * 注册事件回调
         */
        protected $handleNotification(name: string, method: Function): void;
    }
}