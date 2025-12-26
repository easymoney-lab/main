// app.js
App({
  onLaunch() {
    console.log('小程序启动 - onLaunch');
    
    // 初始化用户身份
    try {
      this.initUserIdentity();
      console.log('用户身份初始化完成:', this.globalData);
    } catch (error) {
      console.error('小程序启动失败:', error);
    }
    
    // 调试模式（开发时启用）
    if (this.isDebugMode()) {
      console.log('小程序启动 - Debug模式已启用');
      this.debugLog('App onLaunch', {});
    }
  },

  // 判断是否为调试模式
  isDebugMode() {
    // 可以通过编译条件或配置来控制
    return false; // 发布时设为false
  },

  // 调试日志（发布版也保留基本错误日志）
  debugLog(tag, data) {
    if (this.isDebugMode()) {
      console.log(`[DEBUG] ${tag}:`, data);
    } else {
      // 发布版只记录错误级别的日志
      if (tag.includes('错误') || tag.includes('失败')) {
        console.error(`[ERROR] ${tag}:`, data);
      }
    }
  },

  // 初始化用户身份（默认用户A，可在设置中切换）
  initUserIdentity() {
    try {
      const identity = wx.getStorageSync('userIdentity') || 'userA';
      this.globalData.userIdentity = identity;
      
      // 加载保存的用户名
      const savedNames = wx.getStorageSync('userNames');
      if (savedNames) {
        this.globalData.userNames = savedNames;
      }
      
      this.debugLog('初始化用户身份', { identity, userNames: this.globalData.userNames });
    } catch (e) {
      console.error('初始化用户身份失败', e);
      this.globalData.userIdentity = 'userA';
    }
  },

  // 切换用户身份
  switchIdentity(identity) {
    if (identity !== 'userA' && identity !== 'userB') {
      console.warn('无效的用户身份:', identity);
      return;
    }
    try {
      this.globalData.userIdentity = identity;
      wx.setStorageSync('userIdentity', identity);
      this.debugLog('切换用户身份', { identity });
    } catch (e) {
      console.error('切换用户身份失败', e);
    }
  },

  globalData: {
    userIdentity: 'userA', // userA 或 userB
    userNames: {
      userA: '我',
      userB: 'TA'
    }
  }
})