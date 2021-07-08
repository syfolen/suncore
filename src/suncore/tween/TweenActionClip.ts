
module suncore {
    /**
     * 缓动动作剪辑
     */
    export class TweenActionClip {
        /**
         * 属性名
         */
        prop: string = null;

        /**
         * 开始值
         */
        from: number = 0;

        /**
         * 目标值
         */
        to: number = 0;

        recover(): void {
            this.prop = null;
            this.from = 0;
            this.to = 0;
            suncom.Pool.recover("sunui.TweenActionClip", this);
        }

        static create(): TweenActionClip {
            return suncom.Pool.getItemByClass("sunui.TweenActionClip", TweenActionClip);
        }
    }
}