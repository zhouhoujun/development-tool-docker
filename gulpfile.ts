import * as gulp from 'gulp';

import { Development } from 'development-tool';

Development.create(gulp, __dirname, [
    {
        src: 'src',
        dist: 'lib',
        buildDist: 'build',
        loader: 'development-tool-node'
    }
]);
