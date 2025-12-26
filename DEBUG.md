# 调试指南

## 调试功能

小程序已添加完整的调试功能，帮助你在开发过程中快速定位问题。

### 1. 控制台日志

所有关键操作都会在控制台输出调试信息，包括：
- 应用启动
- 用户身份切换
- 数据加载
- 数据保存
- 数据删除

### 2. 调试模式开关

在 `app.js` 中：
```javascript
isDebugMode() {
  return true; // 开发时设为true，发布时设为false
}
```

在 `utils/util.js` 中：
```javascript
const DEBUG = true; // 开发时设为true，发布时设为false
```

**发布前请将这两个值都改为 `false`**

### 3. 错误处理

所有关键函数都已添加 try-catch 错误处理：
- 数据存储操作
- 时间格式化
- 页面加载

### 4. 数据验证

- 保存行程时会验证必填字段
- 加载数据时会过滤无效记录
- 时间格式化会处理无效日期

## 常见问题调试

### 问题1：数据无法保存

**检查步骤：**
1. 打开微信开发者工具的控制台
2. 查看是否有错误信息
3. 检查存储空间是否已满
4. 查看 `[UTIL DEBUG] 保存行程成功` 日志

**解决方法：**
- 清除小程序数据重新测试
- 检查必填字段是否完整

### 问题2：时间显示异常

**检查步骤：**
1. 查看控制台的 `formatTime` 或 `formatDateTime` 相关日志
2. 检查 `createTime` 字段格式是否正确（ISO格式）

**解决方法：**
- 确保数据中的 `createTime` 是有效的 ISO 日期字符串
- 查看是否有 "无效的日期格式" 警告

### 问题3：页面无法跳转

**检查步骤：**
1. 检查 `app.json` 中的页面路径是否正确
2. 确认使用的是 `wx.navigateTo`（普通页面）还是 `wx.switchTab`（tabBar页面）

**解决方法：**
- 首页和添加页面使用 `wx.switchTab`
- 详情页使用 `wx.navigateTo`

### 问题4：用户身份切换不生效

**检查步骤：**
1. 查看控制台的 `[DEBUG] 切换用户身份` 日志
2. 检查 `app.globalData.userIdentity` 的值

**解决方法：**
- 确认调用 `app.switchIdentity()` 时传入的是 'userA' 或 'userB'
- 检查页面是否正确读取了 `app.globalData.userIdentity`

## 调试工具

### 查看存储数据

在微信开发者工具中：
1. 点击"存储"标签
2. 查看 `trips` 和 `userIdentity` 的值
3. 可以手动修改或清除数据

### 模拟数据

可以在控制台执行：
```javascript
// 添加测试数据
const testTrip = {
  id: Date.now().toString(),
  user: 'userA',
  time: '14:30',
  location: '测试地点',
  content: '测试内容',
  createTime: new Date().toISOString()
};
const trips = wx.getStorageSync('trips') || [];
trips.push(testTrip);
wx.setStorageSync('trips', trips);
```

### 清除所有数据

在控制台执行：
```javascript
wx.clearStorageSync();
```

## 性能优化建议

1. **发布前关闭调试模式**
   - 将 `isDebugMode()` 和 `DEBUG` 设为 `false`
   - 减少控制台输出，提升性能

2. **数据量控制**
   - 建议定期清理旧数据
   - 可以添加数据上限（如最多保存1000条）

3. **异步操作**
   - 大量数据操作时考虑使用异步API
   - 避免阻塞主线程

## 日志格式说明

- `[DEBUG]` - 应用级调试信息
- `[UTIL DEBUG]` - 工具函数调试信息
- `console.error` - 错误信息
- `console.warn` - 警告信息

