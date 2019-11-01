// pages/orderlist/orderlist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderlist:[],
    page:1,
    hasMore:true,
  },
  getOrderList:function(){
    let that = this;
    app.reqHttp({
      url: '/orderInfo/searchOrderList',
      data: { page: that.data.page, userOpenId: app.openId}
    }).then((res) => {
      let list = that.data.orderlist;
      let result = res.result.result;
      for(var i = 0;i<result.length;i++){
        var item = result[i];
        item.pName = item.projectName ? (item.projectName.length > 10 ? item.projectName.substr(0, 8) + "..." : item.projectName) :"生活订单";
        item.ads = item.address?(item.address.length>5?item.address.substr(0,5)+"...":item.address):"未知";
        item.odTime = item.orderTime.substr(0, 16);
        if(item.status>=0 && item.status<2){
          item.statusStr = "未接单"
        }
        if(item.status == 2){
          item.statusStr = "已接单"
        }
        if(item.status == 4){
            item.statusStr = item.payStatus == 1?"未支付":"已完成"
        }

      }
      if(that.data.page == 1){
        list = result;
      }else{
        list = list.concat(result);
      }
      console.log(list);
      that.setData({
        orderlist:list
      })
      wx.hideLoading();
      if (that.data.page == res.result.totalPage){
          that.setData({
            hasMore: false
          })
      }else{
        that.setData({
          hasMore: true
        })
      }
      
    });
  },
  goDetail:function(e){
   let item =  e.currentTarget.dataset.activitylist;
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?item='+JSON.stringify(item),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList();
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
    console.log("down");
    this.setData({
      page:1
    })
   
    wx.showLoading({ title: '加载中', icon: 'loading', duration: 10000 });
    this.getOrderList();

   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.hasMore) {

   
    wx.showLoading({ title: '加载中', icon: 'loading', duration: 10000 });
    let p = this.data.page+1;
    this.setData({
      page:p
    })
    this.getOrderList();
    console.log("up");
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})