function request(options) {
  // 请求拦截器
  //  ...
  // 1. 加一些统一的参数，或者配置
  if (
    !options.url.startsWith("https://") &&
    !options.url.startsWith("http://")
  ) {
    options.url = "https://showme2.myhope365.com" + options.url;
  }
  // 默认的请求头 (formData)
  let header = {
    "content-type": "application/x-www-form-urlencoded",
    // 加上统一的cookie
    cookie: wx.getStorageSync("cookie") || "",
  };
  if (options.header) {
    header = {
      ...header,
      ...options.header,
    };
  }

  return new Promise((reslove, reject) => {
    // 调用接口
    wx.request({
      // 默认的配置
      // 加载传入的配置
      ...options,
      header,
      success(res) {
        // 响应拦截器，所有接口获取数据之前，都会先执行这里
        //  1. 统一的错误处理
        if (res.statusCode != 200) {
          wx.showToast({
            title: "服务器异常，请联系管理员",
          });
        }
        reslove(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

export function get(url, options = {}) {
  return request({
    url,
    ...options,
  });
}

export function post(url, data, options = {}) {
  return request({
    url,
    data,
    method: "POST",
    ...options,
  });
}

export function uploadFile(url, name = "file", formData = {}, options = {}) {
  return new Promise((reslove, reject) => {
    // 图片上传发送
    wx.chooseImage({
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          //仅为示例，非真实的接口地址
          url,
          filePath: tempFilePaths[0],
          // 上传文件对应的key值，这个值在接口文档里找
          name,
          // 除了文件之外额外的参数
          formData,
          header: {
            cookie: wx.getStorageSync("cookie") || "",
          },
          ...options,
          success: (res) => {
            // 请求成功的回调
            const data = JSON.parse(res.data);
            reslove(data);
          },
        });
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}
