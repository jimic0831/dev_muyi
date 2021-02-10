// miniprogram/pages/sousuo/index.js
var that, app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    code: { page: 0 },
    wd:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    if (options.wd) { 
      that.setData({ wd: options.wd }); 
      getlist()
    }
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
    if (!that.data.wd) { return}
    getlist()
  },
  bofang: function (e) {
    //console.log("播放", e)
    wx.navigateTo({
      url: '../bofang/index?vod_id=' + e.currentTarget.dataset.hi.vod_id,
      success: function (res) {
        res.eventChannel.emit('fromData', e.currentTarget.dataset.hi)
      },
    })
  },
  submit:function(e){
    that.setData({
      list: [],
      code: { page: 0 }, wd: e.currentTarget.dataset.hi,
    })
    getlist()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: 'pages/sousuo/index?wd=' + that.data.wd,
      title: "免费电影搜索" + that.data.wd,
    }
  },

  formSubmit:function(e){
    that.setData({
      list: [],
      code: { page: 0 }, wd: e.detail.value.search,})
    getlist()
  }
})

function getlist() {
  if (!that.data.wd) { return}
  if (Number(that.data.code.page) > Number(that.data.code.pagecount)) {
    wx.showModal({
      title: '已全部加载完成',
      content: '没有新的数据了',
      showCancel: false,
    });return}
  wx.showLoading({ title: '搜索中', })
  console.log(Number(that.data.code.page))
  var url = 'https://www.muyi.cf/api.php/provide/vod/?ac=detail&order=vod_time desc&wd=' + that.data.wd+'&pg=' + (Number(that.data.code.page) + 1)
  wx.request({
    url: url,
    header: { 'content-type': 'application/json' },
    success(res) {
      console.log(res.data)
      that.setData({
        list: that.data.list.concat(res.data.list),
        code: res.data
      })
      wx.hideLoading();
      wx.stopPullDownRefresh()
    }
  })
}

