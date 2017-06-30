"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Gulp } from 'gulp';
var _ = require("lodash");
// import * as path from 'path';
var development_core_1 = require("development-core");
// import * as chalk from 'chalk';
var path = require("path");
var replace = require('gulp-replace');
// @task()
// export class DockerCompose implements ITask {
//     constructor(private info: ITaskInfo) {
//     }
//     /**
//      * old filed.
//      *
//      * @type {ITaskInfo}
//      * @memberOf ITask
//      */
//     getInfo(): ITaskInfo {
//         this.info.name = this.info.name || 'DockerCompose';
//         return this.info;
//     }
//     /**
//      * setup task.
//      *
//      * @param {ITaskContext} context
//      * @param {Gulp} [gulp]
//      * @returns {TaskResult}
//      *
//      * @memberOf ITask
//      */
//     setup(context: ITaskContext, gulp?: Gulp): TaskResult {
//         let info = this.getInfo();
//         let option = context.option as DockerOption;
//         context.generateTask(new DockerComposeDynamicTask().tasks())
//         gulp.task(context.subTaskName(info), () => {
//         });
//     }
// }
var DockerComposeDynamicTask = (function () {
    function DockerComposeDynamicTask() {
        this.publishImages = [];
    }
    DockerComposeDynamicTask.prototype.getServiceInfo = function (ctx) {
        if (!this._info) {
            var option = ctx.option;
            var imgs = ctx.toSrc(option.images);
            this._info = {
                composeFile: ctx.toRootPath(ctx.to(option.composeFile) || './docker-compose.yml'),
                images: _.isArray(imgs) ? imgs : [imgs],
                service: ctx.env.publish || ctx.toStr(option.service),
                user: ctx.env['user'] || ctx.toStr(option.user),
                psw: ctx.env['psw'] || ctx.toStr(option.psw),
            };
        }
        return this._info;
    };
    DockerComposeDynamicTask.prototype.tasks = function () {
        var _this = this;
        return [
            {
                name: 'build-docker',
                shell: function (ctx) {
                    var cmds = '';
                    var option = ctx.option;
                    var info = _this.getServiceInfo(ctx);
                    var dist = path.dirname(info.composeFile);
                    var buildcmd = ctx.toStr(option.buildcmd) || 'docker-compose down & docker-compose build';
                    if (/^[C-Z]:/.test(dist)) {
                        cmds = _.first(dist.split(':')) + ': & ';
                    }
                    cmds = cmds + ("cd " + dist + " & " + buildcmd);
                    return cmds;
                }
            },
            {
                name: 'tag-docker',
                shell: function (ctx) {
                    var info = _this.getServiceInfo(ctx);
                    var cmds = '';
                    var option = ctx.option;
                    var version = '';
                    if (option.version) {
                        version = ctx.toStr(option.version);
                    }
                    else {
                        var pkg = ctx.getPackage();
                        if (pkg) {
                            version = pkg.version;
                        }
                    }
                    version = version || 'latest';
                    _.each(info.images, function (it) {
                        var pimg = info.service ? info.service + "/" + it + ":" + version : it + ":" + version;
                        _this.publishImages.push(pimg);
                        cmds = cmds + ("docker tag " + it + " " + pimg + " & ");
                    });
                    cmds = cmds.substring(0, cmds.lastIndexOf('&'));
                    return cmds;
                }
            },
            {
                name: 'push-docker',
                shell: function (ctx) {
                    var info = _this.getServiceInfo(ctx);
                    if (!info.service) {
                        return '';
                    }
                    var option = ctx.option;
                    var pushcmd = ctx.toStr(option.pushcmd) || 'docker push';
                    return _.map(_this.publishImages, function (mg) { return info.user ? "docker login -u " + info.user + " -p " + info.psw + " " + info.service + " & " + pushcmd + " " + mg : pushcmd + " " + mg; });
                }
            },
            {
                name: 'export-docker-compose',
                pipes: function (ctx) {
                    var info = _this.getServiceInfo(ctx);
                    var pipes = [function (ctx) { return replace(/build:/gi, '# build:'); }, function (ctx) { return replace(/#\s*image:/gi, 'image:'); }];
                    _.each(info.images, function (img, idx) {
                        pipes.push(function (ctx) { return replace(img, _this.publishImages[idx]); });
                    });
                    return pipes;
                }
            },
            {
                name: 'save-docker-images',
                shell: function (ctx) {
                    var option = ctx.option;
                    var info = _this.getServiceInfo(ctx);
                    var exportcmd = ctx.toStr(option.exportImagecmd) || 'docker save';
                    var path = ctx.toUrl(ctx.getDist());
                    return _.map(_this.publishImages, function (mg, idx) { return option.exportImage ? " " + exportcmd + " " + mg + " -o " + path + "/" + info.images[idx] + ".tar" : ""; });
                }
            }
        ];
    };
    DockerComposeDynamicTask = __decorate([
        development_core_1.dynamicTask()
    ], DockerComposeDynamicTask);
    return DockerComposeDynamicTask;
}());
exports.DockerComposeDynamicTask = DockerComposeDynamicTask;

//# sourceMappingURL=../sourcemaps/tasks/PublishTask.js.map
