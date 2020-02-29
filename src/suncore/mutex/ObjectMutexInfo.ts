
module suncore {
    /**
     * 对象互斥信息
     */
    export class ObjectMutexInfo {
        /**
         * MsgQ模块信息栈
         */
        private $msgQModStack: MsgQModEnum[] = [];

        /**
         * 当前锁定的模块列表
         */
        private $curMsgQMod: MsgQModEnum;
    }
}