
module suncore {
    /**
     * 当前正在运行的服务集
     */
    export const var_mServices: suncom.KVString2Object<IService> = {};

    /**
     * 运行服务
     */
    export function runService(name: string, service: IService): void {
        if (this.var_mServices[name] === void 0) {
            this.var_mServices[name] = service;
            service.run();
        }
        else {
            suncom.Logger.warn(`suncore::服务己运行: ${name}`);
        }
    }

    /**
     * 停止服务
     */
    export function stopService(name: string): void {
        const service: IService = this.var_mServices[name] || null;
        if (service === null) {
            suncom.Logger.warn(`suncore::服务不存在: ${name}`);
        }
        else {
            delete this.var_mServices[name];
            service.stop();
        }
    }
}