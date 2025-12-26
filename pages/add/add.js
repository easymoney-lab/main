// pages/add/add.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    userIdentity: 'userA',
    userNames: {
      userA: '我',
      userB: 'TA'
    },
    time: '',
    location: '',
    content: '',
    locationLoading: false
  },

  onLoad() {
    // 设置默认时间为当前时间
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const defaultTime = `${hours}:${minutes}`;
    
    this.setData({
      userIdentity: app.globalData.userIdentity,
      userNames: app.globalData.userNames,
      time: defaultTime
    });
  },

  // 选择用户身份
  selectUser(e) {
    const user = e.currentTarget.dataset.user;
    app.switchIdentity(user);
    this.setData({
      userIdentity: user
    });
  },

  // 时间选择
  timeChange(e) {
    this.setData({
      time: e.detail.value
    });
  },

  // 地点输入
  locationInput(e) {
    this.setData({
      location: e.detail.value
    });
  },

  // 选择位置（GPS定位）
  chooseLocation() {
    this.setData({
      locationLoading: true
    });

    // 先获取当前位置权限
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          // 已授权，直接打开地图选择位置
          this.openLocationPicker();
        } else {
          // 未授权，请求授权
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.openLocationPicker();
            },
            fail: (err) => {
              this.setData({
                locationLoading: false
              });
              console.error('授权失败', err);
              wx.showModal({
                title: '需要位置权限',
                content: '需要获取您的位置信息，请在设置中开启位置权限。如果不需要定位，可以手动输入地点。',
                confirmText: '去设置',
                cancelText: '手动输入',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting({
                      success: (settingRes) => {
                        if (settingRes.authSetting['scope.userLocation']) {
                          this.openLocationPicker();
                        } else {
                          wx.showToast({
                            title: '已取消，可手动输入地点',
                            icon: 'none'
                          });
                        }
                      }
                    });
                  } else {
                    wx.showToast({
                      title: '可以手动输入地点',
                      icon: 'none'
                    });
                  }
                }
              });
            }
          });
        }
      },
      fail: () => {
        this.setData({
          locationLoading: false
        });
        wx.showToast({
          title: '获取权限失败',
          icon: 'none'
        });
      }
    });
  },

  // 打开地图选择位置
  openLocationPicker() {
    wx.chooseLocation({
      success: (res) => {
        // 使用选择的位置名称
        const locationName = res.name || res.address || '当前位置';
        this.setData({
          location: locationName,
          locationLoading: false
        });
        
        app.debugLog('选择位置', {
          name: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: (err) => {
        this.setData({
          locationLoading: false
        });
        
        if (err.errMsg.includes('cancel')) {
          // 用户取消，不显示错误
          return;
        }
        
        // 如果 chooseLocation 失败，尝试使用 getLocation
        this.getCurrentLocation();
      }
    });
  },

  // 获取当前位置（备用方案）
  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02', // 返回可以用于 wx.openLocation 的经纬度
      success: (res) => {
        // 使用逆地理编码获取地址
        // 注意：小程序需要使用腾讯地图API或类似服务进行逆地理编码
        // 这里先使用坐标信息
        const locationText = `纬度:${res.latitude.toFixed(6)}, 经度:${res.longitude.toFixed(6)}`;
        this.setData({
          location: locationText,
          locationLoading: false
        });
        
        wx.showToast({
          title: '已获取位置',
          icon: 'success'
        });
      },
      fail: (err) => {
        this.setData({
          locationLoading: false
        });
        
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '需要位置权限',
            content: '请在设置中开启位置权限',
            showCancel: false
          });
        } else {
          wx.showToast({
            title: '定位失败，请手动输入',
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },

  // 内容输入
  contentInput(e) {
    this.setData({
      content: e.detail.value
    });
  },

  // 提交行程
  submitTrip() {
    const { userIdentity, time, location, content } = this.data;

    // 验证必填项
    if (!time) {
      wx.showToast({
        title: '请选择时间',
        icon: 'none'
      });
      return;
    }

    if (!location || location.trim() === '') {
      wx.showToast({
        title: '请输入地点',
        icon: 'none'
      });
      return;
    }

    // 显示加载状态
    wx.showLoading({
      title: '保存中...',
      mask: true
    });

    // 保存行程
    const result = util.saveTrip({
      user: userIdentity,
      time: time,
      location: location.trim(),
      content: content.trim()
    });

    wx.hideLoading();

    if (result.success) {
      wx.showToast({
        title: result.message,
        icon: 'success'
      });
      
      // 重置表单（时间重置为当前时间）
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const defaultTime = `${hours}:${minutes}`;
      
      this.setData({
        time: defaultTime,
        location: '',
        content: ''
      });

      // 延迟跳转到首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
    } else {
      wx.showToast({
        title: result.message,
        icon: 'none'
      });
    }
  }
})