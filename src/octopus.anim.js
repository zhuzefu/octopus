  
  //octopus.anim.js 
  //https://github.com/ded/morpheus/blob/master/integration/integration.html

   addDetection('frame',function() {
     return window.requestAnimationFrame  ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.msRequestAnimationFrame     ||
      window.oRequestAnimationFrame      ||
      function (callback) {
        window.setTimeout(function () {
          callback(+new Date())
        }, 16) // when I was 16..
      }
  });

  var animate = function () {
    var perf = window.performance, //履行；性能；表现；演出
        perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow),
        now = perfNow ? function () { return perfNow.call(perf) } : octopus.now,
        html = document.documentElement,
        thousand = 1000, 
        rgbOhex = /^rgb\(|#/,//rgb or hex
        relVal = /^([+\-])=([\d\.]+)/,  // -=5.5 relative value
        numUnit = /^(?:[\+\-]=)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/, // -=5.5px

        rotate = /rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/ ,  //旋转；使转动；
        scale = /scale\(((?:[+\-]=)?([\d\.]+))\)/,
        skew = /skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,  //偏离，歪斜；斜视
        translate = /translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/, //翻译；解释；转化；被翻译
     
        // these elements do not require 'px'
        unitless = { 
          lineHeight: 1,
          zoom: 1,
          zIndex: 1,
          opacity: 1, 
          transform: 1
        },
        frame = detect('frame');


  //rgb(255,255,255) => #ffffff 
  function rgb(r, g, b) {
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

  function toHex(c) {
    var m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return (m ? rgb(m[1], m[2], m[3]) : c)
      .replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3') // short skirt to long jacket
  }

  function formatTransform(v) {
    var s = '';
    if ('rotate' in v) {
      s += 'rotate(' + v.rotate + 'deg) ';
    }
    if ('scale' in v) {
      s += 'scale(' + v.scale + ') ';
    }
    if ('translatex' in v) {
      s += 'translate(' + v.translatex + 'px,' + v.translatey + 'px) ';
    }
    if ('skewx' in v) {
      s += 'skew(' + v.skewx + 'deg,' + v.skewy + 'deg)';
    }
    return s;
  }

  function parseTransform(style, base) { 
    var values = {},
        m;
    if (m = style.match(rotate)){
      values.rotate = by(m[1], base ? base.rotate : null); //null=>1
    }
    if (m = style.match(scale)){
      values.scale = by(m[1], base ? base.scale : null);
    }
    if (m = style.match(skew)) {
      values.skewx = by(m[1], base ? base.skewx : null); values.skewy = by(m[3], base ? base.skewy : null);
    }
    if (m = style.match(translate)) {
      values.translatex = by(m[1], base ? base.translatex : null); values.translatey = by(m[3], base ? base.translatey : null);
    }
    return values;
  }

  function by(val, start, m, r, i) { //'-=5.5'  学习：用参数定义变量 relVal = /^([+\-])=([\d\.]+)/, 
    return (m = relVal.exec(val)) ?
      (i = parseFloat(m[2])) && (start + (m[1] == '+' ? 1 : -1) * i) :
      parseFloat(val)
  }

  function nextColor(pos, start, finish) { //颜色变化
    var r = [],
        i, 
        e, 
        from,
        to;

    for (i = 0; i < 6; i++) {
      from = Math.min(15, parseInt(start.charAt(i),  16));
      to   = Math.min(15, parseInt(finish.charAt(i), 16));
      e = Math.floor((to - from) * pos + from);
      e = e > 15 ? 15 : e < 0 ? 0 : e;
      r[i] = e.toString(16);
    }
      
    return '#' + r.join('');
  }


  var children = [] //动画队列

  function render(timestamp) {
    var i, 
        count = children.length;
    if (perfNow && timestamp > 1e12) { //??
      timestamp = now();
    }
    for (i = count; i--;) {
      children[i](timestamp); //每个执行的函数都获得一个函数戳参数
    }
    children.length && frame(render);
  }

  function live(f) {
    if (children.push(f) === 1){ //push一个 立即执行？？
      frame(render);
    }
     /*
      console.log(  [].push(1)); => 1
      console.log(  [].push(1,2,3,3));  => 4 推进几个元素
    */
  }

  function die(f) { //为什么不用splice??  移除一个
    var rest, 
        index = indexOf(children, f);

    if (index >= 0) {
      rest = children.slice(index + 1);
      children.length = index;
      children = children.concat(rest);
    }
  }

  function tween(duration, fn, done, ease, from, to) {
    ease = octopus.isFunction(ease) ? ease : animate.easings[ease] ||   function (t) { 
      return Math.sin(t * Math.PI / 2);
    }
    var time = duration || thousand,
        self = this,
        diff = to - from, //间隔
        start = now(),
        stop = 0,
        end = 0;

    function run(t) {
      var delta = t - start; //时间间隔
      if (delta > time || stop) { //结束帧
        to = isFinite(to) ? to : 1;
        stop ? end && fn(to) : fn(to); //区别？
        die(run); //移出队列
        return done && done.apply(self); //执行回调
      }
      isFinite(to) ? fn((diff * ease(delta / time)) + from) :fn(ease(delta / time));
    }

    live(run); //执行

    return {
      stop: function (jump) {
        stop = 1;
        end = jump;
        if (!jump){ 
          done = null;
        }
      }
    }
  }

  function getTweenVal(pos, units, begin, end, k, i, v) { //Tween 吐温算法 将运动值保存在一个队列里
    if (k == 'transform') { //transform变化
      v = {};
      for (var t in begin[i][k]) {
        v[t] = (t in end[i][k]) ? Math.round(((end[i][k][t] - begin[i][k][t]) * pos + begin[i][k][t]) * thousand) / thousand : begin[i][k][t];
      } 
      return v;
    } else if (typeof begin[i][k] == 'string') { //颜色变化 k变化属性值
      return nextColor(pos, begin[i][k], end[i][k]);
    } else { //普通值变化
      // round so we don't get crazy long floats
      v = Math.round(((end[i][k] - begin[i][k]) * pos + begin[i][k]) * thousand) / thousand;
      if (!(k in unitless)){
        v += units[i][k] || 'px';
      }
      return v;
    }
  }

  function animate(elements, options) {
    var els = elements ? (els = isFinite(elements.length) ? elements : [elements]) : [], 
        i,
        complete = options.complete, //回调
        duration = options.duration, //持续时间
        ease = options.easing, //运动方式
        begin = [], 
        end = [], 
        units = [];

    for (i = els.length; i--;) {
      begin[i] = {};
      end[i] = {};
      units[i] = {};

      for (var k in options) {
        switch (k) { //k 变化属性值 关键字
          case 'complete':
          case 'duration':
          case 'easing':
          continue;
          break
        }
          
        var v = getCSS(els[i], k), 
            unit, 
            tmp = octopus.isFunction(options[k]) ? options[k](els[i]) : options[k]; //可以传入函数形式获取值


        if (typeof tmp == 'string' && rgbOhex.test(tmp) && !rgbOhex.test(v)) {
          delete options[k]; 
          continue; 
        }
        begin[i][k] = k == 'transform' ? parseTransform(v) :
          typeof tmp == 'string' && rgbOhex.test(tmp) ?
            toHex(v).slice(1) :
            parseFloat(v);

        end[i][k] = k == 'transform' ? parseTransform(tmp, begin[i][k]) :
          typeof tmp == 'string' && tmp.charAt(0) == '#' ?
            toHex(tmp).slice(1) :
            by(tmp, parseFloat(v));

        (typeof tmp == 'string') && (unit = tmp.match(numUnit)) && (units[i][k] = unit[1]);
      }
    }

    return tween.apply(els, [duration, function (pos, v, xy) {
      for (i = els.length; i--;) {
        for (var k in options) {
          v = getTweenVal(pos, units, begin, end, k, i);
          
          k == 'transform' ?
           els[i].style[octopus.detect('transform')] = formatTransform(v) :
            k == 'opacity' && !support.opacity ?
              (els[i].style.filter = 'alpha(opacity=' + (v * 100) + ')') :
              (els[i].style[octopus.camelize(k)] = v);
        }
      }
    }, complete, ease])
  }

    // expose useful methods
    animate.tween = tween;
    animate.parseTransform = parseTransform;
    animate.formatTransform = formatTransform;
    animate.easings = {};
    return animate;
  }();

  
  extend(proto, {
    'animate': function (options) {
      animate(this, options);
      return this;
    },
    'fadeIn': function (d, fn) {
      animate(this, {
        duration: d,
        opacity: 1,
        complete: fn
      });
      return this;
    },
    'fadeOut': function (d, fn) {
      animate(this, {
        duration: d,
        opacity: 0,
        complete: fn
      })
      return this;
    },
    'tween': animate.tween
  });
