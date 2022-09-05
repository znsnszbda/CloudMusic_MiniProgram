// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    month: '',
    day: '',
    recommendList: [], //推荐列表数据
    index: 0,  // 标识音乐在列表的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 更新日期
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    });

    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){  //没有登录
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: ()=>{
          // 跳转至登录界面
          wx.reLaunch({
            url: '/pages/login_captcha/login_captcha',
          })
        }
      })
    }
    // 获取每日推荐的数据
    this.getRecommendList();

    // 订阅来自songDetail发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let {recommendList, index} = this.data;
      // msg：消息名称  type:传过来的数据
      if(type === 'prev'){  // 上一首
        (index === 0) && (index = recommendList.length);
        index--;
      } else {  // 下一首
        (index === recommendList.length - 1) && (index = -1);
        index++;
      }
      // 更新下标
      this.setData({
        index
      })
      let musicId = recommendList[index].id;
      // 将musicId回传给songDetail页面
      PubSub.publish('musicId', musicId);
    });
  },

  // 获取每日推荐的数据
  async getRecommendList() {
    let recommendListData = await request('/recommend/songs');
    this.setData({
      recommendList: recommendListData.recommend
    })
  },
  
  // 跳转至歌曲播放页
  toSongDetail(e){
    let {songid, index} = e.currentTarget.dataset;
    this.setData({
      index
    })
    // 路由跳转传参： query参数
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?songId=' + songid
    })
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