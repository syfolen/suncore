
module suncore {
    /**
     * 命令枚举
     * export
     */
    export abstract class NotifyKey {
        /**
         * export
         */
        static readonly STARTUP: string = "suncore.NotifyKey.STARTUP";

        /**
         * depends
         */
        static readonly SHUTDOWN: string = "suncore.NotifyKey.SHUTDOWN";

        /**
         * export
         */
        static readonly START_TIMELINE: string = "suncore.NotifyKey.START_TIMELINE";

        /**
         * depends
         */
        static readonly PAUSE_TIMELINE: string = "suncore.NotifyKey.PAUSE_TIMELINE";

        /**
         * export
         */
        static readonly PHYSICS_FRAME: string = "suncore.NotifyKey.PHYSICS_FRAME";

        /**
         * depends
         */
        static readonly PHYSICS_PREPARE: string = "suncore.NotifyKey.PHYSICS_PREPARE";

        /**
         * export
         */
        static readonly ENTER_FRAME: string = "suncore.NotifyKey.ENTER_FRAME";

        /**
         * depends
         */
        static readonly LATER_FRAME: string = "suncore.NotifyKey.LATER_FRAME";

        /**
         * MsgQ业务
         */
        static readonly MSG_Q_BUSINESS: string = "suncore.NotifyKey.MSG_Q_BUSINESS";
    }
}