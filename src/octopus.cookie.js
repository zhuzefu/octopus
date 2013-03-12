octopus.cookie = function (){
    var gCookieLife = '1 year', 
      gMajorDelim = '|', 
      gMinorDelim = '=',
      gDomain = '.2345.com';

    function splitFind(list, key, delim) {
        var i,
          result, 
          fields, 
          tmp, 
          len = list.length;

        for (i=0; i < len; i++) {
          tmp = list[i];
          if (tmp) {  
            fields = tmp.split(delim);
            if (fields[0] === key) {
              result = fields[1];
              break;    
            } 
          }
        }
        return(result);
    }

    function setCookie(name, value, expires, path, domain, secure) {
      var cookieUnits = 24 * 60 * 60 * 1000, 
          permCookie = true,
          expDate = new Date(),
          cookieStr;

      if (!name || !value) {
        octopus.log("ERROR: missing name or value for [" + name + "] -- cookie not set!");
        return;
      }

      expires = expires || gCookieLife;

      if (expires.match(/year/)) {
        expires = parseInt(expires, 10) * 365 * cookieUnits;      
      }
      else if (expires.match(/month/)) {
        expires = parseInt(expires, 10) * 30 * cookieUnits;     
      }
      else if (expires.match(/kill|remove|delete/)) {
        expires = -1 * 365 * cookieUnits;     
      }
      else {
        permCookie = false;
        expires = parseInt(expires, 10);
      }

      if (permCookie) {
        expDate.setTime(expDate.getTime() + expires);  
      }

      cookieStr = name + "=" + encodeURIComponent(value) 
        + ((permCookie) ? "; expires=" + expDate.toGMTString() : "") 
        + "; path=" + ((path) ? path : "/")
        + "; domain=" + ((domain) ? domain : gDomain)
        + ((secure) ? "; secure" : "");

        document.cookie = cookieStr;
    }

    function getCookie(name) {
      var cookieStr = document.cookie,
          cookies = [],
          result;

        if (cookieStr) {
         cookies = cookieStr.split(/;\s*/);
        }
        result = splitFind(cookies, name, '=');
        return(decodeURIComponent(result));
     }

    function deleteCookie(name) {
      return setCookie(name, -1, 'kill');
    }

    function getMetaCookie(subName, name) {
      var cookieStr = getCookie(name);
      return splitFind(cookieStr.split(gMajorDelim), subName, gMinorDelim);
    }

    function setMetaCookie(subName, name, value) {
      var currentCookieVal = getCookie(name),
        subCookies = [],
        temp = [],
        newCookieVal = '',
        fields,
        x;

      if (currentCookieVal) {
        subCookies = currentCookieVal.split(gMajorDelim);
      }

      for (x in subCookies) {
        if (subCookies.hasOwnProperty(x)) {
          fields = subCookies[x].split(gMinorDelim);
          if (fields[0] && fields[1]) {
            temp[fields[0]] = fields[1]; 
          }
        }
      }
      if (subName) {
       temp[subName] = value;
      }
      for (x in temp) {
        if (temp.hasOwnProperty(x)) {
          if (temp[x]) {
            newCookieVal += gMajorDelim + x + gMinorDelim + temp[x];   
          }
        }
      }
      return(setCookie(name, newCookieVal));
    }

    function deleteMetaCookie(subName, name) {
      return(setMetaCookie(subName, name, null));
    }

    return {
      set: setCookie,
      get: getCookie,
      del: deleteCookie,
      setSub: setMetaCookie,
      getSub: getMetaCookie,
      delSub: deleteMetaCookie
    };
  }();