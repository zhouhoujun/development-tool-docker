import { IDynamicTaskOption, IDynamicTasks, ITaskContext } from 'development-core';
export interface ServiceInfo {
    images: string[];
    service: string;
    user: string;
    psw: string;
}
export declare class NodeDynamicTasks implements IDynamicTasks {
    private publishImages;
    private _info;
    protected getServiceInfo(ctx: ITaskContext): ServiceInfo;
    tasks(): IDynamicTaskOption[];
}
