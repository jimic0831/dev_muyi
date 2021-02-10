// miniprogram/pages/liebiao/index.js
var that, app = getApp(), eventChannel;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    code:{page:0, total:0},
    order:'vod_hits_week desc',
    p:'',
    t: '',
    y: '',
    z: '',
    a: '',
    r: '',
    nr: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    that.setData(options)
    wx.getStorage({
      key: 'index', success(res) {
        that.setData({ index: res.data })
      }
    })
    if (options.p == '1') { wx.setNavigationBarTitle({ title: "电影筛选" }) }
    if (options.p == '2') { wx.setNavigationBarTitle({ title: "电视剧筛选" }) }
    if (options.t == '3') { wx.setNavigationBarTitle({ title: "综艺筛选" }) }
    if (options.t == '4') { wx.setNavigationBarTitle({ title: "动漫筛选" }) }

    getlist()
    console.log('options', options)
    eventChannel = this.getOpenerEventChannel()
    if (eventChannel.on) {
      eventChannel.on('search', function (data) {
        that.setData({ "wd": data })
        getlist()
      })
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
    that.setData({
      list: [],
      code: { page: 0, total:0 } }); 
    getlist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    getlist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bofang:function(e){
    wx.navigateTo({
      url: '../bofang/index?vod_id=' + e.currentTarget.dataset.hi.vod_id,
      success: function (res) {
        res.eventChannel.emit('fromData', e.currentTarget.dataset.hi)
      },
    })
  },
  formSubmit:function(e){
    console.log(e.detail.value.search)
    that.setData({ wd: e.detail.value.search, list: [], code: { page: 0, total:0 }})
    getlist()
  },
  liebiao:function(e){
    var d = e.currentTarget.dataset
    if (d.order) { that.setData({ order: d.order}) }
    if (d.p) { that.setData({ p: d.p }) }
    if (d.t) { if (d.t == 0) { that.setData({ t:''}) } else { that.setData({ t: d.t })} }
    if (d.y) { if (d.y==0) { that.setData({ y: "", z: '' })}else{that.setData({ y: d.y,z:''  })} }
    if (d.z) { that.setData({ z: d.z,y:'' }) }
    if (d.a) { if (d.a == 0) { that.setData({ a: "" }) } else { that.setData({ a: d.a }) } }
    if (d.r) { if (d.r == 0) { that.setData({ r: "", nr: '' }) } else { that.setData({ r: d.r, nr: ''}) } }
    if (d.nr) { that.setData({ nr: d.nr,r:'' }) }

    that.setData({
      list: [],
      code: { page: 0, total:0 }
    });
    getlist()
  }
})

function getlist(){
  wx.showLoading({ title: '载入中', })
  //console.log(Number(that.data.y))
  var url = 'https://www.muyi.cf/api.php/provide/vod/?ac=detail&order=' + that.data.order + '&p=' + that.data.p + '&t=' + that.data.t + '&y=' + that.data.y + '&z=' + that.data.z + '&a=' + that.data.a + '&r=' + that.data.r + '&nr=' + that.data.nr + '&pg=' + (Number(that.data.code.page) + 1)
  console.log(url)
  wx.request({
    url: url,
    header: { 'content-type': 'application/json' },
    success(res) {
      console.log(res.data)
      if (Object.prototype.toString.call(res.data) === '[object Object]') {
        that.setData({ 
          list: that.data.list.concat(res.data.list),
          code: res.data
        })
      }
      wx.hideLoading();
      wx.stopPullDownRefresh()
    }
  })

}