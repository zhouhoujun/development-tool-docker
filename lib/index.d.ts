import { ITask, ITaskConfig, IContextDefine, ITaskContext } from 'development-core';
export * from './DockerOption';
export declare class NodeContextDefine implements IContextDefine {
    getContext(config: ITaskConfig): ITaskContext;
    tasks(context: ITaskContext): Promise<ITask[]>;
}
