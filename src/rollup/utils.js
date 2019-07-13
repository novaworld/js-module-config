import path from 'path'
import { isPlainObject, isString, isArray, take } from 'lodash'

const defaultOutput = (f) => ({file: f, format: 'cjs'})

const parseFile = (p, minify) => {
    if (minify) {
        let file = path.parse(p)
        let ext = `min${file.ext}`
        return `${file.dir}/${file.name}.${ext}`
    }
    return p
}

const getOptions = (opts) => {
    return isPlainObject(opts) ? opts : null
}

export const transformOutput = (output, minify) => {

    if (isString(output)) {
        return defaultOutput(parseFile(output, minify))
    } else if (isPlainObject(output)) {
        return output
    }

    if (isString(output[0])) {
        return Object.assign({
                file: parseFile(output[0], minify),
                format: output[1] ? output[1] : 'cjs',
            },
            output[1] === 'umd' ? {name: output[2]} : null,
            output[1] === 'umd' ? getOptions(output[3]) : output[2],
        )
    }

    return output.map(o => {
        if (isArray(o)) {
            if (o.length === 1) {
                return defaultOutput(parseFile(o[0], minify))
            }

            if (o[1] === 'umd') {
                const f = take(o, 3)
                return Object.assign({
                    file: parseFile(f[0], minify),
                    format: f[1],
                    name: f[2],
                }, getOptions(f[3]))
            }

            return Object.assign({
                file: parseFile(o[0], minify),
                format: o[1],
            }, getOptions(o[3]))
        }

        return defaultOutput(parseFile(o, minify))
    })
}