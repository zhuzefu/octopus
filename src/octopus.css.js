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
