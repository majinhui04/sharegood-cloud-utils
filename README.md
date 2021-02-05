常用的 Javascript 工具类方法集合

## 目录介绍

```
.
├── example 使用example
├── dist 编译产出代码
├── docs 项目文档
├── src 源代码目录
├── test 单元测试
```

## 如何使用

通过 npm 下载安装代码

```bash
$ npm install --save sharegood-cloud-utils
```

如果你是 node 环境

```js
var { formatDate } = require('sharegood-cloud-utils')
```

如果你是 webpack 等环境

```js
import { formatDate } from 'sharegood-cloud-utils'
```

如果你是 requirejs 环境

```js
requirejs(
    ['node_modules/sharegood-cloud-utils/dist/sharegood-cloud-utils.js'],
    function (utils) {
        var formatDate = utils.formatDate
    },
)
```

如果你是浏览器环境

```html
<script src="node_modules/sharegood-cloud-utils/dist/sharegood-cloud-utils.min.js"></script>

<script>
    var utils = window['sharegood-cloud-utils']
</script>
```

## 文档

[API](https://majinhui04.github.io/sharegood-cloud-utils/)

## 贡献指南

首次运行需要先安装依赖

```bash
$ npm install
```

开发调试（利用 [rollup-watch](https://github.com/rollup/rollup-watch) ，自动监测源码变更，生成 `dist/sharegood-cloud-utils.js`）
,在 `src/core` 添加相应的 `**.js` 文件，然后在 `src/main.js` 引用

```bash
$ npm run dev
```

添加测试用例

在 `src/test` 添加相应的测试用例文件， 命名遵循于 `**.spec.js` 规范

一键打包生成生产代码

```bash
$ npm run build
```

运行单元测试，浏览器环境需要手动测试，位于`test/browser`

```bash
$ npm test
```

修改 `package.json` 中的版本号，然后发布新版

```bash
$ npm run release
```

## http 使用规范

基于`axios`封装的数据请求增强版，主要有如下功能：

-   支持 Promise
-   重复请求过滤
-   内部封装上传和下载
-   提供数据请求前以及完成后的多个 Hook 拦截器
-   支持重试机制
-   支持防止 CSRF/XSRF

### createAxios 的参数

基础参数与 axios 保持一致（`axios`相关参数请参阅 [http://www.axios-js.com/zh-cn/docs/](http://www.axios-js.com/zh-cn/docs/)）
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---------- |-------------- |---------- |-------------------------------- |-------- |
| baseURL | 接口前缀| String | — | - |
| timeout | 超时时间| Number | — | 15000 |
| headers | 请求头| Object | — | - |

个性化参数

| 参数               | 说明                                                         | 类型     | 可选值 | 默认值 |
| ------------------ | ------------------------------------------------------------ | -------- | ------ | ------ |
| exCancel           | 请求前先取消未完成的请求（通常用于幂等性请求，如列表查询等） | Boolean  | —      | false  |
| exRetry            | 失败后是否重试                                               | Boolean  | —      |        |
| exNoHooks          | 跳过所有全局拦截器                                           | Boolean  | —      |        |
| isResponseSuccess  | 判断业务数据是否正确                                         | Function | -      |        |
| getResponseSuccess | 格式化正常的数据                                             | Function | -      |        |
| getResponseError   | 格式化错误的数据                                             | Function | -      |        |

`http`实例方法
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|---------- |-------------- |---------- |-------------------------------- |-------- |
| $uploadFile | 上传文件 http.uploadFile(config)| | — | |
| $downloadFile | 下载文件 http.downloadFile(config)| | — | |

### 基本用法

```javascript
import { createAxios } from 'sharegood-cloud-utils/dist/sharegood-http.esm.js'
// 返回axios的新实例
export const http = createAxios({
    // axios配置
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        //'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    timeout: 10 * 1000, // 默认超时10s
    baseURL: process.env.VUE_APP_BASEURL_API,
})

// 调用与axios保存一致
http.get('/xxx', config)
http.delete('/xxx', config)
http.post('/xxx', null, config)
http.put('/xxx', null, config)
http.patch('/xxx', null, config)
```

### 格式化数据

```javascript
export const http = createAxios({
    baseURL: process.env.VUE_APP_BASEURL_API,
    /* 
        个性配置 
        payload 为后端返回的json
        比如 {code:0, status: true, successfulPayload:null,unsuccessfulPayload:null,message:'sucess'} 
        */
    isResponseSuccess(payload) {
        if (payload.status) {
            return true
        } else {
            return false
        }
    },
    // 统一将成功结果字段`successfulPayload`改为`data`
    getResponseSuccess(res) {
        const data = res.successfulPayload || {}
        return { data }
    },
    getResponseError(res) {
        let { data, code, message } = res
        data = res.unsuccessfulPayload || {}
        return { data, code, message }
    },
})

// 下载文件
http.$downloadFile({
    url: '/xxx',
})
// 调用
http.get('/xxx').then(({ data }) => {
    console.log(data)
})

// 重试
http.get('/xxx', {
    exRetry: true,
    retry: 3, // 重试次数
    retryDelay: 1000, // 每次重试延时
})
// 请求前先取消未完成的请求（通常用于幂等性请求，如列表查询等）
http.get('/xxx', {
    exCancel: true,
    // 对于 `/xxx/${id}` 这种形式的 path，参考如下：
    // exCancel: '/xxx/*',
    // exCancelName: '/xxx/*',

    // 对于 `/xxx/${id}/yyy` 这种形式的 path，参考如下：
    // exCancel: '/xxx/*/yyy',
    // exCancelName: '/xxx/*/yyy',

    // 严格匹配，参考如下（使用动态名称）：
    // exCancel: `/xxx?${params.id}`,
    // exCancelName: `/xxx?${params.id}`,

    // 匹配一类，参考如下（类名不能以斜杠开头）：
    // exCancel: 'xxx',
    // exCancelName: 'xxx',

    // 调用时传入，使其具备较高灵活度，以实现不同的应用场景（比如锁定作用范围等）：
    // exCancel: opts.cancelName,
    // exCancelName: opts.cancelName,
}).then(({ data }) => {
    console.log(data)
})
```

### 使用拦截器

在拦截器或相关钩子中`做好数据及状态的传递、异常处理等`，在业务中不需要有多余的判断或行为，让业务更专注

-   在业务中，then 不需要进行 `res.data.code == 'xxx'` 等多余的操作（让拦截器全局处理）
-   在业务中，catch 不需要处理弹出消息层（让拦截器全局处理）
-   在业务中，请求过程中不需要处理全局 loading（让相关钩子全局处理）
-   ...

```javascript
import store from '@/store'
import { Message } from 'element-ui'
// 默认添加请求头
const exAuth = Object.freeze({
    onBefore(config) {
        const { token } = store.state.user
        config.headers['token'] = token
    },
    onComplete(config, isResolve, resOrErr) {
        // token 失效处理
        if (resOrErr.code === 30203) {
            // 退出登录
        }
    },
})

// 默认出错提示错误 参数 exNoErrorMassage:true 则不提示
const exShowErrMessage = Object.freeze({
    onBefore(config) {},
    // isResolve 业务是否正常 resOrErr 业务数据或者失败数据
    onComplete(config, isResolve, resOrErr) {
        const message = resOrErr.message || ''

        if (message && !config.exNoErrorMassage && !isResolve) {
            Message.error(message)
        }
    },
})
import { Loading } from 'element-ui'
let instance = null // 单例模式
let count = 0
export const exShowLoading = Object.freeze({
    onBefore(config) {
        if (config.exShowLoading) {
            if (!instance || instance.visible === false) {
                instance = Loading.service()
            }
            count++
            config._exShowLoading = true
        }
    },
    onComplete(config) {
        if (config._exShowLoading) {
            if (instance) {
                count--
                if (count <= 0) {
                    instance.close()
                    instance = null
                    count = 0
                }
            }
        }
    },
})

export const http = createAxios(
    {
        baseURL: process.env.VUE_APP_BASEURL_API,
    },
    (instance) => {
        instance.exHooks.add(exAuth)
        instance.exHooks.add(exShowErrMessage)
    },
)

// 调用
http.request({
    url: '/xxx',
    exNoErrorMassage: true, // 响应异常时不要弹出消息层
    exShowLoading: true, // 请求过程中显示全局 loading
}).then(({ data }) => {
    console.log(data)
})
```

### 使用 createAPI 函数

```javascript
import { createAxios } from 'sharegood-cloud-utils/dist/sharegood-http.esm.js'
import http from '@/scripts/http'
import JSEncrypt from '@/libs/jsencrypt.min.js'
const encrypt = new JSEncrypt()
encrypt.setPublicKey('这里是密钥123456789')
const interceptors = [
    {
        name: '/api/update_password',
        description: '修改密码',
        method: 'post',
        onBefore(payload) {
            const { newPassword, repeatPassword } = payload
            payload.newPassword = encrypt.encrypt(newPassword)
            payload.repeatPassword = encrypt.encrypt(repeatPassword)
        },
        //
        onSuccess(payload) {
            const { data } = payload
            return data
        },
    },
]
export const API = createAPI(http, interceptors, {
    upload(params = {}, config = {}) {
        return http.request({
            method: 'post',
            url: '/api/user/login',
            data: params,
            exShowLoading: true,
            headers: { 'content-type': 'multipart/form-data' },
            ...config,
        })
    },
})

// 自定义api拦截器
API.post('/api/update_password', {
    newPassword: '123456',
    repeatPassword: '123456',
}).then((data) => {
    console.log(data)
})
// 自定义api函数
API.upload({ name: 'file' }, { exShowLoading: true }).then((data) => {
    console.log(data)
})
```
