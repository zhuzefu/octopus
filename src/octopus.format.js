 octopus.format = function() {
    var args = arguments;
    if (!args[0]) {
      return null;
    }

    if(octopus.isObject(args[1])){
      return args[0].replace(/(.*?)\{(.+?)\}([^\{]*)/g, function() {
        return arguments[1] + (args[1][arguments[2]] || "") + arguments[3];
      });
    } else {
      return args[0].replace(/\{(\d+)\}/g, function() {
        return args[arguments[1]];
      });
    }
  };