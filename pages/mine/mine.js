import { get } from "../../utils/http";
const app = getApp();

Page({
  data: {
    userInfo: null,
    alreadyLogin: false,
  },
  onLoad() {
    get("/api/login-user/info").then((res) => {
      if (res.data.code === 0) {
        this.setData({
          userInfo: res.data.data,
          alreadyLogin: true,
        });
      }
    });
  },
  goToLogin() {
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },
  logOut() {
    wx.clearStorageSync("cookie");
    app.globalData.userInfo = null;
    app.globalData.alreadyLogin = false;
    this.setData({
      userInfo: app.globalData.userInfo,
      alreadyLogin: app.globalData.alreadyLogin,
    });
    wx.showToast({
      title: "已退出登录",
      icon: "none",
      duration: 1000,
    });
  },
});
