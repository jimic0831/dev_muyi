//app.js
App({
  globalData: {open: true,},

  onLaunch: function () {


    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'muyi-8gl7aq0o11097455',
        traceUser: true,
      })
    }
    wx.setBackgroundFetchToken({
      token: 'pre'
    })
    wx.getBackgroundFetchData({
      fetchType: 'pre',
      success(res) {
        var index = JSON.parse(res.fetchedData)
        index.fenlei[0].type_extend.area = index.fenlei[0].type_extend.area.split(",")
        index.fenlei[0].type_extend.year = index.fenlei[0].type_extend.year.split(",")

        index.fenlei[1].type_extend.year = index.fenlei[1].type_extend.year.split(",")

        index.fenlei[2].type_extend.area = index.fenlei[2].type_extend.area.split(",")
        index.fenlei[2].type_extend.year = index.fenlei[2].type_extend.year.split(",")

        index.fenlei[3].type_extend.area = index.fenlei[3].type_extend.area.split(",")
        index.fenlei[3].type_extend.year = index.fenlei[3].type_extend.year.split(",")

        wx.setStorage({ key: "index", data: index })
        //console.log('weixin',index.weixin)
        console.log('下载缓存', index) // 缓存数据&nbsp
        this.globalData.open = index.weixin
        //console.log(res.timeStamp.weixin) // 客户端拿到缓存数据的时间戳
        //console.log(res.path) // 页面路径
        //console.log(res.query) // query 参数
        //console.log(res.scene) // 场景值
      }
    })
 }
})
