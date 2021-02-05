import _ from 'lodash'
import stringify from 'qs/lib/stringify'

/**
 * @ignore
 * 将对象序列化成参数
 * @param {object} data
 * @param {Parameters<qs.stringify>[1]} [options]
 */
export const qsStringify = function (data, options) {
    options = { arrayFormat: 'repeat', ...options }
    return stringify(data, options)
}

/**
 * @ignore
 * 将对象转成 formData
 * @typedef {string | number | boolean | File | Blob} Val
 * @param {{[key: string]: Val | Val[]}} data
 * @param {'repeat' | 'brackets' | 'indices'} [arrayFormat]
 */
export const toFormData = function (data, arrayFormat = 'repeat') {
    if (data instanceof FormData) return data
    const formData = new FormData()
    _.each(data, (val, key) => {
        if (val === undefined) return
        if (Array.isArray(val)) {
            val = val.filter((v) => v !== undefined)
            val.forEach((v, i) => {
                let k = key
                if (arrayFormat === 'brackets') k += '[]'
                else if (arrayFormat === 'indices') k += `[${i}]`
                formData.append(k, v === null ? '' : v)
            })
        } else {
            formData.append(key, val === null ? '' : val)
        }
    })
    return formData
}

/**
 * @ignore
 * 上传文件
 * @date 2021-02-05
 * @param {any} params={}
 * @param {any} config={}
 * @returns {any}
 */
export const uploadFile = function (config = {}) {
    const data = config.data || {}
    const formData = toFormData(data)
    const url = config.url
    return this.request({
        method: 'post',
        url: url,
        data: formData,
        headers: { 'content-type': 'multipart/form-data' },
        ...config,
    })
}

/**
 * @ignore
 * 下载文件
 * @date 2021-02-05
 * @param {any} params={}
 * @param {any} config={}
 * @returns {any}
 */
export const downloadFile = function (config = {}) {
    config = {
        responseType: 'arraybuffer', // blob
        ...config,
    }

    return this.request(config).then((response) => {
        if (response.headers) {
            let filename = response.headers['x-suggested-filename']

            if (!filename) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
                const matches = filenameRegex.exec(
                    response.headers['content-disposition'],
                )
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '')
                }
            }

            if (filename) {
                const url = window.URL.createObjectURL(
                    new Blob([response.data]),
                )
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('target', '_blank')
                link.setAttribute('download', decodeURIComponent(filename))
                link.click()
                window.URL.revokeObjectURL(url)

                return Promise.resolve(response)
            } else {
                const payload = response.data || {}
                return Promise.reject(this.$getResponseError(payload))
            }
        } else {
            return response
        }
    })
}
