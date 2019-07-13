const nodeResolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const { terser } = require('rollup-plugin-terser')
const progress = require('rollup-plugin-progress')
const filesize = require('rollup-plugin-filesize')
const env = process.env.NODE_ENV
const isProd = (env === 'production')

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

const rollup = (input, output, options) => {
    const {pkg = {}, external} = options
    const commonExternal = Object.keys(pkg.dependencies)

    return {
        input,
        output: output,
        external,
        plugins: commonPlugins
    }
}

module.exports = {
    rollup
}