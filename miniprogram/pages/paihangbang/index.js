// miniprogram/pages/paihangbang/index.js
var that, app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    code: { page: 0 },
    order: 'vod_time desc',
    r:'T',
    url:"https://www.muyi.cf/"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    getdata()
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
    that.setData({
      list: [],
      code: { page: 0 }
    });
    getdata()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    getdata()
  },
  bofang: function (e) {
    wx.navigateTo({
      url: '../bofang/index?vod_id=' + e.currentTarget.dataset.hi.vod_id,
      success: function (res) {
        res.eventChannel.emit('fromData', e.currentTarget.dataset.hi)
      },
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  liebiao:function(e){
    that.setData({
      order: e.currentTarget.dataset.order,
      r: e.currentTarget.dataset.r,
      list: [],
      code: { page: 0 }
    });
    getdata()
  }
})

function getdata(){
  wx.showLoading({ title: '加载中', })  //console.log(Number(that.data.code.page))
  console.log(that.data.r)
  var url = that.data.url+'/api.php/provide/vod/?ac=detail&r=' + that.data.r+'&order=' + that.data.order + '&pg=' + (Number(that.data.code.page) + 1)
  wx.request({
    url: url,
    header: { 'content-type': 'application/json' },
    success(res) {
      
      that.setData({
        list: that.data.list.concat(res.data.list),
        code: res.data
      })
      wx.hideLoading();
      wx.stopPullDownRefresh()
    }
  })
}