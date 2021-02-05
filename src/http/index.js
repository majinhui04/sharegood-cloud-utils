/* axios 中文文档：http://www.axios-js.com/zh-cn/docs/ */

import axios from 'axios'
import { toFormData, qsStringify } from './helper'
import createAxios from './createAxios'
import createAPI from './createAPI'
import { cancel } from './exCancel'
const { isCancel } = axios
export {
    axios,
    createAxios,
    cancel,
    isCancel,
    createAPI,
    toFormData,
    qsStringify,
}
