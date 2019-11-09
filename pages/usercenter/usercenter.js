// pages/usercenter/usercenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hadLogin: false,
    headPortrait: "",
    name:"",
    amount:"0",
    arr1:[],
    boxs:[],
    time:null,
  },

  goOrderList: function () {
    if (app.hadLogin()) {
      wx.navigateTo({
        url: '/pages/orderlist/orderlist',
      })
    } else {
     this.goLogin();
    }
  },
  goLogin:function(){
    wx.navigateTo({
      url: '/pages/authorize/authorize',
    })
  },
  getAllType: function () {
   
    let that = this;
    app.reqHttp({
      url: '/projectInfo/getAllType',
      data: {}
    }).then((res) => {
      var list = res.result;
      for(var i=0;i<list.length;i++){
        list[i].ionic = app.url + "/accessory/show?id=" + list[i].ionic;
      }
      that.setData({
        arr1: list
      })
      that.change1(-1);
    }).catch(err => {
      wx.showToast({
        title: JSON.stringify(err),
        icon: "none"
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllType();
    let that = this;
    if (app.hadLogin()) {
      that.setData({
        hadLogin: true
      })
          app.reqHttp({
            url: '/userOrder/userInfo',
            data: { openId: app.openId }
          }).then((res) => {
            var userInfo = {};
            userInfo.avatarUrl = res.result.headimgurl;
            userInfo.nickName = res.result.userName;
            userInfo.amount = res.result.balance == null ? 0 : res.result.balance / 100;

            that.setData({
              name: userInfo.nickName,
              headPortrait: userInfo.avatarUrl,
              amount: userInfo.amount,
            })
          });
    }else{
      that.setData({
        hadLogin:false
      })
    } 
    
    let idx = 0;
    clearInterval(this.data.time)
     this.setData({time:setInterval(function () {
      if(idx==360) idx=0;
      for (var i = 0; i < that.data.arr1.length; i++) {
        that.selectComponent("#bx" + i).setDir(idx);
      }
      
        idx+=5;
     }, 1000 / 24)});

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  loginOut:function(){
    app.openId = '';
    wx.setStorage({
      key: 'openId',
      data: '',
    })
    this.setData({
      hadLogin:false
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (app.hadLogin()) {
      that.setData({
        hadLogin: true
      })
      app.reqHttp({
        url: '/userOrder/userInfo',
        data: { openId: app.openId }
      }).then((res) => {
        var userInfo = {};
        userInfo.avatarUrl = res.result.headimgurl;
        userInfo.nickName = res.result.userName;
        userInfo.amount = res.result.balance == null ? 0 : res.result.balance / 100;

        that.setData({
          name: userInfo.nickName,
          headPortrait: userInfo.avatarUrl,
          amount: userInfo.amount,
        })
      });
    } else {
      that.setData({
        hadLogin: false
      })
    } 

    
   
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