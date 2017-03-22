import { IAsserts, TaskString, TaskSource } from 'development-core';



export interface DockerOption extends IAsserts {
    /**
     * the service docker publish to.
     * default use this address.  you can setting it when run time via `--publish`. etc.  --publish service/address
     *
     * @type {TaskString}
     * @memberOf INodeTaskOption
     */
    service: TaskString;

    /**
     * docker local build image names.
     *
     * @type {TaskSource}
     * @memberOf DockerOption
     */
    images?: TaskSource;

    /**
     * docker build command. default 'docker-compose down & docker-compose build'
     */
    buildcmd?: TaskString;

    /**
     * command to push to registry service.
     *
     * @type {TaskString}
     * @memberOf DockerOption
     */
    pushcmd?: TaskString;

    /**
     * export docker images or not.
     *
     * @type {boolean}
     * @memberOf DockerOption
     */
    exportImage?: boolean;

    /**
     * the command to export docker image.
     *
     * @type {TaskString}
     * @memberOf DockerOption
     */
    exportImagecmd?: TaskString;

    /**
     * task version.
     */
    version?: TaskString;

    /**
     * the user account to login docker service.
     * default use this account.  you can setting it when run time via `--user`. etc.  --user accountname
     *
     * @type {TaskString}
     * @memberOf DockerOption
     */
    user?: TaskString;
    /**
     * the user password to login docker service.
     * default use this account password.  you can setting it when run time via `--psw`. etc.  --psw accountpassword
     *
     * @type {TaskString}
     * @memberOf DockerOption
     */
    psw?: TaskString;

}

