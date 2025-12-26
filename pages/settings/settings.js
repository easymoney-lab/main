// pages/settings/settings.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    userNames: {
      userA: '我',
      userB: 'TA'
    },
    stats: {
      total: 0,
      userA: 0,
      userB: 0
    }
  },

  onLoad() {
    this.loadSettings();
    this.loadStats();
  },

  onShow() {
    // 刷新统计数据
    this.loadStats();
  },

  // 加载设置
  loadSettings() {
    const savedNames = wx.getStorageSync('userNames');
    if (savedNames) {
      this.setData({
        userNames: savedNames
      });
      // 同步到全局
      app.globalData.userNames = savedNames;
    } else {
      this.setData({
        userNames: app.globalData.userNames
      });
    }
  },

  // 加载统计数据
  loadStats() {
    const trips = util.getTrips();
    const stats = {
      total: trips.length,
      userA: trips.filter(t => t.user === 'userA').length,
      userB: trips.filter(t => t.user === 'userB').length
    };
    this.setData({
      stats: stats
    });
  },

  // 输入用户名A
  onUserNameAInput(e) {
    this.setData({
      'userNames.userA': e.detail.value || '我'
    });
  },

  // 输入用户名B
  onUserNameBInput(e) {
    this.setData({
      'userNames.userB': e.detail.value || 'TA'
    });
  },

  // 保存设置
  saveSettings() {
    const { userNames } = this.data;
    
    // 验证
    if (!userNames.userA || userNames.userA.trim() === '') {
      wx.showToast({
        title: '请输入你的名字',
        icon: 'none'
      });
      return;
    }

    if (!userNames.userB || userNames.userB.trim() === '') {
      wx.showToast({
        title: '请输入TA的名字',
        icon: 'none'
      });
      return;
    }

    // 保存到本地存储
    const namesToSave = {
      userA: userNames.userA.trim(),
      userB: userNames.userB.trim()
    };

    try {
      wx.setStorageSync('userNames', namesToSave);
      app.globalData.userNames = namesToSave;
      
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });

      app.debugLog('保存用户设置', namesToSave);
    } catch (e) {
      console.error('保存设置失败', e);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  // 清空所有数据
  clearAllData() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有行程记录吗？此操作不可恢复！',
      confirmColor: '#ff4757',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('trips');
            wx.showToast({
              title: '已清空',
              icon: 'success'
            });
            
            // 刷新统计数据
            this.loadStats();
            
            // 通知首页刷新
            const pages = getCurrentPages();
            if (pages.length > 1) {
              const prevPage = pages[pages.length - 2];
              if (prevPage.route === 'pages/index/index') {
                prevPage.loadTrips();
              }
            }
          } catch (e) {
            console.error('清空数据失败', e);
            wx.showToast({
              title: '清空失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
})

