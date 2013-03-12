extend({
  isReady: false,
  ready: octopus.deferred(),
  fireReady: function () {
    if (octopus.isReady) {
      return;
    }
    octopus.isReady = true;
    octopus.ready.fire();
    octopus.fireReady = empty;
  }
});

if (document.readyState === 'complete') {
  octopus.fireReady();
} else if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', function () {
    document.removeEventListener('DOMContentLoaded', arguments.callee, false);
    octopus.fireReady();
  }, false);
} else if (document.attachEvent) {
  document.attachEvent('onreadystatechange', function () {
    if (document.readyState === 'complete') {
      document.detachEvent('onreadystatechange', arguments.callee);
      octopus.fireReady();
    }
  });

  var top = false;
  try {
    top = window.frameElement == null && document.documentElement;
  } catch (e) {}

  if (top && top.doScroll) {
    (function doScrollCheck() {
      if (!octopus.isReady) {
        try {
          // http://javascript.nwbox.com/IEContentLoaded/
          top.doScroll('left');
        } catch (e) {
          return setTimeout(doScrollCheck, 50);
        }
        octopus.fireReady();
      }
    })();
  }
};