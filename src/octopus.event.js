 var on, off, preventDefault, stopPropagation;
  if (document.addEventListener) {
    on = function (node, type, fn) {
      if (node.addEventListener) {
        node.addEventListener(type, fn, false);
      }
    };
    off = function (node, type, fn) {
      if (node.removeEventListener) {
        node.removeEventListener(type, fn, false);
      }
    };
    // IE
  } else {
    preventDefault = function () {
      this.returnValue = false;
    };
    stopPropagation = function () {
      this.cancelBubble = true;
    };
    on = function (node, type, fn) {
      var f;
      if (node.attachEvent) {
        f = fn[guid()] || (fn[guid()] = function (e) {
          if (typeof e.preventDefault !== 'function') {
            e.preventDefault = preventDefault;
            e.stopPropagation = stopPropagation;
          }
          fn.call(node, e);
        });
        node.attachEvent('on' + type, f);
      }
    };
    off = function (node, type, fn) {
      if (node.detachEvent) {
        node.detachEvent('on' + type, fn[guid()] || fn);
      }
    };
  }
  octopus.on = on;
  octopus.off = off;

  var fire;
  if (document.createEvent) {
    fire = function (node, type) {
      var event = document.createEvent('HTMLEvents');
      event.initEvent(type, true, true);
      node.dispatchEvent(event);
    };
  } else {
    fire = function (node, type) {
      var event = document.createEventObject();
      node.fireEvent('on' + type, event);
    };
  }
  octopus.fire = fire;