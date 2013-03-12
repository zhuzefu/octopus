  octopus.browser = function () {
    var ua = navigator.userAgent.toLowerCase(),
      getEnv = function (name) {
        return (name = ua.match(RegExp(name + '\\b[ \\/]?([\\w\\.]*)', 'i'))) ? name.slice(1) : ['', ''] //浏览器名称和版本号
      },
      addSearchProviderEnabled = function () {
        return !!(window.external && typeof window.external.AddSearchProvider != 'undefined' && typeof window.external.IsSearchProviderInstalled != 'undefined');
      }, //判断不一定准确 http://xliar.com/thread-138-1-1.html
      detect360chrome = function () {
        return 'track' in document.createElement('track') && 'scoped' in document.createElement('style');
      },
      is360se = false,
      is2345 = function () {
        var ret = false;
        try {
          if (win.external.RCCoralGetItem() === false) {
            ret = true;
          }
        } catch (e) {
          ret = false;
        }
        return ret;
      }(),
      getMaxthonVer;

    try { //maxthon
      if (/(\d+\.\d)/.test(win.external.max_version)) {
        getMaxthonVer = parseFloat(RegExp.$1);
      }
    } catch (e) {}

    if (!is2345 && !addSearchProviderEnabled()) {
      try {
        if (String(window.external)) {
          is360se = true;
        }
      } catch (e) {}
    }

    var getTypes = getEnv('(msie|safari|firefox|chrome|opera)'),
      getShell = getEnv('(maxthon|360se|360chrome|theworld|se|theworld|greenbrowser|qqbrowser|lbbrowser|2345Explorer)');
    getTypes[0] === 'msie' ? is2345 ? getShell = ['2345Explorer', ''] : is360se ? getShell = ['360se', ''] : getMaxthonVer ? getShell = ['maxthon', getMaxthonVer] : getShell == ',' && (getShell = getEnv('(tencenttraveler)')) : getTypes[0] === 'safari' && (getTypes[1] = getEnv('version') + '.' + getTypes[1]);

    if (getTypes[0] === 'chrome') { //360chrome
      detect360chrome() && (getShell = ['360chrome', '']);
    }

    return {
      isShell: !! getShell[0],
      shell: getShell,
      types: getTypes,
      chrome: getTypes[0] === 'chrome' && getTypes[1],
      firefox: getTypes[0] === 'firefox' && getTypes[1],
      ie: getTypes[0] === 'msie' && getTypes[1],
      opera: getTypes[0] === 'opera' && getTypes[1],
      safari: getTypes[0] === 'safari' && getTypes[1],
      maxthon: getShell[0] === 'maxthon' && getShell[1],
      isTT: getShell[0] === 'tencenttraveler' && getShell[1]
    }
  }();