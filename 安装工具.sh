#!/bin/bash

# 微信开发者工具安装脚本
# macOS 版本

echo "=========================================="
echo "微信开发者工具安装助手"
echo "=========================================="
echo ""

# 检查是否已安装
if [ -d "/Applications/wechatwebdevtools.app" ] || [ -d "/Applications/微信web开发者工具.app" ]; then
    echo "✅ 检测到微信开发者工具已安装！"
    echo ""
    echo "已安装位置："
    ls -d /Applications/*开发者* 2>/dev/null || ls -d /Applications/*devtools* 2>/dev/null
    echo ""
    echo "可以直接打开使用了！"
    exit 0
fi

echo "📥 开始安装微信开发者工具..."
echo ""

# 获取下载链接（macOS版本）
DOWNLOAD_URL="https://dldir1.qq.com/WechatWebDev/release/p-ae42b2b6b5ad401dbb637222aad6c04f.dmg"
DMG_NAME="wechat_devtools.dmg"
INSTALL_DIR="/Applications"

echo "1️⃣ 正在下载微信开发者工具..."
echo "   下载地址: $DOWNLOAD_URL"
echo ""

# 检查是否有curl或wget
if command -v curl &> /dev/null; then
    echo "   使用 curl 下载..."
    curl -L -o "/tmp/$DMG_NAME" "$DOWNLOAD_URL"
elif command -v wget &> /dev/null; then
    echo "   使用 wget 下载..."
    wget -O "/tmp/$DMG_NAME" "$DOWNLOAD_URL"
else
    echo "❌ 错误: 未找到 curl 或 wget，无法自动下载"
    echo ""
    echo "请手动下载："
    echo "   访问: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
    echo "   选择 macOS 版本下载"
    exit 1
fi

if [ $? -eq 0 ]; then
    echo "✅ 下载完成！"
    echo ""
    echo "2️⃣ 正在挂载安装包..."
    hdiutil attach "/tmp/$DMG_NAME" -quiet
    
    echo "3️⃣ 正在安装到应用程序..."
    # 查找.app文件并复制
    APP_PATH=$(find /Volumes -name "*.app" -type d -maxdepth 2 2>/dev/null | grep -i "wechat\|微信\|devtools" | head -1)
    
    if [ -n "$APP_PATH" ]; then
        cp -R "$APP_PATH" "$INSTALL_DIR/"
        echo "✅ 安装完成！"
        echo ""
        echo "4️⃣ 正在卸载安装包..."
        hdiutil detach $(diskutil list | grep -i "wechat\|devtools" | awk '{print $NF}' | head -1) -quiet 2>/dev/null
        rm "/tmp/$DMG_NAME"
        
        echo ""
        echo "=========================================="
        echo "✅ 安装成功！"
        echo "=========================================="
        echo ""
        echo "下一步："
        echo "1. 打开启动台，找到'微信web开发者工具'"
        echo "2. 或者运行: open -a '微信web开发者工具'"
        echo "3. 使用微信扫码登录"
        echo "4. 导入项目: $(pwd)"
        echo ""
    else
        echo "❌ 未找到应用程序文件，请手动安装"
        echo "   安装包已挂载，请手动将 .app 文件拖到应用程序文件夹"
    fi
else
    echo "❌ 下载失败，请检查网络连接"
    echo ""
    echo "请手动下载："
    echo "   访问: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
    exit 1
fi

