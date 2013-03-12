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