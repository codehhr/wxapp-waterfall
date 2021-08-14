// pages/login/login.js
import { post } from "../../utils/http";
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: "",
  },
  // 登录
  login() {
    post("/api/login", {
      username: this.data.username,
      password: this.data.password,
      rememberMe: true,
    }).then((res) => {
      if (res.data.code === 0) {
        // 提示
        wx.showToast({
          title: "登录成功",
          icon: "success",
          duration: 1000,
        });
        setTimeout(() => {
          app.globalData.alreadyLogin = true;
          app.globalData.userInfo = res.data.data;
          wx.setStorageSync("cookie", res.cookies.join(";"));
          wx.reLaunch({
            url: "/pages/mine/mine",
          });
        }, 1000);
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "error",
        });
      }
    });
    // 清空输入框数据
    this.setData({
      username: "",
      password: "",
    });
  },
});
