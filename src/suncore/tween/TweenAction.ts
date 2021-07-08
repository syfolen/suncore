
module suncore {
    /**
     * 缓动动作类
     */
    export class TweenAction {
        /**
         * 缓动函数
         */
        ease: Function = null;

        /**
         * 动作列表
         */
        clips: TweenActionClip[] = [];

        /**
         * 更新回调
         */
        update: suncom.IHandler = null;

        /**
         * 结束回调
         */
        complete: suncom.IHandler = null;

        /**
         * 开始时间
         */
        time: number = 0;

        /**
         * 缓动时间
         */
        duration: number = 0;

        recover(): void {
            this.ease = null;
            while (this.clips.length > 0) {
                this.clips.pop().recover();
            }
            this.update = null;
            this.complete = null;
            this.time = 0;
            this.duration = 0;
            suncom.Pool.recover("sunui.TweenAction", this);
        }

        static create(): TweenAction {
            return suncom.Pool.getItemByClass("sunui.TweenAction", TweenAction);
        }
    }
}