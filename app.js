//app.js
let path = "https://www.allroundshifurepair.com";

App({
  url: path,
  globalData:{},
  /**
  * 网络请求封装
  */
  reqHttp: (ops) => {
    if (!ops) return;
    let data = ops && ops.data ? ops.data : {};
    let contentType = ops && ops.header && ops.header.contentType || 'application/json; charset=UTF-8'
    let method = ops && ops.method ? ops.method : "post";
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中',
      })
      var sessionid = wx.getStorageSync('sessionid');
      wx.request({
        url: ops.url.indexOf('https') < 0 ? path + ops.url : ops.url,
        data: data,
        header: { 'Content-Type': contentType, 'Cookie': 'sid=' + sessionid },
        method: method,
        success: (res) => {
          wx.hideLoading();
          
            resolve(res.data);
          
        },
        fail: () => {
          wx.hideLoading();
          wx.showModal({ title: '网络错误', content: '网络出错，请刷新重试', showCancel: false });
        }
      })
    })
  }
})