// pages/detail/detail.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    trip: null,
    tripId: '',
    userIdentity: 'userA',
    userNames: {
      userA: '我',
      userB: 'TA'
    }
  },

  onLoad(options) {
    const id = options.id;
    if (id) {
      this.setData({
        tripId: id,
        userIdentity: app.globalData.userIdentity,
        userNames: app.globalData.userNames
      });
      this.loadTrip(id);
    }
  },

  // 加载行程详情
  loadTrip(id) {
    try {
      if (!id) {
        console.error('行程ID为空');
        wx.showToast({
          title: '行程ID无效',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
        return;
      }

      const trips = util.getTrips();
      const trip = trips.find(t => t.id === id);
      
      app.debugLog('加载行程详情', { id, found: !!trip });
      
      if (trip) {
        this.setData({
          trip: {
            ...trip,
            createTimeText: util.formatDateTime(trip.createTime)
          }
        });
      } else {
        wx.showToast({
          title: '行程不存在',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    } catch (e) {
      console.error('加载行程详情失败', e);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 删除行程
  deleteTrip() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条行程记录吗？',
      success: (res) => {
        if (res.confirm) {
          const success = util.deleteTrip(this.data.tripId);
          if (success) {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          } else {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
})

