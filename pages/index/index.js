//index.js
//获取应用实例
const app = getApp()
//http://192.168.0.76:8100/?userUrl=o6YxS1sFr_zBwtLXkUu1arJHcKLs
//https://www.allroundshifurepair.com/wechat/authorize?returnUrl=https://www.allroundshifurepair.com/wechat/infoManager?type=2
Page({
  data: {
    swiper: {
      indicatorDots: true,
      autoplay: false,
      activeColor: "#fff",
      circular: true,
      interval: 5000,
      duration: 1000,
    },
    slides: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  gotoPage() {
    wx.redirectTo({
      url: '../mypage/mypage'
    })
  },
  onShow: function() {
    this.getBanner();
  },
  onLoad: function() {},
  goDetail: function() {
    wx.navigateTo({
      url: '/pages/services/services',
    })
  },
  goOrder:function(){
    if(app.globalData.userInfo){
      wx.navigateTo({
        url: '/pages/order/order',
      })
    }else{
      wx.navigateTo({
        url: '/pages/authorize/authorize',
      })
    }
  },
  goLife:function(){
    wx.navigateTo({
      url: '/pages/live/live',
    })
  },
  goUserCenter:function(){
    wx.navigateTo({
      url: '/pages/usercenter/usercenter',
    })
  },
  getBanner() {
    let that = this;
    app.reqHttp({
      url: '/managerInfo/searchAdverting',
      data: {}
    }).then((res) => {
      let banners = [];
      for (let i = 0; i < res.result.length; i++) {
        let img = app.url + "/accessory/show?id=" + res.result[i].accessory;

        banners.push({
          title: "",
          description: "",
          image: img
        });
      }
      that.setData({
        slides: banners
      })
      console.log(that.data.slides)
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: JSON.stringify(err),
        icon: "none"
      })
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})