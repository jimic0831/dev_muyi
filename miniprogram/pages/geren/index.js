// miniprogram/pages/geren/index.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    getdata()
  },

  getuserinfo: function(e) {
    console.log(e.detail.userInfo);
    if (e.detail.userInfo) {
      this.data.hasLogin = true;
    } else {
      wx.showModal({
        title: '提示',
        content: '很抱歉，授权失败，请重新授权！',
        showCancel: false,
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
      this.data.hasLogin = false;
    }
    wx.cloud.callFunction({
      name: 'login',
      success (res) {
        console.log(res.result.openid)
      }
    });
    this.setData({hasLogin: this.data.hasLogin});
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
    that=this
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              //console.log(res)
            }
          })
          that.data.hasLogin = true;
          wx.cloud.callFunction({
            name: 'login',
            success (res) {
              console.log(res.result.openid)
            }
          });
        } else {
          that.data.hasLogin = false;
        }
        that.setData({hasLogin: that.data.hasLogin})
      }
    })
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

  bofang: function (e) {
    wx.navigateTo({
      url: '../bofang/index?vodid=' + e.currentTarget.dataset.hi.vod_id,
      success: function (res) {
        res.eventChannel.emit('fromData', e.currentTarget.dataset.hi)
      },
    })
  },
  wodejilu: function (e){
    wx.navigateTo({
      url: '../wodejilu/index',
      success: function (res) {
      },
    })
  },
  wodeshoucang: function (e) {
    wx.navigateTo({
      url: '../wodeshoucang/index',
      success: function (res) {
      },
    })
  }
})

function getdata(){
  wx.getStorage({
    key: 'jilu', success(res) {
      that.setData({ jilu: res.data, })
      wx.stopPullDownRefresh()
    }
  })

  wx.getStorage({
    key: 'shoucang', success(res) {
      that.setData({ shoucang: res.data, })
    }
  })
}