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
