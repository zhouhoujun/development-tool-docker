
import * as _ from 'lodash';
// import * as path from 'path';
import { IDynamicTaskOption, IDynamicTasks, dynamicTask, ITaskContext } from 'development-core';
// import * as chalk from 'chalk';
import { DockerOption } from '../DockerOption';
const replace = require('gulp-replace');

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
                shell: (ctx) => {
                    let cmds = '';
                    let dist = ctx.toUrl(ctx.getRootPath());
                    let option = ctx.option as DockerOption;
                    let buildcmd = ctx.toStr(option.buildcmd) || 'docker-compose down & docker-compose build';
                    if (/^[C-Z]:/.test(dist)) {
                        cmds = _.first(dist.split(':')) + ': & ';
                    }
                    cmds = cmds + `cd ${dist} & ${buildcmd}`;
                    return cmds;
                }

            },
            {
                name: 'tag-docker',
                shell: (ctx) => {
                    let info = this.getServiceInfo(ctx);
                    let cmds = '';

                    let option = ctx.option as DockerOption;
                    let version = '';
                    if (option.version) {
                        version = ctx.toStr(option.version);
                    } else {
                        let pkg = ctx.getPackage();
                        if (pkg) {
                            version = pkg.version;
                        }
                    }
                    version = version || 'latest';

                    _.each(info.images, it => {
                        let pimg = info.service ? `${info.service}/${it}:${version}` : `${it}:${version}`;
                        this.publishImages.push(pimg);
                        cmds = cmds + `docker tag ${it} ${pimg} & `
                    });

                    cmds = cmds.substring(0, cmds.lastIndexOf('&'));
                    return cmds;
                }
            },
            {
                name: 'push-docker',
                shell: (ctx) => {
                    let info = this.getServiceInfo(ctx);
                    if (!info.service) {
                        return '';
                    }
                    let option = ctx.option as DockerOption;
                    let pushcmd = ctx.toStr(option.pushcmd) || 'docker push';
                    return _.map(this.publishImages, mg => info.user ? `docker login -u ${info.user} -p ${info.psw} ${info.service} & ${pushcmd} ${mg}` : `${pushcmd} ${mg}`);
                }
            },
            {
                name: 'export-docker-compose',
                pipes: (ctx) => {
                    let info = this.getServiceInfo(ctx);
                    let pipes = [(ctx) => replace(/build:/gi, '# build:'), (ctx) => replace(/#\s*image:/gi, 'image:')];
                    _.each(info.images, (img, idx) => {
                        pipes.push(ctx => replace(img, this.publishImages[idx]));
                    });
                    return pipes;
                }
            },
            {
                name: 'save-docker-images',
                shell: (ctx) => {
                    let option = ctx.option as DockerOption;
                    let info = this.getServiceInfo(ctx);
                    let exportcmd = ctx.toStr(option.exportImagecmd) || 'docker save';
                    let path = ctx.toUrl(ctx.getDist());
                    return _.map(this.publishImages, (mg, idx) => option.exportImage ? ` ${exportcmd} ${mg} -o ${path}/${info.images[idx]}.tar` : ``);
                }
            }
        ];
    }
}
