# packaged development-tool-docker

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/development-tool-docker/src/mastert).
Please file issues and pull requests against that repo.
This package use to develop kit for typescript node project development via gulp tasks.

## Install

You can install this package either with `npm`.

### npm

```shell

npm install development-tool-docker

```

You can `import` modules:

## import module

```ts
import * as gulp from 'gulp';
import  { Development } from 'development-tool';
import { INodeTaskOption } from 'development-tool-docker';

```

## Create development tool

```ts
Development.create(gulp, __dirname, {
    tasks:[
        <INodeTaskOption>{
            src: 'src',
            //testSrc: '...',
            //e2eSrc: '...',
            //watchSrc: '...'
            dist: 'lib',
            // buildDist:'build path',
            // releaseDist: 'release path',
            // depolyDist: 'depoly path'
            asserts:{
                json: 'src/**/*.json',
                css:'src/common/**/*.css',
                moduleBcss: ['src/moduleB/**/*.css'],
                moduleAcss: {
                    src: ['src/apath/**/*.css', 'src/bpath/**/*.css'],
                    dist:'dist path',
                    buildDist:'buildDist path',
                    releaseDist: 'release Distpath',
                    depolyDist: 'depoly Distpath'
                },
                ...
            },

            loader: 'development-tool-docker',
             // add pipe works for module tasks.
            pipe(stream, ctx, dist, gulp){ ... }
            pipes: Pipe[] | (ctx, dist, gulp)=> Pipe[],
            output: OutputPipe[] | (stream, ctx, dist, gulp)=> OutputPipe[]
        }
    ]
});
```

## Create development tool with addation sub tasks

```ts
Development.create(gulp, __dirname, {
    tasks:{
        src: 'src',
        //testSrc: '...',
        //e2eSrc: '...',
        //watchSrc: '...'
        dist: 'lib',
        // buildDist:'build path',
        // releaseDist: 'release path',
        // depolyDist: 'depoly path'
        loader: 'development-tool-docker',
        tasks:[
            {
                src: 'files be dealt with',
                //testSrc: '...',
                //e2eSrc: '...',
                //watchSrc: '...'
                dist: 'dist path',
                // buildDist:'build path',
                // releaseDist: 'release path',
                // depolyDist: 'depoly path'
                loader:'development-tool-*' //the module must implement ITaskDefine.
            },
            {
                src: ['src/apath/**/*.css', 'src/bpath/**/*.css'],
                //testSrc: '...',
                //e2eSrc: '...',
                //watchSrc: '...'
                dist: 'dist path',
                // buildDist:'build path',
                // releaseDist: 'release path',
                // depolyDist: 'depoly path'
                loader: {
                    configModule: path.join(__dirname, './src/task.ts'), //the module must implement ITaskDefine.
                    dir: [path.join(__dirname, './src/mytasks')]
                },
                tasks: [
                    {
                        src: 'files be dealt with',
                        //testSrc: '...',
                        //e2eSrc: '...',
                        //watchSrc: '...'
                        dist: 'dist path',
                        // buildDist:'build path',
                        // releaseDist: 'release path',
                        // depolyDist: 'depoly path'
                        loader: {
                            //./src/mytasks folder must has module implement ITaskDefine.
                            dir: path.join(__dirname, './src/mytasks')
                        }
                    },
                    {
                        src: 'files be dealt with',
                        //testSrc: '...',
                        //e2eSrc: '...',
                        //watchSrc: '...'
                        dist: 'dist path',
                        // buildDist:'build path',
                        // releaseDist: 'release path',
                        // depolyDist: 'depoly path'
                        loader: {
                            module: path.join(__dirname, './src/mytasks/dosomething'),
                             // add pipe works for module tasks.
                            pipe(stream, ctx, dist, gulp){ ... }
                            pipes: Pipe[] | (ctx, dist, gulp)=> Pipe[],
                            output: OutputPipe[] | (stream, ctx, dist, gulp)=> OutputPipe[]
                            configModule: path.join(__dirname, './src/mytasks/config') //the module must implement ITaskDefine.
                        },
                        // also can add pipe works for module tasks here.
                        pipe(stream, ctx, dist, gulp){ ... }
                        pipes: Pipe[] | (ctx, dist, gulp)=> Pipe[],
                        output: OutputPipe[] | (stream, ctx, dist, gulp)=> OutputPipe[]
                    }
                ]
            }
            ...
        ]
    }
});
```

https://github.com/zhouhoujun/development-tool-docker.git

## Documentation

Documentation is available on the
[development-tool-docker docs site](https://github.com/zhouhoujun/development-tool-docker).

## License

MIT © [Houjun](https://github.com/zhouhoujun/)