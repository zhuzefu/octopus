
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
