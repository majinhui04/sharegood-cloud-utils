/*!
 * sharegood-cloud-utils v0.0.4 (https://github.com/majinhui04/sharegood-cloud-utils.git)
 */
 
import _ from 'lodash';
import axios from 'axios';
import qs from 'qs';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

var formats = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
            || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

var utils = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};

var has$1 = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray$1 = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray$1(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray$1(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray$1(obj)) {
        // we need to join elements in
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : undefined }];
    } else if (isArray$1(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        var value = typeof key === 'object' && key.value !== undefined ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var keyPrefix = isArray$1(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix
            : prefix + (allowDots ? '.' + key : '[' + key + ']');

        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has$1.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray$1(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

var stringify_1 = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray$1(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

/**
 * 将对象序列化成参数
 * @param {object} data
 * @param {Parameters<qs.stringify>[1]} [options]
 */

var qsStringify = function qsStringify(data, options) {
  options = _objectSpread2({
    arrayFormat: 'repeat'
  }, options);
  return stringify_1(data, options);
};
/**
 * 将对象转成 formData
 * @typedef {string | number | boolean | File | Blob} Val
 * @param {{[key: string]: Val | Val[]}} data
 * @param {'repeat' | 'brackets' | 'indices'} [arrayFormat]
 */

var toFormData = function toFormData(data) {
  var arrayFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'repeat';
  if (data instanceof FormData) return data;
  var formData = new FormData();

  _.each(data, function (val, key) {
    if (val === undefined) return;

    if (Array.isArray(val)) {
      val = val.filter(function (v) {
        return v !== undefined;
      });
      val.forEach(function (v, i) {
        var k = key;
        if (arrayFormat === 'brackets') k += '[]';else if (arrayFormat === 'indices') k += "[".concat(i, "]");
        formData.append(k, v === null ? '' : v);
      });
    } else {
      formData.append(key, val === null ? '' : val);
    }
  });

  return formData;
};
/**
 * 上传文件
 * @date 2021-02-05
 * @param {any} params={}
 * @param {any} config={}
 * @returns {any}
 */

var uploadFile = function uploadFile() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var data = config.data || {};
  var formData = toFormData(data);
  var url = config.url;
  return this.request(_objectSpread2({
    method: 'post',
    url: url,
    data: formData,
    headers: {
      'content-type': 'multipart/form-data'
    }
  }, config));
};
/**
 * 下载文件
 * @date 2021-02-05
 * @param {any} params={}
 * @param {any} config={}
 * @returns {any}
 */

var downloadFile = function downloadFile() {
  var _this = this;

  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  config = _objectSpread2({
    responseType: 'arraybuffer'
  }, config);
  return this.request(config).then(function (response) {
    if (response.headers) {
      var filename = response.headers['x-suggested-filename'];

      if (!filename) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(response.headers['content-disposition']);

        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      if (filename) {
        var url = window.URL.createObjectURL(new Blob([response.data]));
        var link = document.createElement('a');
        link.href = url;
        link.setAttribute('target', '_blank');
        link.setAttribute('download', decodeURIComponent(filename));
        link.click();
        window.URL.revokeObjectURL(url);
        return Promise.resolve(response);
      } else {
        var payload = response.data || {};
        return Promise.reject(_this.$getResponseError(payload));
      }
    } else {
      return response;
    }
  });
};

var bind = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray$2(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer$1(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray$2(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge$1(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge$1(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge$1({}, val);
    } else if (isArray$2(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

var utils$1 = {
  isArray: isArray$2,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer$1,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge$1,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
var mergeConfig = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge(target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils$1.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils$1.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils$1.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils$1.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils$1.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils$1.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils$1.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils$1.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils$1.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils$1.forEach(otherKeys, mergeDeepProperties);

  return config;
};

var merge$2 = function merge(defaults, config) {
  config = mergeConfig(defaults, config);

  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (defaults.method) {
    config.method = defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  return config;
};

var fireBefore = function fireBefore(exHooks, config) {
  exHooks.forEach(function (_ref) {
    var onBefore = _ref.onBefore;
    return onBefore && onBefore(config);
  });
};

var fireComplete = function fireComplete(exHooks, config, isResolve, resOrErr) {
  exHooks.forEach(function (_ref2) {
    var onComplete = _ref2.onComplete;
    return onComplete && onComplete(config, isResolve, resOrErr);
  });
};

var complete = function complete(promise, exHooks, config) {
  promise.then(function (res) {
    return fireComplete(exHooks, config, true, res);
  })["catch"](function (e) {
    return e;
  });
  promise["catch"](function (err) {
    return fireComplete(exHooks, config, false, err);
  });
  return promise["catch"](function (err) {
    throw err;
  });
};
/**
 * 包装所有请求方法，实现相关钩子
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 * @param {AxiosInstance} instance 输入旧的实例
 * @returns {AxiosInstance} 输出新的实例
 */


function wrapAxios(instance) {
  var wrap = function wrap() {
    return wrap.request.apply(wrap, arguments);
  };

  _.each(instance, function (val, key) {
    wrap[key] = val;
  });

  wrap.exHooks = [];

  wrap.exHooks.add = function (obj) {
    var _this = this;

    var _id = _.uniqueId("".concat(Date.now()));

    this.push(_objectSpread2(_objectSpread2({}, obj), {}, {
      _id: _id
    }));
    return function () {
      var index = _this.findIndex(function (o) {
        return o._id === _id;
      });

      index > -1 && _this.splice(index, 1);
    };
  };

  wrap.request = function (config) {
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = merge$2(this.defaults, config);

    if (config.exNoHooks) {
      return instance.request.call(this, config);
    } else {
      fireBefore(this.exHooks, config);
      var promise = instance.request.call(this, config);
      return complete(promise, this.exHooks, config);
    }
  };

  var _loop = function _loop() {
    var method = _arr[_i];

    wrap[method] = function (url, config) {
      config = merge$2(this.defaults, _objectSpread2(_objectSpread2({}, config), {}, {
        method: method,
        url: url
      }));
      fireBefore(this.exHooks, config);
      var promise = instance[method].call(this, url, config);
      return complete(promise, this.exHooks, config);
    };
  };

  for (var _i = 0, _arr = ['delete', 'get', 'head', 'options']; _i < _arr.length; _i++) {
    _loop();
  }

  var _loop2 = function _loop2() {
    var method = _arr2[_i2];

    wrap[method] = function (url, data, config) {
      config = merge$2(this.defaults, _objectSpread2(_objectSpread2({}, config), {}, {
        method: method,
        url: url
      }));
      fireBefore(this.exHooks, config);
      var promise = instance[method].call(this, url, data, config);
      return complete(promise, this.exHooks, config);
    };
  };

  for (var _i2 = 0, _arr2 = ['post', 'put', 'patch']; _i2 < _arr2.length; _i2++) {
    _loop2();
  }

  return wrap;
}

var CancelToken = axios.CancelToken,
    Cancel = axios.Cancel;
var tokens = {};
/**
 * 请求前处理 config（尽可能在最先注册的拦截器中调用）
 * @param {import('axios').AxiosRequestConfig} config
 */

var setConfig = function setConfig(config) {
  var method = config.method,
      _config$baseURL = config.baseURL,
      baseURL = _config$baseURL === void 0 ? '' : _config$baseURL,
      url = config.url,
      exCancelName = config.exCancelName,
      cancelToken = config.cancelToken;
  var path = url.replace(/\?.*$/, '');
  var name = "".concat(method).concat(baseURL).concat(path);
  if (exCancelName === true) name = "".concat(method).concat(baseURL).concat(path);else if (/^\//.test(exCancelName)) name = "".concat(method).concat(baseURL).concat(exCancelName);else if (typeof exCancelName === 'string' && exCancelName) name = exCancelName;

  var token, _promise;

  if (cancelToken instanceof CancelToken) {
    token = cancelToken;
    _promise = cancelToken.promise;
  } else {
    token = new CancelToken(_.noop);
  }

  token.promise = new Promise(function (resolve) {
    _promise && _promise.then(resolve)["catch"](function (e) {
      return e;
    });
    token._exCancel_resolvePromise = resolve;
  });
  token._exCancel_id = _.uniqueId("".concat(Date.now()));
  config._exCancel.id = token._exCancel_id;
  config._exCancel.name = name;
  config.cancelToken = token;
  tokens[name] = tokens[name] || [];
  tokens[name].push(token);
  console.log('setConfig', config.url);
};
/**
 * 钩子函数
 * @type {import('axios').AxiosInstance['exHooks'][0]}
 */

var hooks = Object.freeze({
  onBefore: function onBefore(config) {
    console.log('onBefore', config.url);
    config._exCancel = {}; // 钩子与拦截器之间的通信对象

    if (config.exCancel) {
      var method = config.method,
          _config$baseURL2 = config.baseURL,
          baseURL = _config$baseURL2 === void 0 ? '' : _config$baseURL2,
          url = config.url,
          exCancel = config.exCancel;
      var path = url.replace(/\?.*$/, '');
      var names = Array.isArray(exCancel) ? exCancel : [exCancel];
      names = _.union(names).map(function (name) {
        if (name === true) return "".concat(method).concat(baseURL).concat(path);
        if (/^\//.test(name)) return "".concat(method).concat(baseURL).concat(name);
        if (typeof name === 'string') return name;
      });
      names = names.filter(Boolean);
      console.log('onBefore names', names);
      cancel(names);
    }
  },
  onComplete: function onComplete(config) {
    var _config$_exCancel = config._exCancel,
        id = _config$_exCancel.id,
        name = _config$_exCancel.name;
    var arr = tokens[name];

    if (id && arr) {
      var index = arr.findIndex(function (token) {
        return token._exCancel_id === id;
      });

      if (index > -1) {
        arr.splice(index, 1);
        if (arr.length === 0) delete tokens[name];
      }
    }
  }
});
/**
 * 取消未完成的请求
 * @param {string | string[]} name exCancelName 参数值对应的名称
 */

var cancel = function cancel(name) {
  var names = Array.isArray(name) ? name : [name];
  console.log('cancel tokens', tokens);

  _.each(tokens, function (val, key) {
    console.log(1, val, key);

    if (names.includes(key)) {
      val.forEach(function (token) {
        if (token.reason) return;
        token.reason = new Cancel('exCancel');

        token._exCancel_resolvePromise(token.reason);
      });
      delete tokens[key];
    }
  });
};

/**
 * HTTP 请求错误信息集合
 */
var HttpError = {
  exCancel: '请求频率过快',
  "default": '网络走神了,请稍后再试',
  cancel: '请求已取消',
  network: '网络异常或服务器连接失败',
  aborted: '请求被中止',
  timeout: '请求服务器响应超时，请求已经被中断',
  // 3xx: 重定向，需要进一步的操作以完成请求
  301: '请求的资源已被永久的移动到新URI',
  302: '请求的资源临时被移动，请重新发送请求',
  303: '请求的资源已被永久的移动到新URI，使用GET和POST请求查看',
  304: '所请求资源未变动，已使用本地缓存资源进行访问',
  305: '所请求的资源必须通过代理访问',
  306: '请求的资源已被移动',
  307: '请求的资源临时被移动，使用GET请求重定向',
  // 4xx: 客户端错误
  400: '客户端请求发生语法错误，服务器无法处理该请求',
  401: '被请求的页面需要进行身份验证',
  402: '未知客户端错误',
  403: '所请求页面的禁止访问',
  404: 'Not Found，所请求地址不存在',
  405: '请求中指定的方法被禁止使用',
  406: '服务器无法根据客户端请求的内容特性完成请求',
  407: '用户必须首先使用代理服务器进行验证并授权',
  408: '服务器等待客户端发送的请求已超时',
  409: '由于冲突，请求无法被完成',
  410: '指定请求的页面已经被移动或不存在',
  411: '服务器无法处理客户端发送的不带 Content-Length 的请求信息',
  412: '请求失败，请求中前提条件有错误',
  413: '由于所请求的实体的太大，服务器拒绝处理该请求',
  414: '请求的URI过长（URI通常为网址），服务器无法处理',
  415: '服务器无法处理请求附带的媒体格式',
  416: '客户端请求的范围 Range 无效',
  417: '服务器无法满足 Expect 的请求头信息',
  // 5xx: 服务器错误
  500: '服务器内部错误，无法完成请求',
  501: '服务器不支持所请求的功能，无法完成请求',
  502: '充当网关或代理的服务器，从远端服务器接收到了一个无效的请求',
  503: '由于超载或系统维护，服务器暂时的无法处理客户端的请求',
  504: '充当网关或代理的服务器，未及时从远端服务器获取请求',
  505: '服务器不支持请求中指明的HTTP协议版本'
};
/**
 * 将新的提示错误描述信息覆盖旧的信息
 * @param {Object} options 新的错误信息配置，如{404:'页面未找到'}
 */

HttpError.merge = function (options) {
  Object.assign(HttpError, options);
};
/**
 * 根据 HTTP 错误对象分析对应的错误详细内容
 * @param {{request,response:{status}}} error
 * @returns {string}
 */


HttpError.info = function (error) {
  var type = _typeof(error); // err.response.status


  switch (type) {
    case 'undefined':
      {
        return formatError(HttpError.network);
      }

    case 'object':
      {
        if (error.response && error.response.status && HttpError[error.response.status]) {
          return formatError("[".concat(error.response.status, "] ").concat(HttpError[error.response.status]), 'server', error.response.status);
        } else if (error instanceof Error) {
          // 超时
          if (/^timeout of/i.test(error.message)) {
            return formatError(HttpError.timeout, 'timeout');
          } else if (/^network/i.test(error.message)) {
            return formatError(HttpError.network, 'network');
          } else {
            return formatError(error.message);
          }
        } else if (/^cancel/i.test(error.toString())) {
          var name = error['message']; // 请求过快

          if ('exCancel' === name) {
            return formatError(HttpError['exCancel'], 'exCancel');
          } else {
            return formatError(HttpError.cancel, 'cancel');
          }
        }

        return formatError(HttpError["default"]);
      }

    case 'string':
      {
        return formatError(error);
      }

    default:
      {
        return formatError(HttpError["default"]);
      }
  }
};

function formatError(message) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'error';
  var status = arguments.length > 2 ? arguments[2] : undefined;
  return {
    message: message,
    name: name,
    status: status
  };
}

/**
 * 全局请求扩展配置
 * 添加一个请求拦截器 （于transformRequest之前处理）
 */

var axiosConfig = {
  success: function success(config) {
    //   // 在请求开始前，对之前的请求做检查取消操作
    //   removePending(config);
    //   // 将当前请求添加到 pending 中
    //   addPending(config);
    var headers = config.headers;
    var ContentType = headers['Content-Type'] || ''; // 只有 ‘application/x-www-form-urlencoded’模式才需要对post的data做序列化

    if (config.data && ContentType.indexOf('application/x-www-form-urlencoded') > -1) {
      config.data = qs.stringify(config.data);
    }

    setConfig(config);
    return config;
  },
  error: function error(_error) {
    return Promise.reject(_error);
  }
};
/**
 * 全局请求响应处理
 * 添加一个返回拦截器 （于transformResponse之后处理）
 * 返回的数据类型默认是json，若是其他类型（text）就会出现问题，因此用try,catch捕获异常
 */

var axiosResponse = {
  success: function success(response) {
    // 如果是流文件则直接返回
    if (response.config && response.config.responseType === 'blob') {
      return Promise.resolve(response);
    } // 数据结果根据`content-type`来操作json数据以及文件流


    if (response.config && response.config.responseType === 'arraybuffer') {
      var headers = response.headers || {};
      var contentType = headers['content-type'] || '';
      var isJSON = contentType.indexOf('application/json') > -1;

      if (isJSON) {
        try {
          var _payload = JSON.parse(Buffer.from(response.data).toString('utf8'));

          if (this.$isResponseSuccess(_payload)) {
            return this.$getResponseSuccess(_payload);
          } else {
            return Promise.reject(this.$getResponseError(_payload));
          }
        } catch (err) {
          return Promise.reject({
            message: err.message,
            data: err
          });
        }
      } else {
        return response;
      }
    }

    var payload = response.data || {};

    if (this.$isResponseSuccess(payload)) {
      var result = this.$getResponseSuccess(payload);
      console.log('[业务正常]', result);
      return result;
    } else {
      var _result = this.$getResponseError(payload);

      console.log('[业务异常]', _result);
      return Promise.reject(_result);
    }
  },
  error: function error(err) {
    var _this = this;

    var config = err.config; // If config does not exist or the retry option is not set, reject

    if (!config || !config.exRetry) {
      var result = HttpError.info(err);
      return Promise.reject(result);
    } // 请求不再经过hook


    config.exNoHooks = true; // Set the variable for keeping track of the retry count

    config.__retryCount = config.__retryCount || 0;
    config.retry = config.retry || 3;
    config.retryDelay = config.retryDelay || 1000; // Check if we've maxed out the total number of retries

    if (config.__retryCount >= config.retry) {
      // Reject with the error
      var _result2 = HttpError.info(err);

      return Promise.reject(_result2);
    } // Increase the retry count


    config.__retryCount += 1;
    console.log("[\u5F00\u59CB\u7B2C".concat(config.__retryCount, "\u6B21\u91CD\u8BD5] \u603B\u5171").concat(config.retry, "\u6B21")); // Create new promise to handle exponential backoff

    var backoff = new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, config.retryDelay || 1);
    }); // Return the promise in which recalls axios to retry the request

    return backoff.then(function () {
      return _this.request(config);
    });
  }
};
/**
 * @param {Parameters<axios['create']>[0]} requestConfig
 * @param {(instance: ReturnType<axios['create']>) => any} [callback]
 */

var createAxios = function createAxios(requestConfig, callback) {
  var _requestConfig$isResp = requestConfig.isResponseSuccess,
      isResponseSuccess = _requestConfig$isResp === void 0 ? function () {
    return true;
  } : _requestConfig$isResp,
      _requestConfig$getRes = requestConfig.getResponseError,
      getResponseError = _requestConfig$getRes === void 0 ? function (res) {
    return res;
  } : _requestConfig$getRes,
      _requestConfig$getRes2 = requestConfig.getResponseSuccess,
      getResponseSuccess = _requestConfig$getRes2 === void 0 ? function (res) {
    return res;
  } : _requestConfig$getRes2,
      rest = _objectWithoutProperties(requestConfig, ["isResponseSuccess", "getResponseError", "getResponseSuccess"]);

  var defaults = {
    /* 默认配置 */
    // paramsSerializer: params => qsStringify(params),
  };

  var _axios = axios.create(mergeConfig(defaults, rest));

  var instance = wrapAxios(_axios);
  instance.$uploadFile = uploadFile;
  instance.$downloadFile = downloadFile;
  instance.$isResponseSuccess = isResponseSuccess;
  instance.$getResponseError = getResponseError;
  instance.$getResponseSuccess = getResponseSuccess;
  instance.exHooks.add(hooks);
  instance.interceptors.request.use(axiosConfig.success, axiosConfig.error);
  instance.interceptors.response.use(function (config) {
    return axiosResponse.success.call(instance, config);
  }, function (error) {
    return axiosResponse.error.call(instance, error);
  });
  callback && callback(instance);
  return instance;
};

// 遍历递归处理数据 obj 元数据   map 映射 {status:{newKey:'$status'}}
function deepMapHandler() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var map = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // 判断原目标是数组还是对象，进行初始化赋值
  var newObj = obj.constructor === Array ? [] : {};
  responseMapHandler(obj, map); // 循环原目标

  for (var key in obj) {
    // 判断当前值是否存在
    if (obj.hasOwnProperty(key)) {
      // 判断是否当前要拷贝的是否是对象
      if (obj[key] && _typeof(obj[key]) === 'object') {
        // 是对象，再次调用deepClone递归
        newObj[key] = deepMapHandler(obj[key], map);
      } else {
        // 数组，直接赋值就好
        newObj[key] = obj[key];
      }
    }
  }

  return newObj;
}

function responseMapHandler() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var map = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Object.keys(map).forEach(function (key) {
    var target = map[key];
    var value = data[key];

    if (data.hasOwnProperty(key)) {
      if (typeof target === 'string') {
        data[target] = value;
      } else if (_typeof(target) === 'object') {
        var _target$newKey = target.newKey,
            newKey = _target$newKey === void 0 ? "$".concat(key) : _target$newKey,
            handler = target.handler,
            replace = target.replace,
            dict = target.dict;

        try {
          var newValue = value; // 字典枚举查询

          if (dict) {
            var _dict = {};

            if (typeof dict === 'function') {
              _dict = dict();
            }

            var options = _dict.options || [];
            options.forEach(function (item) {
              if (item.value == value) {
                newValue = item.label;
              }
            });
          }

          if (handler) {
            newValue = handler(value, data);
          }

          data[newKey] = newValue;

          if (replace) {
            delete data[key];
          }
        } catch (err) {}
      } else if (typeof target === 'function') {
        data[key] = target(value, data);
      }
    }
  });
}

function createAPI(http) {
  var interceptors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var apis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var interceptorsMAP = {};
  interceptors.map(function (item) {
    var name = item.name,
        method = item.method,
        url = item.url;
    name = name || url;
    var key = name + method;

    if (interceptorsMAP[key]) {
      console.error("[createAPI error]: \u51FA\u73B0\u91CD\u590D\u62E6\u622A\u5668 ".concat(name, " ").concat(method), item);
    } else {
      interceptorsMAP[key] = 1;
    }
  });
  var API = new Proxy(apis, {
    get: function get(target, name) {
      var methods = ['get', 'post', 'put', 'delete', 'patch'];

      if (methods.indexOf(name) > -1) {
        return function () {
          var method = name;
          var url = arguments.length <= 0 ? undefined : arguments[0];
          var params = arguments.length <= 1 ? undefined : arguments[1];
          var config = arguments.length <= 2 ? undefined : arguments[2];
          var interceptor = interceptors.filter(function (item) {
            return item.name === url && item.method === method;
          })[0];
          interceptor = interceptor || {
            onBefore: function onBefore() {},
            onSuccess: function onSuccess() {},
            config: {}
          }; // console.log(arg, url, method, interceptor)

          var callback = function callback() {
            var uri = interceptor.url || url;
            var description = interceptor.description || '';
            interceptor.onBefore(params);
            return http.request(_objectSpread2(_objectSpread2({
              method: method,
              url: uri,
              body: params,
              description: description
            }, interceptor.config), config)).then(function (res) {
              var _res$data = res.data,
                  data = _res$data === void 0 ? {} : _res$data;
              var responseMap = interceptor.responseMap;

              if (responseMap) {
                deepMapHandler(data, responseMap);
              }

              var result = interceptor.onSuccess(res);

              if (result) {
                return result;
              } else {
                return res;
              }
            });
          };

          return callback();
        };
      } else if (typeof target[name] === 'function') {
        return function () {
          for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
            arg[_key] = arguments[_key];
          }

          return target[name].apply(null, arg);
        };
      } else {
        var names = name.split('_');
        var method = names.splice(0, 1)[0];
        var uri = names.map(function (name) {
          if (name.indexOf('$') > -1) {
            name = name.replace('$', '');
            return "{".concat(name, "}");
          } else {
            return '/' + name;
          }
        }).join('');
        console.log('uri', uri); // 'get' | 'delete' | 'post' | 'put' | 'patch'

        if (methods.indexOf(method) > -1) {
          return function () {
            var callback = function callback(params, config) {
              return http.request(_objectSpread2({
                method: method,
                url: uri,
                body: params
              }, config));
            };

            for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              arg[_key2] = arguments[_key2];
            }

            return callback.apply(apis, arg);
          };
        } else {
          return function () {
            return Promise.reject({
              message: "[".concat(name, "] \u51FD\u6570\u4E0D\u5B58\u5728")
            });
          };
        }
      }
    }
  });
  return API;
}

/* axios 中文文档：http://www.axios-js.com/zh-cn/docs/ */
var isCancel = axios.isCancel;
var HTTP = {
  axios: axios,
  createAxios: createAxios,
  cancel: cancel,
  isCancel: isCancel,
  createAPI: createAPI,
  toFormData: toFormData,
  qsStringify: qsStringify
};

/**
 * 加法函数，用来得到精确的加法结果<br>
 * javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 *
 * @param {number} arg1
 * @param {number} arg2
 * @returns {number} arg1加上arg2的精确结果
 * @example
 *
 * accAdd(0.1, 0.2)
 * // => 0.3
 */
function accAdd(arg1, arg2) {
  var r1;
  var r2;
  var m;
  var c;

  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }

  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }

  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));

  if (c > 0) {
    var cm = Math.pow(10, c);

    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', '')) * cm;
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm;
      arg2 = Number(arg2.toString().replace('.', ''));
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''));
    arg2 = Number(arg2.toString().replace('.', ''));
  }

  return (arg1 + arg2) / m;
}

