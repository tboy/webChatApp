//app.js
let path = "https://www.allroundshifurepair.com";
//o6YxS1sFr_zBwtLXkUu1arJHcKLs
App({
  url: path,
  openId: '',
  onLaunch: function (ops) {
    const updateManager = wx.getUpdateManager()
    var self = this;
    // updateManager.onCheckForUpdate(function (res) {
    //   // 请求完新版本信息的回调
    //   var hasUpdate = res.hasUpdate;
    //   self.globalData.hasUpdate = hasUpdate;
    // })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    
   
    wx.getStorage({
      key: 'openId',
      success: function (res) {
        self.openId = res.data;
      },
    })
  },

  setOpenId:function(openId) {
    this.openId = openId;
    wx.setStorage({
      key: 'openId',
      data: openId,
    })
  },
  hadLogin:function(){
    let flag = this.openId == '' ? false : true
    return flag;
  },

  /**
  * 网络请求封装
  */
  reqHttp: (ops) => {
    if (!ops) return;
    var self = this;
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
  },
  getUUid() {
    var mydate = new Date();
    var uuid = "cms" + mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds();
    return uuid;
  }
})