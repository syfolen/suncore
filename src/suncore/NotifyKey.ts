
module suncore {

    /**
     * 命令枚举
     */
    export abstract class NotifyKey {
        // 系统命令
        static readonly STARTUP: string = "suncore.NotifyKey.STARTUP";
        static readonly SHUTDOWN: string = "suncore.NotifyKey.SHUTDOWN";

        static readonly PHYSICS_FRAME: string = "suncore.NotifyKey.PHYSICS_FRAME";
        static readonly PHYSICS_PREPARE: string = "suncore.NotifyKey.PHYSICS_PREPARE";

        static readonly ENTER_FRAME: string = "suncore.NotifyKey.ENTER_FRAME";
        static readonly LATER_FRAME: string = "suncore.NotifyKey.LATER_FRAME";

        // 时间轴命令
        static readonly CREATE_TIMELINE: string = "suncore.NotifyKey.CREATE_TIMELINE";
        static readonly REMOVE_TIMELINE: string = "suncore.NotifyKey.REMOVE_TIMELINE";
        static readonly TIMELINE_STOPPED: string = "suncore.NotifyKey.TIMELINE_STOPPED";
        static readonly TIMESTAMP_STOPPED: string = "suncore.NotifyKey.TIMESTAMP_STOPPED";
    }
}