/**
 * 除法函数，用来得到精确的除法结果<br>
 * javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 *
 * @param {number} arg1
 * @param {number} arg2
 * @returns {number} arg1除以arg2的精确结果
 * @example
 *
 * accDiv(0.2, 0.3)
 * // => 0.6666666666666666
 */
function accDiv(arg1, arg2) {
  var t1 = 0;
  var t2 = 0;
  var r1;
  var r2;

  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    console.error(e);
  }

  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    console.error(e);
  }

  r1 = Number(arg1.toString().replace('.', ''));
  r2 = Number(arg2.toString().replace('.', ''));
  return r1 / r2 * Math.pow(10, t2 - t1);
}

/**
 * 乘法函数，用来得到精确的乘法结果<br>
 * javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 *
 * @param {number} arg1
 * @param {number} arg2
 * @returns {number} arg1乘以arg2的精确结果
 * @example
 *
 * accMul(0.222, 0.3333)
 * // => 0.0739926
 */
function accMul(arg1, arg2) {
  var m = 0;
  var s1 = arg1.toString();
  var s2 = arg2.toString();

  try {
    s1.split('.')[1] && (m += s1.split('.')[1].length);
  } catch (e) {
    console.error(e);
  }

  try {
    s2.split('.')[1] && (m += s2.split('.')[1].length);
  } catch (e) {
    console.error(e);
  }

  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
}

/**
 * 减法函数，用来得到精确的减法结果<br>
 * javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 *
 * @param {number} arg1
 * @param {number} arg2
 * @returns {number} arg1减去arg2的精确结果
 * @example
 *
 * accSub(0.3, 0.2)
 * // => 0.1
 */
function accSub(arg1, arg2) {
  var r1;
  var r2;
  var m;
  var n;

  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }

  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }

  m = Math.pow(10, Math.max(r1, r2)); // last modify by deeka //动态控制精度长度

  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
 * 为数字加上单位：万或亿
 *
 * @param {number} number 输入数字.
 * @param {number} decimalDigit 返回的小数点后最多的位数，默认为 2
 * @return {*} 加上单位后的数字（计算结果有时会有精度问题）
 * @example
 *
 * addChineseUnit(1000.01)
 * // => 1000.01
 *
 * addChineseUnit(10000)
 * // => 1万
 *
 * addChineseUnit(99000)
 * // => 9.9万
 *
 * addChineseUnit(566000)
 * // => 56.6万
 *
 * addChineseUnit(5660000)
 * // => 566万
 *
 * addChineseUnit(44440000)
 * // => 4444万
 *
 * addChineseUnit(11111000)
 * // => 1111.1万
 *
 * addChineseUnit(444400000)
 * // => 4.44亿
 *
 * addChineseUnit(400000000000000000000000)
 * // => 3999.99万亿亿
 *
 * addChineseUnit(4000000000000000000000000)
 * // => 4亿亿亿
 */
