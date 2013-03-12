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