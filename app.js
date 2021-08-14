import { get } from "./utils/http";

// app.js
App({
  globalData: {
    alreadyLogin: false,
    userInfo: null,
    newsDetail: null,
  },

  onLaunch() {
    // 检查登录状态
    get("/api/login-user/info").then((res) => {
      if (res.data.code === 0) {
        this.globalData.alreadyLogin = true;
        this.globalData.userInfo = res.data.data;
      } else {
        this.globalData.alreadyLogin = false;
        this.globalData.userInfo = null;
      }
    });
  },
});
