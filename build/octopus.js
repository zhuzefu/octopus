/**
 * @namespace $ octopus
 * @version 1.0.0
 * @date: 2013/01/28
 * TODO: hide&show / 插件机制 / 注释 / 打包 / 单元测试 / yui doc / 模块化 
*/

;(function (window) {
 
  var document = window.document,

    //noConflict用，如果命名有冲突，可以让渡$，乃至于octopus的使用权，具体查看octopus.noConflict
    _$ = window.$,
    _octopus = window.octopus,

    //选择器用
    rcomma = /\s*,\s*/,
    rid = /^#([\w\-]+)$/,
    rtagclass = /^(?:([\w]+)|([\w]+)?\.([\w\-]+))$/,

    //trim用
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

    //feature detection
    detectCache = {},
    detectionTests = {},

    //miscellaneous 
    class2type = {},
    empty = function () {};

  var octopus = function (selector, context) {
    if (!(this instanceof octopus)) {
      return new octopus(selector, context);
    }

    //selector为function时将回调函数放到DOM reday时执行
    if (octopus.isFunction(selector)) {
      return octopus.ready(selector);
    }

    var collections = queryAll(selector, context);

    this.length = collections.length;
    //将简单选择器获取的结果集附加到新实例上
    merge(this, collections);
  };


  /**
   * 版本号 => 大版本.小版本.补丁(major.minor.patch)
   * @string 
   * @grammar octopus(selector, context).VERSION
   */
  octopus.VERSION = '1.0.0';
  /**
   * 是否开启除臭，改标示上线打包时应该自动替换为false
   * @string 
   * @grammar octopus(selector, context).DEBUG
   */
  octopus.DEBUG = '%DEBUG%';


  var proto = octopus.prototype;

  /**
   * 每次生成一个唯一标示符
   * @function
   * @grammar octopus.guid(pre)
   * @param {String} 前缀，默认为'octopus'
   * @return {String} 一个唯一标示符
   */
  var guid = octopus.guid = function (pre) {
    return ( pre || 'octopus' ) + octopus.VERSION + Math.random() * 9e17;
  };


  /**
   * 增加一个特性嗅探
   * @function
   * @grammar octopus.addDetection(name, fn)
   * @param {String} 嗅探名称
   * @return {Function} 嗅探函数
   */
  var addDetection = octopus.addDetection = function(name, fn) {
    if (!detectionTests[name]) {
      detectionTests[name] = fn;
    }
  };

   /**
   * 运用一个特性嗅探
   * @function
   * @grammar octopus.detect(name)
   * @param {String} 嗅探名称
   * @return {Boolean} 是否支持特性
   */
  var detect = octopus.detect = function(name) {
    if (!detectCache[name]) {
      detectCache[name] = detectionTests[name]();
    }
    return detectCache[name];
  };

  /**
   * 将类数组对象(array-like，像Arguments， NodeList)转换成真正数组
   * @function
   * @grammar octopus.toArray(list)
   * @param {Arguments|NodeList} array-like
   * @return {Array}
   */
  var toArray = octopus.toArray = function (list) {
    var i = 0,
        len = list.length,
        ret = [];

    for (; i < len; i++) {
      ret[i] = list[i];
    }
    return ret;
  };

  /**
   * 迭代一个数组或者类数组对象（核心函数）
   * @function
   * @grammar octopus.each(obj, iterator, context) | octopus.forEach(obj, iterator, context) 
   * @param {Array|Arguments|NodeList} 数组或者类数组对象
   * @param {Functoin} 迭代函数
   * @param {Object} 上下文环境
   * @return {Array|Arguments|NodeList}
   */
  var each = octopus.each = octopus.forEach = function (obj, iterator, context) {
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
   * 将一个数组合并到一个对象或数组上，主要用于将queryAll获取的元素集合合并到octopus实例上
   * @function
   * @grammar octopus.merge({}, [1,2,3])
   * @param {Anything} 
   * @param {Array|Arguments|NodeList} 数组或者类数组对象
   * @return {Anything}
   */
  var merge = octopus.merge = function (one, two) {
      var i = 0, 
          len = two.length;

      for (; i < len; i++) {
        one[i] = two[i];
      }
      return one;
  };

  /**
   * 对一个对象进行扩展(核心函数)
   * @function
   * @grammar octopus.extend({})
   * @param {Object} 要进行扩展的目标对象，如果只有一个参数，对octopus进行扩展
   * @param {Object} 
   * @return {Object}
   */
  var extend = octopus.extend = function () {
    var target = arguments[0],
        key, 
        i = 1, 
        len = arguments.length;

    if (len === 1) {
      return octopus.extend(octopus, target);
    }
    for (; i < len; i++) {
      for (key in arguments[i]) {
        target[key] = arguments[i][key];
      }
    }
    return target;
  };

   /**
   * 一个数组是否包含某元素
   * @function
   * @grammar octopus.indexOf(array,el,fromIndex)
   * @param {Array} 
   * @param {Anything} 
   * @param {Number} 从哪里开始搜索
   * @return {Number}
   */
  var indexOf = octopus.indexOf = pIndexOf ? function (array, el, fromIndex) {
      return pIndexOf.call(array, el, fromIndex);
    } : function (array, el, fromIndex) {
      var len = array.length,
          i = fromIndex ? fromIndex < 0 ? Math.max(0, len + fromIndex) : fromIndex : 0;

      for (; i < len; ++i) {
        if (array[i] === el) {
          return i;
        }
      }
      return -1;
    };

   /**
   * 去除两边的空字符
   * @function
   * @grammar octopus.trim(str)
   * @param {String} 
   * @return {String}
   */
  var trim = octopus.trim = pTrim ? function (str) {
      return pTrim.call(str);
    } : function (str) {
      return str.replace(rtrim, '');
    };

   /**
   * 绑定函数到一个某个上下文对象
   * @function
   * @grammar octopus.bind(func, obj)
   * @param {Function} 
   * @return {Object}
   * @return {Anything}
   */
  var bind = octopus.bind = function (func, obj) {
    if (pBind && func.bind === pBind) return pBind.apply(func, pSlice.call(arguments, 1));
    var args = pSlice.call(arguments, 2);
    return function () {
      return func.apply(obj, args.concat(pSlice.call(arguments)));
    };
  };



  //octopus.selector.js 

  /**
   * 简单选择器实现，目前只支持id, tag, tag.class, or .class形式，或者他们的组合(用','分开的分组选择器)
   * @function
   * @grammar octopus.queryAll('#id') | octopus.queryAll('.class') | octopus.queryAll('a') | octopus.queryAll('a.class') | octopus.queryAll('a,.class,#id') 
   * @param {String} 选择器字符串
   * @param {Element|String|null} 选择器上下文
   * @return {Array} 元素数组
   */
  var queryAll = octopus.queryAll = function (selector, context) {
    context = context && (typeof context === 'string' ? queryAll(context)[0] : context.nodeName ? context : context[0]) || document;

    if (!selector || !context) {
      return [];
    }

    if (typeof selector !== 'string') {
      // 非 window or document的元素
      if (selector.style) {
        return [selector];
      }
      //document
      if (selector.documentElement) {
        return [selector.documentElement];
      }
      return toArray(selector);
    }

    var match,
        node,
        ret,
        m,
        i,
        j;

    // id     rtagclass = /^(?:([\w]+)|([\w]+)?\.([\w\-]+))$/,

    if (match = rid.exec(selector)) {
      return (node = context.getElementById(match[1])) ? [node] : [];
      // tag, class, and tag.class
    } else if (match = rtagclass.exec(selector)) {
      // tag
      if (m = match[1]) {
        return toArray(context.getElementsByTagName(m));
      }
      m = match[3];
      // class
      if (!match[2] && context.getElementsByClassName) {
        return toArray(context.getElementsByClassName(m));
      }
      // tag.class
      if (context.querySelectorAll) {
        return toArray(context.querySelectorAll(selector));
      }
      // ie fallback
      match = context.getElementsByTagName(match[2] || '*');
      ret = [];
      j = 0;
      m = ' ' + m + ' ';
      for (; node = match[j]; j++) {
        if (~ (' ' + node.className + ' ').indexOf(m)) {
          ret.push(node);
        }
      }
      return ret;

    //分组选择器
    } else {
      ret = [];
      selector = selector.split(rcomma);
      if (selector.length < 2) {
        throw 'Invalid selector: ' + selector;
      }
      for (i = 0; node = selector[i]; i++) {
        pPush.apply(ret, queryAll(node, context));
      }
      return ret;
    }
  };

  var query = octopus.query = function (selector, context) {
    return queryAll(selector, context)[0];
  };

  //octopus.mscellaneous.js 
  'Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList,XMLHttpRequest'.replace(/[^,]+/g, function (name) {
    class2type['[object ' + name + ']'] = name.toLowerCase();
  });

  extend({
    'log' : function () {
        if (octopus.DEBUG && console) {
          var arr = [],
              i = 0,
              len = arguments.length;

          for (; i < len ; i++) {
            arr[i] = arguments[i];
          }
          arr.unshift('OCTOPUS DEBUG: ');
          console.log.apply(console, arr);
        }
     },
    'camelize' : function(s) {
        return s.replace(/-(.)/g, function (m, m1) {
          return m1.toUpperCase();
        });
     },
    'noConflict': function (deep) {
      window.$ = _$;
      deep && (window.octopus = _octopus);
      return octopus;
    },
    'type': function (obj) {
      return obj == null ? String(obj) : class2type[pToString.call(obj)] || 'object';
    },
    'isString': function (obj) {
      return octopus.type(obj) === 'string';
    },
    'isFunction': function (obj) { 
      return octopus.type(obj) === 'function';
    },
    'isArray': Array.isArray || function (obj) {
      return octopus.type(obj) === 'array';
    },
    'isObject': function (obj) { 
      return obj !== Object(obj);
    },
    'now': function() {
      return Date.now || new Date().valueOf();
    },
    'deferred': function () {
      var list = [],
          self = function (fn) {
            octopus.isFunction(fn) && list.push(fn);
            return self;
          };

      self.fire = function (fn) {
        list = self.reuse ? list.concat() : list
        while (fn = list.shift()) {
          fn();
        }
        return list.length ? self : self.complete();
      }
      self.complete = empty;
      return self;
    }
  });


  //octopus.className.js
  addDetection('supportClassList',function() {
    return !!document.createElement('div').classList;
  });


  if (detect('supportClassList')) {
    var hasClass = octopus.hasClass = function(el, cls) {
      return el.classList.contains(cls);
    };
    var addClass = octopus.addClass  = function(el, cls) {
      var i = 0, 
          c;

      cls = cls.split(' ');
      while( c = cls[i++] ) {
        el.classList.add(c);
      }
    };
    var removeClass = octopus.removeClass = function(el, cls) {
      var i = 0,
          c;
          
      cls = cls.split(' ');
      while( c = cls[i++] ) {
        el.classList.remove(c);
      }
    };
    var toggleClass = octopus.toggleClass = function(el, cls) {
      el.classList.toggle(cls);
    };
  }else{
    var hasClass = octopus.hasClass = function(el, cls) {
      return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') !== -1;
     };
     var addClass = octopus.addClass  = function(el, cls) {
      el.className += (el.className ? ' ' : '') + cls;
     };
     var removeClass = octopus.removeClass = function(el, cls) {
      el.className = el.className.replace(RegExp('\\b' + cls + '\\b', 'g'), '');
     };
     var toggleClass = octopus.toggleClass = function(el, cls) {
       hasClass(el, cls) ? removeClass(el, cls) : addClass(el, cls);
     };
  }


  //octopus.support.js
  var support = octopus.support = (function () {
    var b,
        div = document.createElement('div');

    div.setAttribute('className', 't');
    div.innerHTML = '<b style="float:left;opacity:.55"></b>';
    b = div.getElementsByTagName('b')[0];
    return {
      getSetAttribute: div.className !== 't',
      cssFloat: !! b.style.cssFloat,
      opacity: /^0.55/.test(b.style.opacity) 
    };
  })();


  //octopus.attributes.js
  var getAttr, removeAttr;
  if (support.getSetAttribute) {
    getAttr = function (node, name) {
      var nType;
      if (!node || (nType = node.nodeType) === 3 || nType === 8 || nType === 2) {
        return undefined;
      }

      return node.getAttribute(name);
    };
    removeAttr = function (node, name, value) {
      node.removeAttribute(name);
    };
  } else {
    // IE6/7
    getAttr = function (node, name) {
      var nType, ret;
      if (!node || (nType = node.nodeType) === 3 || nType === 8 || nType === 2) {
        return undefined;
      }
      if (rleveltwo.test(name)) {
        return node.getAttribute(name, 2);
      } else {
        ret = node.getAttributeNode(name);
        return ret && (ret = ret.nodeValue) !== '' ? ret : null;
      }
    };
    removeAttr = function (node, name, value) {
      node.setAttribute(name, '');
      node.removeAttributeNode(node.getAttributeNode(name));
    };
  }

  octopus.setAttr = function (node, name, value) {
    var nType, ret;
    if (!node || (nType = node.nodeType) === 3 || nType === 8 || nType === 2) {
      return;
    }
    if (!support.getSetAttribute) {
      ret = node.getAttributeNode(name);
      if (!ret) {
        ret = document.createAttribute(name);
        node.setAttributeNode(ret);
      }
      ret.nodeValue = value + '';
      return;
    }
    node.setAttribute(name, value + '');
  };

  octopus.getAttr = getAttr;
  octopus.removeAttr = removeAttr;


  //octopus.css.js
  addDetection('transform',function() {
    var styles = document.createElement('a').style,   
        props = ['webkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'Transform'],
        i = 0,
        len = props.length;

    for (; i <len ; i++) {
      if (props[i] in styles) {
        return props[i]  
      }
    }
  });


  var cssProps = {
    'float': support.cssFloat ? 'cssFloat' : 'styleFloat',
    'transform': detect('transform') ? detect('transform') : ''
  },
  cssHooks = {};

  var getCSS;
  if (window.getComputedStyle) {
    getCSS = function (node, name) {
      name = cssProps[name] || name;
      var style,
          ret = cssHooks[name];

      if (ret && pHasOwn.call(ret, 'get')) {
        return ret.get(node, name);
      } else {
        ret = getComputedStyle(node, null)[name];
        return  (style = node.style) && style[name] || ret;
      }
    };
  } else if (document.documentElement.currentStyle) {
    getCSS = function (node, name) {
      name = cssProps[name] || name;
      var left, 
          rsLeft, 
          style,
          ret = cssHooks[name];

      if (ret && pHasOwn.call(ret, 'get')) {
        return ret.get(node, name);
      } else {
        // Credits to jQuery
        ret = node.currentStyle && node.currentStyle[name];

        // Uses the pixel converter by Dean Edwards
        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
        if (rnotnumpx.test(ret)) {
          rsLeft = node.runtimeStyle && node.runtimeStyle[name];
          style = node.style;

          left = style.left;
          if (rsLeft) {
            node.runtimeStyle.left = node.currentStyle.left;
          }
          style.left = name === 'fontSize' ? '1em' : (ret || 0);
          ret = style.pixelLeft + 'px';

          // Revert the changed values
          style.left = left;
          if (rsLeft) {
            node.runtimeStyle.left = rsLeft;
          }
        }

        return ret === '' ? 'auto' : !ret ? (style = node.style) && style[name] : ret;
      }
    };
  }
  octopus.getCSS = getCSS;

  // IE uses filter for opacity
  if (!support.opacity) {
    cssHooks.opacity = {
      get: function (node) {
        var alpha = node.filters.alpha;
        // Return a string just like the browser
        return alpha ? alpha.opacity / 100 + '' : '1';
      },
      set: function (node, value) {
        var style = node.style,
          alpha = node.filters.alpha;

        style.zoom = 1; // Force opacity in IE by setting the zoom level
        if (alpha) {
          alpha.opacity = value * 100;
        } else {
          style.filter += 'alpha(opacity=' + value * 100 + ')';
        }
      }
    };
  }

  octopus.setCSS = function (node, name, value) {
    name = cssProps[name] || name;
    var hook = cssHooks[name];
    if (hook && pHasOwn.call(hook, 'set')) {
      hook.set(node, value);
    } else {
      node.style[name] = value;
    }
  };

  //octopus.dimension.js
  octopus.getWinDimension = function (name) {
    name = name.charAt(0).toUpperCase() + name.slice(1); //首字母大写
    var docElemProp = document.documentElement['client' + name];
    return document.compatMode === 'CSS1Compat' && docElemProp || document.body['client' + name] || docElemProp;
  };

  octopus.getDocDimension = function (name) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return Math.max(
        document.documentElement['client' + name],
        document.body['scroll' + name],
        document.documentElement['scroll' + name],
        document.body['offset' + name], 
        document.documentElement['offset' + name]
      );
  };

  //octopus.event.js
  var on, off, preventDefault, stopPropagation;
  if (document.addEventListener) {
    on = function (node, type, fn) {
      if (node.addEventListener) {
        node.addEventListener(type, fn, false);
      }
    };
    off = function (node, type, fn) {
      if (node.removeEventListener) {
        node.removeEventListener(type, fn, false);
      }
    };
    // IE
  } else {
    preventDefault = function () {
      this.returnValue = false;
    };
    stopPropagation = function () {
      this.cancelBubble = true;
    };
    on = function (node, type, fn) {
      var f;
      if (node.attachEvent) {
        f = fn[guid()] || (fn[guid()] = function (e) {
          if (typeof e.preventDefault !== 'function') {
            e.preventDefault = preventDefault;
            e.stopPropagation = stopPropagation;
          }
          fn.call(node, e);
        });
        node.attachEvent('on' + type, f);
      }
    };
    off = function (node, type, fn) {
      if (node.detachEvent) {
        node.detachEvent('on' + type, fn[guid()] || fn);
      }
    };
  }
  octopus.on = on;
  octopus.off = off;

  var fire;
  if (document.createEvent) {
    fire = function (node, type) {
      var event = document.createEvent('HTMLEvents');
      event.initEvent(type, true, true);
      node.dispatchEvent(event);
    };
  } else {
    fire = function (node, type) {
      var event = document.createEventObject();
      node.fireEvent('on' + type, event);
    };
  }
  octopus.fire = fire;
  //TODO:delegate


  // Add internal functions to the prototype
  each('each forEach merge toArray indexOf'.split(' '), function (val) {
    proto[val] = function () {
      var args = [this];
      pPush.apply(args, arguments);
      return octopus[val].apply(this, args);
    };
  });
  each('addClass removeClass toggleClass setAttr removeAttr setCSS on off fire'.split(' '), function (val) {
    proto[val] = function () {
      var node, args, i = 0;
      for (; node = this[i]; i++) {
        args = [node];
        pPush.apply(args, arguments);
        octopus[val].apply(node, args);
      }
      return this;
    };
  });

  // If any of the elements have the class, return true
  proto.hasClass = function (classStr) {
    var node, 
        i = 0,
        ret;

    for (; node = this[i]; i++) {
      if (hasClass(node, classStr)) {
        return true;
      }
    }
    return false;
  };

  // getAttr/getCSS only return for the first node
  each(['getAttr', 'getCSS'], function (val) {
    proto[val] = function (name) {
      return octopus[val](this[0], name);
    };
  });

  //octopus.traversing.js
  extend(proto, {
    slice: function (start, end) {
      return new octopus(slice.apply(toArray(this), arguments));
    },
    first: function () {
      return this.slice(0, 1);
    },
    eq: function (index) {
      return~ (index = +index) ? this.slice(index, index + 1) : this.slice(index);
    },
    find: function (selector) {
      var node,
          sel, 
          j,
          el,
          i = 0,
          ret = [];

      for (; node = this[i]; i++) {
        sel = queryAll(selector, rid.test(selector) ? document : node);
        for (j = 0; el = sel[j]; j++) {
          if (!~indexOf(ret, el)) {
            ret.push(el);
          }
        }
      }
      return new octopus(ret);
    },
    filter: function (fn) {
      var node,
          ret = [],
          i = 0;

      for (; node = this[i]; i++) {
        if (fn.call(node, node, i)) {
          ret.push(node);
        }
      }
      return new octopus(ret);
    }
  });


  //octopus.beacon.js
  /**
   * 通过请求一个图片的方式向服务器存储一条日志，适用于统计等不需要服务器返回数据的情况
   * @function
   * @grammar octopus.beacon(url)
   * @param {string} url 要发送的地址.
   */
  octopus.beacon = function (url) {
    var img = new Image();
    img.onload = img.onerror = img.onabort = function () {
      img.onload = img.onerror = img.onabort = null;
      img = null;
    };
    img.src = url;
  };

  //octopus.jsonp.js
  octopus.JSONP = function (params, callback) {
    var JSONString = 'JSON_' + guid(),
      running = false;

    octopus.JSON[JSONString] = function (data) {
      running = false;
      delete octopus.JSON[JSONString];
      callback(data);
    }

    if (typeof params.data == 'object') {
      params.data = octopus.toQueryString(params.data);
    }
    var publik = {
      send: function () {
        running = true;
        var url = params.url + '?' + params.key + '= octopus.JSON.' + JSONString + '&' + params.data;
        octopus.load(url);
      },

      cancel: function () {
        running && script.parentNode && script.parentNode.removeChild(script);
        running = false;
        octopus.JSON[JSONString] = function () {
          delete octopus.JSON[JSONString];
        }
      }
    };
    if (params.now !== false) {
      publik.send();
    }
    return publik;
  }

  //octopus.query.js
  octopus.toQueryString = function (object, base) {
    var queryString = [];
    each(object, function (value, key) {
      if (base) {
        key = base + '[' + key + ']';
      }
      var result;

      if (octopus.isArray(value)) {
        var qs = {};
        each(value, function (val, i) {
          qs[i] = val;
        });
        result = octopus.toQueryString(qs, key);
      } else if (typeof value == 'object') {
        result = octopus.toQueryString(value, key);
      } else {
        result = key + '=' + encodeURIComponent(value);
      }

      if (value !== null) {
        queryString.push(result);
      }
    });
    return queryString.join('&');
  }

  octopus.createQuery = function(params) {
    var q = '',
        p ;

   for (p in params) {
      q += encodeURIComponent(p)+'='+encodeURIComponent(params[p])+'&';
    }
    return q.slice(0, -1);
  };

  //octopus.format.js

  /**
   * format message patterns
   * $.format("{1} likes {2}", 'John', 'Anna');
   * $.format("{a} likes {b}", {a:'John', b:'Anna'});
   */
  octopus.format = function() {
    var args = arguments;
    if (!args[0]) {
      return null;
    }

    if(octopus.isObject(args[1])){
      return args[0].replace(/(.*?)\{(.+?)\}([^\{]*)/g, function() {
        return arguments[1] + (args[1][arguments[2]] || "") + arguments[3];
      });
    } else {
      return args[0].replace(/\{(\d+)\}/g, function() {
        return args[arguments[1]];
      });
    }
  };

  //octopus.tmpl.js
  //TODO: octopus.tmpl

  //octopus.request.js
  var xhrObject = (function () {
    var XMLHTTP = function () {
      return new XMLHttpRequest();
    }
    var MSXML2 = function () {
      return new ActiveXObject('MSXML2.XMLHTTP');
    }
    var MSXML = function () {
      return new ActiveXObject('Microsoft.XMLHTTP');
    }
    try {
      XMLHTTP();
      return XMLHTTP;
    } catch (e) {
      try {
        MSXML2();
        return MSXML2;
      } catch (e) {
        MSXML();
        return MSXML;
      }
    }
  })();


  octopus.request = function (options, callback) {
    if (!(this instanceof octopus.request)) {
      return new octopus.request(options, callback);
    }
    var self = this;
    self.options = extend({}, self.options, options)
    self.callback = callback;
    self.xhr = new xhrObject;
    self.headers = self.options.headers;
    if (self.options.now !== false) {
      self.send();
    }
  };

  octopus.request.prototype = {
    options: {
      /*
        user: '',
        password: '',
      */
      exception: empty,
      url: '',
      data: '',
      method: 'get',
      now: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
      },
      async: true,
      emulation: true, //仿效；竞赛；努力追上并超越；竞争
      urlEncoded: true,
      encoding: 'utf-8'
    },

    onStateChange: function () {
      var self = this,
        xhr = self.xhr;

      if (xhr.readyState != 4 || !self.running) {
        return;
      }
      self.running = false;
      self.status = 0;

      try {
        var status = xhr.status;
        self.status = (status == 1223) ? 204 : status;
      } catch (e) {}

      xhr.onreadystatechange = empty;

      var args = self.status >= 200 && self.status < 300 ? [false, self.xhr.responseText || '', self.xhr.responseXML] : [self.status];

      self.callback.apply(self, args);
    },

    setHeader: function (name, value) {
      this.headers[name] = value;
      return this;
    },

    getHeader: function (name) {
      try {
        return this.xhr.getResponseHeader(name);
      } catch (e) {
        return null;
      }
    },
    send: function () {
      var self = this,
        options = self.options;
      if (self.running) return self;
      self.running = true;

      var data = options.data || '',
        url = String(options.url),
        method = options.method.toLowerCase();

      if (typeof data != 'string') {
        data = octopus.toQueryString(data)
      }
      if (options.emulation && indexOf(method, ['get', 'post']) < 0) {
        var _method = '_method=' + method;
        data = (data) ? _method + '&' + data : _method;
        method = 'post';
      }

      if (options.urlEncoded && indexOf(method, ['post', 'put']) > -1) {
        var encoding = (options.encoding) ? '; charset=' + options.encoding : '';
        self.headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
      }

      if (!url) {
        url = document.location.pathname
      }
      var trimPosition = url.lastIndexOf('/');
      if (trimPosition > -1 && (trimPosition = url.indexOf('#')) > -1) {
        url = url.substr(0, trimPosition);
      };
      if (data && method == 'get') {
        url += (url.indexOf('?') > -1 ? '&' : '?') + data;
        data = null;
      };

      var xhr = self.xhr;

      xhr.open(method.toUpperCase(), url, open.async, options.user, options.password);
      if (options.user && 'withCredentials' in xhr) xhr.withCredentials = true;
      xhr.onreadystatechange = bind(self.onStateChange, self);
      for (var i in self.headers) {
        try {
          xhr.setRequestHeader(i, self.headers[i]);
        } catch (e) {
          options.exception.apply(self, [i, self.headers[i]]);
        }
      }
      xhr.send(data);
      if (!options.async) self.onStateChange();
      return self;
    },
    cancel: function () {
      var self = this;
      if (!self.running) {
        return self;
      }
      self.running = false;
      var xhr = self.xhr;
      xhr.abort();
      xhr.onreadystatechange = empty;
      self.xhr = new xhrObject();
      return self;
    }
  };


  //octopus.json.js
  addDetection('supportJSON',function() {
    return window.JSON && window.JSON.parse;
  });

  if (detect('supportJSON')) {
    octopus.JSON = {
      parse: function (json) {
        if (typeof json !== 'string') {
          return;
        }
        json = trim(json);
        var isValid = /^[\],:{}\s]*$/.test(json.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
          .replace(/(?:^|:|,)(?:\s*\[)+/g, ""));

        if (!isValid) {
          throw 'Invalid JSON';
        }
        return new Function('return ' + json)();
      },
      stringify: function (data) {
        var _slashes = function (string) {
          var key,
          replacements = {
            "\\\\": '\\\\',
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\r": '\\r',
            '"': '\\"'
          };

          for (key in replacements) {
            string = string.replace(new RegExp(key, 'ig'), replacements[key]);
          }
          return string;
        },
        _stringify = function (data) {
          var temp = [],
            i,
            type,
            value,
            rvalue;

          for (i in data) {
            value = data[i];
            type = typeof value;
            if (type === 'undefined') {
              return;
            }
            if (type !== 'function') {
              switch (type) {
                case 'object':
                  rvalue = value === null ? value :
                  // For ISO date format
                  value.getDay ? '"' + (1e3 - ~value.getUTCMonth() * 10 + value.toUTCString() + 1e3 + value / 1).replace(/1(..).*?(\d\d)\D+(\d+).(\S+).*(...)/, '$3-$1-$2T$4.$5Z') + '"' :
                  // For Array
                  value.length ? '[' + (function () {
                    var rdata = [];
                    each(value, function (i, item) {
                      rdata.push((typeof item === 'string' ? '"' + _slashes(item) + '"' : item));
                    });
                    return rdata.join(',');
                  })() + ']' :
                  // For Object
                  octopus.JSON.stringify(value);
                  break;
                case 'number':
                  rvalue = !isFinite(value) ? null : value;
                  break;
                case 'boolean':
                case 'null':
                  rvalue = value;
                  break;
                case 'string':
                  rvalue = '"' + _slashes(value) + '"';
                  break;
              }
              temp.push('"' + i + '"' + ':' + rvalue);
            }
          }
          return temp.join(',');
        }
        return '{' + _stringify(data) + '}';
      }
    }
  } else {
    octopus.JSON = window.JSON;
  }

  //octopus.cookie.js
  octopus.cookie = function (){
    var gCookieLife = '1 year', 
      gMajorDelim = '|', 
      gMinorDelim = '=',
      gDomain = '.2345.com';

    function splitFind(list, key, delim) {
        var i,
          result, 
          fields, 
          tmp, 
          len = list.length;

        for (i=0; i < len; i++) {
          tmp = list[i];
          if (tmp) {  
            fields = tmp.split(delim);
            if (fields[0] === key) {
              result = fields[1];
              break;    
            } 
          }
        }
        return(result);
    }

    function setCookie(name, value, expires, path, domain, secure) {
      var cookieUnits = 24 * 60 * 60 * 1000, 
          permCookie = true,
          expDate = new Date(),
          cookieStr;

      if (!name || !value) {
        octopus.log("ERROR: missing name or value for [" + name + "] -- cookie not set!");
        return;
      }

      expires = expires || gCookieLife;

      if (expires.match(/year/)) {
        expires = parseInt(expires, 10) * 365 * cookieUnits;      
      }
      else if (expires.match(/month/)) {
        expires = parseInt(expires, 10) * 30 * cookieUnits;     
      }
      else if (expires.match(/kill|remove|delete/)) {
        expires = -1 * 365 * cookieUnits;     
      }
      else {
        permCookie = false;
        expires = parseInt(expires, 10);
      }

      if (permCookie) {
        expDate.setTime(expDate.getTime() + expires);  
      }

      cookieStr = name + "=" + encodeURIComponent(value) 
        + ((permCookie) ? "; expires=" + expDate.toGMTString() : "") 
        + "; path=" + ((path) ? path : "/")
        + "; domain=" + ((domain) ? domain : gDomain)
        + ((secure) ? "; secure" : "");

        document.cookie = cookieStr;
    }

    function getCookie(name) {
      var cookieStr = document.cookie,
          cookies = [],
          result;

        if (cookieStr) {
         cookies = cookieStr.split(/;\s*/);
        }
        result = splitFind(cookies, name, '=');
        return(decodeURIComponent(result));
     }

    function deleteCookie(name) {
      return setCookie(name, -1, 'kill');
    }

    function getMetaCookie(subName, name) {
      var cookieStr = getCookie(name);
      return splitFind(cookieStr.split(gMajorDelim), subName, gMinorDelim);
    }

    function setMetaCookie(subName, name, value) {
      var currentCookieVal = getCookie(name),
        subCookies = [],
        temp = [],
        newCookieVal = '',
        fields,
        x;

      if (currentCookieVal) {
        subCookies = currentCookieVal.split(gMajorDelim);
      }

      for (x in subCookies) {
        if (subCookies.hasOwnProperty(x)) {
          fields = subCookies[x].split(gMinorDelim);
          if (fields[0] && fields[1]) {
            temp[fields[0]] = fields[1]; 
          }
        }
      }
      if (subName) {
       temp[subName] = value;
      }
      for (x in temp) {
        if (temp.hasOwnProperty(x)) {
          if (temp[x]) {
            newCookieVal += gMajorDelim + x + gMinorDelim + temp[x];   
          }
        }
      }
      return(setCookie(name, newCookieVal));
    }

    function deleteMetaCookie(subName, name) {
      return(setMetaCookie(subName, name, null));
    }

    return {
      set: setCookie,
      get: getCookie,
      del: deleteCookie,
      setSub: setMetaCookie,
      getSub: getMetaCookie,
      delSub: deleteMetaCookie
    };
  }();

  //octopus.store.js
  //serialize  deserialize

  if (!window.localStorage) {
    var store = octopus.store = {},
    prefix = 'data-userdata',
      attrSrc = document.body,
      html = document.documentElement,
      mark = function (key, isRemove, temp, reg) {
        try {
          html.load(prefix);
          temp = html.getAttribute(prefix);
          temp = temp === null ? '' : temp;
        } catch (e) {
          temp = '';
        }
        reg = RegExp('\\b' + key + '\\b,?', 'i');
        hasKey = reg.test(temp) ? 1 : 0;
        temp = isRemove ? temp.replace(reg, '').replace(',', '') : hasKey ? temp : temp === '' ? key : temp.split(',').concat(key).join(',');
        html.setAttribute(prefix, temp);
        html.save(prefix);
      };

    attrSrc.addBehavior('#default#userData');
    html.addBehavior('#default#userData');
    store.getItem = function (key) {
      try {
        attrSrc.load(key);
        return attrSrc.getAttribute(key);
      } catch (e) {
        return null;
      }
    };
    store.setItem = function (key, value) {
      attrSrc.setAttribute(key, value);
      attrSrc.save(key);
      mark(key);
    };
    store.removeItem = function (key) {
      attrSrc.removeAttribute(key);
      attrSrc.save(key);
      mark(key, 1);
    };
    store.clear = function () {
      try {
        html.load(prefix);
        var attrs = html.getAttribute(prefix).split(','),
          len = attrs.length;
        for (var i = 0; i < len; i++) {
          attrSrc.removeAttribute(attrs[i]);
          attrSrc.save(attrs[i]);
        }
        html.setAttribute(prefix, '');
        html.save(prefix);
      } catch (e) {

      }
    };
  } else {
    octopus.store = window.localStorage;
  }

  //octopus.browser.js
  octopus.browser = function () {
    var ua = navigator.userAgent.toLowerCase(),
      getEnv = function (name) {
        return (name = ua.match(RegExp(name + '\\b[ \\/]?([\\w\\.]*)', 'i'))) ? name.slice(1) : ['', ''] //浏览器名称和版本号
      },
      addSearchProviderEnabled = function () {
        return !!(window.external && typeof window.external.AddSearchProvider != 'undefined' && typeof window.external.IsSearchProviderInstalled != 'undefined');
      }, //判断不一定准确 http://xliar.com/thread-138-1-1.html
      detect360chrome = function () {
        return 'track' in document.createElement('track') && 'scoped' in document.createElement('style');
      },
      is360se = false,
      is2345 = function () {
        var ret = false;
        try {
          if (win.external.RCCoralGetItem() === false) {
            ret = true;
          }
        } catch (e) {
          ret = false;
        }
        return ret;
      }(),
      getMaxthonVer;

    try { //maxthon
      if (/(\d+\.\d)/.test(win.external.max_version)) {
        getMaxthonVer = parseFloat(RegExp.$1);
      }
    } catch (e) {}

    if (!is2345 && !addSearchProviderEnabled()) {
      try {
        if (String(window.external)) {
          is360se = true;
        }
      } catch (e) {}
    }

    var getTypes = getEnv('(msie|safari|firefox|chrome|opera)'),
      getShell = getEnv('(maxthon|360se|360chrome|theworld|se|theworld|greenbrowser|qqbrowser|lbbrowser|2345Explorer)');
    getTypes[0] === 'msie' ? is2345 ? getShell = ['2345Explorer', ''] : is360se ? getShell = ['360se', ''] : getMaxthonVer ? getShell = ['maxthon', getMaxthonVer] : getShell == ',' && (getShell = getEnv('(tencenttraveler)')) : getTypes[0] === 'safari' && (getTypes[1] = getEnv('version') + '.' + getTypes[1]);

    if (getTypes[0] === 'chrome') { //360chrome
      detect360chrome() && (getShell = ['360chrome', '']);
    }

    return {
      isShell: !! getShell[0],
      shell: getShell,
      types: getTypes,
      chrome: getTypes[0] === 'chrome' && getTypes[1],
      firefox: getTypes[0] === 'firefox' && getTypes[1],
      ie: getTypes[0] === 'msie' && getTypes[1],
      opera: getTypes[0] === 'opera' && getTypes[1],
      safari: getTypes[0] === 'safari' && getTypes[1],
      maxthon: getShell[0] === 'maxthon' && getShell[1],
      isTT: getShell[0] === 'tencenttraveler' && getShell[1]
    }
  }();


  //octopus.functional.js
  octopus.memoize = function(func, hasher) {
    var memo = {};
       hasher || (hasher =  function(value) { return value;});

    return function() {
      var key = hasher.apply(this, arguments);
      return pHasOwn.call(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  octopus.throttle = function(func, wait) {
    var context, 
        args, 
        timeout,
        result;

    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };


  //octopus.ready.js
  extend({
    isReady: false,
    ready: octopus.deferred(),
    fireReady: function () {
      if (octopus.isReady) {
        return;
      }
      octopus.isReady = true;
      octopus.ready.fire();
      octopus.fireReady = empty;
    }
  });

  if (document.readyState === 'complete') {
    octopus.fireReady();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function () {
      document.removeEventListener('DOMContentLoaded', arguments.callee, false);
      octopus.fireReady();
    }, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState === 'complete') {
        document.detachEvent('onreadystatechange', arguments.callee);
        octopus.fireReady();
      }
    });

    var top = false;
    try {
      top = window.frameElement == null && document.documentElement;
    } catch (e) {}

    if (top && top.doScroll) {
      (function doScrollCheck() {
        if (!octopus.isReady) {
          try {
            // http://javascript.nwbox.com/IEContentLoaded/
            top.doScroll('left');
          } catch (e) {
            return setTimeout(doScrollCheck, 50);
          }
          octopus.fireReady();
        }
      })();
    }
  };
 
  //octopus.mod.js
  //文件加载器
  var mod = {}, //存放模块 {'name':{charset: "utf-8",path: "http://pianyishuo.com/assets/js/filter.js",type: "js"}}
      loaded = {}, //{url:ture}
      loading = {}, //正在载入中
      head = document.head || document.getElementsByTagName('head')[0] || document.documentElement,
      globals = [],
    /*
      //声明了全局模块，后面的队列会默认先加载全局模块。在实际应用中不要滥用，只声明必要的，因为这样会影响一些性能。
    */
     configure = {
      autoload: false,
      core: ''
    };

    var load = function (url, type, charset, callback) {
      if (loading[url]) {
        if (callback) {
          setTimeout(function () {
            load(url, type, charset, callback);
          }, 17);
          return;
        }
      }

      if (loaded[url]) {
        if (callback) {
          callback();
          return;
        }
      }

      loading[url] = true;

      var pureurl = url.split('?')[0];
      var n, t = type || pureurl.toLowerCase().substring(pureurl.lastIndexOf('.') + 1);

      if (t === 'js') {
        n = document.createElement('script');
        n.type = 'text/javascript';
        n.src = url;
        n.async = 'true';
        if (charset) {
          n.charset = charset;
        }
      } else if (t === 'css') {
        n = document.createElement('link');
        n.type = 'text/css';
        n.rel = 'stylesheet';
        n.href = url;
        loaded[url] = true;
        loading[url] = false;
        head.appendChild(n);
        if (callback) callback();
        return;
      }

      n.onload = n.onreadystatechange = function () {
        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
          loading[url] = false;
          loaded[url] = true;
          if (callback) {
            callback();
          }
          n.onload = n.onreadystatechange = null;
        }
      };
      n.onerror = function () {
        loading[url] = false;
        if (callback) {
          callback();
        }
        n.onerror = null;
      }
      head.appendChild(n);
    };

    // private method, parallel process.
    // This method used for loading modules in parallel.
    var parallel = function (list, callback) {
      var length = list.length,
         hook = function () {
          if (!--length && callback) callback();
        };

      if (length == 0) {
        callback && callback();
        return;
      };
      for (var i = 0; i < list.length; i++) {
        var current = mod[list[i]]; //list array
        if (typeof (list[i]) == 'function') { //函数
          list[i]();
          hook();
          continue;
        }
        if (typeof (current) === 'undefined') { //模块未定义过，就使用
          octopus.log('In Error :: Module not found: ' + list[i]);
          hook();
          continue;
        }
        if (current.rely && current.rely.length != 0) { //依赖数组 rely
           parallel(current.rely, (function (current) { //依赖先载完 
            return function () {
              load(current.path, current.type, current.charset, hook);
            };
          })(current));
        } else {
          load(current.path, current.type, current.charset, hook);
        }
      }
    };
    
      // mapping for `In`
      // This is the main function, also mapping for method `use`.
      /*
      //真正的加载顺序为 mod1 || mod2 || function -> function[callback]
      var demo=octopus.use('mod1','mod2',function() {
          console.log('我跟mod1和mod2是并行的关系');
      },function() {
          console.log('我是回调函数，他们都加载完毕才会触发我'); //队列中最后一个函数被视为回调函数
      });
  
    */
      var use = function () { 
        var args = pSlice.call(arguments);
  
        if (globals.length) { //加入全局模块
          args = globals.concat(args);
        }
  
        if (typeof (args[args.length - 1]) === 'function') { //队列中最后一个函数被视为回调函数
          var callback = args.pop();
        }
  
        if (configure.core && !loaded[configure.core]) {
          parallel(['core'], function () { //核心模块先载完
            parallel(args, callback);
          });
        } else {
          parallel(args, callback);
        }
      };
  
     
    // This method used for adding module.
    // var mod = {}; //存放模块 {'name':{charset: "utf-8",path: "http://pianyishuo.com/assets/js/filter.js",type: "js"}}
    var add = function (key, val) {
      if (!key || !val || !val.path) return;
      mod[key] = val;
    };
  
    /*
    octopus.adds({
        'type' : 'js',
        'charset':'utf-8',
        'modules':{
            'lazy-load':{path:'/assets/js/lazyload.js?t=20120127.js',type:'js'},
            'search':{path:'/assets/js/search.js?t=20120127.js',type:'js'},
            'largeimage':{path:'/assets/js/largeimage.js?t=20120127.js',type:'js'}
        }
    );
    */
   var adds = function (config) { 
    if (!config.modules) return;
    var key,
        val;

    for (key in config.modules) {
      if (config.modules.hasOwnProperty(key)) {
         val = config.modules[key];
        if (config.type && !val.type) val.type = config.type;
        if (config.charset && !val.charset) val.charset = config.charset;
        add.call(null, key, val); 
      } else {
        continue;
      }
    }
  };
  
  var modConfig = function (key, val) {
    configure[key] = val;
  };

  var global = function () {
    var args = octopus.isArray(arguments[0]) ? arguments[0] : pSlice.call(arguments);
    globals = globals.concat(args);
  };

  (function () { 
    var self = (function () {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

    var autoload = self.getAttribute('autoload'),
        core = self.getAttribute('core');

    if (core) {
      configure['autoload'] = eval(autoload);
      configure['core'] = core;
      add('core', {
        path: configure.core
      });
    }
    if (configure.autoload && configure.core) {
      use();
    }
  }());
  
  extend({
    add : add,
    adds : adds,
    modConfig : modConfig,
    load : load,
    use : use
  });


  //octopus.anim.js 
  //https://github.com/ded/morpheus/blob/master/integration/integration.html

   addDetection('frame',function() {
     return window.requestAnimationFrame  ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.msRequestAnimationFrame     ||
      window.oRequestAnimationFrame      ||
      function (callback) {
        window.setTimeout(function () {
          callback(+new Date())
        }, 16) // when I was 16..
      }
  });
  var animate = function () {
    var perf = window.performance, //履行；性能；表现；演出
        perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow),
        now = perfNow ? function () { return perfNow.call(perf) } : octopus.now,
        html = document.documentElement,
        thousand = 1000, 
        rgbOhex = /^rgb\(|#/,//rgb or hex
        relVal = /^([+\-])=([\d\.]+)/,  // -=5.5 relative value
        numUnit = /^(?:[\+\-]=)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/, // -=5.5px

        rotate = /rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/ ,  //旋转；使转动；
        scale = /scale\(((?:[+\-]=)?([\d\.]+))\)/,
        skew = /skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,  //偏离，歪斜；斜视
        translate = /translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/, //翻译；解释；转化；被翻译
     
        // these elements do not require 'px'
        unitless = { 
          lineHeight: 1,
          zoom: 1,
          zIndex: 1,
          opacity: 1, 
          transform: 1
        },
        frame = detect('frame');


  //rgb(255,255,255) => #ffffff 
  function rgb(r, g, b) {
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

  function toHex(c) {
    var m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return (m ? rgb(m[1], m[2], m[3]) : c)
      .replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3') // short skirt to long jacket
  }

  function formatTransform(v) {
    var s = '';
    if ('rotate' in v) {
      s += 'rotate(' + v.rotate + 'deg) ';
    }
    if ('scale' in v) {
      s += 'scale(' + v.scale + ') ';
    }
    if ('translatex' in v) {
      s += 'translate(' + v.translatex + 'px,' + v.translatey + 'px) ';
    }
    if ('skewx' in v) {
      s += 'skew(' + v.skewx + 'deg,' + v.skewy + 'deg)';
    }
    return s;
  }

  function parseTransform(style, base) { 
    var values = {},
        m;
    if (m = style.match(rotate)){
      values.rotate = by(m[1], base ? base.rotate : null); //null=>1
    }
    if (m = style.match(scale)){
      values.scale = by(m[1], base ? base.scale : null);
    }
    if (m = style.match(skew)) {
      values.skewx = by(m[1], base ? base.skewx : null); values.skewy = by(m[3], base ? base.skewy : null);
    }
    if (m = style.match(translate)) {
      values.translatex = by(m[1], base ? base.translatex : null); values.translatey = by(m[3], base ? base.translatey : null);
    }
    return values;
  }

  function by(val, start, m, r, i) { //'-=5.5'  学习：用参数定义变量 relVal = /^([+\-])=([\d\.]+)/, 
    return (m = relVal.exec(val)) ?
      (i = parseFloat(m[2])) && (start + (m[1] == '+' ? 1 : -1) * i) :
      parseFloat(val)
  }

  function nextColor(pos, start, finish) { //颜色变化
    var r = [],
        i, 
        e, 
        from,
        to;

    for (i = 0; i < 6; i++) {
      from = Math.min(15, parseInt(start.charAt(i),  16));
      to   = Math.min(15, parseInt(finish.charAt(i), 16));
      e = Math.floor((to - from) * pos + from);
      e = e > 15 ? 15 : e < 0 ? 0 : e;
      r[i] = e.toString(16);
    }
      
    return '#' + r.join('');
  }


  var children = [] //动画队列

  function render(timestamp) {
    var i, 
        count = children.length;
    if (perfNow && timestamp > 1e12) { //??
      timestamp = now();
    }
    for (i = count; i--;) {
      children[i](timestamp); //每个执行的函数都获得一个函数戳参数
    }
    children.length && frame(render);
  }

  function live(f) {
    if (children.push(f) === 1){ //push一个 立即执行？？
      frame(render);
    }
     /*
      console.log(  [].push(1)); => 1
      console.log(  [].push(1,2,3,3));  => 4 推进几个元素
    */
  }

  function die(f) { //为什么不用splice??  移除一个
    var rest, 
        index = indexOf(children, f);

    if (index >= 0) {
      rest = children.slice(index + 1);
      children.length = index;
      children = children.concat(rest);
    }
  }

  function tween(duration, fn, done, ease, from, to) {
    ease = octopus.isFunction(ease) ? ease : animate.easings[ease] ||   function (t) { 
      return Math.sin(t * Math.PI / 2);
    }
    var time = duration || thousand,
        self = this,
        diff = to - from, //间隔
        start = now(),
        stop = 0,
        end = 0;

    function run(t) {
      var delta = t - start; //时间间隔
      if (delta > time || stop) { //结束帧
        to = isFinite(to) ? to : 1;
        stop ? end && fn(to) : fn(to); //区别？
        die(run); //移出队列
        return done && done.apply(self); //执行回调
      }
      isFinite(to) ? fn((diff * ease(delta / time)) + from) :fn(ease(delta / time));
    }

    live(run); //执行

    return {
      stop: function (jump) {
        stop = 1;
        end = jump;
        if (!jump){ 
          done = null;
        }
      }
    }
  }

  function getTweenVal(pos, units, begin, end, k, i, v) { //Tween 吐温算法 将运动值保存在一个队列里
    if (k == 'transform') { //transform变化
      v = {};
      for (var t in begin[i][k]) {
        v[t] = (t in end[i][k]) ? Math.round(((end[i][k][t] - begin[i][k][t]) * pos + begin[i][k][t]) * thousand) / thousand : begin[i][k][t];
      } 
      return v;
    } else if (typeof begin[i][k] == 'string') { //颜色变化 k变化属性值
      return nextColor(pos, begin[i][k], end[i][k]);
    } else { //普通值变化
      // round so we don't get crazy long floats
      v = Math.round(((end[i][k] - begin[i][k]) * pos + begin[i][k]) * thousand) / thousand;
      if (!(k in unitless)){
        v += units[i][k] || 'px';
      }
      return v;
    }
  }

  function animate(elements, options) {
    var els = elements ? (els = isFinite(elements.length) ? elements : [elements]) : [], 
        i,
        complete = options.complete, //回调
        duration = options.duration, //持续时间
        ease = options.easing, //运动方式
        begin = [], 
        end = [], 
        units = [];

    for (i = els.length; i--;) {
      begin[i] = {};
      end[i] = {};
      units[i] = {};

      for (var k in options) {
        switch (k) { //k 变化属性值 关键字
          case 'complete':
          case 'duration':
          case 'easing':
          continue;
          break
        }
          
        var v = getCSS(els[i], k), 
            unit, 
            tmp = octopus.isFunction(options[k]) ? options[k](els[i]) : options[k]; //可以传入函数形式获取值


        if (typeof tmp == 'string' && rgbOhex.test(tmp) && !rgbOhex.test(v)) {
          delete options[k]; 
          continue; 
        }
        begin[i][k] = k == 'transform' ? parseTransform(v) :
          typeof tmp == 'string' && rgbOhex.test(tmp) ?
            toHex(v).slice(1) :
            parseFloat(v);

        end[i][k] = k == 'transform' ? parseTransform(tmp, begin[i][k]) :
          typeof tmp == 'string' && tmp.charAt(0) == '#' ?
            toHex(tmp).slice(1) :
            by(tmp, parseFloat(v));

        (typeof tmp == 'string') && (unit = tmp.match(numUnit)) && (units[i][k] = unit[1]);
      }
    }

    return tween.apply(els, [duration, function (pos, v, xy) {
      for (i = els.length; i--;) {
        for (var k in options) {
          v = getTweenVal(pos, units, begin, end, k, i);
          
          k == 'transform' ?
           els[i].style[octopus.detect('transform')] = formatTransform(v) :
            k == 'opacity' && !support.opacity ?
              (els[i].style.filter = 'alpha(opacity=' + (v * 100) + ')') :
              (els[i].style[octopus.camelize(k)] = v);
        }
      }
    }, complete, ease])
  }

    // expose useful methods
    animate.tween = tween;
    animate.parseTransform = parseTransform;
    animate.formatTransform = formatTransform;
    animate.easings = {};
    return animate;
  }();

  
  extend(proto, {
    'animate': function (options) {
      animate(this, options);
      return this;
    },
    'fadeIn': function (d, fn) {
      animate(this, {
        duration: d,
        opacity: 1,
        complete: fn
      });
      return this;
    },
    'fadeOut': function (d, fn) {
      animate(this, {
        duration: d,
        opacity: 0,
        complete: fn
      })
      return this;
    },
    'tween': animate.tween
  });

  //注册 octopus
  window.octopus = octopus;
  //如果$未被使用，则注册 $
  !window.$ && (window.$ = octopus);
}(this));