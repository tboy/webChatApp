// pages/order/order.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    arr1: [],
    c1: 0,
    arr2: [],
    c2: 0,
    arr3: [],
    c3: 0,
    photos: [],
    imgHeight: 0,
    date:'2019-01-01',
    beginDate:'',
    endDate:'',

    time:'08:00',
    region: ['广东省', '广州市', '海珠区'],
    remark:'',
    contactName:'',
    contactPhone:'',


  },
  updateTxt: function(e) {
    let prop = e.currentTarget.dataset['mk']+"";
    console.log(prop)
    let obj = {};
    obj[prop] = e.detail.value;
    this.setData(obj)

    console.log(this.data)
  },
  getAllType: function() {

    let that = this;
    app.reqHttp({
      url: '/projectInfo/getAllType',
      data: {}
    }).then((res) => {
      that.setData({
        arr1: res.result
      })
      that.change1(-1);
    }).catch(err => {
      wx.showToast({
        title: JSON.stringify(err),
        icon: "none"
      })
    })
  },

  change1: function(e) {
    let parentId = -1;
    let idx = 0;
    if (e == -1) {
      parentId = this.data.arr1[0].id;
    } else {
      idx = e.detail.value;
      parentId = this.data.arr1[e.detail.value].id;
    }
    let that = this;
    app.reqHttp({
      url: '/projectInfo/getAllType',
      data: {
        parentId: parentId
      }
    }).then((res) => {
      that.setData({
        arr2: res.result,
        c1: idx
      })
      that.change2(-1);
    }).catch(err => {
      wx.showToast({
        title: JSON.stringify(err),
        icon: "none"
      })
    })

  },
  change2: function(e) {
    let parentId = -1
    let idx = 0;
    if (e == -1) {
      parentId = this.data.arr2[0].id;
    } else {
      idx = e.detail.value;
      parentId = this.data.arr2[e.detail.value].id;
    }
    let that = this;
    app.reqHttp({
      url: '/projectInfo/searchInfoByType',
      data: {
        type: parentId
      }
    }).then((res) => {
      let temp = [];
      for (let i = 0; i < res.result.length; i++) {
        let item = {};
        item.id = res.result[i].id;
        item.name = res.result[i].name;
        if (res.result[i].referencePrice) {
          item.name += "," + res.result[i].referencePrice;
        }
        temp.push(item);
      }

      that.setData({
        arr3: temp,
        c2: idx
      })
      that.change3(-1)
    }).catch(err => {
      wx.showToast({
        title: JSON.stringify(err),
        icon: "none"
      })
    })

  },
  change3: function(e) {
    let idx = 0;
    if (e != -1) {
      idx = e.detail.value;
    }
    this.setData({
      c3: idx
    })
  },

  //选择头像
  chooseImageTap: function(e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function(type) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sourceType: [type],
      success: function(res) {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFiles[0].path, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            var base64 = 'data:image/png;base64,' + res.data
            that.uplateFile(base64);
          }
        })
      },
    })
  },

  uplateFile: function(base64, path) {
    var location = app.globalData.location;
    var that = this;
    var postdata = {
      type: "image",
      img: base64,
      id: app.getUUid()
    }
    app.reqHttp({
      url: '/accessory/uploadbase64',
      data: postdata
    }).then(res => {
      if (res.status == 200) {
        let imgs = that.data.photos;
        imgs.push(postdata)
        let h = imgs.length % 4 == 0 ? (imgs.length / 4) * 6 : parseInt(imgs.length / 4) * 6 + 6;
        that.setData({
          photos: imgs,
          imgHeight: h
        });

      }
    }).catch(err => {
      console.log(err)
    })

  },
  bindDateChange:function(e){
    this.setData({
      date:e.detail.value
    });
   
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    });
  },
  bindRegionChange:function(e){
    this.setData({
      region: e.detail.value
    })
  },
  alert:function(str){
    wx.showModal({
      title: '提示',
      content: str+"!"
    })
  
  },
  subOrder:function(){
    let images = '';
    for (let i = 0; i < this.data.photos.length; i++) {
      images += this.data.photos[i].id + "_";
    }
  
    if (!this.data.remark || this.data.remark == '') {
      this.alert("请填写备注")
      return;
    }
    if (!this.data.contactName || this.data.contactName == '') {
      this.alert("请输入联系名称")
      return;
    }
    if (!this.data.contactPhone || this.data.contactPhone == '') {
      this.alert("请输入常用手机号码")
      return;
    }
    

   
    var mytime = this.data.date + " " + this.data.time;
    var selTime = new Date(mytime).getTime();
    if (selTime <= new Date().getTime()) {
      this.alert("预约时间必须大于当前时间")
      return;
    }

   

    if (!this.data.address || this.data.address == '') {
      this.alert("请填写详细地址")
      return;
    }
    debugger
    let pars = {};
    pars.userOpenid = app.openId;
    pars.cityInfo = this.data.region[1];
    pars.district = this.data.region[2];
    pars.remark = this.data.remark;
    pars.images = images;
    pars.address = this.data.address;
    pars.contactPhone = this.data.contactPhone;
    pars.projectId = this.data.arr3[this.data.c3].id;
    pars.orderTimeStr = mytime+":00";
    pars.contactName = this.data.contactName;
    pars.type = 1;
    app.reqHttp({
      url: '/orderInfo/save',
      data: pars
    }).then((res) => {
      wx.navigateTo({
        url: '/pages/orderlist/orderlist',
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let date = new Date();
    
    let y = date.getFullYear();
    let m = date.getMonth()+1;
    let d = date.getDate();
    let ymd = y+"-"+(m<10?"0"+m:m)+"-"+d;
    let ymd2 = (y + 1) + "-" + (m < 10 ? "0" + m : m) + "-" + d;
    this.setData({
      date:ymd,
      beginDate:ymd,
      endDate:ymd2
    })
    this.getAllType();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})