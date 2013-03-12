 octopus.JSONP = function (params, callback) {
    var JSONString = 'JSON_' + guid(),
      running = false;

    octopus.JSON[JSONString] = function (data) {
      running = false;
      delete octopus.JSON[JSONString];
      callback(data);
    }

    if (typeof params.data == 'object') {
      params.data = octopus.toQueryString(params.data);
    }
    var publik = {
      send: function () {
        running = true;
        var url = params.url + '?' + params.key + '= octopus.JSON.' + JSONString + '&' + params.data;
        octopus.load(url);
      },

      cancel: function () {
        running && script.parentNode && script.parentNode.removeChild(script);
        running = false;
        octopus.JSON[JSONString] = function () {
          delete octopus.JSON[JSONString];
        }
      }
    };
    if (params.now !== false) {
      publik.send();
    }
    return publik;
  }
