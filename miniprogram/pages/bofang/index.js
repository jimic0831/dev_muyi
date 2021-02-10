// miniprogram/pages/bofang/index.js
var that, app = getApp(), eventChannel, videoContext, timer, nickName, isShowLoading = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioindex:'',
    hits: { hits: 1, hits_day: 1, hits_week: 1, hits_month: 1 },
    jianjie:false,
    rebo:[],
    shoucang:[],
    speed: 1,
    showSpeed: false,
    fullScreen: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.setData({ open: app.globalData.open})
    videoContext = wx.createVideoContext('video',this)
  
    if (!wx.getStorageSync('index')) { getindex() }

    //if (options.vod_id) { getdata(options.vod_id); that.setData({ open: true }) }
    
    eventChannel = this.getOpenerEventChannel()
    
    if (eventChannel.on){
    eventChannel.on('fromData', function (data) {
      getplay(data)
    })
    } else { console.log('vod_id', options.vod_id); getdata(options.vod_id); that.setData({ open: true })}
    
    if (options.vodid) { getdata(options.vodid);}
    //console.log('fromData', eventChannel.on('fromData'));
    
    var modalShowing = false;
    timer = setInterval(function () {
      wx.request({
        url: 'https://www.muyi.cf/wechat/data.php?type=check&nickname=' + encodeURI(nickName),
        success (res) {
          if (res.data == "-1" && !modalShowing) {
            modalShowing = true;
            videoContext.exitFullScreen()
            videoContext.pause()
            wx.showModal({
              title: '只差一步了',
              content: '关注公众号"木易资源"后,将不再出现此提示！是否复制公众号',
              confirmText: '复制',
              success (res) {
                if (res.confirm) {
                  modalShowing = false
                  wx.setClipboardData({
                    data: 'muyitool',
                  })
                } else if (res.cancel) {
                  modalShowing = false
                  console.log('用户点击取消')
                }
              }
            });
          }
        }
      })
    }, 60000)
    //600000=10分钟
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     // 查看是否授权
     wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              nickName = res.userInfo.nickName
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您还未登录，请前往授权登录',
            showCancel: false,
            confirmText: '前往登录',
            success (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../geren/index',
                })
              }
            }
          });
        }
      }
    })
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
    clearInterval(timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(timer)
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
    that.setData({ fenxiang: false })
    return {
      path: 'pages/bofang/index?vod_id=' + that.data.video.vod_id,
      imageUrl: that.data.video.vod_pic,
      title: "《" + that.data.video.vod_name + "》"+that.data.video.vod_remarks+" 免费在线观看",
    }
  },
  radioCheckedChange: function (e) {
    if (that.data.open == false) { that.setClipboardData() ;    return }
    wx.showLoading({ title: '加载视频', })
    isShowLoading = true
    this.setData({
      radioindex: that.data.vod_play_url[e.detail.value]
    })
    //console.log('value', Number(e.detail.vod_play_url));
    //console.log('video', that.data.vod_play_url[e.detail.value] );
  },
  bindplay: function (e){
    //console.log('bindplay',e);
    if (isShowLoading) {
      wx.hideLoading()
      isShowLoading = false
    }
  },
  bindtimeupdate: function (e){
    //console.log('bindtimeupdate',e.detail.currentTime);
    jilu(e.detail.currentTime)
  },
  bindprogress: function (e) {
    //console.log('bindprogress', e.detail);
    if (isShowLoading) {
      wx.hideLoading()
      isShowLoading = false
    }
  },
  binderror:function(e){
    if (isShowLoading) {
      wx.hideLoading()
      isShowLoading = false
    }
    wx.showModal({
      title: '视频播放错误',
      content: '可能是网络卡顿，请刷新切换线路重新播放！',
      cancelText: '不刷新',
      confirmText:"刷新",
      success(res) {
        if (res.confirm) {
          wx.showLoading({ title: '加载视频', })
          isShowLoading = true
          videoContext.play()
        } 
      }
    })
  },
  bindloadedmetadata: function(e) {
    if (isShowLoading) {
      wx.hideLoading()
      isShowLoading = false
    }
  },
  bindcontrolstoggle: function(e) {
    //console.log("bindcontrolstoggle",e.detail);
    this.setData({showSpeed: e.detail.show})
  },
  bindfullscreenchange: function(e) {
    console.log("bindfullscreenchange",e.detail);
    this.setData({fullScreen: e.detail.fullScreen})
  },
  jianjie:function(e){
    that.setData({ 'jianjie': e.currentTarget.dataset.hi })
  },
  setClipboardData(){
  wx.setClipboardData({
    data: 'https://www.muyi.cf/index.php/vod/detail/id/' + that.data.video.vod_id+'.html',
    success(res) {

      wx.showModal({
        title: '播放链接复制成功',
        content: '打开浏览器复制到网页免费观看。',
        showCancel: false,
        success(res) {
  
        }
      })

    }
    })
  },
  bofang:function(e){
    getplay(e.currentTarget.dataset.hi)
  },
  shoucang:function(){
    var index = that.data.shoucang.findIndex(item => item.vod_id === that.data.video.vod_id);
    console.log("index", index);
    if (index == -1) { //插入
      var shoucang = that.data.shoucang
      shoucang.unshift(that.data.video)
      wx.setStorage({ key: "shoucang", data: shoucang})
      getshoucang()
    } else { //修改
      var shoucang = that.data.shoucang
      shoucang.splice(index,1);
      wx.setStorage({ key: "shoucang", data: shoucang })
      getshoucang()
      //that.setData({ shoucang: that.data.shoucang.splice(index, 1).unshift(that.data.video), })
      //wx.setStorage({ key: "shoucang", data: that.data.shoucang })
    }
  },
  speedHandler: function(e){
    if (this.data.speed >= 2) {
      this.data.speed = 0;
    }
    let speedVaule = this.data.speed + 0.5
    this.setData({speed: speedVaule})
    videoContext.playbackRate(speedVaule)
  }
})

