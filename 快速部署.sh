#!/bin/bash

# 快速部署脚本 - 准备发布版本

echo "=========================================="
echo "准备发布版本"
echo "=========================================="
echo ""

# 备份当前配置
echo "1️⃣ 备份当前配置..."
cp app.js app.js.backup
cp utils/util.js utils/util.js.backup
echo "   ✅ 已备份配置文件"

# 关闭调试模式
echo ""
echo "2️⃣ 关闭调试模式..."

# 修改 app.js
sed -i '' 's/return true; \/\/ 开发时设为true，发布时设为false/return false; \/\/ 发布版本关闭调试/g' app.js 2>/dev/null || \
sed -i 's/return true; \/\/ 开发时设为true，发布时设为false/return false; \/\/ 发布版本关闭调试/g' app.js

# 修改 utils/util.js
sed -i '' 's/const DEBUG = true; \/\/ 开发时设为true，发布时设为false/const DEBUG = false; \/\/ 发布版本关闭调试/g' utils/util.js 2>/dev/null || \
sed -i 's/const DEBUG = true; \/\/ 开发时设为true，发布时设为false/const DEBUG = false; \/\/ 发布版本关闭调试/g' utils/util.js

echo "   ✅ 调试模式已关闭"

# 运行检查
echo ""
echo "3️⃣ 运行发布前检查..."
./发布前检查.sh

echo ""
echo "=========================================="
echo "✅ 准备完成！"
echo "=========================================="
echo ""
echo "下一步操作："
echo "1. 在微信开发者工具中点击'上传'按钮"
echo "2. 填写版本号和备注"
echo "3. 在微信公众平台提交审核"
echo ""
echo "💡 如需恢复调试模式，运行："
echo "   cp app.js.backup app.js"
echo "   cp utils/util.js.backup utils/util.js"
echo ""

