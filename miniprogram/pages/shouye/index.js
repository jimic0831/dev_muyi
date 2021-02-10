// miniprogram/pages/shouye/index.js
var that, app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    url:"https://www.muyi.cf/"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    wx.getSystemInfo({
      success: function success(res) {
        //console.log("getSystemInfo", res)
        var ios = !!(res.system.toLowerCase().search('ios') + 1);
        //console.log("ios", ios)
        if (ios) { var h = 44 } else { h = 48}
        that.setData({
          ios: ios,
          statusBarHeight: res.statusBarHeight,
          swiper: res.windowHeight - res.statusBarHeight - 36 - h
        });
        //console.log("swiper", that.data.swiper)
      }
    }); 
    //wx.setStorage({ key: "index", data: res.data })
    //console.log("index", wx.getStorageSync('index').weixin)
    if (wx.getStorageSync('index') && wx.getStorageSync('index').weixin) 
    { that.setData({ index: wx.getStorageSync('index') })
      app.globalData.open = wx.getStorageSync('index').weixin }
    else { getdata()}
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
    getdata()
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

  },
  swipercurrent:function(e){
    //console.log("swipercurrent", e.detail)
    that.setData({ current: e.detail.current})
  },
  current:function(e){
    that.setData({ current: e.currentTarget.dataset.hi })
  },
  bindtransition:function(e){
    console.log("bindtransition", e.detail)
  },
  bofang: function (e) {
    //console.log("播放", e.currentTarget.dataset.hi.vod_id)
    wx.navigateTo({
      url: '../bofang/index?vod_id=' + e.currentTarget.dataset.hi.vod_id,
      success: function (res) {
        // console.log('==================');
        // console.log(res)
        res.eventChannel.emit('fromData', e.currentTarget.dataset.hi)
      },
    })
  },
  sousuo:function(){
    wx.navigateTo({
      url: '../sousuo/index',
      success: function (res) {
      },
    })
  },
  liebiao:function(e){
    var d = e.currentTarget.dataset
    console.log("搜索", d)
    if (!d.order) { d.order = 'vod_hits_week desc' }
    if (!d.p) { d.p = '' }
    if (!d.t) { d.t = '' }
    if (!d.y) { d.y = '' }
    if (!d.z) { d.z = '' }
    if (!d.a) { d.a = '' }
    if (!d.r) { d.r = '' }
    if (!d.nr) { d.nr = '' }
    wx.navigateTo({
      url: '../liebiao/index?order=' + d.order + '&p=' + d.p + '&t=' + d.t + '&y=' + d.y + '&z=' + d.z + '&a=' + d.a + '&r=' + d.r + '&nr=' + d.nr,
      success: function (res) {
        
      },
    })
  }
})

function getdata(){
  wx.showLoading({ title: '加载数据...', })
  wx.request({
    url: that.data.url+'/label/index.html',
    header: { 'content-type': 'application/json' },
    success(res) {
      //console.log(res.data)
      app.globalData.open = res.data.weixin

      res.data.fenlei[0].type_extend.area = res.data.fenlei[0].type_extend.area.split(",")
      res.data.fenlei[0].type_extend.year = res.data.fenlei[0].type_extend.year.split(",")

      res.data.fenlei[1].type_extend.area = res.data.fenlei[1].type_extend.area.split(",")
      res.data.fenlei[1].type_extend.year = res.data.fenlei[1].type_extend.year.split(",")

      res.data.fenlei[2].type_extend.area = res.data.fenlei[2].type_extend.area.split(",")
      res.data.fenlei[2].type_extend.year = res.data.fenlei[2].type_extend.year.split(",")
  
      //res.data.fenlei[3].type_extend.area = res.data.fenlei[3].type_extend.area.split(",")
      //res.data.fenlei[3].type_extend.year = res.data.fenlei[3].type_extend.year.split(",")
 
      that.setData({ index: res.data})
      //console.log("index",res.data)
      //console.log(JSON.parse(res.data))
      wx.setStorage({ key: "index", data: res.data})
      wx.hideLoading();
      wx.stopPullDownRefresh()
    }
  })
}