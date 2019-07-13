import nodeResolve from 'rollup-plugin-node-resolve'
const commonjs = require('rollup-plugin-commonjs')
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel'

import pkg from './package.json'

export default {
    input: 'src/index.js',
    output: {
        file: pkg.main,
        format: 'cjs'
    },
    plugins: [
        nodeResolve(),
        babel({
            exclude: 'node_modules/**', // only transpile our source code
            runtimeHelpers: true,
        }),
        commonjs(),
        json(),
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {}),
    ]
}