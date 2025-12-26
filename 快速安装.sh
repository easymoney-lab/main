#!/bin/bash

# 快速安装指南 - 手动下载安装

echo "=========================================="
echo "微信开发者工具 - 快速安装指南"
echo "=========================================="
echo ""

# 检查是否已安装
if [ -d "/Applications/wechatwebdevtools.app" ] || [ -d "/Applications/微信web开发者工具.app" ]; then
    echo "✅ 微信开发者工具已安装！"
    echo ""
    echo "位置："
    find /Applications -name "*开发者*" -o -name "*devtools*" 2>/dev/null | grep -i "wechat\|微信"
    echo ""
    echo "可以直接使用了！"
    exit 0
fi

echo "📥 请按照以下步骤手动安装："
echo ""
echo "1️⃣ 打开浏览器，访问下载页面："
echo "   https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
echo ""
echo "2️⃣ 选择 macOS 版本下载（.dmg 文件）"
echo ""
echo "3️⃣ 下载完成后，双击 .dmg 文件"
echo ""
echo "4️⃣ 将 '微信web开发者工具.app' 拖到 '应用程序' 文件夹"
echo ""
echo "5️⃣ 安装完成后，运行以下命令打开："
echo "   open -a '微信web开发者工具'"
echo ""
echo "6️⃣ 导入项目："
echo "   - 点击 '+' 或 '导入项目'"
echo "   - 选择目录: $(pwd)"
echo "   - AppID 选择 '测试号'"
echo "   - 项目名称: 情侣行程记录"
echo ""
echo "=========================================="
echo ""

# 尝试打开浏览器
if command -v open &> /dev/null; then
    read -p "是否现在打开下载页面？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
    fi
fi

