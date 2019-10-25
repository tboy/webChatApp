// pages/special/special.js
var app = getApp();
const WXBizDataCrypt = require('../../utils/WXBizDataCrypt.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null,
    dialogHidden: true,
    phoneNumber: null,
    yzmCode: null,
    unionId: null,
    openid: null,
    sessionKey:null,
    canclickcode:true,
    codetext:'获取验证码',
    waitsecond: 60,
    codeStyle: null
  },
  confirm:function(){
    var self = this;
    if (!this.data.yzmCode){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    
    var postData= {
      openid: this.data.openid,
      code: this.data.yzmCode,
      unionid: this.data.unionId
    }
    debugger;
    // 绑定
    app.reqHttp({
      url: '/app/common/xcxBind',
      data: postData
    }).then((respone) => {
      wx.showToast({
        title: '绑定成功',
        success: function(res){
          wx.setStorage({
            key: 'phoneNumber',
            data: self.data.phoneNumber,
          })
          wx.switchTab({
            url: "/pages/tabBar/index/index"
          })
          console.log(res)
        }
      })  
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: err,
        icon:"none"
      })  
    })
  },
  phoneNumberBlur:function(e){
    var value = e.detail.value;
    this.setData({
      phoneNumber: value
    })
  },
  codeBlur: function(e){
    var value = e.detail.value;
    this.setData({
      yzmCode: value
    })
  },
  getCode: function(){
    if (!this.data.canclickcode) {
      return
    }
    var phoneNumber = this.data.phoneNumber && this.data.phoneNumber.replace(/\s/g, '')

    if (!phoneNumber || phoneNumber.length === 0 || !(/^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[0-9]))\d{8}$/).test(phoneNumber)) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    var second = this.data.waitsecond;
    this.setData({
      canclickcode: false,
      codeStyle: 'noClickClass',
      codetext: second +'s后重新发送'
    })
  
    const clock = setInterval(() => {
      second--;
      this.setData({
        codetext: second + 's后重新发送'
      })
      if (second === 0) {
        clearInterval(clock);
        this.setData({
          codetext: '重新发送验证码',
          waitsecond: 60,
          codeStyle: null,
          canclickcode: true
        })
      }
    }, 1000)
    const postData = {
      mobile: this.data.phoneNumber
    }
    app.reqHttp({
      url:'/app/common/wechatbindsendsms',
      data: postData
    }).then((respone) => {
      const data = respone.data
      if (respone.result === 1) {
        wx.showToast({
          title: '验证码已经发送到' + this.data.phoneNumber + ',请注意查收',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: respone.msg,
          icon: 'none'
        })
        clearInterval(clock);
        this.setData({
          codetext: '发送验证码',
          waitsecond: 60,
          codeStyle: null,
          canclickcode: true
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  bindGetUserInfo(e) {
    if (e.detail.userInfo){
      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv;
      //用户允许登录
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo
      })
      this.getDecrypt(encryptedData,iv,this.data.sessionKey);
    }else{
      // 用户拒绝授权
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        app.reqHttp({
          url: '/app/common/jscode2session',
          method: 'get',
          data: {
            code: code
          }
        }).then(res => {
          var openid = res.data.openid;
          debugger;
          var sessionKey = res.data.session_key;
          if (!openid){
            wx.showToast({
              title: '获取微信授权失败',
              icon: "none"
            })
            return;
          }
          wx.setStorageSync("sessionid", res.data.sessionid);// 保存sessionid
          wx.setStorageSync("openid", openid);// 保存openid
          wx.setStorageSync("sessionKey", sessionKey)// 保存sessionKey
          this.setData({
            openid: openid,
            sessionKey: sessionKey
          })
    
        }).catch(err => {
          console.log(err)
        })

      }
    })
  },
  // 解码得到unionId登录
  getDecrypt: function (encryptedData, iv, sessionKey) {
    var pc = new WXBizDataCrypt(app.globalData.appid, sessionKey)
    var data = pc.decryptData(encryptedData, iv)
    var unionId = data && data.unionId;
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