function addChineseUnit(number, decimalDigit) {
  var addWan = function addWan(integer, number, mutiple, decimalDigit) {
    var digit = getDigit(integer);

    if (digit > 3) {
      var remainder = digit % 8;

      if (remainder >= 5) {
        // ‘十万’、‘百万’、‘千万’显示为‘万’
        remainder = 4;
      }

      return Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) / Math.pow(10, decimalDigit) + '万';
    } else {
      return Math.round(number / Math.pow(10, mutiple - decimalDigit)) / Math.pow(10, decimalDigit);
    }
  };

  var getDigit = function getDigit(integer) {
    // 当为负数时的会出现不转换的问题，因此取绝对值
    integer = Math.abs(integer);
    var digit = -1;

    while (integer >= 1) {
      digit++;
      integer = integer / 10;
    }

    return digit;
  };

  return function (number, decimalDigit) {
    decimalDigit = decimalDigit == null ? 2 : decimalDigit;
    var integer = Math.floor(number);
    var digit = getDigit(integer); // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];

    var unit = [];

    if (digit > 3) {
      var multiple = Math.floor(digit / 8);

      if (multiple >= 1) {
        var tmp = Math.round(integer / Math.pow(10, 8 * multiple));
        unit.push(addWan(tmp, number, 8 * multiple, decimalDigit));

        for (var i = 0; i < multiple; i++) {
          unit.push('亿');
        }

        return unit.join('');
      } else {
        return addWan(integer, number, 0, decimalDigit);
      }
    } else {
      return parseFloat(number).toFixed(decimalDigit);
    }
  }(number, decimalDigit);
}
/**
 * 2020-3-18 23:11:54
 * 支持负值格式转换
 * eg:
 * -123456.33 -> "-123.46万"
 */

/**
 * 识别股票代码添加市场后缀
 *
 * @param {string} stock 股票代码
 * @returns {string}
 * @example
 *
 * appendStockSuffix('600570')
 * // => '600570.SS'
 */
function appendStockSuffix(stock) {
  var regSS = /^(((700|730|900|600|601|580)[\d]{3})|60[\d]{4})$/;
  var regSZ = /^(((000|002|200|300|080|031)[\d]{3}|00[\d]{4}))$/;

  if (regSS.test(stock)) {
    stock = stock + '.SS';
  } else if (regSZ.test(stock)) {
    stock = stock + '.SZ';
  }

  return stock;
}

/**
 * 加密算法
 * 1.所有入参加入集合M，参数名做key, 值做value
 * 2.提供的密钥1（字段名appid）与密钥2（字段名secret）两项，以及当前时间戳（字段名time)也加入集合M,
 * 3.将集合M内非空参数值的参数按照参数名ASCII码从小到大排序（字典序）
 * 4.集合M所有值拼接成字符串，转化成UTF-8编码格式的字节数组, 最后需要取MD5码（signature摘要值）
 *
 * @param {object} params
 * @example
 *
 * const params = { mobile: '15858264900', nickname: 'liwb', appkey: 'ertfgdf345435568123454rtoiko5=' };
 *
 * md5(encrypt(params).toUpperCase());
 * // => md5('APPKEY=ERTFGDF34543545=&MOBILE=15858264903&NICKNAME=LIWB')
 */
function encrypt(params) {
  // 顺序排列key
  var keys = Object.keys(params).sort();
  var str = [];
  keys.forEach(function (p) {
    str.push(p + '=' + params[p]);
  });
  return str.join('&');
}

/**
 * 将from所有的键值对都添加到to上面去，返回to
 *
 * @param {Object} to
 * @param {Object} from
 * @returns {*}
 * @example
 *
 * const from = {mobile: '15858264903', nickname: 'liwb'};
 * const to = {nickname: 'cklwb'};
 *
 * extend(to, from);
 * // => {nickname: "liwb", mobile: "15858264903"}
 */
function extend$1(to, from) {
  var keys = Object.keys(from);
  var i = keys.length;

  while (i--) {
    to[keys[i]] = from[keys[i]];
  }

  return to;
}

/**
 * 格式化银行卡<br>
 * 用户在输入银行卡号时，需要以4位4位的形式显示，就是每隔4位加个空格，方便用户校对输入的银行卡是否正确<br>
 * **注：**一般数据库里面存的都是不带格式的原始数据，所以提交的时候记得过滤下空格再提交哦。毕竟格式化这种算是表现层，前端展示的时候处理下就好，业务逻辑什么用到的卡号可不是格式化后的呢。<br>
 * 还原`val.replace(/\s/g, '');`
 *
 * @param {string} val
 * @returns {*}
 * @example
 *
 * formatBankCard('6225365271562822');
 * // => 6225 3652 7156 2822
 */
function formatBankCard(val) {
  if (typeof val !== 'string') throw new Error('输入值必须为字符串');
  var len = val.length;
  var reg = /(\d{4})(?=\d)/g;

  if (len < 4) {
    return val;
  } else {
    return val.replace(reg, '$1 ');
  }
}

/**
 * Date 转化为指定格式的String<br>
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)可以用 1-2 个占位符<br>
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *
 * @param {string | number} date string支持形式：20160126 12:00:00，2016-01-26 12:00:00，2016.01.26 12:00:00，20160126，2016-01-26 12:00:00.0
 * @param {string} fmt
 * @returns {string}
 * @example
 *
 * formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss.S');
 * // => 2006-07-02 08:09:04.423
 *
 * formatDate(Date.now(), 'yyyy-MM-dd E HH:mm:ss');
 * // => 2009-03-10 二 20:09:04
 *
 * formatDate(Date.now(), 'yyyy-MM-dd EE hh:mm:ss');
 * // => 2009-03-10 周二 08:09:04
 *
 * formatDate(Date.now(), 'yyyy-MM-dd EEE hh:mm:ss');
 * // => 2009-03-10 星期二 08:09:04
 *
 * formatDate(Date.now(), 'yyyy-M-d h:m:s.S')
 * // => 2006-7-2 8:9:4.18
 */
function formatDate() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var fmt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-MM-dd HH:mm:ss';

  if (typeof date === 'string') {
    date = new Date(formatTimeByPattern(date));
  } else if (typeof date === 'number') {
    date = new Date(date);
  }

  var o = {
    'M+': date.getMonth() + 1,
    // 月份
    'd+': date.getDate(),
    // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    // 小时
    'H+': date.getHours(),
    // 小时
    'm+': date.getMinutes(),
    // 分
    's+': date.getSeconds(),
    // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3),
    // 季度
    'S': date.getMilliseconds() // 毫秒

  };
  var week = {
    '0': "\u65E5",
    '1': "\u4E00",
    '2': "\u4E8C",
    '3': "\u4E09",
    '4': "\u56DB",
    '5': "\u4E94",
    '6': "\u516D"
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "\u661F\u671F" : "\u5468" : '') + week[date.getDay() + '']);
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }

  return fmt;
} // val 字符串转换成 / 连接
// 20160126 12:00:00
// 2016-01-26 12:00:00
// 2016.01.26 12:00:00
// 20160126
// 2016-01-26 12:00:00.0


function formatTimeByPattern(val) {
  // 2016-05-23 13:58:02.0
  if (val.length > 19) {
    val = val.substring(0, 19);
  }

  var pattern = /-|\./g;
  var year;
  var month;
  var day;
  var reset;

  if (pattern.test(val)) {
    return val.replace(pattern, '/');
  } else {
    // 若无’-‘，则不处理
    if (!~val.indexOf('-')) {
      year = val.slice(0, 4);
      month = val.slice(4, 6);
      day = val.slice(6, 8);
      reset = val.slice(8);
      return year + '/' + month + '/' + day + reset;
    }
  }
}

/**
 * 将时间转化为几天前,几小时前，几分钟前
 *
 * @param {number} ms
 * @returns {*}
 * @example
 *
 * formatTimeAgo(1505232000000);
 * // => 1天前
 */
function formatTimeAgo(ms) {
  ms = parseInt(ms);
  var timeNow = Date.now();
  var diff = (timeNow - ms) / 1000;
  var date = new Date();
  var days = Math.round(diff / (24 * 60 * 60));
  var hours = Math.round(diff / (60 * 60));
  var minutes = Math.round(diff / 60);
  var second = Math.round(diff);

  if (days > 0 && days < 2) {
    return days + '天前';
  } else if (days <= 0 && hours > 0) {
    return hours + '小时前';
  } else if (hours <= 0 && minutes > 0) {
    return minutes + '分钟前';
  } else if (minutes <= 0 && second >= 0) {
    return '刚刚';
  } else {
    date.setTime(ms);
    return date.getFullYear() + '-' + f(date.getMonth() + 1) + '-' + f(date.getDate()) + ' ' + f(date.getHours()) + ':' + f(date.getMinutes());
  }

  function f(n) {
    return n < 10 ? '0' + n : n;
  }
}

/**
 * 获取指定时间unix时间戳
 *
 * @param {string} time
 * @returns {number}
 * @example
 *
 * formatDateToTimeStamp('20160126 12:00:00');
 * // => 1453780800000
 *
 * formatDateToTimeStamp('2016-01-26 12:00:00');
 * // => 1453780800000
 *
 * formatDateToTimeStamp('2016.01.26 12:00:00');
 * // => 1453780800000
 *
 * formatDateToTimeStamp('20160126');
 * // => 1453737600000
 *
 * formatDateToTimeStamp('2016-01-26 12:00:00.0');
 * // => 1453780800000
 */
function formatDateToTimeStamp(time) {
  if (typeof time !== 'string') throw new TypeError('数据类型必须是 string'); // 2016-05-23 13:58:02.0

  if (time.length > 19) {
    time = time.substring(0, 19);
  }

  var unixTime;
  var pattern = /-|\./g;
  var year;
  var month;
  var day;
  var reset;

  if (pattern.test(time)) {
    unixTime = time.replace(pattern, '/');
  } else {
    // 若无’-‘，则不处理
    if (!~time.indexOf('-')) {
      year = time.slice(0, 4);
      month = time.slice(4, 6);
      day = time.slice(6, 8);
      reset = time.slice(8);
      unixTime = year + '/' + month + '/' + day + reset;
    }
  }

  return Math.round(new Date(unixTime).getTime());
}

/**
 * 用符号（默认为逗号）格式化金钱
 *
 * @param {string} val
 * @param {string} symbol 默认`,`
 * @returns {string|*|XML|void}
 * @example
 *
 * formatMoney('1234567890');
 * // => 1,234,567,890
 */
function formatMoney(val) {
  var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';
  if (typeof val !== 'string') throw new TypeError('数据类型必须是 string');
  return val.replace(/\B(?=(\d{3})+(?!\d))/g, symbol);
}

/**
 * 手机号码中间部分替换成指定符号
 *
 * @param {string} phone
 * @param {string} symbol 默认为`*`
 * @returns {string|*|XML|void}
 * @example
 *
 * formatPhone('15858264903');
 * // => 158****4903
 */
function formatPhone(phone) {
  var symbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '****';
  if (typeof phone !== 'string') throw new TypeError('数据类型必须是 string');
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1".concat(symbol, "$2"));
}

/**
 * 获取location.href参数
 *
 * @param {string} name
 * @returns {*}
 * @example
 *
 * window.location.href = 'http://www.baidu.com/?a=1&b=2';
 *
 * getLocationHrefParam('a');
 * // => 1
 */
function getLocationHrefParam(name) {
  // 构造一个含有目标参数的正则表达式对象
  var r = new RegExp('(\\?|#|&)' + name + '=([^&#]*)(&|#|$)');
  var m = window.location.href.match(r);
  if (r !== null) return decodeURIComponent(!m ? '' : m[2]);
  return null;
}

/**
 * 获取location.search的参数
 *
 * @param {string} name
 * @returns {*}
 * @example
 *
 * window.location.href = 'http://www.baidu.com/?a=1&b=2';
 *
 * getLocationSearchParam('a');
 * // => 1
 */
function getLocationSearchParam(name) {
  // 构造一个含有目标参数的正则表达式对象
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 匹配目标参数

  var r = window.location.search.substr(1).match(reg);
  if (r !== null) return decodeURIComponent(r[2]);
  return null;
}

/**
 * 是否为空对象
 *
 * @param val
 * @returns {boolean}
 * @example
 *
 * isEmptyObject({});
 * // => true
 */
function isEmptyObject(val) {
  if (val !== Object(val)) return false;
  return Object.keys(val).length === 0;
}

/**
 * 根据参数获取对应的值
 *
 * @param {string} name
 * @returns {*}
 * @example
 *
 * // window.location.href: 'http://www.baidu.com/?a=1&b=2&state=broker:aaaa1111ccc;tenant:asdfasdf;view_tag:2;
 * getUrlNames('state');
 * // => {broker: "aaaa1111ccc", tenant: "asdfasdf", view_tag: "2"}
 */

function getUrlNames(name) {
  var urlParam = getLocationHrefParam(name);
  var o = {};

  if (urlParam) {
    var str = urlParam.split(';');

    for (var i = 0, len = str.length; i < len; i++) {
      if (str[i].indexOf(':') !== -1) {
        var str1 = str[i].split(':');
        o[str1[0]] = str1[1];
      }
    }
  }

  return !isEmptyObject(o) ? o : '';
}

/**
 * 生成guid
 *
 * @returns {string}
 * @example
 *
 * generateGUID();
 * // => 1e508ed6-6177-498d-c2a3-467f546db6ab
 */
function generateGUID() {
  var d = Date.now();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x7 | 0x8).toString(16);
  });
  return uuid;
}

