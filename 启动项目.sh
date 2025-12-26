#!/bin/bash

# 快速启动微信小程序项目

PROJECT_PATH="/Users/kd/微信小程序"

echo "🚀 正在启动微信小程序项目..."
echo ""

# 检查项目目录是否存在
if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ 项目目录不存在: $PROJECT_PATH"
    exit 1
fi

# 尝试打开微信开发者工具
if [ -d "/Applications/微信web开发者工具.app" ]; then
    open -a "微信web开发者工具" --args --project "$PROJECT_PATH"
elif [ -d "/Applications/微信开发者工具.app" ]; then
    open -a "微信开发者工具" --args --project "$PROJECT_PATH"
elif [ -d "/Applications/wechatwebdevtools.app" ]; then
    open -a "wechatwebdevtools" --args --project "$PROJECT_PATH"
else
    echo "❌ 未找到微信开发者工具"
    echo "   请先安装: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
    exit 1
fi

echo "✅ 已打开微信开发者工具"
echo ""
echo "如果这是首次导入，请："
echo "1. AppID 选择 '测试号'"
echo "2. 项目名称: 情侣行程记录"
echo "3. 点击 '导入'"
echo ""

