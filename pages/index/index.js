// pages/index/index.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    trips: [],
    filteredTrips: [],
    searchKeyword: '',
    stats: {
      total: 0,
      userA: 0,
      userB: 0
    },
    userIdentity: 'userA',
    userNames: {
      userA: '我',
      userB: 'TA'
    },
    isLoading: true // 添加加载状态
  },

  onLoad() {
    console.log('首页 onLoad 开始执行');
    
    // 显示加载状态
    this.setData({
      isLoading: true
    });
    
    try {
      // 初始化示例数据（仅在第一次加载时）
      this.initSampleData();
      this.loadTrips();
    } catch (error) {
      console.error('首页 onLoad 错误:', error);
      this.setData({
        isLoading: false
      });
      wx.showToast({
        title: '页面加载失败',
        icon: 'none'
      });
    }
  },

  // 初始化示例数据
  initSampleData() {
    const existingTrips = util.getTrips();
    
    // 如果已有数据，不添加示例数据
    if (existingTrips.length > 0) {
      console.log('已有行程数据，跳过示例数据初始化');
      return;
    }
    
    console.log('初始化示例数据');
    
    // 添加示例行程记录
    const sampleTrips = [
      {
        user: 'userA',
        time: '09:00',
        location: '公司',
        content: '开始一天的工作',
        createTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2天前
      },
      {
        user: 'userB', 
        time: '12:30',
        location: '餐厅',
        content: '午餐时间',
        createTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1天前
      },
      {
        user: 'userA',
        time: '18:00',
        location: '健身房',
        content: '锻炼身体',
        createTime: new Date().toISOString() // 今天
      }
    ];
    
    sampleTrips.forEach((trip, index) => {
      const tripWithId = {
        ...trip,
        id: Date.now().toString() + index
      };
      util.saveTrip(tripWithId);
    });
    
    console.log('示例数据初始化完成');
  },
  // 加载行程列表
  loadTrips() {
    try {
      console.log('开始加载行程数据');
      const trips = util.getTrips();
      console.log('获取到的行程数据:', trips);
      
      const userIdentity = app.globalData.userIdentity;
      
      // 确保数据格式正确
      if (!Array.isArray(trips)) {
        console.warn('行程数据不是数组，重置为空数组');
        trips = [];
      }

      // 格式化时间显示
      const formattedTrips = trips.map(trip => {
        // 确保每个行程对象都有必要字段
        return {
          id: trip.id || Date.now().toString(),
          user: trip.user || 'userA',
          time: trip.time || '00:00',
          location: trip.location || '未知地点',
          content: trip.content || '',
          createTime: trip.createTime || new Date().toISOString(),
          createTimeText: util.formatTime(trip.createTime || new Date().toISOString())
        };
      });

      // 计算统计信息
      const stats = {
        total: formattedTrips.length,
        userA: formattedTrips.filter(t => t.user === 'userA').length,
        userB: formattedTrips.filter(t => t.user === 'userB').length
      };

      console.log('准备设置页面数据:', {
        tripsCount: formattedTrips.length,
        stats: stats,
        userIdentity: userIdentity
      });

      // 强制更新页面数据
      this.setData({
        trips: formattedTrips,
        filteredTrips: formattedTrips,
        stats: stats,
        userIdentity: userIdentity,
        userNames: app.globalData.userNames,
        isLoading: false
      }, () => {
        console.log('页面数据设置回调完成');
        console.log('当前页面trips数据:', this.data.trips);
        console.log('当前页面filteredTrips数据:', this.data.filteredTrips);
      });

      console.log('页面数据设置完成');
      
    } catch (e) {
      console.error('加载行程列表失败', e);
      // 设置空数据状态
      this.setData({
        trips: [],
        filteredTrips: [],
        stats: { total: 0, userA: 0, userB: 0 },
        isLoading: false
      });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword
    });
    this.filterTrips();
  },

  // 清除搜索
  clearSearch() {
    this.setData({
      searchKeyword: ''
    });
    this.filterTrips();
  },

  // 过滤行程
  filterTrips() {
    const { trips, searchKeyword } = this.data;
    let filteredTrips = trips;

    if (searchKeyword && searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      filteredTrips = trips.filter(trip => {
        const location = (trip.location || '').toLowerCase();
        const content = (trip.content || '').toLowerCase();
        return location.includes(keyword) || content.includes(keyword);
      });
    }

    this.setData({
      filteredTrips: filteredTrips
    });
  },

  // 切换用户身份
  switchUser(e) {
    const user = e.currentTarget.dataset.user;
    app.switchIdentity(user);
    this.setData({
      userIdentity: user,
      searchKeyword: '' // 切换用户时清空搜索
    });
    this.loadTrips();
  },

  // 查看详情
  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 跳转到设置页面
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 简单强制刷新
  simpleRefresh() {
    console.log('=== 简单强制刷新 ===');
    
    // 直接重新加载数据
    this.loadTrips();
    
    wx.showToast({
      title: '刷新完成',
      icon: 'success'
    });
  },

  // 强制刷新显示
  forceRefreshDisplay() {
    console.log('=== 强制刷新显示 ===');
    
    // 检查当前数据状态
    console.log('当前trips数据:', this.data.trips);
    console.log('当前filteredTrips数据:', this.data.filteredTrips);
    
    // 调用简单刷新函数
    this.simpleRefresh();
    
    // 强制重新设置相同数据（触发WXML重新渲染）
    this.setData({
      trips: [...this.data.trips], // 创建新数组引用
      filteredTrips: [...this.data.filteredTrips]
    }, () => {
      console.log('强制刷新完成');
      console.log('刷新后trips数据:', this.data.trips);
      console.log('刷新后filteredTrips数据:', this.data.filteredTrips);
      
      // 检查WXML应该显示的内容
      console.log('应该显示行程列表:', this.data.trips.length > 0);
    });
    
    wx.showToast({
      title: '强制刷新完成',
      icon: 'none'
    });
  },
})