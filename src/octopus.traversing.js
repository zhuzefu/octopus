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