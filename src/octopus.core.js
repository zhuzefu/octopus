/**
 * 核心依赖文件

 * @author xiongxiaoming 、zzf
 * @module octopus
 * @submodule octopus.core
 */

;(function (window) {
  var document = window.document,

    // noConflict用，如果命名有冲突，可以让渡$，乃至于octopus的使用权，具体查看octopus.noConflict
    _$ = window.$,
    _octopus = window.octopus,

    // 选择器用
    rcomma = /\s*,\s*/,
    rid = /^#([\w\-]+)$/,
    rtagclass = /^(?:([\w]+)|([\w]+)?\.([\w\-]+))$/,

    // trim用
    rtrim = /\S/.test('\xA0') ? /^[\s\xA0]+|[\s\xA0]+$/g : /^\s+|\s+$/g,

    // attributes用
    rleveltwo = /(?:href|src|width|height)/i,

    // css用
    rnotnumpx = /^-?\d+[^p\s\d]+$/i,
    ropacity = /opacity=([^)]*)/,
    ralpha = /alpha\([^)]*\)/i,

    // core
    ArrayProto = Array.prototype,
    objectProto = Object.prototype,
    pForEach = ArrayProto.forEach,
    pSlice = ArrayProto.slice,
    pPush = ArrayProto.push,
    pIndexOf = ArrayProto.indexOf,
    pToString = objectProto.toString,
    pHasOwn = objectProto.hasOwnProperty,
    pBind = Function.prototype.bind,
    pTrim = String.prototype.trim,

    // feature detection
    detectCache = {},
    detectionTests = {},

    // miscellaneous 
    class2type = {},
    empty = function () {};

  /**
    核心包装函数，仿jq

    @class octopus
    @constructor
    @global
  **/
  var octopus = function ( selector, context ) {
    if ( !( this instanceof octopus ) ) {
      return new octopus( selector , context );
    }

    //selector为function时将回调函数放到DOM reday时执行
    if ( octopus.isFunction( selector ) ) {
      return octopus.ready( selector );
    }
    var collections = queryAll( selector, context );
    this.length = collections.length;

    //将简单选择器获取的结果集附加到新实例上
    merge( this , collections );
  };


  /**
    版本号 => 大版本.小版本.补丁(major.minor.patch)

    @property {String} VERSION
  **/
  octopus.VERSION = '1.0.0';

  /**
    是否开启除臭，该属性上线打包时应该自动替换为false

    @property {String} DEBUG
  **/
  octopus.DEBUG = '%DEBUG%';

  
  var proto = octopus.prototype;

  /**
    每次生成一个唯一标示符

    @method guid
    @param {String} 唯一标示符的前缀，默认为'octopus'
    @return {String} 一个唯一标示符
  **/
  var guid = octopus.guid = function ( pre ) {
    return ( pre || 'octopus' ) + octopus.VERSION + Math.random() * 9e17;
  };

  /**
    增加一个特性嗅探

    @method addDetection
    @param {String} 嗅探名称
    @return {Function} 嗅探函数
  **/
  var addDetection = octopus.addDetection = function( name, fn ) {
    if ( !detectionTests[name] ) {
      detectionTests[name] = fn;
    }
  };

   /**
    运用一个特性嗅探

    @method detect
    @param {String} 嗅探名称
    @return {Mixed} 是否支持特性或者该特性的支持值等
   **/
  var detect = octopus.detect = function( name ) {
    if ( !detectCache[name] ) {
      detectCache[name] = detectionTests[name]();
    }
    return detectCache[name];
  };

  /**
    将类数组对象(array-like，像Arguments， NodeList)转换成真正数组

    @method toArray
    @param {Mixed} array-like，像Arguments， NodeList
    @return {Array} 转换成真正数组
  **/
  var toArray = octopus.toArray = function ( list ) {
    var i = 0,
        len = list.length,
        ret = [];

    for ( ; i < len; i++ ) {
      ret[i] = list[i];
    }
    return ret;
  };

  /**
    迭代一个数组或者类数组对象（核心函数）

    @method each、forEach
    @param {Functoin} 迭代函数
    @param {Object} 上下文环境
    @return {Mixed} Array|Arguments|NodeList
  **/
  var each = octopus.each = octopus.forEach = function ( obj, iterator, context ) {
    var key,
        len;

    if (!obj) {
      return;
    }
    if (pForEach && obj.forEach === pForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (key = 0, len = obj.length; key < len; key++) {
        if (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else {
      for (key in obj) {
        if (pHasOwn.call(obj, key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    }
    return obj;
  };

  /**
    将一个数组合并到一个对象或数组上，主要用于将queryAll获取的元素集合合并到octopus实例上

    @method merge
    @param {Mixed} 被合并对象
    @param {Mixed} 合并对象
    @return {Mixed} 数组或者类数组对象
  **/
  var merge = octopus.merge = function (one, two) {
      var i = 0, 
          len = two.length;

      for (; i < len; i++) {
        one[i] = two[i];
      }
      return one;
  };

  /**
    对一个对象进行扩展(核心函数)

    @method extend
    @param {Object} 要进行扩展的目标对象，如果只有一个参数，对octopus进行扩展
    @param {Object} 
    @return {Object} 合并对象
  **/
  var extend = octopus.extend = function () {
    var target = arguments[0],
        key, 
        i = 1, 
        len = arguments.length;

    if ( len === 1 ) {
      return octopus.extend( octopus, target );
    }
    for ( ; i < len; i++ ) {
      for ( key in arguments[i] ) {
        target[key] = arguments[i][key];
      }
    }
    return target;
  };

  /**
    一个数组是否包含某元素

    @method indexOf
    @param {Array} 
    @param {Mixed} 
    @param {Number} 从哪里开始搜索
    @return {Number} 
  **/
  var indexOf = octopus.indexOf = pIndexOf ? function ( array, el, fromIndex ) {
      return pIndexOf.call( array, el, fromIndex );
    } : function ( array, el, fromIndex ) {
      var len = array.length,
          i = fromIndex ? fromIndex < 0 ? Math.max( 0, len + fromIndex ) : fromIndex : 0;

      for ( ; i < len; ++i ) {
        if ( array[i] === el) {
          return i;
        }
      }
      return -1;
   };

  /**
    去除两边的空字符

    @method trim
    @param {String} 
    @return {String} 
  **/
  var trim = octopus.trim = pTrim ? function (str) {
      return pTrim.call(str);
    } : function (str) {
      return str.replace(rtrim, '');
    };

  /**
    绑定函数到一个某个上下文对象

    @method bind
    @param {Function} 
    @param {Object} 
    @return {Mixed} 
  **/
  var bind = octopus.bind = function (func, obj) {
    if (pBind && func.bind === pBind) return pBind.apply(func, pSlice.call(arguments, 1));
    var args = pSlice.call(arguments, 2);
    return function () {
      return func.apply(obj, args.concat(pSlice.call(arguments)));
    };
  };


  //注册 octopus
  window.octopus = octopus;

  //如果$未被使用，则注册 $
  !window.$ && (window.$ = octopus);
}(this));