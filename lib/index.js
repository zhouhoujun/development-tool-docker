"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var development_core_1 = require("development-core");
var PublishTask_1 = require("./tasks/PublishTask");
var NodeContextDefine = (function () {
    function NodeContextDefine() {
    }
    // getContext(config: ITaskConfig): ITaskContext {
    //     return bindingConfig(config);
    // }
    NodeContextDefine.prototype.tasks = function (context) {
        return context.findTasks(PublishTask_1.DockerComposeDynamicTask);
    };
    NodeContextDefine = __decorate([
        development_core_1.taskdefine()
    ], NodeContextDefine);
    return NodeContextDefine;
}());
exports.NodeContextDefine = NodeContextDefine;

//# sourceMappingURL=sourcemaps/index.js.map