function getshoucang() {
  //wx.clearStorage()
  wx.getStorage({
    key: 'shoucang', success(res) {
      var index = res.data.findIndex(item => item.vod_id === that.data.video.vod_id);
      that.setData({ shoucang: res.data, shoucangpx: index })
      //console.log("修改", that.data.shoucang, that.data.shoucangpx);
    }
  })
}

function jilu(time) {
  wx.getStorage({
    key: 'jilu', success(res) {
      var index = res.data.findIndex(item => item.vod_id === that.data.video.vod_id);
      that.setData({ 'video.time': time, 'video.radioindex': that.data.radioindex})
      if (index == -1) {//没有
        res.data.unshift(that.data.video)
        wx.setStorage({ key: "jilu", data: res.data })
      }
      else{ //有更新
        res.data.splice(index, 1);
        res.data.unshift(that.data.video)
        wx.setStorage({ key: "jilu", data: res.data })
      }
    }
  })
}

function setlist(e){
  //console.log('e', e);
  var a = e.replace(/\$\$\$/g, "#");
  //console.log('a',a);
  var list = a.split("#")
  var vod_play_url=[]
  //console.log('list',list);
  for (var i = 0; i < list.length; i++){
      var v = list[i].split("$")
    vod_play_url.unshift({ name: v[0], url: v[1]})
  }
  console.log('vod_play_url',vod_play_url);
  that.setData({ 'vod_play_url': vod_play_url})
  //console.log(that.data.vod_play_url)
  if (!wx.getStorageSync('jilu')) { wx.setStorage({ key: "jilu", data: [] }) }
  wx.getStorage({
    key: 'jilu', success(res) {
      var index = res.data.findIndex(item => item.vod_id === that.data.video.vod_id);
      if (index == -1) {//没有
        that.setData({ radioindex: vod_play_url[0] })
        //console.log("radioindex",that.data.radioindex)
      }
      else { //有更新
        if (res.data[index].time){videoContext.seek(res.data[index].time)}
        if (res.data[index].radioindex) { that.setData({ radioindex: res.data[index].radioindex }) }
        else { that.setData({ radioindex: vod_play_url[0] })}
      }
      if (res.data.length > 20) {
        res.data.splice(20, (res.data.length - 20));
        wx.setStorage({ key: "jilu", data: res.data })
      }
    }
  })
  //console.log(that.data.video.vod_id)
  wx.request({
    url: 'https://www.muyi.cf/index.php/ajax/hits?mid=1&id=' + that.data.video.vod_id+'&type=update',
    header: { 'content-type': 'application/json' },
    success(res) {
      if (res.data.msg =='操作成功！'){
        that.setData({ hits: res.data.data})  //console.log(res.data.data)
      }
    }
  })
}

