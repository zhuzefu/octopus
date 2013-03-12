 addDetection('supportClassList',function() {
    return !!document.createElement('div').classList;
  });


  if (detect('supportClassList')) {
    var hasClass = octopus.hasClass = function(el, cls) {
      return el.classList.contains(cls);
    };
    var addClass = octopus.addClass  = function(el, cls) {
      var i = 0, 
          c;

      cls = cls.split(' ');
      while( c = cls[i++] ) {
        el.classList.add(c);
      }
    };
    var removeClass = octopus.removeClass = function(el, cls) {
      var i = 0,
          c;
          
      cls = cls.split(' ');
      while( c = cls[i++] ) {
        el.classList.remove(c);
      }
    };
    var toggleClass = octopus.toggleClass = function(el, cls) {
      el.classList.toggle(cls);
    };
  }else{
    var hasClass = octopus.hasClass = function(el, cls) {
      return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') !== -1;
     };
     var addClass = octopus.addClass  = function(el, cls) {
      el.className += (el.className ? ' ' : '') + cls;
     };
     var removeClass = octopus.removeClass = function(el, cls) {
      el.className = el.className.replace(RegExp('\\b' + cls + '\\b', 'g'), '');
     };
     var toggleClass = octopus.toggleClass = function(el, cls) {
       hasClass(el, cls) ? removeClass(el, cls) : addClass(el, cls);
     };
  }