/**
 * 获取max与min之间的随机数
 *
 * @param {number} min
 * @param {number} max
 * @returns {*}
 * @example
 *
 * getRandomInt(1, 9);
 * // => 2
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * html字符解码
 *
 * @param {string} str
 * @returns {string}
 * @example
 *
 * htmlDecode('&lt;script&gt;');
 * // => <script>
 */
function htmlDecode(str) {
  if (typeof str === 'string' && str.length === 0) return;
  var s = str.replace(/&amp;/g, '&');
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/<br>/g, '\\n');
}

/**
 * html字符编码
 *
 * @param {string} str
 * @returns {string}
 * @example
 *
 * htmlEncode('<script>');
 * // => &lt;script&gt;
 */
function htmlEncode(str) {
  if (typeof str === 'string' && str.length === 0) return;
  var s = str.replace(/&/g, '&amp;');
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\'/g, '&#39;').replace(/ /g, '&nbsp;').replace(/\"/g, '&quot;').replace(/\n/g, '<br>');
}

/**
 * 是否是支付宝内核
 *
 * @returns {boolean}
 * @example
 *
 * inAlipay();
 * // => false
 */
function inAlipay() {
  if (typeof navigator === 'undefined') return;
  var ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('alipayclient') !== -1;
}

/**
 * 是否是微信内核
 *
 * @returns {boolean}
 * @example
 *
 * inWeixin();
 * // => false
 */
function inWeixin() {
  if (typeof navigator === 'undefined') return;
  var ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('micromessenger') !== -1;
}

/**
 * 是否为有效的身份证号,支持1/2代(15位/18位数字)
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isCardId('411423198807127834');
 * // => true
 */
function isCardId(val) {
  var reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
  return reg.test(val);
}

/**
 * 是否为数字
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isDigit('abc');
 * // => false
 */
function isDigit(val) {
  var reg = /^-?\d+\.?\d*$/;
  return reg.test(val);
}

/**
 * 是否为闰年
 *
 * @param {number} val
 * @returns {boolean}
 * @example
 *
 * isLeapYear(2000);
 * // => true
 */
function isLeapYear(val) {
  if (typeof val !== 'number') throw new TypeError('数据类型必须是 number');

  if (val % 4 === 0 && val % 100 !== 0) {
    return true;
  } else {
    return val % 400 === 0;
  }
}

/**
 * 是否为字母
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isLetters('1234');
 * // => false
 */
function isLetters(val) {
  var reg = /^[a-z]+$/i;
  return reg.test(val);
}

/**
 * 是否为有效的车牌号码
 *
 * 1.常规车牌号：仅允许以汉字开头，后面可录入六个字符，由大写英文字母和阿拉伯数字组成。如：粤B12345；<br>
 * 2.武警车牌：允许前两位为大写英文字母，后面可录入七个字符，由大写英文字母和阿拉伯数字组成，其中第三位可录汉字也可录大写英文字母及阿拉伯数字，如：WJ01警0081、WJ0112345。<br>
 * 3.最后一个为汉字的车牌：允许以汉字开头，后面可录入六个字符，前五位字符，由大写英文字母和阿拉伯数字组成，而最后一个字符为汉字，汉字包括“挂”、“学”、“警”、“军”、“港”、“澳”。<br>如：粤Z1234港。
 * 4.新军车牌：以两位为大写英文字母开头，后面以5位阿拉伯数字组成。如：BA12345。<br>
 * 5.黑龙江车牌存在08或38开头的情况。<br>
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isLicenseNo('浙A12345');
 * // => true
 */
function isLicenseNo(val) {
  var reg = /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/;
  return reg.test(val);
}

/**
 * 是否为有效的手机号，中国手机号(宽松), 只要是13,14,15,16,17,18,19开头即可
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isMobile('15898745678');
 * // => true
 */
function isMobile(val) {
  var reg = /^[1][3456789]\d{9}$/;
  return reg.test(val);
}

/**
 * 是否为有效的日期格式<br>
 * 格式为 yyyy-mm-dd 或 yyyy-mm-dd HH:mm:ss
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidDate('2015-01-20');
 * // => true
 */
function isValidDate(val) {
  var dateReg = /^\d{4}-\d{2}-\d{2}$/;
  var timeReg = /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/;
  return dateReg.test(val) || timeReg.test(val);
}

/**
 * 是否为有效的邮箱地址<br>
 * 名称允许汉字、字母、数字，域名只允许英文域名<br>
 * 中文如：杨元庆001Abc@lenovo.com.cn
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidEmail('123456@qq.com');
 * // => true
 */
function isValidEmail(val) {
  var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i;
  return reg.test(val);
}

/**
 * 是否为有效的 qq
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidQQ('814563410');
 * // => true
 */
function isValidQQ(val) {
  var reg = /^[1-9][0-9]{4,10}$/;
  return reg.test(val);
}

/**
 * 是否为有效的 url<br>
 *
 * 支持类型:<br>
 * http(s)://(username:password@)(www.)domain.(com/co.uk)(/...)<br>
 * (s)ftp://(username:password@)domain.com/...<br>
 * git://(username:password@)domain.com/...<br>
 * irc(6/s)://host:port/... //<br>
 * afp over TCP/IP: afp://[<user>@]<host>[:<port>][/[<path>]]<br>
 * telnet://<user>:<password>@<host>[:<port>/]<br>
 * smb://[<user>@]<host>[:<port>][/[<path>]][?<param1>=<value1>[;<param2>=<value2>]]<br>
 *
 * @param {string} url
 * @returns {*}
 * @example
 *
 * isValidURI('https://github.com/lodash');
 * // => true
 */
function isValidURI(url) {
  var protocols = '((https?|s?ftp|irc[6s]?|git|afp|telnet|smb):\\/\\/)?';
  var userInfo = '([a-z0-9]\\w*(\\:[\\S]+)?\\@)?';
  var domain = '([a-z0-9]([\\w]*[a-z0-9])*\\.)?[a-z0-9]\\w*\\.[a-z]{2,}(\\.[a-z]{2,})?';
  var port = '(:\\d{1,5})?';
  var ip = '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}';
  var address = '(\\/\\S*)?';
  var domainType = [protocols, userInfo, domain, port, address];
  var ipType = [protocols, userInfo, ip, port, address];

  var verify = function verify(type) {
    return new RegExp('^' + type.join('') + '$', 'i').test(url);
  };

  return verify(domainType) || verify(ipType);
}

/**
 * 是否为有效的中国邮政编码
 *
 * @param val
 * @returns {boolean}
 * @example
 *
 * isValidZipcode('330561');
 * // => true
 */
function isValidZipcode(val) {
  var reg = /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/;
  return reg.test(val);
}

/**
 * 对整数进行前置补0
 *
 * @param {number} num 数值
 * @param {number} size 要补0的位数
 * @returns {string}
 * @example
 *
 * preZeroFill(12, 3);
 * // => 012
 */
function preZeroFill(num, size) {
  if (num >= Math.pow(10, size)) {
    return num.toString();
  } else {
    var _str = Array(size + 1).join('0') + num;

    return _str.slice(_str.length - size);
  }
}

/**
 * 将字节转换成友好格式，如Bytes，KB，MB
 *
 * @param {string} bytes
 * @returns {*}
 * @example
 *
 * bytesToSize(10000)
 * // => 9.8 KB
 */
function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB'];
  if (bytes === 0) return 'n/a';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

/**
 * base64转blob
 *
 * @param {string} dataURL
 * @returns {*}
 * @example
 *
 * const URI = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48c3R5bGUvPjwvZGVmcz48cGF0aCBkPSJNOTU5LjQzNiAyNDMuNUwzNzcuNDEzIDg3MC4yNyA2NC4wMiA0NjcuMzQ0bDExNC43MjctOTcuOTMgMTk4LjY2NiAyMDcuMDYgNDkyLjQ4Mi00MjIuNTEgODkuNTQgODkuNTM3em0wIDAiIGZpbGw9IiM0M2E5ZjEiLz48L3N2Zz4=';
 *
 * dataURLToBlob(URI);
 * // => Blob {size: 248, type: "image/svg+xml"}
 */
function dataURLToBlob(dataURL) {
  var BASE64_MARKER = ';base64,';
  var parts;
  var contentType;
  var raw;

  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    parts = dataURL.split(',');
    contentType = parts[0].split(':')[1];
    raw = decodeURIComponent(parts[1]);
    return new Blob([raw], {
      type: contentType
    });
  }

  parts = dataURL.split(BASE64_MARKER);
  contentType = parts[0].split(':')[1];
  raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {
    type: contentType
  });
}

/**
 * 获取设备像素比
 *
 * @returns {number}
 * @example
 *
 * // window.navigator.appVersion(5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1)
 * getPixelRatio();
 * // => 2
 */
function getPixelRatio() {
  var ctx = document.createElement('canvas').getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
  return dpr / bsr;
}

/**
 * 将文本插入到文本区域的光标位置<br>
 * _应用场景：_如在评论框里，在光标位置里插入emoji等
 *
 * @param {object} dom对象
 * @param {string} str
 * @example
 *
 * <textarea name="textarea" rows="10" cols="50">你好世界~</textarea>
 *
 * const editText = document.querySelector('#editText');
 *
 * insertText(editText, 'hello world');
 * // =>
 */
function insertAtCaret(dom) {
  var str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (document.selection) {
    // IE
    var sel = document.selection.createRange();
    sel.text = str;
  } else if (typeof dom.selectionStart === 'number' && typeof dom.selectionEnd === 'number') {
    var startPos = dom.selectionStart;
    var endPos = dom.selectionEnd;
    var cursorPos = startPos;
    var tmpStr = dom.value;
    dom.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
    cursorPos += str.length;
    dom.selectionStart = dom.selectionEnd = cursorPos;
  } else {
    dom.value += str;
  }
}

/**
 * 获取移动设备信息，如是否是iOS，android等
 *
 * @returns {{}}
 * @example
 *
 * getDevice();
 * // => {"androidChrome":false,"ipad":false,"iphone":true,"android":false,"ios":true,"os":"ios","osVersion":"9.1","webView":null}
 */
function getDevice() {
  var device = {};
  var ua = navigator.userAgent;
  var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
  device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false; // Android

  if (android) {
    device.os = 'android';
    device.osVersion = android[2];
    device.android = true;
    device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
  }

  if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
  } // iOS


  if (iphone && !ipod) {
    device.osVersion = iphone[2].replace(/_/g, '.');
    device.iphone = true;
  }

  if (ipad) {
    device.osVersion = ipad[2].replace(/_/g, '.');
    device.ipad = true;
  }

  if (ipod) {
    device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    device.iphone = true;
  } // iOS 8+ changed UA


  if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
    if (device.osVersion.split('.')[0] === '10') {
      device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
    }
  } // Webview


  device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
  return device;
}

/**
 * 获取浏览器的类型和版本号
 *
 * @returns {{type: string, version: string}}
 * @example
 *
 * getBrowser();
 * // => {type: "chrome", version: "60.0.3112.101"}
 */
function getBrowser() {
  var ua = navigator.userAgent.toLowerCase();
  var type = 'UNKNOW';
  var v;

  var check = function check(regex) {
    return regex.test(ua);
  }; // IE


  if (check(/msie/) && !check(/opera/)) {
    type = 'ie';
    v = /msie[\/|\s]*([\d+?\.?]+)/.exec(ua);
  } else if (!check(/webkit/) && check(/gecko/) && check(/firefox/) && !check(/opera/)) {
    // firefox
    type = 'firefox';
    v = /firefox[\/|\s]*([\d+?\.?]+)/.exec(ua);
  } else if (check(/\bchrome\b/)) {
    // chrome
    type = 'chrome';
    v = /chrome[\/|\s]*([\d+?\.?]+)/.exec(ua);
  } else if (check(/applewebkit/) && check(/safari/)) {
    // safari (!check(/\bchrome\b/) is ensure by non-chrome above)
    type = 'safari';
    v = /version[\/|\s]*([\d+?\.?]+)/.exec(ua);
  } else if (check(/opera/)) {
    type = 'opera';
    v = /version[\/|\s]*([\d+?.?]+)/.exec(ua) || /opera[\/|\s]*([\d+?.?]+)/.exec(ua);
  }

  return {
    type: type,
    version: v && v[1] ? v[1] : 'UNKNOW'
  };
}

/**
 * 得到两个时间的时间差（返回天数）
 *
 * @since 1.0.7
 * @param {number} startDay 开始时间戳
 * @param {number} endDay   结束时间戳
 * @returns {number}
 * @example
 *
 * getDiffDay(1501516800000, 1504195200000);
 * // => 31
 */
function getDiffDay(startDay, endDay) {
  startDay = Number(startDay);
  endDay = Number(endDay);
  return Math.abs(endDay - startDay) / (24 * 1000 * 3600);
}

/**
 * Dom 操作，元素是包含某个 class
 *
 * @since 1.1.5
 * @param el HTML元素
 * @param cls css类名
 * @returns {boolean}
 * @example
 *
 * <div class="box flex"></div>
 * hasClass(document.querySelector('.box'), 'flex');
 * // => true
 */
function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');

  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}

/**
 * dom操作，元素添加某个class
 *
 * @since 1.1.5
 * @param el HTML元素
 * @param cls css类名
 * @example
 *
 * <div class="box flex"></div>
 * addClass(document.querySelector('.box'), 'flex1');
 * // => <div class="box flex flex1"></div>
 */

function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }

  if (!el.classList) {
    el.className = curClass;
  }
}

var trim$1 = function trim(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
/**
 * Dom 操作，元素删除某个 class
 *
 * @since 1.1.5
 * @param el HTML元素
 * @param cls css类名
 * @example
 *
 * <div class="box flex"></div>
 * removeClass(document.querySelector('.box'), 'flex');
 * // => <div class="box"></div>
 */


function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }

  if (!el.classList) {
    el.className = trim$1(curClass);
  }
}

