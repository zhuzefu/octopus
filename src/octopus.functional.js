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

