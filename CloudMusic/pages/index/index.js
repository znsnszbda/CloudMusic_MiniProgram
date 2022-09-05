import request from '../../utils/request'

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommendList: [],
    topList: []
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 请求轮播图
    let bannerListData = await request('/banner', {type: 2})
    this.setData({
      banners: bannerListData.banners
    })

    // 请求推荐歌单
    let recommendListData = await request('/personalized', {limit: 10});
    this.setData({
      recommendList: recommendListData.result
    })

    // 获取排行榜数据
    /* 
      需求分析：
        1. 需要根据idx的值获取对应的数据
        2. idx的取值范围是0-20，需要0-4（前5个）
        3. 需要发生5次请求
    */
    let index = 0;
    let resultArr = [];
    while(index < 5){
      let topListData = await request('/top/list', {idx: index++});
      let topListItem = {name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 3)};
      resultArr.push(topListItem);
      // 不要等待太久，用户体验较好，但渲染次数增加
      this.setData({
        topList: resultArr
      })
    }
    // 需要等待5次请求结束才更新数据，用户体验差
    // this.setData({
    //   topList: resultArr
    // })
  },

  // 跳转每日推荐页面的回调
  toRecommeendSong(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
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