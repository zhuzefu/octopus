  addDetection('supportJSON',function() {
    return window.JSON && window.JSON.parse;
  });

  if (detect('supportJSON')) {
    octopus.JSON = {
      parse: function (json) {
        if (typeof json !== 'string') {
          return;
        }
        json = trim(json);
        var isValid = /^[\],:{}\s]*$/.test(json.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
          .replace(/(?:^|:|,)(?:\s*\[)+/g, ""));

        if (!isValid) {
          throw 'Invalid JSON';
        }
        return new Function('return ' + json)();
      },
      stringify: function (data) {
        var _slashes = function (string) {
          var key,
          replacements = {
            "\\\\": '\\\\',
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\r": '\\r',
            '"': '\\"'
          };

          for (key in replacements) {
            string = string.replace(new RegExp(key, 'ig'), replacements[key]);
          }
          return string;
        },
        _stringify = function (data) {
          var temp = [],
            i,
            type,
            value,
            rvalue;

          for (i in data) {
            value = data[i];
            type = typeof value;
            if (type === 'undefined') {
              return;
            }
            if (type !== 'function') {
              switch (type) {
                case 'object':
                  rvalue = value === null ? value :
                  // For ISO date format
                  value.getDay ? '"' + (1e3 - ~value.getUTCMonth() * 10 + value.toUTCString() + 1e3 + value / 1).replace(/1(..).*?(\d\d)\D+(\d+).(\S+).*(...)/, '$3-$1-$2T$4.$5Z') + '"' :
                  // For Array
                  value.length ? '[' + (function () {
                    var rdata = [];
                    each(value, function (i, item) {
                      rdata.push((typeof item === 'string' ? '"' + _slashes(item) + '"' : item));
                    });
                    return rdata.join(',');
                  })() + ']' :
                  // For Object
                  octopus.JSON.stringify(value);
                  break;
                case 'number':
                  rvalue = !isFinite(value) ? null : value;
                  break;
                case 'boolean':
                case 'null':
                  rvalue = value;
                  break;
                case 'string':
                  rvalue = '"' + _slashes(value) + '"';
                  break;
              }
              temp.push('"' + i + '"' + ':' + rvalue);
            }
          }
          return temp.join(',');
        }
        return '{' + _stringify(data) + '}';
      }
    }
  } else {
    octopus.JSON = window.JSON;
  }