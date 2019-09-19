
module suncore {

    /**
     * 命令枚举
     */
    export abstract class NotifyKey {
        // 系统命令
        static readonly STARTUP: string = "suncore.NotifyKey.STARTUP";
        static readonly SHUTDOWN: string = "suncore.NotifyKey.SHUTDOWN";

        static readonly FRAME_ENTER: string = "suncore.NotifyKey.FRAME_ENTER";
        static readonly FRAME_LATER: string = "suncore.NotifyKey.FRAME_LATER";

        // 时间轴命令
        static readonly CREATE_TIMELINE: string = "suncore.NotifyKey.CREATE_TIMELINE";
        static readonly REMOVE_TIMELINE: string = "suncore.NotifyKey.REMOVE_TIMELINE";
        static readonly TIMELINE_STOPPED: string = "suncore.NotifyKey.TIMELINE_STOPPED";
        static readonly TIMESTAMP_STOPPED: string = "suncore.NotifyKey.TIMESTAMP_STOPPED";
    }
}