function getdata(id) {
  wx.showLoading({ title: '获取数据', })
  isShowLoading = true
  wx.request({
    url: 'https://www.muyi.cf/api.php/provide/vod/?ac=detail&&ids='+id,
    header: { 'content-type': 'application/json' },
    success(res) {
      //console.log(res.data.list)
      getplay(res.data.list[0])
      wx.stopPullDownRefresh()
    }
  })
} 

function getplay(data) {
  //that.data.open = true;
  if (that.data.open) { 
    wx.showLoading({ title: '加载视频', })
    isShowLoading = true
  }
  else { that.setData({ jianjie:true})}
  //console.log("type_id_1", that.data.video.type_id_1)
  data.vod_content = data.vod_content.replace(/<[^>]+>/g, "")
  if (data.vod_pic.substring(0, 6) == 'upload') { data.vod_pic = 'https://www.muyi.cf/' + data.vod_pic }
  if (data.vod_pic.substring(0, 3) == 'mac') { data.vod_pic = data.vod_pic.replace('mac', 'http') }
  if (data.vod_remarks.indexOf('T')>=0) { that.setData({ "TS": true }) }
  else { that.setData({ "TS": false })}
  //console.log("vod_remarks", data.vod_remarks.indexOf('T'))
  that.setData({ "video": data })
  getshoucang()
  wx.setNavigationBarTitle({ title: data.vod_name })
  //var array = "{name:'" + data.vod_play_url.replace(/\$/g, "',url:'").replace(/\#/g, "'}#{name:'")+"'}"
  //var list =array.split("#")
  //var josn = JSON.stringify([data])
  console.log("视频", that.data.video)
  setlist(data.vod_play_url)

  if (data.type_id_1 == 1) {
    wx.getStorage({
      key: 'index', success(res) {
        that.setData({ rebo: res.data.rebodianying, open: res.data.weixin})
      }
    })
  }
  if (data.type_id_1 == 2) {
    wx.getStorage({
      key: 'index', success(res) {
        that.setData({ rebo: res.data.rebodianshiju, open: res.data.weixin})
      }
    })
  }
  if (data.type_id == 3) {
    wx.getStorage({
      key: 'index', success(res) {
        that.setData({ rebo: res.data.rebozongyi, open: res.data.weixin })
      }
    })
  }
  if (data.type_id == 4) {
    wx.getStorage({
      key: 'index', success(res) {
        that.setData({ rebo: res.data.rebodongman, open: res.data.weixin })
      }
    })
  }
  if (isShowLoading) {
    wx.hideLoading()
    isShowLoading = false
  }
  wx.stopPullDownRefresh();
}

function getindex() {
  wx.showLoading({ title: '加载数据...', })
  isShowLoading = true
  wx.request({
    url: 'https://www.muyi.cf/label/index.html',
    header: { 'content-type': 'application/json' },
    success(res) {
      //console.log(res.data.weixin)
      app.globalData.open = res.data.weixin

      res.data.fenlei[0].type_extend.area = res.data.fenlei[0].type_extend.area.split(",")
      res.data.fenlei[0].type_extend.year = res.data.fenlei[0].type_extend.year.split(",")

      res.data.fenlei[1].type_extend.year = res.data.fenlei[1].type_extend.year.split(",")

      res.data.fenlei[2].type_extend.area = res.data.fenlei[2].type_extend.area.split(",")
      res.data.fenlei[2].type_extend.year = res.data.fenlei[2].type_extend.year.split(",")

      res.data.fenlei[3].type_extend.area = res.data.fenlei[3].type_extend.area.split(",")
      res.data.fenlei[3].type_extend.year = res.data.fenlei[3].type_extend.year.split(",")

      that.setData({ index: res.data })
      //console.log(res.data)
      //console.log(JSON.parse(res.data))
      wx.setStorage({ key: "index", data: res.data })
      if (isShowLoading) {
        wx.hideLoading()
        isShowLoading = false
      }
      wx.stopPullDownRefresh()
    }
  })
}