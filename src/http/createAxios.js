/**
 * @ignore
 * 这里的配置项及拦截器通常和业务无关
 * 请求拦截器的执行顺序：最后注册--->最先注册
 * 响应拦截器的执行顺序：最先注册--->最后注册--->then
 * 根据顺序做好数据及状态的传递
 */

import _ from 'lodash'
import axios from 'axios'
import mergeConfig from 'axios/lib/core/mergeConfig'
// import { qsStringify } from '../utils'
import wrapAxios from './wrapAxios'
// import exShowLoading from './exShowLoading'
import * as exCancel from './exCancel'

import HttpError from './HttpError'
import qs from 'qs'
import { uploadFile, downloadFile } from './helper'

/**
 * @ignore
 * 全局请求扩展配置
 * 添加一个请求拦截器 （于transformRequest之前处理）
 */
const axiosConfig = {
    success: (config) => {
        //   // 在请求开始前，对之前的请求做检查取消操作
        //   removePending(config);
        //   // 将当前请求添加到 pending 中
        //   addPending(config);

        const headers = config.headers
        const ContentType = headers['Content-Type'] || ''
        // 只有 ‘application/x-www-form-urlencoded’模式才需要对post的data做序列化
        if (
            config.data &&
            ContentType.indexOf('application/x-www-form-urlencoded') > -1
        ) {
            config.data = qs.stringify(config.data)
        }
        exCancel.setConfig(config)
        return config
    },
    error: (error) => Promise.reject(error),
}

/**
 * @ignore
 * 全局请求响应处理
 * 添加一个返回拦截器 （于transformResponse之后处理）
 * 返回的数据类型默认是json，若是其他类型（text）就会出现问题，因此用try,catch捕获异常
 */
const axiosResponse = {
    success(response) {
        // 如果是流文件则直接返回
        if (response.config && response.config.responseType === 'blob') {
            return Promise.resolve(response)
        }
        // 数据结果根据`content-type`来操作json数据以及文件流
        if (response.config && response.config.responseType === 'arraybuffer') {
            const headers = response.headers || {}
            const contentType = headers['content-type'] || ''
            const isJSON = contentType.indexOf('application/json') > -1
            if (isJSON) {
                try {
                    // arraybuffer转化成json对象
                    let enc = new TextDecoder('utf-8')
                    const payload = JSON.parse(
                        enc.decode(new Uint8Array(response.data)),
                    )
                    // const payload = JSON.parse(
                    //     Buffer.from(response.data).toString('utf8'),
                    // )
                    if (this.$isResponseSuccess(payload)) {
                        return this.$getResponseSuccess(payload)
                    } else {
                        return Promise.reject(this.$getResponseError(payload))
                    }
                } catch (err) {
                    console.error('[下载失败]', err)
                    return Promise.reject({
                        message: '下载失败',
                        name: 'download',
                        data: err,
                    })
                }
            } else {
                return response
            }
        }

        const payload = response.data || {}
        if (this.$isResponseSuccess(payload)) {
            const result = this.$getResponseSuccess(payload)
            // console.log('[业务正常]', result)
            return result
        } else {
            const result = this.$getResponseError(payload)
            // console.log('[业务异常]', result)
            return Promise.reject(result)
        }
    },
    error(err) {
        const config = err.config
        // If config does not exist or the retry option is not set, reject
        if (!config || !config.exRetry) {
            const result = HttpError.info(err)
            return Promise.reject(result)
        }
        // 请求不再经过hook
        config.exNoHooks = true
        // Set the variable for keeping track of the retry count
        config.__retryCount = config.__retryCount || 0
        config.retry = config.retry || 3
        config.retryDelay = config.retryDelay || 1000

        // Check if we've maxed out the total number of retries
        if (config.__retryCount >= config.retry) {
            // Reject with the error
            const result = HttpError.info(err)
            return Promise.reject(result)
        }

        // Increase the retry count
        config.__retryCount += 1
        // console.log(
        //     `[开始第${config.__retryCount}次重试] 总共${config.retry}次`,
        // )
        // Create new promise to handle exponential backoff
        const backoff = new Promise(function (resolve) {
            setTimeout(function () {
                resolve()
            }, config.retryDelay || 1)
        })

        // Return the promise in which recalls axios to retry the request
        return backoff.then(() => {
            return this.request(config)
        })
    },
}

/**
 * @ignore
 * @param {Parameters<axios['create']>[0]} requestConfig
 * @param {(instance: ReturnType<axios['create']>) => any} [callback]
 */
export const createAxios = (requestConfig, callback) => {
    const {
        isResponseSuccess = function () {
            return true
        },
        getResponseError = function (res) {
            return res
        },
        getResponseSuccess = function (res) {
            return res
        },
        ...rest
    } = requestConfig

    const defaults = {
        /* 默认配置 */
        // paramsSerializer: params => qsStringify(params),
    }

    const _axios = axios.create(mergeConfig(defaults, rest))
    const instance = wrapAxios(_axios)
    instance.$uploadFile = uploadFile
    instance.$downloadFile = downloadFile
    instance.$isResponseSuccess = isResponseSuccess
    instance.$getResponseError = getResponseError
    instance.$getResponseSuccess = getResponseSuccess
    instance.exHooks.add(exCancel.hooks)

    instance.interceptors.request.use(axiosConfig.success, axiosConfig.error)
    instance.interceptors.response.use(
        (config) => {
            return axiosResponse.success.call(instance, config)
        },
        (error) => {
            return axiosResponse.error.call(instance, error)
        },
    )

    callback && callback(instance)
    return instance
}

export default createAxios
