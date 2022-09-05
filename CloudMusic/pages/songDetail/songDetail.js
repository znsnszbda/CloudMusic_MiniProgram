// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'
// 获取全局实例
const appInstance = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //标识是否播放音乐
    song: {}, //歌曲对象
    musicLink: '', //歌曲的链接
    currentTime: '00:00',   //实时时间
    durationTime: '04:00',  // 总时长
    currentWidth: 0, // 实时进度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options 用于接收路由跳转的参数
    // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过去会自动截取掉
    let songId = options.songId;
    // 获取歌曲信息
    this.getMusicInfo(songId);

    // 判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === songId){
      // 修改当前页面播放音乐状态为true
      this.setData({
        isPlay: true
      })
    }

    //订阅来自recommendSong发布的musicId消息 并 自动更新音乐播放
    PubSub.subscribe('musicId', (msg, musicId) => {
      // 更新当前页播放的音乐
      this.getMusicInfo(musicId);
      // 自动播放
      this.musicControl(true, musicId);
      // // 取消订阅
      // PubSub.unsubscribe('musicId');
    });

    // 解决切到后台 与系统不同步问题
    // 创建共用实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 监听音乐播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true);
      // 修改全局音乐播放状态
      appInstance.globalData.musicId = songId;
    });
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false);
    });
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });
    // 监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换下一首歌，并自动播放
      PubSub.publish('switchType', 'next');  
      this.setData({
        currentWidth: 0,
        musicLink: ''
      })
    });
    // 监听音乐实时播放进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      })
    });
  },
  // 封装 修改播放状态函数
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    // 修改全局音乐播放状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 获取歌曲信息
  async getMusicInfo(songId){
    let songData = await request('/song/detail', {ids: songId});
    if(songData.code !== 200){
      wx.showToast({
        title: '获取歌曲信息失败',
        icon: 'none'
      })
      return;
    }
    let durationTime = moment(songData.songs[0].dt).format('mm:ss');
    this.setData({
      song: songData.songs[0],
      durationTime
    });
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

  // 点击播放/暂停的回调
  handleMusicPlay(){
    let isPlay = !this.data.isPlay;
    // this.setData({
    //   isPlay
    // });  //因为监听处理了，所以这里不需要重复
    // 播放/暂停歌曲
    this.musicControl(isPlay, this.data.song.id);
  },
  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId){
    // 创建控制音乐播放实例
    if(isPlay){  // 播放
      if(!this.data.musicLink){
        // 获取音乐播放链接
        let musicLinkData = await request('/song/url', {id: musicId});
        if(musicLinkData.code !== 200){
          wx.showToast({
            title: '获取歌曲失败',
            icon: 'none'
          })
          return;
        }
        this.setData({
          musicLink: musicLinkData.data[0].url
        })
      }
      this.backgroundAudioManager.src = this.data.musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
      // this.backgroundAudioManager.seek(this.backgroundAudioManager.duration - 2);
    } else {  // 暂停
      this.backgroundAudioManager.pause();
    }
  },

  // 点击切换歌曲的回调
  handleSwitch(e) {
    let type = e.currentTarget.id;
    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    this.setData({
      musicLink: '',
      currentWidth: 0
    })
    
    // 发布消息数据到recommendSong页面
    PubSub.publish('switchType', type);
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})