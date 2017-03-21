/// <reference types="mocha" />
import * as _ from 'lodash';
import { ITask, ITaskConfig, bindingConfig, IContextDefine, ITaskContext, taskdefine } from 'development-core';

export * from './DockerOption';

import { NodeDynamicTasks } from './tasks/PublishTask';

@taskdefine
export class NodeContextDefine implements IContextDefine {

    getContext(config: ITaskConfig): ITaskContext {
        return bindingConfig(config);
    }

    tasks(context: ITaskContext): Promise<ITask[]> {
        return context.findTasks(NodeDynamicTasks)
    }
}