/**
 * 中划线转换小驼峰
 *
 * @since 1.1.7
 * @param {string} variable
 * @returns {string}
 * @example
 *
 * toCamelCaseVar('get_account_list');
 * // => getAccountList
 */
function toCamelCaseVar(variable) {
  return variable.replace(/_+[a-zA-Z]/g, function (str, index) {
    return index ? str.substr(-1).toUpperCase() : str;
  });
}

/**
 * 格式化数字、金额、千分位、保留几位小数、舍入舍去
 *
 * @since 1.0.7
 * @param number 要格式化的数字
 * @param decimals 保留几位小数
 * @param decPoint 小数点符号
 * @param thousandsSep 千分位符号
 * @param roundTag 舍入参数，默认 'ceil' 向上取,'floor'向下取,'round' 四舍五入
 * @returns {XML|void|*|string}
 * @example
 *
 * formatNumber(2, 2, '.', ',');
 * // => 2.00
 */
function formatNumber(number) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var decPoint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  var thousandsSep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ',';
  var roundTag = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'ceil';
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number;
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  var sep = thousandsSep || ',';
  var dec = decPoint || '.';
  var re = /(-?\d+)(\d{3})/;
  var s = '';

  var toFixedFix = function toFixedFix(n, prec) {
    var k = Math.pow(10, prec);
    return '' + parseFloat(Math[roundTag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
  };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2');
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }

  return s.join(dec);
}

/**
 * 版本比较
 *
 * {@link https://github.com/omichelsen/compare-versions}
 * @param v1 老版本
 * @param v2 新版本
 * @returns {number} v1 > v2 => 1, v1 < v2 => -1, v1 === v2 => 0
 * @example
 *
 * compareVersion('10.1.8', '10.0.4');
 * // => 1
 * compareVersion('10.0.1', '10.0.1');
 * // => 0
 * compareVersion('10.1.1', '10.2.2');
 * // => -1
 */
function compareVersion(v1, v2) {
  var semver = /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;

  function indexOrEnd(str, q) {
    return str.indexOf(q) === -1 ? str.length : str.indexOf(q);
  }

  function split(v) {
    var c = v.replace(/^v/, '').replace(/\+.*$/, '');
    var patchIndex = indexOrEnd(c, '-');
    var arr = c.substring(0, patchIndex).split('.');
    arr.push(c.substring(patchIndex + 1));
    return arr;
  }

  function tryParse(v) {
    return isNaN(Number(v)) ? v : Number(v);
  }

  function validate(version) {
    if (typeof version !== 'string') {
      throw new TypeError('Invalid argument expected string');
    }

    if (!semver.test(version)) {
      throw new Error('Invalid argument not valid semver (\'' + version + '\' received)');
    }
  }

  [v1, v2].forEach(validate);
  var s1 = split(v1);
  var s2 = split(v2);

  for (var i = 0; i < Math.max(s1.length - 1, s2.length - 1); i++) {
    var n1 = parseInt(s1[i] || 0, 10);
    var n2 = parseInt(s2[i] || 0, 10);
    if (n1 > n2) return 1;
    if (n2 > n1) return -1;
  }

  var sp1 = s1[s1.length - 1];
  var sp2 = s2[s2.length - 1];

  if (sp1 && sp2) {
    var p1 = sp1.split('.').map(tryParse);
    var p2 = sp2.split('.').map(tryParse);

    for (i = 0; i < Math.max(p1.length, p2.length); i++) {
      if (p1[i] === undefined || typeof p2[i] === 'string' && typeof p1[i] === 'number') return -1;
      if (p2[i] === undefined || typeof p1[i] === 'string' && typeof p2[i] === 'number') return 1;
      if (p1[i] > p2[i]) return 1;
      if (p2[i] > p1[i]) return -1;
    }
  } else if (sp1 || sp2) {
    return sp1 ? -1 : 1;
  }

  return 0;
}

/**
 * 主动防御
 * 对于我们操作的数据，尤其是由 API 接口返回的，时常会有一个很复杂的深层嵌套的数据结构。为了代码的健壮性，很多时候需要对每一层访问都作空值判断，就像这样：
 props.user &&
 props.user.posts &&
 props.user.posts[0] &&
 props.user.posts[0].comments &&
 props.user.posts[0].comments[0]
 代码看起来相当不美观，因此提供了一个非常简洁明了的原生的方式。
 *
 * @param p 属性列表
 * @param o 对象
 * @returns {*} 如果正常访问到，则返回对应的值，否则返回 null。
 * @example
 *
 * var props = {
 *  user: {
 *    post: [{
 *      comments: 'test'
 *    }]
 *  }
 * };
 * getIn(['user', 'post', 0, 'comments'], props);
 * // => test
 */
function getIn(p, o) {
  return p.reduce(function (xs, x) {
    return xs && xs[x] ? xs[x] : null;
  }, o);
}

/**
 * RGB 转换为 Hex
 *
 * @since 1.2.0
 * @param r r值
 * @param g g值
 * @param b b值
 * @returns {string} Hex值
 * @example
 * rgbToHex(0,0,0);
 * // => #000000
 */
function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Hex 转换为 Rgb
 *
 * @since 1.2.0
 * @param hex
 * @returns {*}
 * @example
 *
 * hexToRgb("#0033ff").g;
 * // => 51
 */
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Anagrams of string（带有重复项）
 * 使用递归。对于给定字符串中的每个字母，为字母创建字谜。使用map（）将字母与每部分字谜组合，然后使用reduce（）将所有字谜组合到一个数组中，最基本情况是字符串长度等于2或1。
 *
 * @since 1.2.1
 * @param str
 * @returns {*}
 * @example
 *
 * anagrams('abc');
 * // => ['abc','acb','bac','bca','cab','cba']
 */
function anagrams(str) {
  if (str.length <= 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
  return str.split('').reduce(function (acc, letter, i) {
    return acc.concat(anagrams(str.slice(0, i) + str.slice(i + 1)).map(function (val) {
      return letter + val;
    }));
  }, []);
}

/**
 * 大写每个单词的首字母
 *
 * @since 1.2.1
 * @param str
 * @returns {string|*|void|XML}
 * @example
 *
 * capitalizeEveryWord('hello world!');
 * // => 'Hello World!'
 */
function capitalizeEveryWord(str) {
  return str.replace(/\b[a-z]/g, function (_char) {
    return _char.toUpperCase();
  });
}

/**
 * 斐波那契数组生成器
 * 创建一个特定长度的空数组，初始化前两个值（0和1）。使用Array.reduce（）向数组中添加值，后面的一个数等于前面两个数相加之和（前两个除外）。
 *
 * @since 1.2.1
 * @param num
 * @returns {*}
 * @example
 *
 * fibonacci(5);
 * // => [0,1,1,2,3]
 */
function fibonacci(num) {
  return Array(num).fill(0).reduce(function (acc, val, i) {
    return acc.concat(i > 1 ? acc[i - 1] + acc[i - 2] : i);
  }, []);
}

/**
 * 获取滚动位置
 * 如果已定义，请使用pageXOffset和pageYOffset，否则使用scrollLeft和scrollTop，可以省略el来使用window的默认值。
 *
 * @since 1.2.1
 * @param el
 * @returns {{x: Number, y: Number}}
 * @example
 *
 * getScrollPos();
 * // => {x: 0, y: 200}
 */
function getScrollPos() {
  var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  return {
    x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
    y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
  };
}

/**
 * 获取数组的最后一项
 *
 * @since 1.2.1
 * @param array
 * @returns {boolean}
 * @example
 *
 * last(['1,2,3']);
 * // => '3';
 */
function last(array) {
  return Array.isArray(array) && array.slice(-1)[0];
}

/**
 * 测试函数所花费的时间
 *
 * @since 1.2.1
 * @param callback
 * @returns {*}
 * @example
 *
 * timeTaken(() => Math.pow(2, 10));
 * // => 1024
 */
function timeTaken(callback) {
  if (typeof callback !== 'function') throw new Error('callback 必须为可执行的函数');
  console.time('timeTaken');
  var r = callback();
  console.timeEnd('timeTaken');
  return r;
}

/**
 * 数组转换为键值对的对象
 *
 * @since 1.2.1
 * @param array
 * @returns {*}
 * @example
 *
 * objectFromPairs([['a',1],['b',2]]);
 * // => {a: 1, b: 2}
 */
function objectFromPairs(array) {
  return Array.isArray(array) && array.reduce(function (a, v) {
    return a[v[0]] = v[1], a;
  }, {});
}

/**
 * 对象转化为键值对
 * 使用 Object.keys() 和 Array.map() 遍历对象的键并生成一个包含键值对的数组。
 * 
 * @param obj
 * @returns {any[][]}
 * @example
 *
 * objectToPairs({ a: 1, b: 2 });
 * // => [['a',1],['b',2]]
 */
var objectToPairs = function objectToPairs(obj) {
  return Object.keys(obj).map(function (k) {
    return [k, obj[k]];
  });
};

/**
 * 滚动到顶部
 * 使用document.documentElement.scrollTop或document.body.scrollTop获取到顶部的距离。从顶部滚动一小部分距离。
 使用window.requestAnimationFrame（）来滚动。
 *
 * @since 1.2.1
 * @example
 *
 * scrollToTop();
 */
function scrollToTop() {
  var c = document.documentElement.scrollTop || document.body.scrollTop;

  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
}

/**
 * 是否为中文
 *
 * @since 1.4.7
 * @param {string} str
 * @returns {boolean}
 * @example
 *
 * isChinese('中文');
 * // => true
 */
function isChinese(str) {
  var reg = /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/;
  return reg.test(str);
}

/**
 * 是否为 HTML 标签
 *
 * @since 1.2.4
 * @param {string} str
 * @returns {boolean}
 * @example
 *
 * isHTML('<p>123</p>');
 * // => true
 */
function isHTML(str) {
  var reg = /<("[^"]*"|'[^']*'|[^'">])*>/;
  return reg.test(str);
}

/**
 * 返回指定长度的月份集合
 * 摘自：https://segmentfault.com/a/1190000013041329
 *
 * @param  {time} 时间
 * @param  {len} 长度
 * @param  {direction} 方向：  1: 前几个月;  2: 后几个月;  3:前后几个月  默认 3
 * @return {Array} 数组
 * @example
 *
 * getMonths('2018-1-29', 6, 1)
 * // => ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
 */
function getMonths(time, len, direction) {
  var mm = new Date(time).getMonth();
  var yy = new Date(time).getFullYear();
  var index = mm;
  direction = isNaN(direction) ? 3 : direction;

  var cutMonth = function cutMonth(index) {
    if (index <= len && index >= -len) {
      return direction === 1 ? formatPre(index).concat(cutMonth(++index)) : direction === 2 ? formatNext(index).concat(cutMonth(++index)) : formatCurr(index).concat(cutMonth(++index));
    }

    return [];
  };

  var formatNext = function formatNext(i) {
    var y = Math.floor(i / 12);
    var m = i % 12;
    return [yy + y + '-' + (m + 1)];
  };

  var formatPre = function formatPre(i) {
    var y = Math.ceil(i / 12);
    var m = i % 12;
    m = m === 0 ? 12 : m;
    return [yy - y + '-' + (13 - m)];
  };

  var formatCurr = function formatCurr(i) {
    var y = Math.floor(i / 12);
    var yNext = Math.ceil(i / 12);
    var m = i % 12;
    var mNext = m === 0 ? 12 : m;
    return [yy - yNext + '-' + (13 - mNext), yy + y + '-' + (m + 1)];
  }; // 数组去重


  var unique = function unique(arr) {
    if (Array.hasOwnProperty('from')) {
      return Array.from(new Set(arr));
    } else {
      var n = {},
          r = [];

      for (var i = 0; i < arr.length; i++) {
        if (!n[arr[i]]) {
          n[arr[i]] = true;
          r.push(arr[i]);
        }
      }

      return r;
    }
  };

  return direction !== 3 ? cutMonth(index) : unique(cutMonth(index).sort(function (t1, t2) {
    return new Date(t1).getTime() - new Date(t2).getTime();
  }));
}

/**
 * 获取某月有多少天
 * 摘自：https://segmentfault.com/a/1190000013041329
 *
 * @param  {time} 时间
 * @return {number} 天数
 * @example
 *
 * getMonthOfDay('2018-1-29')
 * // => 31
 */
function getMonthOfDay(time) {
  var date = new Date(time);
  var year = date.getFullYear();
  var mouth = date.getMonth() + 1;
  var days; //当月份为二月时，根据闰年还是非闰年判断天数

  if (mouth == 2) {
    days = year % 4 == 0 && year % 100 == 0 && year % 400 == 0 || year % 4 == 0 && year % 100 != 0 ? 28 : 29;
  } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
    //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
    days = 31;
  } else {
    //其他月份，天数为：30.
    days = 30;
  }

  return days;
}

/**
 * 返回指定长度的天数集合
 * 摘自：https://segmentfault.com/a/1190000013041329
 *
 * @param  {time} 时间
 * @param  {len} 长度
 * @param  {direction} 方向：  1: 前几天;  2: 后几天;  3:前后几天  默认 3
 * @return {Array} 数组
 * @example
 *
 * getDays('2018-1-29', 6, 1)
 * // => ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
 */
