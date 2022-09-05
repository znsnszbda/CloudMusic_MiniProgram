Component({
  data: {
    selected: 0,
    color: "#303030",
    selectedColor: "#fff",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "主页",
        iconPath: "/static/images/tabs/home.png",
        selectedIconPath: "/static/images/tabs/home-active.png"
      },
      {
        pagePath: "/pages/video/video",
        text: "视频",
        iconPath: "/static/images/tabs/vedio.png",
        selectedIconPath: "/static/images/tabs/vedio-active.png"
      },
      {
        pagePath: "/pages/personal/personal",
        text: "个人中心",
        iconPath: "/static/images/tabs/personal.png",
        selectedIconPath: "/static/images/tabs/personal-active.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      // this.setData({
      //   selected: data.index
      // })
    }
  }
})