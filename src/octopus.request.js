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