function getDays(time, len, direction) {
  var tt = new Date(time);

  var getDay = function getDay(day) {
    var t = new Date(time);
    t.setDate(t.getDate() + day);
    var m = t.getMonth() + 1;
    return t.getFullYear() + '-' + m + '-' + t.getDate();
  };

  var arr = [];

  if (direction === 1) {
    for (var i = 1; i <= len; i++) {
      arr.unshift(getDay(-i));
    }
  } else if (direction === 2) {
    for (var _i = 1; _i <= len; _i++) {
      arr.push(getDay(_i));
    }
  } else {
    for (var _i2 = 1; _i2 <= len; _i2++) {
      arr.unshift(getDay(-_i2));
    }

    arr.push(tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate());

    for (var _i3 = 1; _i3 <= len; _i3++) {
      arr.push(getDay(_i3));
    }
  }

  return direction === 1 ? arr.concat([tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()]) : direction === 2 ? [tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()].concat(arr) : arr;
}

/**
 * 获取某个日期是当年中的第几天
 *
 * @since 1.2.4
 * @param time
 * @returns {number}
 * @example
 *
 * getDayOfYear('2014-01-10')
 * => 10
 */
function getDayOfYear(time) {
  var firstDayYear = getFirstDayOfYear(time);
  var numSecond = (new Date(time).getTime() - new Date(firstDayYear).getTime()) / 1000;
  return Math.ceil(numSecond / (24 * 3600));
} // 获取某年的第一天


function getFirstDayOfYear(time) {
  var year = new Date(time).getFullYear();
  return year + '-01-01 00:00:00';
}

/**
 * 获取某个日期在这一年的第几周
 *
 * @since 1.2.4
 * @param time
 * @returns {number}
 * @example
 *
 * getDayOfYearWeek('2014-01-10')
 * => 2
 */

function getDayOfYearWeek(time) {
  var numDays = getDayOfYear(time);
  return Math.ceil(numDays / 7);
}

/**
 * 获取某年有多少天
 *
 * @since 1.2.4
 * @param time
 * @returns {number}
 * @example
 *
 * getYearOfDay('2014')
 * => 365
 */

function getYearOfDay(time) {
  var firstDayYear = getFirstDayOfYear$1(time);
  var lastDayYear = getLastDayOfYear(time);
  var numSecond = (new Date(lastDayYear).getTime() - new Date(firstDayYear).getTime()) / 1000;
  return Math.ceil(numSecond / (24 * 3600));
} // 获取某年的第一天


function getFirstDayOfYear$1(time) {
  var year = new Date(time).getFullYear();
  return year + '-01-01 00:00:00';
} // 获取某年最后一天


function getLastDayOfYear(time) {
  var year = new Date(time).getFullYear();
  var dateString = year + '-12-01 00:00:00';
  var endDay = getMonthOfDay(dateString);
  return year + '-12-' + endDay + ' 23:59:59';
}

/**
 * 图片压缩
 * @param  {string}   file [压缩文件]
 * @param  {object}   obj [压缩参数]
 * @param  {function} cb   [回调函数]
 * @return {string}        [返回压缩前和压缩后的格式]
 */

/* istanbul ignore next */
function photoCompress(file, obj, cb) {
  // obj = {
  //    width: 图片宽,
  //    height: 图片高,
  //    quality: 图像质量，
  //    blob: 是否转换成Blob
  //  }
  // 将以base64的图片url数据转换为Blob
  function convertBase64UrlToBlob(urlData) {
    var arr = urlData.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {
      type: mime
    });
  } // canvas 绘制图片


  function canvasDataURL(oldBase64) {
    var img = new Image();
    img.src = oldBase64;

    img.onload = function () {
      var that = this; // 默认按比例压缩

      var w = that.width,
          h = that.height,
          scale = w / h;
      w = obj.width || w;
      h = obj.height || w / scale;
      var quality = 0.7; // 默认图片质量为0.7
      //生成canvas

      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d'); // 创建属性节点

      var anw = document.createAttribute('width');
      anw.nodeValue = w;
      var anh = document.createAttribute('height');
      anh.nodeValue = h;
      canvas.setAttributeNode(anw);
      canvas.setAttributeNode(anh);
      ctx.drawImage(that, 0, 0, w, h); // 图像质量

      if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
        quality = obj.quality;
      } // quality值越小，所绘制出的图像越模糊


      var base64 = canvas.toDataURL('image/jpeg', quality); // 回调函数返回base64的值

      if (obj.blob) {
        cb && cb(convertBase64UrlToBlob(base64), convertBase64UrlToBlob(oldBase64));
      } else {
        cb && cb(base64, oldBase64);
      }
    };
  } // 读取图片的base64格式


  var ready = new FileReader();
  ready.readAsDataURL(file);

  ready.onload = function () {
    var re = this.result;
    canvasDataURL(re);
  };
}

/**
 * 数字金额大写转换
 *
 * @since 1.2.5
 * @param n
 * @returns {string}
 * @example
 *
 * changeMoneyToChinese(100111);
 * => "壹拾万零壹佰壹拾壹元整"
 *
 * changeMoneyToChinese(7.52);
 * => "柒元伍角贰分"
 *
 * changeMoneyToChinese(951434677682.00);
 * => "玖仟伍佰壹拾肆亿叁仟肆佰陆拾柒万柒仟陆佰捌拾贰元整"
 */
function changeMoneyToChinese(n) {
  if (isNaN(n)) {
    console.warn("\u6570\u636E\u7C7B\u578B\u4E3A number");
    return;
  }

  var fraction = ['角', '分'];
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  var head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  var s = '';

  for (var i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(shiftRight(n, 1 + i)) % 10] + fraction[i]).replace(/零./, '');
  }

  s = s || '整';
  n = Math.floor(n);

  for (var _i = 0; _i < unit[0].length && n > 0; _i++) {
    var p = '';

    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(shiftLeft(n, 1));
    }

    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][_i] + s;
  }

  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
} // 向右移位


function shiftRight(number, digit) {
  digit = parseInt(digit, 10);
  var value = number.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] + digit : digit));
} // 向左移位


function shiftLeft(number, digit) {
  digit = parseInt(digit, 10);
  var value = number.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] - digit : -digit));
}

/**
 * 数字转换成中文的大写数字
 *
 * @since 1.2.5
 * @param num
 * @returns {string}
 * @example
 *
 * numberToChinese(10001010);
 * => "一千万一千一十"
 */
function numberToChinese(num) {
  var AA = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  var BB = ['', '十', '百', '千', '万', '亿', '点', ''];
  var a = ('' + num).replace(/(^0*)/g, '').split('.'),
      k = 0,
      re = '';

  for (var i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re;
        break;

      case 4:
        if (!new RegExp('0{4}//d{' + (a[0].length - i - 1) + '}$').test(a[0])) re = BB[4] + re;
        break;

      case 8:
        re = BB[5] + re;
        BB[7] = BB[5];
        k = 0;
        break;
    }

    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
    k++;
  }

  if (a.length > 1) // 加上小数部分(如果有小数部分)
    {
      re += BB[6];

      for (var _i = 0; _i < a[1].length; _i++) {
        re += AA[a[1].charAt(_i)];
      }
    }

  if (re == '一十') re = '十';
  if (re.match(/^一/) && re.length == 3) re = re.replace('一', '');
  return re;
}

/**
 * 科学计数法转化为数值字符串形式
 *
 * @param {number} num
 * @returns {string}
 * @example
 *
 * toNonExponential(3.3e-7);
 * => // "0.00000033"
 *
 * toNonExponential(3e-7);
 * => // "0.0000003"
 *
 * toNonExponential(1.401e10);
 * => // "14010000000"
 *
 * toNonExponential(0.0004);
 * => // "0.0004"
 */
function toNonExponential(num) {
  if (typeof num !== 'number') throw new TypeError('数据类型必须是 number');
  var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}

/**
 * 获取网址参数
 * @param {string} url
 * @returns {{}} 返回包含当前URL参数的对象。
 * @example
 *
 * getURLParameters('http://url.com/page?name=Adam&surname=Smith');
 * => // {name: 'Adam', surname: 'Smith'}
 */
function getURLParameters() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.href;
  if (typeof url !== 'string') throw new TypeError('数据类型必须是 string');
  var paramsArr = url.match(/([^?=&]+)(=([^&]*))/g);
  if (!paramsArr) return {};
  return paramsArr.reduce(function (a, v) {
    return a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a;
  }, {});
}

/**
 * 根据提供函数返回的值映射一个新对象
 *
 * @param obj
 * @param fn
 * @returns {{}}
 * @example
 *
 * const users = {
  fred: { user: 'fred', age: 40 },
  pebbles: { user: 'pebbles', age: 1 }
};
 * mapValues(users, u => u.age);
 * // => { fred: 40, pebbles: 1 }
 */
var mapValues = function mapValues(obj, fn) {
  return Object.keys(obj).reduce(function (acc, k) {
    acc[k] = fn(obj[k], k, obj);
    return acc;
  }, {});
};

/**
 * 根据提供函数生成的键生成一个新对象
 * 使用 Object.keys(obj) 来迭代对象的键。 使用 Array.reduce() 创建一个具有相同值的新对象，并使用 fn 来映射键。
 * 
 * @param obj
 * @param fn
 * @returns {{}}
 * @example
 *
 * mapKeys({ a: 1, b: 2 }, (val, key) => key + val);
 * // => { a1: 1, b2: 2 }
 */
var mapKeys = function mapKeys(obj, fn) {
  return Object.keys(obj).reduce(function (acc, k) {
    acc[fn(obj[k], k, obj)] = obj[k];
    return acc;
  }, {});
};

/**
 * 反转对象的键值对
 * 而不会改变它。使用 Object.keys() 和 Array.reduce() 来反转对象的键值对。
 *
 * @param obj
 * @returns {{}}
 * @example
 *
 * invertKeyValues({ name: 'John', age: 20 });
 * // => { 20: 'age', John: 'name' }
 */
var invertKeyValues = function invertKeyValues(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    acc[obj[key]] = key;
    return acc;
  }, {});
};

/**
 * 获取数组，对象或字符串的大小。
 * Get type of val (array, object or string). Use length property for arrays. Use length or size value if available or number of keys for objects. Use size of a Blob object created from val for strings.

 获取 val （array，object 或 string）的类型。 对于数组使用 length 属性。 对于对象，使用 length 或 size 如果可用的话，或者对象的键的数量。 对于字符串，使用根据 val 创建的Blob对象 的 size。

 通过 split('') 将字符串拆分成字符数组并返回其长度。

 * @param val
 * @returns {*}
 * @example
 *
 * size([1, 2, 3, 4, 5]);
 * // =>  5
 *
 * size('size');
 * // => 4
 *
 * size({ one: 1, two: 2, three: 3 });
 * // => 3
 */
var size = function size(val) {
  return Array.isArray(val) ? val.length : val && _typeof(val) === 'object' ? val.size || val.length || Object.keys(val).length : typeof val === 'string' ? new Blob([val]).size : 0;
};

/**
 * 清除空格
 *
 * @param str
 * @param type 1-所有空格  2-前后空格  3-前空格 4-后空格
 * @returns {*}
 * @example
 *
 * trim(' 123 ');
 * // => 123
 */
function trim$2(str) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  if (typeof str !== 'string') throw new Error('输入值必须为字符串');

  switch (type) {
    case 1:
      return str.replace(/\s+/g, '');

    case 2:
      return str.replace(/(^\s*)|(\s*$)/g, '');

    case 3:
      return str.replace(/(^\s*)/g, '');

    case 4:
      return str.replace(/(\s*$)/g, '');

    default:
      return str;
  }
}

/**
 * toZhCN 把字符串转成以分为单位的整数。
 *
 * @param {number|string} num 金额
 * @returns {string} 中文大写的金额, 标准会计格式
 * @example
 *
 * toZhCN(500.3);
 * // => 伍佰元叁角整
 */
function toZhCN(num) {
  if (typeof num === 'number') {
    num = String(num);
  }

  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(num)) {
    throw new Error("\u975E\u6CD5\u6570\u636E: ".concat(JSON.stringify(num)));
  }

  var unit = '京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分';
  var str = '';
  num += '00';
  var pos = num.indexOf('.');

  if (pos >= 0) {
    num = num.substring(0, pos) + num.substr(pos + 1, 2);
  }

  unit = unit.substr(unit.length - num.length);

  for (var i = 0, len = num.length; i < len; i++) {
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(Number(num.charAt(i))) + unit.charAt(i);
  }

  return str.replace(/零(仟|佰|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(兆|万|亿|元)/g, '$1').replace(/(兆|亿)万/g, '$1').replace(/(京|兆)亿/g, '$1').replace(/(京)兆/g, '$1').replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, '$1$2零$3仟').replace(/^元零?|零分/g, '').replace(/(元|角)$/g, '$1整');
}

/**
 * 深层克隆对象
 *
 * @param obj
 * @returns {*}
 * @example
 *
 * const a = { foo: 'bar', obj: { a: 1, b: 2 } };
 * const b = deepClone(a);
 * // => a !== b, a.obj !== b.obj
 */
function deepClone(obj) {
  var clone = Object.assign({}, obj);
  Object.keys(clone).forEach(function (key) {
    return clone[key] = _typeof(obj[key]) === 'object' ? deepClone(obj[key]) : obj[key];
  });
  return Array.isArray(obj) && obj.length ? (clone.length = obj.length) && Array.from(clone) : Array.isArray(obj) ? Array.from(obj) : clone;
}

/**
 * 深层映射对象键
 *
 * @param obj
 * @param fn
 * @returns {{}}
 * @example
 *
 * const obj = {
  foo: '1',
  nested: {
    child: {
      withArray: [
        {
          grandChild: ['hello']
        }
      ]
    }
  }
};

 const upperKeysObj = deepMapKeys(obj, key => key.toUpperCase());

 // =>
 {
  "FOO":"1",
  "NESTED":{
    "CHILD":{
      "WITHARRAY":[
        {
          "GRANDCHILD":[ 'hello' ]
        }
      ]
    }
  }
}
 */
