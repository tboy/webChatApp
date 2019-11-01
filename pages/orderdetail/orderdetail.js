// pages/orderdetail/orderdetail.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bigImg:'',
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item = JSON.parse(options.item);
    var photos = [];
    if (item.images != null) {
      let images = item.images.split("_");
      for (let i = 0; i < images.length; i++) {
        if (images[i] == "") {
          break;
        }
        let ionic = app.url + "/accessory/show?id=" + images[i];
        photos.push({ ionicImg: ionic });
      }
    }
    item.photos = photos;
  
    this.setData(item);
  },

  showImage:function(e){
    let path = e.currentTarget.dataset.path;
    this.setData({
      isShow:true,
      bigImg:path
    })
  },
  hideImage:function(e){
    this.setData({
      isShow: false,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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