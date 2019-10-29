
module suncore {

    /**
     * 系统消息结构
     */
    export class Message {

        /**
         * 模块
         */
        mod: ModuleEnum;

        /**
         * 优先权
         */
        priority: MessagePriorityEnum;

        /**
         * 是否己激活
         */
        active: boolean;

        /**
         * 挂载的数据对象
         */
        data: ISocketData;

        /**
         * 挂载的任务
         */
        task: ITask;

        /**
         * 回调执行器
         */
        handler: suncom.IHandler;

        /**
         * 回调方法
         */
        method: Function;

        /**
         * 回调对象
         */
        caller: Object;

        /**
         * 超时时间
         */
        timeout: number;
    }
}