function deepMapKeys(obj, fn) {
  return Array.isArray(obj) ? obj.map(function (val) {
    return deepMapKeys(val, fn);
  }) : _typeof(obj) === 'object' ? Object.keys(obj).reduce(function (acc, current) {
    var val = obj[current];
    acc[fn(current)] = val !== null && _typeof(val) === 'object' ? deepMapKeys(val, fn) : acc[fn(current)] = val;
    return acc;
  }, {}) : obj;
}

/**
 * 从对象中检索给定选择器指示的一组属性
 *
 * {@link https://30secondsofcode.org/object#get}
 * @param from
 * @param selectors
 * @returns {string[]}
 * @example
 *
 * const obj = { selector: { to: { val: 'val to select' } }, target: [1, 2, { a: 'test' }] };
 * get(obj, 'selector.to.val', 'target[0]', 'target[2].a');
 * // =>  ['val to select', 1, 'test']
 */
function get(from) {
  for (var _len = arguments.length, selectors = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    selectors[_key - 1] = arguments[_key];
  }

  return [].concat(selectors).map(function (s) {
    return s.replace(/\[([^\[\]]*)\]/g, '.$1.').split('.').filter(function (t) {
      return t !== '';
    }).reduce(function (prev, cur) {
      return prev && prev[cur];
    }, from);
  });
}

/**
 * 基于给定的键返回嵌套JSON对象中的目标值
 *
 * {@link https://30secondsofcode.org/object#dig}
 * @param obj
 * @param target
 * @returns {any}
 * @example
 *
 * const data = {
 *  level1: {
 *    level2: {
 *      level3: 'some data'
 *    }
 *  }
 * };
 * dig(data, 'level3');
 * // => 'some data'
 * dig(data, 'level4');
 * // => undefined
 */
function dig(obj, target) {
  return target in obj ? obj[target] : Object.values(obj).reduce(function (acc, val) {
    if (acc !== undefined) return acc;
    if (_typeof(val) === 'object') return dig(val, target);
  }, undefined);
}

/**
 * 是否为空
 * 如果a值是空对象，集合，没有可枚举属性或任何不被视为集合的类型，则返回true。
 *
 * {@link https://30secondsofcode.org/type#isempty}
 * @param val
 * @returns {boolean}
 * @example
 *
 * isEmpty([]);
 * // => true
 * isEmpty({});
 * // => true
 * isEmpty('');
 * // => true
 * isEmpty([1, 2]);
 * // => false
 * isEmpty({ a: 1, b: 2 });
 * // => false
 * isEmpty('text');
 * // => false
 * isEmpty(123);
 * // => true - type is not considered a collection
 * isEmpty(true);
 * // => true - type is not considered a collection
 */
function isEmpty(val) {
  return val == null || !(Object.keys(val) || val).length;
}

/**
 * 从两个或多个对象的组合中创建一个新对象
 *
 * {@link https://30secondsofcode.org/object#merge}
 * @param objs
 * @returns {*}
 * @example
 *
 * merge(
 {
  a: [{ x: 2 }, { y: 4 }],
  b: 1
},
 {
  a: { z: 3 },
  b: [2, 3],
  c: 'foo'
});
 * // => { a: [ { x: 2 }, { y: 4 }, { z: 3 } ], b: [ 1, 2, 3 ], c: 'foo' }
 */
function merge$3() {
  for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
    objs[_key] = arguments[_key];
  }

  return [].concat(objs).reduce(function (acc, obj) {
    return Object.keys(obj).reduce(function (a, k) {
      acc[k] = acc.hasOwnProperty(k) ? [].concat(acc[k]).concat(obj[k]) : obj[k];
      return acc;
    }, {});
  }, {});
}

/**
 * 返回对象的白名单属性
 *
 * {@link https://github.com/tj/node-only}
 * @param obj
 * @param keys
 * @returns {*}
 * @example
 *
 * var obj = {
  name: 'tobi',
  last: 'holowaychuk',
  email: 'tobi@learnboost.com',
  _id: '12345'
};

 * var user = only(obj, 'name last email');
 * // => {
      name: 'tobi',
      last: 'holowaychuk',
      email: 'tobi@learnboost.com'
    }
 */
function only(obj, keys) {
  obj = obj || {};
  if ('string' == typeof keys) keys = keys.split(/ +/);
  return keys.reduce(function (ret, key) {
    if (null == obj[key]) return ret;
    ret[key] = obj[key];
    return ret;
  }, {});
}

/**
 * 是否为 Light OS(容器)
 *
 * @example
 *
 * isLightOS();
 * // => true
 */
function isLightOS() {
  return window.navigator.userAgent.toLowerCase().indexOf('lightos') !== -1;
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURLs The relative URL
 * @returns {string} The combined URL
 */
function combineURLs(baseURL) {
  for (var _len = arguments.length, relativeURLs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    relativeURLs[_key - 1] = arguments[_key];
  }

  var length = relativeURLs.length;

  if (length > 0) {
    var relativeUrlsArr = relativeURLs.map(function (item) {
      return item.replace(/^\/+/, '').replace(/\/+$/, '');
    });
    var relativeUrlStr = relativeUrlsArr.join('/');

    if (relativeURLs[length - 1].slice(-1) === '/') {
      relativeUrlStr += '/';
    }

    return baseURL.replace(/\/+$/, '') + '/' + relativeUrlStr;
  } else {
    return baseURL;
  }
}

/**
 * 是否是微博内核
 *
 * @returns {boolean}
 * @example
 *
 * inWeibo();
 * // => false
 */
function inWeibo() {
  if (typeof navigator === 'undefined') return;
  var ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('weibo') !== -1;
}

/**
 * 动态加载 script
 *
 * @param {string} src
 * @param {function} callback
 * @example
 *
 * dynamicLoadScript('https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js', () => {
 *   console.log('加载成功');
 * })
 * // => 加载成功
 *
 */
function dynamicLoadScript(src, callback) {
  var existingScript = document.getElementById(src);

  var cb = callback || function () {};

  if (!existingScript) {
    var script = document.createElement('script');
    script.src = src; // src url for the third-party library being loaded.

    script.id = src;
    document.body.appendChild(script);
    var onEnd = 'onload' in script ? stdOnEnd : ieOnEnd;
    onEnd(script, cb);
  }

  if (existingScript && cb) cb(null, existingScript);

  function stdOnEnd(script, cb) {
    script.onload = function () {
      // this.onload = null here is necessary
      // because even IE9 works not like others
      this.onerror = this.onload = null;
      cb(null, script);
    };

    script.onerror = function () {
      this.onerror = this.onload = null;
      cb(new Error('Failed to load ' + src), script);
    };
  }

  function ieOnEnd(script, cb) {
    script.onreadystatechange = function () {
      if (this.readyState !== 'complete' && this.readyState !== 'loaded') return;
      this.onreadystatechange = null;
      cb(null, script); // there is no way to catch loading errors in IE8
    };
  }
}

/**
 * 是否为有效的微信号
 * 6至20位，以字母开头，字母，数字，减号，下划线
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidWechatID('liwenbo_2010');
 * // => true
 */
function isValidWechatID(val) {
  var reg = /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/;
  return reg.test(val);
}

/**
 * 是否为有效的16进制颜色
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidHexadecimalColor('#f00');
 * // => true
 *
 * isValidHexadecimalColor('#fe9de8');
 * // => true
 */
function isValidHexadecimalColor(val) {
  var reg = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
  return reg.test(val);
}

/**
 * 是否为有效的IP v4
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidIPV4('172.16.0.0');
 * // => true
 *
 * isValidIPV4('127.0.0.0');
 * // => true
 *
 */
function isValidIPV4(val) {
  var reg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return reg.test(val);
}

/**
 * 是否为有效的IP v6
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidIPV6('2031:0000:130f:0000:0000:09c0:876a:130b');
 * // => true
 *
 */
function isValidIPV6(val) {
  var reg = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i;
  return reg.test(val);
}

/**
 * 是否为有效的护照（包含香港、澳门）
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidPassport('s28233515');
 * // => true
 *
 * isValidPassport('141234567');
 * // => true
 *
 * isValidPassport('159203084');
 * // => true
 *
 * isValidPassport('MA1234567');
 * // => true
 *
 * isValidPassport('K25345719');
 * // => true
 */
function isValidPassport(val) {
  var reg = /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/;
  return reg.test(val);
}

/**
 * 是否为有效的电话(座机)
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isTelephone('0571-4211236');
 * // => true
 */
function isValidTelephone(val) {
  var reg = /^0\d{2,3}-\d{7,8}$/;
  return reg.test(val);
}

/**
 * 是否为有效的手机号，中国手机号(最宽松), 只要是1开头即可, 如果你的手机号是用来接收短信, 优先建议选择这一条
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isMobileLoose('008618311006933');
 * // => true
 *
 * isMobileLoose('+8617888829981');
 * // => true
 *
 * isMobileLoose('19119255642');
 * // => true
 */
function isMobileLoose(val) {
  var reg = /^(?:(?:\+|00)86)?1\d{10}$/;
  return reg.test(val);
}

/**
 * 是否为有效的手机号，中国手机号(严谨), 根据工信部2019年最新公布的手机号段
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isMobileStrict('008618311006933');
 * // => true
 *
 * isMobileStrict('+8617888829981');
 * // => true
 *
 * isMobileStrict('19119255642');
 * // => true
 */
function isMobileStrict(val) {
  var reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
  return reg.test(val);
}

/**
 * 是否为有效的中文姓名
 *
 * @param val
 * @returns {boolean}
 * @example
 *
 * isValidChineseName('葛二蛋');
 * // => true
 *
 * isValidChineseName('凯文·杜兰特');
 * // => true
 *
 * isValidChineseName('德克·维尔纳·诺维茨基');
 * // => true
 */
function isValidChineseName(val) {
  var reg = /^(?:[\u4e00-\u9fa5·]{2,16})$/;
  return reg.test(val);
}

/**
 * 是否为有效的新能源车牌号
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isNewEnergyLicenseNo('京AD92035');
 * // => true
 *
 * isNewEnergyLicenseNo('甘G23459F');
 * // => true
 */
function isNewEnergyLicenseNo(val) {
  var reg = /[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))$/;
  return reg.test(val);
}

/**
 * 是否为有效的银行卡号（10到30位, 覆盖对公/私账户, 参考[微信支付](https://pay.weixin.qq.com/wiki/doc/api/xiaowei.php?chapter=22_1)）
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidBankNo('6234567890');
 * // => true
 *
 * isValidBankNo('6222026006705354217');
 * // => true
 */
function isValidBankNo(val) {
  var reg = /^[1-9]\d{9,29}$/;
  return reg.test(val);
}

/**
 * 是否为有效的 base64格式
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidBase64Format('data:image/gif;base64,xxxx==')
 * => true
 */
function isValidBase64Format(val) {
  var reg = /^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@/?%\s]*?)\s*$/i;
  return reg.test(val);
}

/**
 * 是否为有效的A股代码
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidAShareCode('sz000858');
 * // => true
 *
 * isValidAShareCode('SZ002136');
 * // => true
 *
 * isValidAShareCode('SH600600');
 * // => true
 *
 * isValidAShareCode('sh600600');
 * // => true
 */
function isValidAShareCode(val) {
  var reg = /^(s[hz]|S[HZ])(000[\d]{3}|002[\d]{3}|300[\d]{3}|600[\d]{3}|60[\d]{4})$/;
  return reg.test(val);
}

/**
 * 是否为有效的统一社会信用代码
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isUnifiedSocialCreditCode('91230184MA1BUFLT44');
 * // => true
 *
 * isUnifiedSocialCreditCode('92371000MA3MXH0E3W');
 * // => true
 */
function isUnifiedSocialCreditCode(val) {
  var reg = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/;
  return reg.test(val);
}

/**
 * 是否为有效的考卷分数, 大于等于0, 小于等于150, 支持小数位出现5, 如145.5
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidTestScores('150');
 * // => true
 *
 * isValidTestScores('149.5');
 * // => true
 */
function isValidTestScores(val) {
  var reg = /^150$|^(?:\d|[1-9]\d|1[0-4]\d)(?:.5)?$/;
  return reg.test(val);
}

/**
 * 版本号格式必须为X.Y.Z
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidSemverVersion('16.3.10');
 * // => true
 */
function isValidSemverVersion(val) {
  var reg = /^150$|^(?:\d|[1-9]\d|1[0-4]\d)(?:.5)?$/;
  return reg.test(val);
}

/**
 * 是否为有效的国内座机电话
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isTelephone('0571-4211236');
 * // => true
 *
 * isTelephone('0341-86091234');
 * // => true
 */
function isValidChineseTelephone(val) {
  var reg = /\d{3}-\d{8}|\d{4}-\d{7}/;
  return reg.test(val);
}

/**
 * 是否为有效的迅雷链接
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidThunder('thunder://QUEsICdtYWduZXQ6P3h0PXVybjpidGloOjBCQTE0RTUxRkUwNjU1RjE0Qzc4NjE4RjY4NDY0QjZFNTEyNjcyOUMnWlo=');
 * // => true
 */
function isValidThunder(val) {
  var reg = /^thunderx?:\/\/[a-zA-Z\d]+=$/;
  return reg.test(val);
}

/**
 * 是否为有效的ed2k链接(宽松匹配)
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidEd2kLinkLoose('ed2k://|file|%E5%AF%84%E7%94%9F%E8%99%AB.PARASITE.2019.HD-1080p.X264.AAC-UUMp4(ED2000.COM).mp4|2501554832|C0B93E0879C6071CBED732C20CE577A3|h=5HTKZPQFYRKORN52I3M7GQ4QQCIHFIBV|/');
 * // => true
 */
function isValidEd2kLinkLoose(val) {
  var reg = /^ed2k:\/\/\|file\|.+\|\/$/;
  return reg.test(val);
}

/**
 * 是否为有效的磁力链接(宽松匹配)
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidMagnetLinkLoose('magnet:?xt=urn:btih:40A89A6F4FB1498A98087109D012A9A851FBE0FC');
 * // => true
 */
