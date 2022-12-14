仿网易云音乐MiniProgram

##### 已实现页面

│	├── pages 			      // 小程序页面

│		 └── index		   	// 首页/主页

│		 └── video			   // 视频页

│		 └── personal	 					// 个人中心页

│		 └── login_password			 // 密码登录页

│		 └── login_captcha			    // 验证码登录页

│		 └── recommendSong	        // 每日推荐页

│		 └── songDetail 					 // 音乐播放页

│	 	 └── search 	                       // 搜索页

###### 整体框架

一进小程序显示首页，小程序底部有个tab切换栏，实现 主页--视频页--个人中心页切换

###### 主页

页面结构：banner轮播图 -- 导航栏 -- 推荐歌曲 -- 排行榜

已实现功能：① 动态展示数据 ② 点击每日推荐进入**每日推荐页**

###### 视频页

页面结构：头部搜索栏 -- 导航栏（动态数据） -- 视频展示区

已实现功能：

​	① 点击搜索框进入**搜索页**

​	② 导航区滑动，点击不同item展示相应的视频信息，且被选中的会跑到导航栏第一个

​	③ 视频展示区域：下拉刷新，上拉加载更多数据，视频分享功能，解决多个视频播放问题

###### 个人中心页

页面结构：用户信息展示 -- 开通会员模块 -- 导航栏 -- 菜单栏 -- 退出登录按钮

已实现功能：

​	① 点击头像和用户名区域进入**验证码登录页**（可切换到**密码登录页**），已成功登录点击无反应

​	② 最近播放区域动态展示最近播放记录

​	③ 拉动回弹动画效果

​	④ 点击退出登录，若成功退出登录会清楚用户信息和cookies

###### 验证码登录页 、密码登录页

验证码登录页 点击 “密码登录” 跳转到 密码登录页，可回退

已实现功能：登录成功把用户信息和cookies存在本地

###### 每日推荐页

页面结构：头部静态展示（动态展示日期）-- 动态展示音乐信息

已实现功能：

​	① 需要登录，未登录自动跳转到**登录页**

​	② 点击一首歌曲会跳转到**音乐播放页**

###### 音乐播放页

已实现功能：

​	① 点击播放按钮，有播放动画（摇杆放下，磁盘旋转），开始播放音乐

​	② 切换歌曲功能，当前歌曲播放自然结束自动切换下一首并自动播放

​	③ 进度条动态展示

​	④ 小程序切进后台，系统控制音乐播放关闭

###### 搜索页

页面结构： 搜索框 -- 搜索历史（如有）-- 热搜榜

已实现功能：

​	① 模糊匹配关键字搜索 并 动态展示相关搜索结果

​	② 输入框清空功能

​	③ 搜索历史清空功能

##### 如何使用

仅供学习使用。

###### 服务器运行

找到 ‘硅谷云音乐_sever' 文件夹，进入，在当前文件夹打开Powershell窗口（按住shift键+鼠标右键）；在Powershell窗口输入 npm start （前提是电脑先装node.js），服务器就跑起来了。

注：服务器跑起来才能去请求网易云官方的接口数据。

官方接口文档：https://binaryify.github.io/NeteaseCloudMusicApi/#/

github：https://github.com/Binaryify/NeteaseCloudMusicApi

也可以直接使用github上最新的服务器，自己参照官方接口文档使用。



###### 微信小程序开发工具

下载安装并注册：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

在小程序开发工具运行代码即可



###### 笔者开发过程的笔记

记录实现过程、遇到的问题、解决方案等，可能有点乱，见谅。

https://www.yuque.com/docs/share/5959150f-07ff-4749-95e0-bbfd4969533d?# 《云音乐小程序》



###### 资料来源

感谢尚硅谷b站上分享的学习视频和资料：

【尚硅谷微信小程序开发（零基础小程序开发入门到精通）】 https://www.bilibili.com/video/BV12K411A7A2?share_source=copy_web&vd_source=cecfdcca228b8afdccb58987672050e0



###### 其他说明

功能实现不全，仅学习使用，可能还存在一些未优化功能和bug，有些地方按自己想法做，并非全照视频里的完成，有兴趣的欢迎交流指正。
