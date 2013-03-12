  octopus.getWinDimension = function (name) {
    name = name.charAt(0).toUpperCase() + name.slice(1); //首字母大写
    var docElemProp = document.documentElement['client' + name];
    return document.compatMode === 'CSS1Compat' && docElemProp || document.body['client' + name] || docElemProp;
  };

  octopus.getDocDimension = function (name) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return Math.max(
        document.documentElement['client' + name],
        document.body['scroll' + name],
        document.documentElement['scroll' + name],
        document.body['offset' + name], 
        document.documentElement['offset' + name]
      );
  };