function isValidMagnetLinkLoose(val) {
  var reg = /^magnet:\?xt=urn:btih:[0-9a-fA-F]{40,}.*$/;
  return reg.test(val);
}

/**
 * 是否为有效的子网掩码
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidSubnetMask('255.255.255.0');
 * // => true
 */
function isValidSubnetMask(val) {
  var reg = /^(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(?:\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
  return reg.test(val);
}

/**
 * 是否为有效的md5格式(32位)
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidMD5('21fe181c5bfc16306a6828c1f7b762e8');
 * // => true
 */
function isValidMD5(val) {
  var reg = /^[a-f0-9]{32}$/;
  return reg.test(val);
}

/**
 * 是否为有效的视频链接地址（视频格式可按需增删）
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidVideoLink('http://www.abc.com/video/wc.avi');
 * // => true
 */
function isValidVideoLink(val) {
  var reg = /^https?:\/\/.*?(?:swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)$/i;
  return reg.test(val);
}

/**
 * 是否为有效的图片链接地址（图片格式可按需增删）
 *
 * @param {string} val
 * @returns {boolean}
 * @example
 *
 * isValidImageLink('https://www.abc.com/logo.png');
 * // => true
 */
function isValidImageLink(val) {
  var reg = /^https?:\/\/.*?(?:gif|png|jpg|jpeg|webp|svg|psd|bmp|tif)$/i;
  return reg.test(val);
}

/**
 * 是否为有效的用户名，4到16位（字母，数字，下划线，减号）
 *
 * @param {string} val
 * @param {number} minLength
 * @param {number} maxLength
 * @returns {boolean}
 * @example
 *
 * isValidUserName('xiaohua_qq');
 * // => true
 */
function isValidUserName(val) {
  var minLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  var maxLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 16;
  var reg = new RegExp("^[a-zA-Z0-9_-]{".concat(minLength, ",").concat(maxLength, "}$"));
  return reg.test(val);
}

/**
 * 是否为有效的密码强度，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
 *
 * @param {string} val
 * @param {number} minLength 最小位数
 * @returns {boolean}
 * @example
 *
 * isValidPassword('Kd@curry666');
 * // => true
 */
function isValidPassword(val) {
  var minLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
  var reg = new RegExp("^.*(?=.{".concat(minLength, ",})(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$"));
  return reg.test(val);
}

/**
 * 判断 iPhone X Series 机型，刘海屏
 *
 * @returns {boolean}
 * @example
 *
 * isPhoneX()
 * => true
 */
function isPhoneX() {
  // X XS, XS Max, XR
  var xSeriesConfig = [{
    devicePixelRatio: 3,
    width: 375,
    height: 812
  }, {
    devicePixelRatio: 3,
    width: 414,
    height: 896
  }, {
    devicePixelRatio: 2,
    width: 414,
    height: 896
  }]; // h5

  if (typeof window !== 'undefined' && window) {
    var isIOS = /iphone/gi.test(window.navigator.userAgent);
    if (!isIOS) return false;
    var _window = window,
        devicePixelRatio = _window.devicePixelRatio,
        screen = _window.screen;
    var width = screen.width,
        height = screen.height;
    return xSeriesConfig.some(function (item) {
      return item.devicePixelRatio === devicePixelRatio && item.width === width && item.height === height;
    });
  }

  return false;
}

/**
 * 动态设置网页中的标题
 *
 * @param title
 * @param img
 */
function setDocumentTitle(title, img) {
  if (!title || window.document.title === title) return;
  document.title = title;
  var mobile = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(mobile)) {
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none'; // 替换成站标favicon路径或者任意存在的较小的图片即可

    iframe.setAttribute('src', img || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

    var iframeCallback = function iframeCallback() {
      setTimeout(function () {
        iframe.removeEventListener('load', iframeCallback);
        document.body.removeChild(iframe);
      }, 0);
    };

    iframe.addEventListener('load', iframeCallback);
    document.body.appendChild(iframe);
  }
}

/**
 * 是否是QQ浏览器内核
 *
 * @returns {boolean}
 * @example
 *
 * inQQBrowser();
 * // => false
 */
function inQQBrowser() {
  if (typeof window.navigator === 'undefined') return;
  var ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('mqqbrowser') !== -1;
}

/**
 * 是否是UC浏览器内核
 *
 * @returns {boolean}
 * @example
 *
 * inUCBrowser();
 * // => false
 */
function inUCBrowser() {
  if (typeof window.navigator === 'undefined') return;
  var ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('ucbrowser') !== -1;
}

/**
 * 两个值之间的深入比较，以确定它们是否相等
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {*}
 * @example
 *
 * equals({ a: [2, { e: 3 }], b: [4], c: 'foo' }, { a: [2, { e: 3 }], b: [4], c: 'foo' });
 *
 * // => true
 */
function equals(a, b) {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (!a || !b || _typeof(a) !== 'object' && _typeof(b) !== 'object') return a === b;
  if (a === null || a === undefined || b === null || b === undefined) return false;
  if (a.prototype !== b.prototype) return false;
  var keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(function (k) {
    return equals(a[k], b[k]);
  });
}

/**
 * utf16字符串转实体字符
 * @param {string} str 待编译的字符串
 */
function utf16toEntities(str) {
  if (!str) return '';

  if (typeof str !== 'string') {
    console.error('需要编译的数据类型需要是字符串类型');
    return str;
  }

  var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则

  str = str.replace(patt, function (_char) {
    var H, L, code;

    if (_char.length === 2) {
      H = _char.charCodeAt(0); // 取出高位

      L = _char.charCodeAt(1); // 取出低位

      code = (H - 0xd800) * 0x400 + 0x10000 + L - 0xdc00; // 转换算法

      return '&#' + code + ';';
    } else {
      return _char;
    }
  });
  return str;
}

/**
 * 实体字符转utf16字符串
 * @param {*} str 待解析的字符串
 */

function entitiestoUtf16(str) {
  if (!str) return '';

  if (typeof str !== 'string') {
    console.error('需要解析的数据类型需要是字符串类型');
    return str;
  } // 检测出形如&#12345;形式的字符串


  var strObj = utf16toEntities(str);
  var patt = /&#\d+;/g;
  var H, L, code;
  var arr = strObj.match(patt) || [];

  for (var i = 0; i < arr.length; i++) {
    code = arr[i];
    code = code.replace('&#', '').replace(';', ''); // 高位

    H = Math.floor((code - 0x10000) / 0x400) + 0xd800; // 低位

    L = (code - 0x10000) % 0x400 + 0xdc00;
    code = '&#' + code + ';';
    var s = String.fromCharCode(H, L);
    strObj = strObj.replace(code, s);
  }

  return strObj;
}

/**
 * 处理emoji，用于把用utf16编码的字符转换成实体字符
 * @param {string} str 需要编译/解析的字符串
 * @param {string} type encode 编译 decode 转义
 * @returns {string} 编译/解析后的字符串
 * @example
 *
 * handleEmoji("😃", "encode");
 * // => "&#128515;"
 * handleEmoji("&#128522;", "decode")；
 * // => "😊"
 */

function handleEmoji() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'encode';
  if (!str) return '';

  if (typeof str !== 'string') {
    console.error('handleEmoji数据类型需要是字符串类型');
    return str;
  }

  if (type === 'encode') {
    return utf16toEntities(str);
  } else if (type === 'decode') {
    return entitiestoUtf16(str);
  } else {
    return str;
  }
}

/**
 * 获取图片的base64 url
 * @param {string} url 图片url
 * @returns {Promise} 图片base64信息
 */
function getImgBase64(url) {
  var Img = new Image();
  var dataURL = '';
  Img.setAttribute('crossOrigin', 'anonymous');
  Img.src = url;
  return new Promise(function (resolve, reject) {
    Img.onload = function () {
      var canvas = document.createElement('canvas'),
          width = Img.width,
          height = Img.height;
      var ctx = canvas.getContext('2d');
      var scale = 5;
      ctx.scale(scale, scale);
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.drawImage(Img, 0, 0, width * scale, height * scale);
      dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
  });
}

/**
 * 删除对象里面value值为null的键值对
 * @param {*} data 接口返回的blob数据
 * @param {*} name excel名称
 * @param {*} callBack 导出成功/失败回调  回调返回{type:fail/success}  fail情况下 返回{ type: "fail", code, msg }
 */
function exportXls(data) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'excel';
  var callBack = arguments.length > 2 ? arguments[2] : undefined;

  if (!data || data.size === 0) {
    callBack && callBack({
      type: 'fail',
      msg: '数据为空'
    });
    return false;
  }

  var reader = new FileReader();
  reader.readAsText(data, 'utf-8');

  reader.onload = function (e) {
    try {
      var _JSON$parse = JSON.parse(reader.result),
          code = _JSON$parse.code,
          msg = _JSON$parse.msg;

      if (code && code !== 200) {
        callBack && callBack({
          type: 'fail',
          code: code,
          msg: msg
        });
        return false;
      } else {
        _downFile(data, name);
      }

      callBack && callBack({
        type: 'success'
      });
    } catch (error) {
      _downFile(data, name);

      callBack && callBack({
        type: 'success'
      });
    }
  };
}

function _downFile(data, fileName) {
  var blob = new Blob([data], {
    type: 'application/vnd.ms-excel,charset=UTF-8'
  });

  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName + '.xlsx');
  } else {
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName + '.xlsx';
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}

/**
 * 检查是否是emoji表情
 * @param {*} value 正则校验变量
 * @return {boolean} 正则校验结果 true: 是emoji表情 false: 不是emoji表情
 */
function isEmoji(value) {
  var arr = ["\uD83C[\uDF00-\uDFFF]", "\uD83D[\uDC00-\uDE4F]", "\uD83D[\uDE80-\uDEFF]"];
  return new RegExp(arr.join('|'), 'g').test(value);
}

/**
 * 检查是否为特殊字符
 * @param {string} value 正则校验的变量
 * @returns {boolean} 正则校验结果 true: 是特殊字符 false: 不是特殊字符
 */
function isSpecialChar(value) {
  var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]\s]/im;
  var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]\s]/im;
  return regEn.test(value) || regCn.test(value);
}

/**
 * 过滤对象中为空的属性
 *
 * @param obj
 * @returns {*}
 * @example
 *
 * filterEmptyPropObj({name: 'foo', sex: ''})
 * // => {name: 'foo'}
 */
function filterEmptyPropObj(obj) {
  if (!(_typeof(obj) == 'object')) return;

  for (var key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key];
    }
  }

  return obj;
}

/**
 * URLJoin
 *
 * @param args
 * @returns {string}
 * @description
 * Joins all given URL segments together, then normalizes the resulting URL.

 Use String.prototype.join('/') to combine URL segments, then a series of String.prototype.replace() calls with various regexps to normalize the resulting URL (remove double slashes, add proper slashes for protocol, remove slashes before parameters, combine parameters with '&' and normalize first parameter delimiter).
 * @example
 *
 * URLJoin('http://www.google.com', 'a', '/b/cd', '?foo=123', '?bar=foo');
 * // => 'http://www.google.com/a/b/cd?foo=123&bar=foo'
 */
function URLJoin() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.join('/').replace(/[\/]+/g, '/').replace(/^(.+):\//, '$1://').replace(/^file:/, 'file:/').replace(/\/(\?|&|#[^!])/g, '$1').replace(/\?/g, '&').replace('&', '?');
}

//export {default as http} from './http/index.js';

export { HTTP as http, accAdd, accDiv, accMul, accSub, addChineseUnit, appendStockSuffix, encrypt, extend$1 as extend, formatBankCard, formatDate, formatTimeAgo, formatDateToTimeStamp, formatMoney, formatPhone, getLocationHrefParam, getLocationSearchParam, getUrlNames, generateGUID, getRandomInt, htmlDecode, htmlEncode, inAlipay, inWeixin, isCardId, isDigit, isEmptyObject, isLeapYear, isLetters, isLicenseNo, isMobile, isValidDate, isValidEmail, isValidQQ, isValidURI, isValidZipcode, preZeroFill, bytesToSize, dataURLToBlob, getPixelRatio, insertAtCaret, getDevice, getBrowser, getDiffDay, addClass, hasClass, removeClass, toCamelCaseVar, formatNumber, compareVersion, getIn, rgbToHex, hexToRgb, anagrams, capitalizeEveryWord, fibonacci, getScrollPos, last, timeTaken, objectFromPairs, objectToPairs, scrollToTop, isChinese, isHTML, getMonths, getMonthOfDay, getDays, getDayOfYear, getDayOfYearWeek, getYearOfDay, photoCompress, changeMoneyToChinese, numberToChinese, toNonExponential, getURLParameters, mapValues, mapKeys, invertKeyValues, size, trim$2 as trim, toZhCN, deepClone, deepMapKeys, get, dig, isEmpty, merge$3 as merge, only, isLightOS, combineURLs, inWeibo, dynamicLoadScript, isValidWechatID, isValidHexadecimalColor, isValidIPV4, isValidIPV6, isValidPassport, isValidTelephone, isMobileLoose, isMobileStrict, isValidChineseName, isNewEnergyLicenseNo, isValidBankNo, isValidBase64Format, isValidAShareCode, isUnifiedSocialCreditCode, isValidTestScores, isValidSemverVersion, isValidChineseTelephone, isValidThunder, isValidEd2kLinkLoose, isValidMagnetLinkLoose, isValidSubnetMask, isValidMD5, isValidVideoLink, isValidImageLink, isValidUserName, isValidPassword, isPhoneX, setDocumentTitle, inQQBrowser, inUCBrowser, equals, handleEmoji, getImgBase64, exportXls, isEmoji, isSpecialChar, filterEmptyPropObj, URLJoin };
