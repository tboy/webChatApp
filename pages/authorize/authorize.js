// pages/special/special.js
var app = getApp();
const WXBizDataCrypt = require('../../utils/WXBizDataCrypt.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  bindmessage: function (e) {
    console.log("获取推送消息");
    console.log(e.detail.data[0].openId);
    app.setOpenId(e.detail.data[0].openId);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  // 解码得到unionId登录
  getDecrypt: function (encryptedData, iv, sessionKey) {
    debugger
    var pc = new WXBizDataCrypt(app.globalData.appid, sessionKey)
    var data = pc.decryptData(encryptedData, iv)
    var unionId = data && data.unionId;
    console.log(pc)
    console.log(data)
    console.log(unionId)
    if (!unionId) {
      wx.showToast({
        title: 'unionId获取失败',
        icon: 'none'
      })
      return;
    }
    this.setData({
      unionId: unionId
    })
    app.reqHttp({
      url: '/app/common/xcxLogin',
      data: { unionid: unionId }
    }).then(res => {
      if (res.result === 100) {
        this.setData({
          dialogHidden: false
        })
      } else {
        // wx.switchTab({
        //   url: "/pages/index/index"
        // })
        wx.navigateBack({
          delta: 1
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})