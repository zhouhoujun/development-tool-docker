import { ITask, IContextDefine, ITaskContext } from 'development-core';
export * from './DockerOption';
export declare class NodeContextDefine implements IContextDefine {
    tasks(context: ITaskContext): Promise<ITask[]>;
}
