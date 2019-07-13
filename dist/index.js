'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var nodeResolve = _interopDefault(require('rollup-plugin-node-resolve'));
var replace = _interopDefault(require('rollup-plugin-replace'));
var babel = _interopDefault(require('rollup-plugin-babel'));
var commonjs = _interopDefault(require('rollup-plugin-commonjs'));
var rollupPluginTerser = require('rollup-plugin-terser');
var progress = _interopDefault(require('rollup-plugin-progress'));
var filesize = _interopDefault(require('rollup-plugin-filesize'));
var path = _interopDefault(require('path'));
var lodash = require('lodash');

const defaultOutput = f => ({
  file: f,
  format: 'cjs'
});

const parseFile = (p, minify) => {
  if (minify) {
    let file = path.parse(p);
    let ext = `min${file.ext}`;
    return `${file.dir}/${file.name}.${ext}`;
  }

  return p;
};

const getOptions = opts => {
  return lodash.isPlainObject(opts) ? opts : null;
};

const transformOutput = (output, minify) => {
  if (lodash.isString(output)) {
    return defaultOutput(parseFile(output, minify));
  } else if (lodash.isPlainObject(output)) {
    return output;
  }

  if (lodash.isString(output[0])) {
    return Object.assign({
      file: parseFile(output[0], minify),
      format: output[1] ? output[1] : 'cjs'
    }, output[1] === 'umd' ? {
      name: output[2]
    } : null, output[1] === 'umd' ? getOptions(output[3]) : output[2]);
  }

  return output.map(o => {
    if (lodash.isArray(o)) {
      if (o.length === 1) {
        return defaultOutput(parseFile(o[0], minify));
      }

      if (o[1] === 'umd') {
        const f = lodash.take(o, 3);
        return Object.assign({
          file: parseFile(f[0], minify),
          format: f[1],
          name: f[2]
        }, getOptions(f[3]));
      }

      return Object.assign({
        file: parseFile(o[0], minify),
        format: o[1]
      }, getOptions(o[3]));
    }

    return defaultOutput(parseFile(o, minify));
  });
};

const env = process.env.NODE_ENV;
const commonPlugins = [nodeResolve(), babel({
  exclude: 'node_modules/**',
  // only transpile our source code
  runtimeHelpers: true
}), //Place babel before commonjs plugin.
commonjs(), replace({
  'process.env.NODE_ENV': JSON.stringify(env)
}), progress(), filesize()];

const rollup = (input, output, options = {}) => {
  const {
    pkg = getPkg(),
    external,
    minify,
    ...rest
  } = options || {};
  const commonExternal = Object.keys(pkg.dependencies);
  let plugins = [].concat(commonPlugins);

  if (minify) {
    plugins = plugins.concat(rollupPluginTerser.terser());
  }

  const config = {
    input,
    output: transformOutput(output, minify),
    external: commonExternal,
    plugins
  };
  return Object.assign(config, lodash.isFunction(rest) ? rest(config) : rest || {});
};

const getPkg = () => rollup.config.pkg;

rollup.config = {};

rollup.setConfig = config => {
  rollup.config = config;
};

exports.rollup = rollup;
