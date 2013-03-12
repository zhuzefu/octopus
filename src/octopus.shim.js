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