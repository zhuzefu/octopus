var getAttr, removeAttr;
  if (support.getSetAttribute) {
    getAttr = function (node, name) {
      var nType;
      if (!node || (nType = node.nodeType) === 3 || nType === 8 || nType === 2) {
        return undefined;
      }

      return node.getAttribute(name);
    };
    removeAttr = function (node, name, value) {
      node.removeAttribute(name);
    };
  } else {
    // IE6/7
    getAttr = function (node, name) {
      var nType, ret;
      if (!node || (nType = node.nodeType) === 3 || nType === 8 || nType === 2) {
        return undefined;
      }
      if (rleveltwo.test(name)) {
        return node.getAttribute(name, 2);
      } else {
        ret = node.getAttributeNode(name);
        return ret && (ret = ret.nodeValue) !== '' ? ret : null;
      }
    };
    removeAttr = function (node, name, value) {
      node.setAttribute(name, '');
      node.removeAttributeNode(node.getAttributeNode(name));
    };
  }

  octopus.setAttr = function (node, name, value) {
    var nType, ret;
    if (!node || (nType = node.nodeType) === 3 || nType === 8 || nType === 2) {
      return;
    }
    if (!support.getSetAttribute) {
      ret = node.getAttributeNode(name);
      if (!ret) {
        ret = document.createAttribute(name);
        node.setAttributeNode(ret);
      }
      ret.nodeValue = value + '';
      return;
    }
    node.setAttribute(name, value + '');
  };

  octopus.getAttr = getAttr;
  octopus.removeAttr = removeAttr;