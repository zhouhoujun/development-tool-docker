
import * as _ from 'lodash';
// import * as path from 'path';
import { IDynamicTaskOption, Operation, IDynamicTasks, dynamicTask, ITaskContext } from 'development-core';
// import * as chalk from 'chalk';
import { DockerOption } from '../DockerOption';


export interface ServiceInfo {
    images: string[];
    service: string;
    user: string;
    psw: string;
}

@dynamicTask
export class NodeDynamicTasks implements IDynamicTasks {
    private publishImages = [];

    private _info: ServiceInfo;
    protected getServiceInfo(ctx: ITaskContext) {
        if (!this._info) {
            let option = ctx.option as DockerOption;
            let imgs = ctx.toSrc(option.images);
            this._info = <ServiceInfo>{
                images: _.isArray(imgs) ? imgs : [imgs],
                service: ctx.env.publish || ctx.toStr(option.service),
                user: ctx.env['user'] || ctx.toStr(option.user),
                psw: ctx.env['psw'] || ctx.toStr(option.psw),
            };
        }
        return this._info;
    }

    tasks(): IDynamicTaskOption[] {
        return [
            {
                name: 'build-docker',
                oper: Operation.deploy,
                shell: (ctx) => {
                    let cmds = '';
                    let dist = ctx.toUrl(ctx.getRootPath());
                    if (/^[C-Z]:/.test(dist)) {
                        cmds = _.first(dist.split(':')) + ': & ';
                    }
                    cmds = cmds + 'cd ' + dist + ' & docker-compose build';
                    return cmds;
                }

            },

            {

                name: 'tag-docker',
                oper: Operation.deploy,
                shell: (ctx) => {
                    let info = this.getServiceInfo(ctx);
                    let cmds = '';
                    _.each(info.images, it => {
                        let pimg = `${info.service}/${it}`;
                        this.publishImages.push(pimg);
                        cmds = cmds + `docker tag ${it} ${pimg} & `
                    });

                    cmds = cmds.substring(0, cmds.lastIndexOf('&'));
                    return cmds;
                }
            },
            {
                name: 'push-docker',
                oper: Operation.deploy,
                shell: (ctx) => {
                    let info = this.getServiceInfo(ctx);
                    return _.map(this.publishImages, mg => info.user ? `docker login -u ${info.user} -p ${info.psw} ${info.service} & docker push ${mg}` : `docker push ${mg}`);
                }
            }
        ];
    }
}
