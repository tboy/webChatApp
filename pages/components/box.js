// pages/components/box.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      //外部传入数据
      obj:{
        type:Object,
        value:{},
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dir:0
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      
      // let that = this;
      // setInterval(function () {
      //   that.setData({ dir: that.data.dir + 1 })
      // }, 1000 / 24);
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
      setDir:function(val) {
        this.setData({dir:val})
      }
  }

})
