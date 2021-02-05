const path = require('path')
const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
// const cjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const node = require('rollup-plugin-node-resolve')
const pack = require('../package.json')
const version = process.env.VERSION || pack.version

const external = Object.keys(pack.dependencies)

const moduleName = 'sharegood-http'

const banner = `/*!
 * ${moduleName} v${version} 
 */
 `

const resolve = (p) => {
    return path.resolve(__dirname, '../', p)
}

const builds = {
    // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
    commonjs: {
        entry: resolve('src/http/index.js'),
        dest: resolve(`dist/${moduleName}.common.js`),
        format: 'cjs',
        banner,
        external,
    },
    // Runtime only (ES Modules). Used by bundlers that support ES Modules,
    // e.g. Rollup & Webpack 2
    esm: {
        entry: resolve('src/http/index.js'),
        dest: resolve(`dist/${moduleName}.esm.js`),
        format: 'es',
        banner,
        external,
    },
    // runtime-only production build (Browser)
    production: {
        entry: resolve('src/http/index.js'),
        dest: resolve(`dist/${moduleName}.min.js`),
        format: 'umd',
        env: 'production',
        moduleName,
        banner,
    },
    // runtime-only build (Browser)
    development: {
        entry: resolve('src/http/index.js'),
        dest: resolve(`dist/${moduleName}.js`),
        format: 'umd',
        env: 'development',
        moduleName,
        banner,
    },
}

function genConfig(name) {
    const opts = builds[name]
    const config = {
        input: opts.entry,
        //external: external.concat(opts.external || []),

        external: [].concat(opts.external || []),
        plugins: [
            node({
                jsnext: true,
                main: true,
                browser: true,
            }),
            babel({
                //runtimeHelpers: true,
                exclude: 'node_modules/**', // 仅仅转译我们的源码
            }),
            commonjs(),
        ].concat(opts.plugins || []),
        output: {
            file: opts.dest,
            format: opts.format,
            banner: opts.banner,
            name: opts.moduleName,
            globals: {
                lodash: '_',
                axios: 'axios',
                qs: 'qs',
            },
        },
    }

    const replacePluginOptions = { __VERSION__: pack.version }
    if (opts.env) {
        replacePluginOptions['process.env.NODE_ENV'] = JSON.stringify(opts.env)
    }
    config.plugins.push(replace(replacePluginOptions))

    Object.defineProperty(config, '_name', {
        enumerable: false,
        value: name,
    })

    return config
}

if (process.env.TARGET) {
    module.exports = genConfig(process.env.TARGET)
} else {
    exports.getBuild = genConfig
    exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
