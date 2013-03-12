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
