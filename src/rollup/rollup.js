import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import progress from 'rollup-plugin-progress'
import filesize from 'rollup-plugin-filesize'
import {transformOutput} from './utils'
import { isFunction } from 'lodash'

const env = process.env.NODE_ENV
const isProd = (env === 'production')
const isDev = (env === 'dev')

const exclude = 'node_modules/**'

const commonPlugins = [
    nodeResolve(),
    babel({
        exclude: 'node_modules/**', // only transpile our source code
        runtimeHelpers: true,
    }), //Place babel before commonjs plugin.
    commonjs(),
    progress(),
    filesize(),
];

const rollup = (input, output, options = {}) => {
    const {pkg = getPkg(), external, minify, ...rest} = options || {}

    const commonExternal = Object.keys(pkg.dependencies)
    let plugins = [].concat(commonPlugins)
    if(minify){
        plugins = plugins.concat(terser())
    }
    const config = {
        input,
        output: transformOutput(output, minify),
        external: commonExternal,
        plugins,
    }

    return Object.assign(config, isFunction(rest) ? rest(config) : rest || {})
}

const getPkg = () => rollup.config.pkg

rollup.config = {}

rollup.setConfig = (config) => {rollup.config = config}

export {
    rollup
}