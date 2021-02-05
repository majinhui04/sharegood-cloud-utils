// 遍历递归处理数据 obj 元数据   map 映射 {status:{newKey:'$status'}}
function deepMapHandler(obj = {}, map = {}) {
    // 判断原目标是数组还是对象，进行初始化赋值
    const newObj = obj.constructor === Array ? [] : {}
    responseMapHandler(obj, map)
    // 循环原目标
    for (let key in obj) {
        // 判断当前值是否存在
        if (obj.hasOwnProperty(key)) {
            // 判断是否当前要拷贝的是否是对象
            if (obj[key] && typeof obj[key] === 'object') {
                // 是对象，再次调用deepClone递归
                newObj[key] = deepMapHandler(obj[key], map)
            } else {
                // 数组，直接赋值就好
                newObj[key] = obj[key]
            }
        }
    }
    return newObj
}
function responseMapHandler(data = {}, map = {}) {
    Object.keys(map).forEach(key => {
        let target = map[key]
        let value = data[key]
        if (data.hasOwnProperty(key)) {
            if (typeof target === 'string') {
                data[target] = value
            } else if (typeof target === 'object') {
                let { newKey = `$${key}`, handler, replace, dict } = target
                try {
                    let newValue = value
                    // 字典枚举查询
                    if (dict) {
                        let _dict = {}
                        if (typeof dict === 'function') {
                            _dict = dict()
                        }
                        const options = _dict.options || []

                        options.forEach(item => {
                            if (item.value == value) {
                                newValue = item.label
                            }
                        })
                    }
                    if (handler) {
                        newValue = handler(value, data)
                    }

                    data[newKey] = newValue

                    if (replace) {
                        delete data[key]
                    }
                } catch (err) {}
            } else if (typeof target === 'function') {
                data[key] = target(value, data)
            }
        }
    })
}

function createAPI(http, interceptors = [], apis = {}) {
    const interceptorsMAP = {}
    interceptors.map(item => {
        let { name, method, url } = item
        name = name || url
        const key = name + method
        if (interceptorsMAP[key]) {
            console.error(
                `[createAPI error]: 出现重复拦截器 ${name} ${method}`,
                item,
            )
        } else {
            interceptorsMAP[key] = 1
        }
    })

    const API = new Proxy(apis, {
        get(target, name) {
            const methods = ['get', 'post', 'put', 'delete', 'patch']
            if (methods.indexOf(name) > -1) {
                return function(...arg) {
                    let method = name
                    let url = arg[0]
                    let params = arg[1]
                    let config = arg[2]
                    let interceptor = interceptors.filter(item => {
                        return item.name === url && item.method === method
                    })[0]

                    interceptor = interceptor || {
                        onBefore() {},
                        onSuccess() {},
                        config: {},
                    }

                    // console.log(arg, url, method, interceptor)
                    let callback = function() {
                        const uri = interceptor.url || url
                        const description = interceptor.description || ''
                        interceptor.onBefore(params)
                        return http
                            .request({
                                method: method,
                                url: uri,
                                body: params,
                                description,
                                ...interceptor.config,
                                ...config,
                            })
                            .then(res => {
                                let { data = {} } = res
                                let responseMap = interceptor.responseMap
                                if (responseMap) {
                                    deepMapHandler(data, responseMap)
                                }
                                const result = interceptor.onSuccess(res)
                                if (result) {
                                    return result
                                } else {
                                    return res
                                }
                            })
                    }
                    return callback()
                }
            } else if (typeof target[name] === 'function') {
                return function(...arg) {
                    return target[name].apply(null, arg)
                }
            } else {
                let names = name.split('_')
                let method = names.splice(0, 1)[0]

                let uri = names
                    .map(name => {
                        if (name.indexOf('$') > -1) {
                            name = name.replace('$', '')
                            return `{${name}}`
                        } else {
                            return '/' + name
                        }
                    })
                    .join('')
                console.log('uri', uri)
                // 'get' | 'delete' | 'post' | 'put' | 'patch'
                if (methods.indexOf(method) > -1) {
                    return function(...arg) {
                        let callback = function(params, config) {
                            return http.request({
                                method,
                                url: uri,
                                body: params,
                                ...config,
                            })
                        }
                        return callback.apply(apis, arg)
                    }
                } else {
                    return function() {
                        return Promise.reject({
                            message: `[${name}] 函数不存在`,
                        })
                    }
                }
            }
        },
    })

    return API
}

export default createAPI
