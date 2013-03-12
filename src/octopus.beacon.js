  /**
   * 通过请求一个图片的方式向服务器存储一条日志，适用于统计等不需要服务器返回数据的情况
   * @function
   * @grammar octopus.beacon(url)
   * @param {string} url 要发送的地址.
   */
  octopus.beacon = function (url) {
    var img = new Image();
    img.onload = img.onerror = img.onabort = function () {
      img.onload = img.onerror = img.onabort = null;
      img = null;
    };
    img.src = url;
  };