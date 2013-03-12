(function(window){var document=window.document,_$=window.$,_octopus=window.octopus,rcomma=/\s*,\s*/,rid=/^#([\w\-]+)$/,rtagclass=/^(?:([\w]+)|([\w]+)?\.([\w\-]+))$/,rtrim=/\S/.test("\u00a0")?/^[\s\xA0]+|[\s\xA0]+$/g:/^\s+|\s+$/g,rleveltwo=/(?:href|src|width|height)/i,rnotnumpx=/^-?\d+[^p\s\d]+$/i,ropacity=/opacity=([^)]*)/,ralpha=/alpha\([^)]*\)/i,ArrayProto=Array.prototype,objectProto=Object.prototype,pForEach=ArrayProto.forEach,pSlice=ArrayProto.slice,pPush=ArrayProto.push,pIndexOf=ArrayProto.indexOf,pToString=objectProto.toString,pHasOwn=objectProto.hasOwnProperty,pBind=Function.prototype.bind,pTrim=String.prototype.trim,detectCache={},detectionTests={},class2type={},empty=function(){},octopus=function(a,b){if(!(this instanceof octopus))return new octopus(a,b);if(octopus.isFunction(a))return octopus.ready(a);var c=queryAll(a,b);this.length=c.length,merge(this,c)};octopus.VERSION="1.0.0",octopus.DEBUG="%DEBUG%";var proto=octopus.prototype,guid=octopus.guid=function(a){return(a||"octopus")+octopus.VERSION+9e17*Math.random()},addDetection=octopus.addDetection=function(a,b){detectionTests[a]||(detectionTests[a]=b)},detect=octopus.detect=function(a){return detectCache[a]||(detectCache[a]=detectionTests[a]()),detectCache[a]},toArray=octopus.toArray=function(a){for(var b=0,c=a.length,d=[];c>b;b++)d[b]=a[b];return d},each=octopus.each=octopus.forEach=function(a,b,c){var d,e;if(a){if(pForEach&&a.forEach===pForEach)a.forEach(b,c);else if(a.length===+a.length)for(d=0,e=a.length;e>d;d++)d in a&&b.call(c,a[d],d,a);else for(d in a)pHasOwn.call(a,d)&&b.call(c,a[d],d,a);return a}},merge=octopus.merge=function(a,b){for(var c=0,d=b.length;d>c;c++)a[c]=b[c];return a},extend=octopus.extend=function(){var b,a=arguments[0],c=1,d=arguments.length;if(1===d)return octopus.extend(octopus,a);for(;d>c;c++)for(b in arguments[c])a[b]=arguments[c][b];return a},indexOf=octopus.indexOf=pIndexOf?function(a,b,c){return pIndexOf.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=c?0>c?Math.max(0,d+c):c:0;d>e;++e)if(a[e]===b)return e;return-1},trim=octopus.trim=pTrim?function(a){return pTrim.call(a)}:function(a){return a.replace(rtrim,"")},bind=octopus.bind=function(a,b){if(pBind&&a.bind===pBind)return pBind.apply(a,pSlice.call(arguments,1));var c=pSlice.call(arguments,2);return function(){return a.apply(b,c.concat(pSlice.call(arguments)))}},queryAll=octopus.queryAll=function(a,b){if(b=b&&("string"==typeof b?queryAll(b)[0]:b.nodeName?b:b[0])||document,!a||!b)return[];if("string"!=typeof a)return a.style?[a]:a.documentElement?[a.documentElement]:toArray(a);var c,d,e,f,g,h;if(c=rid.exec(a))return(d=b.getElementById(c[1]))?[d]:[];if(c=rtagclass.exec(a)){if(f=c[1])return toArray(b.getElementsByTagName(f));if(f=c[3],!c[2]&&b.getElementsByClassName)return toArray(b.getElementsByClassName(f));if(b.querySelectorAll)return toArray(b.querySelectorAll(a));for(c=b.getElementsByTagName(c[2]||"*"),e=[],h=0,f=" "+f+" ";d=c[h];h++)~(" "+d.className+" ").indexOf(f)&&e.push(d);return e}if(e=[],a=a.split(rcomma),2>a.length)throw"Invalid selector: "+a;for(g=0;d=a[g];g++)pPush.apply(e,queryAll(d,b));return e},query=octopus.query=function(a,b){return queryAll(a,b)[0]};if("Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList,XMLHttpRequest".replace(/[^,]+/g,function(a){class2type["[object "+a+"]"]=a.toLowerCase()}),extend({log:function(){if(octopus.DEBUG&&console){for(var a=[],b=0,c=arguments.length;c>b;b++)a[b]=arguments[b];a.unshift("OCTOPUS DEBUG: "),console.log.apply(console,a)}},camelize:function(a){return a.replace(/-(.)/g,function(a,b){return b.toUpperCase()})},noConflict:function(a){return window.$=_$,a&&(window.octopus=_octopus),octopus},type:function(a){return null==a?a+"":class2type[pToString.call(a)]||"object"},isString:function(a){return"string"===octopus.type(a)},isFunction:function(a){return"function"===octopus.type(a)},isArray:Array.isArray||function(a){return"array"===octopus.type(a)},isObject:function(a){return a!==Object(a)},now:function(){return Date.now||(new Date).valueOf()},deferred:function(){var a=[],b=function(c){return octopus.isFunction(c)&&a.push(c),b};return b.fire=function(c){for(a=b.reuse?a.concat():a;c=a.shift();)c();return a.length?b:b.complete()},b.complete=empty,b}}),addDetection("supportClassList",function(){return!!document.createElement("div").classList}),detect("supportClassList"))var hasClass=octopus.hasClass=function(a,b){return a.classList.contains(b)},addClass=octopus.addClass=function(a,b){var d,c=0;for(b=b.split(" ");d=b[c++];)a.classList.add(d)},removeClass=octopus.removeClass=function(a,b){var d,c=0;for(b=b.split(" ");d=b[c++];)a.classList.remove(d)},toggleClass=octopus.toggleClass=function(a,b){a.classList.toggle(b)};else var hasClass=octopus.hasClass=function(a,b){return-1!==(" "+a.className+" ").indexOf(" "+b+" ")},addClass=octopus.addClass=function(a,b){a.className+=(a.className?" ":"")+b},removeClass=octopus.removeClass=function(a,b){a.className=a.className.replace(RegExp("\\b"+b+"\\b","g"),"")},toggleClass=octopus.toggleClass=function(a,b){hasClass(a,b)?removeClass(a,b):addClass(a,b)};var support=octopus.support=function(){var a,b=document.createElement("div");return b.setAttribute("className","t"),b.innerHTML='<b style="float:left;opacity:.55"></b>',a=b.getElementsByTagName("b")[0],{getSetAttribute:"t"!==b.className,cssFloat:!!a.style.cssFloat,opacity:/^0.55/.test(a.style.opacity)}}(),getAttr,removeAttr;support.getSetAttribute?(getAttr=function(a,b){var c;return a&&3!==(c=a.nodeType)&&8!==c&&2!==c?a.getAttribute(b):void 0},removeAttr=function(a,b){a.removeAttribute(b)}):(getAttr=function(a,b){var c,d;return a&&3!==(c=a.nodeType)&&8!==c&&2!==c?rleveltwo.test(b)?a.getAttribute(b,2):(d=a.getAttributeNode(b),d&&""!==(d=d.nodeValue)?d:null):void 0},removeAttr=function(a,b){a.setAttribute(b,""),a.removeAttributeNode(a.getAttributeNode(b))}),octopus.setAttr=function(a,b,c){var d,e;if(a&&3!==(d=a.nodeType)&&8!==d&&2!==d)return support.getSetAttribute?(a.setAttribute(b,c+""),void 0):(e=a.getAttributeNode(b),e||(e=document.createAttribute(b),a.setAttributeNode(e)),e.nodeValue=c+"",void 0)},octopus.getAttr=getAttr,octopus.removeAttr=removeAttr,addDetection("transform",function(){for(var a=document.createElement("a").style,b=["webkitTransform","MozTransform","OTransform","msTransform","Transform"],c=0,d=b.length;d>c;c++)if(b[c]in a)return b[c]});var cssProps={"float":support.cssFloat?"cssFloat":"styleFloat",transform:detect("transform")?detect("transform"):""},cssHooks={},getCSS;window.getComputedStyle?getCSS=function(a,b){b=cssProps[b]||b;var c,d=cssHooks[b];return d&&pHasOwn.call(d,"get")?d.get(a,b):(d=getComputedStyle(a,null)[b],(c=a.style)&&c[b]||d)}:document.documentElement.currentStyle&&(getCSS=function(a,b){b=cssProps[b]||b;var c,d,e,f=cssHooks[b];return f&&pHasOwn.call(f,"get")?f.get(a,b):(f=a.currentStyle&&a.currentStyle[b],rnotnumpx.test(f)&&(d=a.runtimeStyle&&a.runtimeStyle[b],e=a.style,c=e.left,d&&(a.runtimeStyle.left=a.currentStyle.left),e.left="fontSize"===b?"1em":f||0,f=e.pixelLeft+"px",e.left=c,d&&(a.runtimeStyle.left=d)),""===f?"auto":f?f:(e=a.style)&&e[b])}),octopus.getCSS=getCSS,support.opacity||(cssHooks.opacity={get:function(a){var b=a.filters.alpha;return b?b.opacity/100+"":"1"},set:function(a,b){var c=a.style,d=a.filters.alpha;c.zoom=1,d?d.opacity=100*b:c.filter+="alpha(opacity="+100*b+")"}}),octopus.setCSS=function(a,b,c){b=cssProps[b]||b;var d=cssHooks[b];d&&pHasOwn.call(d,"set")?d.set(a,c):a.style[b]=c},octopus.getWinDimension=function(a){a=a.charAt(0).toUpperCase()+a.slice(1);var b=document.documentElement["client"+a];return"CSS1Compat"===document.compatMode&&b||document.body["client"+a]||b},octopus.getDocDimension=function(a){return a=a.charAt(0).toUpperCase()+a.slice(1),Math.max(document.documentElement["client"+a],document.body["scroll"+a],document.documentElement["scroll"+a],document.body["offset"+a],document.documentElement["offset"+a])};var on,off,preventDefault,stopPropagation;document.addEventListener?(on=function(a,b,c){a.addEventListener&&a.addEventListener(b,c,!1)},off=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}):(preventDefault=function(){this.returnValue=!1},stopPropagation=function(){this.cancelBubble=!0},on=function(a,b,c){var d;a.attachEvent&&(d=c[guid()]||(c[guid()]=function(b){"function"!=typeof b.preventDefault&&(b.preventDefault=preventDefault,b.stopPropagation=stopPropagation),c.call(a,b)}),a.attachEvent("on"+b,d))},off=function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c[guid()]||c)}),octopus.on=on,octopus.off=off;var fire;fire=document.createEvent?function(a,b){var c=document.createEvent("HTMLEvents");c.initEvent(b,!0,!0),a.dispatchEvent(c)}:function(a,b){var c=document.createEventObject();a.fireEvent("on"+b,c)},octopus.fire=fire,each("each forEach merge toArray indexOf".split(" "),function(a){proto[a]=function(){var b=[this];return pPush.apply(b,arguments),octopus[a].apply(this,b)}}),each("addClass removeClass toggleClass setAttr removeAttr setCSS on off fire".split(" "),function(a){proto[a]=function(){for(var b,c,d=0;b=this[d];d++)c=[b],pPush.apply(c,arguments),octopus[a].apply(b,c);return this}}),proto.hasClass=function(a){for(var b,c=0;b=this[c];c++)if(hasClass(b,a))return!0;return!1},each(["getAttr","getCSS"],function(a){proto[a]=function(b){return octopus[a](this[0],b)}}),extend(proto,{slice:function(){return new octopus(slice.apply(toArray(this),arguments))},first:function(){return this.slice(0,1)},eq:function(a){return~(a=+a)?this.slice(a,a+1):this.slice(a)},find:function(a){for(var b,c,d,e,f=0,g=[];b=this[f];f++)for(c=queryAll(a,rid.test(a)?document:b),d=0;e=c[d];d++)~indexOf(g,e)||g.push(e);return new octopus(g)},filter:function(a){for(var b,c=[],d=0;b=this[d];d++)a.call(b,b,d)&&c.push(b);return new octopus(c)}}),octopus.beacon=function(a){var b=new Image;b.onload=b.onerror=b.onabort=function(){b.onload=b.onerror=b.onabort=null,b=null},b.src=a},octopus.JSONP=function(a,b){var c="JSON_"+guid(),d=!1;octopus.JSON[c]=function(a){d=!1,delete octopus.JSON[c],b(a)},"object"==typeof a.data&&(a.data=octopus.toQueryString(a.data));var e={send:function(){d=!0;var b=a.url+"?"+a.key+"= octopus.JSON."+c+"&"+a.data;octopus.load(b)},cancel:function(){d&&script.parentNode&&script.parentNode.removeChild(script),d=!1,octopus.JSON[c]=function(){delete octopus.JSON[c]}}};return a.now!==!1&&e.send(),e},octopus.toQueryString=function(a,b){var c=[];return each(a,function(a,d){b&&(d=b+"["+d+"]");var e;if(octopus.isArray(a)){var f={};each(a,function(a,b){f[b]=a}),e=octopus.toQueryString(f,d)}else e="object"==typeof a?octopus.toQueryString(a,d):d+"="+encodeURIComponent(a);null!==a&&c.push(e)}),c.join("&")},octopus.createQuery=function(a){var c,b="";for(c in a)b+=encodeURIComponent(c)+"="+encodeURIComponent(a[c])+"&";return b.slice(0,-1)},octopus.format=function(){var a=arguments;return a[0]?octopus.isObject(a[1])?a[0].replace(/(.*?)\{(.+?)\}([^\{]*)/g,function(){return arguments[1]+(a[1][arguments[2]]||"")+arguments[3]}):a[0].replace(/\{(\d+)\}/g,function(){return a[arguments[1]]}):null};var xhrObject=function(){var a=function(){return new XMLHttpRequest},b=function(){return new ActiveXObject("MSXML2.XMLHTTP")},c=function(){return new ActiveXObject("Microsoft.XMLHTTP")};try{return a(),a}catch(d){try{return b(),b}catch(d){return c(),c}}}();if(octopus.request=function(a,b){if(!(this instanceof octopus.request))return new octopus.request(a,b);var c=this;c.options=extend({},c.options,a),c.callback=b,c.xhr=new xhrObject,c.headers=c.options.headers,c.options.now!==!1&&c.send()},octopus.request.prototype={options:{exception:empty,url:"",data:"",method:"get",now:!0,headers:{"X-Requested-With":"XMLHttpRequest",Accept:"text/javascript, text/html, application/xml, text/xml, */*"},async:!0,emulation:!0,urlEncoded:!0,encoding:"utf-8"},onStateChange:function(){var a=this,b=a.xhr;if(4==b.readyState&&a.running){a.running=!1,a.status=0;try{var c=b.status;a.status=1223==c?204:c}catch(d){}b.onreadystatechange=empty;var e=a.status>=200&&300>a.status?[!1,a.xhr.responseText||"",a.xhr.responseXML]:[a.status];a.callback.apply(a,e)}},setHeader:function(a,b){return this.headers[a]=b,this},getHeader:function(a){try{return this.xhr.getResponseHeader(a)}catch(b){return null}},send:function(){var a=this,b=a.options;if(a.running)return a;a.running=!0;var c=b.data||"",d=b.url+"",e=b.method.toLowerCase();if("string"!=typeof c&&(c=octopus.toQueryString(c)),b.emulation&&0>indexOf(e,["get","post"])){var f="_method="+e;c=c?f+"&"+c:f,e="post"}if(b.urlEncoded&&indexOf(e,["post","put"])>-1){var g=b.encoding?"; charset="+b.encoding:"";a.headers["Content-type"]="application/x-www-form-urlencoded"+g}d||(d=document.location.pathname);var h=d.lastIndexOf("/");h>-1&&(h=d.indexOf("#"))>-1&&(d=d.substr(0,h)),c&&"get"==e&&(d+=(d.indexOf("?")>-1?"&":"?")+c,c=null);var i=a.xhr;i.open(e.toUpperCase(),d,open.async,b.user,b.password),b.user&&"withCredentials"in i&&(i.withCredentials=!0),i.onreadystatechange=bind(a.onStateChange,a);for(var j in a.headers)try{i.setRequestHeader(j,a.headers[j])}catch(k){b.exception.apply(a,[j,a.headers[j]])}return i.send(c),b.async||a.onStateChange(),a},cancel:function(){var a=this;if(!a.running)return a;a.running=!1;var b=a.xhr;return b.abort(),b.onreadystatechange=empty,a.xhr=new xhrObject,a}},addDetection("supportJSON",function(){return window.JSON&&window.JSON.parse}),octopus.JSON=detect("supportJSON")?{parse:function(a){if("string"==typeof a){a=trim(a);var b=/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""));if(!b)throw"Invalid JSON";return Function("return "+a)()}},stringify:function(a){var b=function(a){var b,c={"\\\\":"\\\\","\b":"\\b","	":"\\t","\n":"\\n","\r":"\\r",'"':'\\"'};for(b in c)a=a.replace(RegExp(b,"ig"),c[b]);return a},c=function(a){var d,e,f,g,c=[];for(d in a){if(f=a[d],e=typeof f,"undefined"===e)return;if("function"!==e){switch(e){case"object":g=null===f?f:f.getDay?'"'+(1e3-10*~f.getUTCMonth()+f.toUTCString()+1e3+f/1).replace(/1(..).*?(\d\d)\D+(\d+).(\S+).*(...)/,"$3-$1-$2T$4.$5Z")+'"':f.length?"["+function(){var a=[];return each(f,function(c,d){a.push("string"==typeof d?'"'+b(d)+'"':d)}),a.join(",")}()+"]":octopus.JSON.stringify(f);break;case"number":g=isFinite(f)?f:null;break;case"boolean":case"null":g=f;break;case"string":g='"'+b(f)+'"'}c.push('"'+d+'"'+":"+g)}}return c.join(",")};return"{"+c(a)+"}"}}:window.JSON,octopus.cookie=function(){function e(a,b,c){var d,e,f,g,h=a.length;for(d=0;h>d;d++)if(g=a[d],g&&(f=g.split(c),f[0]===b)){e=f[1];break}return e}function f(b,c,e,f,g,h){var l,i=864e5,j=!0,k=new Date;return b&&c?(e=e||a,e.match(/year/)?e=365*parseInt(e,10)*i:e.match(/month/)?e=30*parseInt(e,10)*i:e.match(/kill|remove|delete/)?e=-365*i:(j=!1,e=parseInt(e,10)),j&&k.setTime(k.getTime()+e),l=b+"="+encodeURIComponent(c)+(j?"; expires="+k.toGMTString():"")+"; path="+(f?f:"/")+"; domain="+(g?g:d)+(h?"; secure":""),document.cookie=l,void 0):(octopus.log("ERROR: missing name or value for ["+b+"] -- cookie not set!"),void 0)}function g(a){var d,b=document.cookie,c=[];return b&&(c=b.split(/;\s*/)),d=e(c,a,"="),decodeURIComponent(d)}function h(a){return f(a,-1,"kill")}function i(a,d){var f=g(d);return e(f.split(b),a,c)}function j(a,d,e){var l,m,h=g(d),i=[],j=[],k="";h&&(i=h.split(b));for(m in i)i.hasOwnProperty(m)&&(l=i[m].split(c),l[0]&&l[1]&&(j[l[0]]=l[1]));a&&(j[a]=e);for(m in j)j.hasOwnProperty(m)&&j[m]&&(k+=b+m+c+j[m]);return f(d,k)}function k(a,b){return j(a,b,null)}var a="1 year",b="|",c="=",d=".2345.com";return{set:f,get:g,del:h,setSub:j,getSub:i,delSub:k}}(),window.localStorage)octopus.store=window.localStorage;else{var store=octopus.store={},prefix="data-userdata",attrSrc=document.body,html=document.documentElement,mark=function(a,b,c,d){try{html.load(prefix),c=html.getAttribute(prefix),c=null===c?"":c}catch(e){c=""}d=RegExp("\\b"+a+"\\b,?","i"),hasKey=d.test(c)?1:0,c=b?c.replace(d,"").replace(",",""):hasKey?c:""===c?a:c.split(",").concat(a).join(","),html.setAttribute(prefix,c),html.save(prefix)};attrSrc.addBehavior("#default#userData"),html.addBehavior("#default#userData"),store.getItem=function(a){try{return attrSrc.load(a),attrSrc.getAttribute(a)}catch(b){return null}},store.setItem=function(a,b){attrSrc.setAttribute(a,b),attrSrc.save(a),mark(a)},store.removeItem=function(a){attrSrc.removeAttribute(a),attrSrc.save(a),mark(a,1)},store.clear=function(){try{html.load(prefix);for(var a=html.getAttribute(prefix).split(","),b=a.length,c=0;b>c;c++)attrSrc.removeAttribute(a[c]),attrSrc.save(a[c]);html.setAttribute(prefix,""),html.save(prefix)}catch(d){}}}if(octopus.browser=function(){var g,a=navigator.userAgent.toLowerCase(),b=function(b){return(b=a.match(RegExp(b+"\\b[ \\/]?([\\w\\.]*)","i")))?b.slice(1):["",""]},c=function(){return!(!window.external||void 0===window.external.AddSearchProvider||void 0===window.external.IsSearchProviderInstalled)},d=function(){return"track"in document.createElement("track")&&"scoped"in document.createElement("style")},e=!1,f=function(){var a=!1;try{win.external.RCCoralGetItem()===!1&&(a=!0)}catch(b){a=!1}return a}();try{/(\d+\.\d)/.test(win.external.max_version)&&(g=parseFloat(RegExp.$1))}catch(h){}if(!f&&!c())try{window.external+""&&(e=!0)}catch(h){}var i=b("(msie|safari|firefox|chrome|opera)"),j=b("(maxthon|360se|360chrome|theworld|se|theworld|greenbrowser|qqbrowser|lbbrowser|2345Explorer)");return"msie"===i[0]?f?j=["2345Explorer",""]:e?j=["360se",""]:g?j=["maxthon",g]:","==j&&(j=b("(tencenttraveler)")):"safari"===i[0]&&(i[1]=b("version")+"."+i[1]),"chrome"===i[0]&&d()&&(j=["360chrome",""]),{isShell:!!j[0],shell:j,types:i,chrome:"chrome"===i[0]&&i[1],firefox:"firefox"===i[0]&&i[1],ie:"msie"===i[0]&&i[1],opera:"opera"===i[0]&&i[1],safari:"safari"===i[0]&&i[1],maxthon:"maxthon"===j[0]&&j[1],isTT:"tencenttraveler"===j[0]&&j[1]}}(),octopus.memoize=function(a,b){var c={};return b||(b=function(a){return a}),function(){var d=b.apply(this,arguments);return pHasOwn.call(c,d)?c[d]:c[d]=a.apply(this,arguments)}},octopus.throttle=function(a,b){var c,d,e,f,g=0,h=function(){g=new Date,e=null,f=a.apply(c,d)};return function(){var i=new Date,j=b-(i-g);return c=this,d=arguments,0>=j?(clearTimeout(e),e=null,g=i,f=a.apply(c,d)):e||(e=setTimeout(h,j)),f}},extend({isReady:!1,ready:octopus.deferred(),fireReady:function(){octopus.isReady||(octopus.isReady=!0,octopus.ready.fire(),octopus.fireReady=empty)}}),"complete"===document.readyState)octopus.fireReady();else if(document.addEventListener)document.addEventListener("DOMContentLoaded",function(){document.removeEventListener("DOMContentLoaded",arguments.callee,!1),octopus.fireReady()},!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&(document.detachEvent("onreadystatechange",arguments.callee),octopus.fireReady())});var top=!1;try{top=null==window.frameElement&&document.documentElement}catch(e){}top&&top.doScroll&&function doScrollCheck(){if(!octopus.isReady){try{top.doScroll("left")}catch(a){return setTimeout(doScrollCheck,50)}octopus.fireReady()}}()}var mod={},loaded={},loading={},head=document.head||document.getElementsByTagName("head")[0]||document.documentElement,globals=[],configure={autoload:!1,core:""},load=function(a,b,c,d){if(loading[a]&&d)return setTimeout(function(){load(a,b,c,d)},17),void 0;if(loaded[a]&&d)return d(),void 0;loading[a]=!0;var f,e=a.split("?")[0],g=b||e.toLowerCase().substring(e.lastIndexOf(".")+1);if("js"===g)f=document.createElement("script"),f.type="text/javascript",f.src=a,f.async="true",c&&(f.charset=c);else if("css"===g)return f=document.createElement("link"),f.type="text/css",f.rel="stylesheet",f.href=a,loaded[a]=!0,loading[a]=!1,head.appendChild(f),d&&d(),void 0;f.onload=f.onreadystatechange=function(){this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(loading[a]=!1,loaded[a]=!0,d&&d(),f.onload=f.onreadystatechange=null)},f.onerror=function(){loading[a]=!1,d&&d(),f.onerror=null},head.appendChild(f)},parallel=function(a,b){var c=a.length,d=function(){!--c&&b&&b()};if(0==c)return b&&b(),void 0;for(var e=0;a.length>e;e++){var f=mod[a[e]];"function"!=typeof a[e]?void 0!==f?f.rely&&0!=f.rely.length?parallel(f.rely,function(a){return function(){load(a.path,a.type,a.charset,d)}}(f)):load(f.path,f.type,f.charset,d):(octopus.log("In Error :: Module not found: "+a[e]),d()):(a[e](),d())}},use=function(){var a=pSlice.call(arguments);if(globals.length&&(a=globals.concat(a)),"function"==typeof a[a.length-1])var b=a.pop();configure.core&&!loaded[configure.core]?parallel(["core"],function(){parallel(a,b)}):parallel(a,b)},add=function(a,b){a&&b&&b.path&&(mod[a]=b)},adds=function(a){if(a.modules){var b,c;for(b in a.modules)a.modules.hasOwnProperty(b)&&(c=a.modules[b],a.type&&!c.type&&(c.type=a.type),a.charset&&!c.charset&&(c.charset=a.charset),add.call(null,b,c))}},modConfig=function(a,b){configure[a]=b},global=function(){var a=octopus.isArray(arguments[0])?arguments[0]:pSlice.call(arguments);globals=globals.concat(a)};(function(){var self=function(){var a=document.getElementsByTagName("script");return a[a.length-1]}(),autoload=self.getAttribute("autoload"),core=self.getAttribute("core");core&&(configure.autoload=eval(autoload),configure.core=core,add("core",{path:configure.core})),configure.autoload&&configure.core&&use()})(),extend({add:add,adds:adds,modConfig:modConfig,load:load,use:use}),addDetection("frame",function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||function(a){window.setTimeout(function(){a(+new Date)},16)}});var animate=function(){function o(a,b,c){return"#"+(1<<24|a<<16|b<<8|c).toString(16).slice(1)}function p(a){var b=a.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);return(b?o(b[1],b[2],b[3]):a).replace(/#(\w)(\w)(\w)$/,"#$1$1$2$2$3$3")}function q(a){var b="";return"rotate"in a&&(b+="rotate("+a.rotate+"deg) "),"scale"in a&&(b+="scale("+a.scale+") "),"translatex"in a&&(b+="translate("+a.translatex+"px,"+a.translatey+"px) "),"skewx"in a&&(b+="skew("+a.skewx+"deg,"+a.skewy+"deg)"),b}function r(a,b){var d,c={};return(d=a.match(i))&&(c.rotate=s(d[1],b?b.rotate:null)),(d=a.match(j))&&(c.scale=s(d[1],b?b.scale:null)),(d=a.match(k))&&(c.skewx=s(d[1],b?b.skewx:null),c.skewy=s(d[3],b?b.skewy:null)),(d=a.match(l))&&(c.translatex=s(d[1],b?b.translatex:null),c.translatey=s(d[3],b?b.translatey:null)),c}function s(a,b,c,d,e){return(c=g.exec(a))?(e=parseFloat(c[2]))&&b+("+"==c[1]?1:-1)*e:parseFloat(a)}function t(a,b,c){var e,f,g,h,d=[];for(e=0;6>e;e++)g=Math.min(15,parseInt(b.charAt(e),16)),h=Math.min(15,parseInt(c.charAt(e),16)),f=Math.floor((h-g)*a+g),f=f>15?15:0>f?0:f,d[e]=f.toString(16);return"#"+d.join("")}function v(a){var d,e=u.length;for(b&&a>1e12&&(a=c()),d=e;d--;)u[d](a);u.length&&n(v)}function w(a){1===u.push(a)&&n(v)}function x(a){var b,c=indexOf(u,a);c>=0&&(b=u.slice(c+1),u.length=c,u=u.concat(b))}function y(a,b,d,f,g,h){function o(a){var c=a-l;return c>i||m?(h=isFinite(h)?h:1,m?n&&b(h):b(h),x(o),d&&d.apply(j)):(isFinite(h)?b(k*f(c/i)+g):b(f(c/i)),void 0)}f=octopus.isFunction(f)?f:A.easings[f]||function(a){return Math.sin(a*Math.PI/2)};var i=a||e,j=this,k=h-g,l=c(),m=0,n=0;return w(o),{stop:function(a){m=1,n=a,a||(d=null)}}}function z(a,b,c,d,f,g,h){if("transform"==f){h={};for(var i in c[g][f])h[i]=i in d[g][f]?Math.round(((d[g][f][i]-c[g][f][i])*a+c[g][f][i])*e)/e:c[g][f][i];return h}return"string"==typeof c[g][f]?t(a,c[g][f],d[g][f]):(h=Math.round(((d[g][f]-c[g][f])*a+c[g][f])*e)/e,f in m||(h+=b[g][f]||"px"),h)}function A(a,b){var d,c=a?c=isFinite(a.length)?a:[a]:[],e=b.complete,g=b.duration,i=b.easing,j=[],k=[],l=[];for(d=c.length;d--;){j[d]={},k[d]={},l[d]={};for(var m in b){switch(m){case"complete":case"duration":case"easing":continue}var o,n=getCSS(c[d],m),t=octopus.isFunction(b[m])?b[m](c[d]):b[m];"string"!=typeof t||!f.test(t)||f.test(n)?(j[d][m]="transform"==m?r(n):"string"==typeof t&&f.test(t)?p(n).slice(1):parseFloat(n),k[d][m]="transform"==m?r(t,j[d][m]):"string"==typeof t&&"#"==t.charAt(0)?p(t).slice(1):s(t,parseFloat(n)),"string"==typeof t&&(o=t.match(h))&&(l[d][m]=o[1])):delete b[m]}}return y.apply(c,[g,function(a,e){for(d=c.length;d--;)for(var g in b)e=z(a,l,j,k,g,d),"transform"==g?c[d].style[octopus.detect("transform")]=q(e):"opacity"!=g||support.opacity?c[d].style[octopus.camelize(g)]=e:c[d].style.filter="alpha(opacity="+100*e+")"},e,i])}var a=window.performance,b=a&&(a.now||a.webkitNow||a.msNow||a.mozNow),c=b?function(){return b.call(a)}:octopus.now,e=(document.documentElement,1e3),f=/^rgb\(|#/,g=/^([+\-])=([\d\.]+)/,h=/^(?:[\+\-]=)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/,i=/rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/,j=/scale\(((?:[+\-]=)?([\d\.]+))\)/,k=/skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,l=/translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/,m={lineHeight:1,zoom:1,zIndex:1,opacity:1,transform:1},n=detect("frame"),u=[];return A.tween=y,A.parseTransform=r,A.formatTransform=q,A.easings={},A}();extend(proto,{animate:function(a){return animate(this,a),this},fadeIn:function(a,b){return animate(this,{duration:a,opacity:1,complete:b}),this},fadeOut:function(a,b){return animate(this,{duration:a,opacity:0,complete:b}),this},tween:animate.tween}),window.octopus=octopus,!window.$&&(window.$=octopus)})(this);