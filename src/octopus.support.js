var support = octopus.support = (function () {
    var b,
        div = document.createElement('div');

    div.setAttribute('className', 't');
    div.innerHTML = '<b style="float:left;opacity:.55"></b>';
    b = div.getElementsByTagName('b')[0];
    return {
      getSetAttribute: div.className !== 't',
      cssFloat: !! b.style.cssFloat,
      opacity: /^0.55/.test(b.style.opacity) 
    };
  })();
