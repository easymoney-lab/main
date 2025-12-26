#!/bin/bash

# 检查微信开发者工具是否已安装

echo "=========================================="
echo "检查微信开发者工具安装状态"
echo "=========================================="
echo ""

# 查找可能的安装位置
INSTALL_PATHS=(
    "/Applications/微信web开发者工具.app"
    "/Applications/wechatwebdevtools.app"
    "/Applications/WeChatWebDevtools.app"
)

FOUND=false

for path in "${INSTALL_PATHS[@]}"; do
    if [ -d "$path" ]; then
        echo "✅ 找到微信开发者工具！"
        echo "   位置: $path"
        echo ""
        FOUND=true
        
        # 获取版本信息（如果可能）
        if [ -f "$path/Contents/Info.plist" ]; then
            VERSION=$(defaults read "$path/Contents/Info.plist" CFBundleShortVersionString 2>/dev/null)
            if [ -n "$VERSION" ]; then
                echo "   版本: $VERSION"
            fi
        fi
        
        echo ""
        echo "🚀 可以运行以下命令打开："
        echo "   open -a '微信web开发者工具'"
        echo ""
        echo "📁 或者直接打开项目："
        echo "   open -a '微信web开发者工具' --args --project '$(pwd)'"
        echo ""
        break
    fi
done

if [ "$FOUND" = false ]; then
    echo "❌ 未找到微信开发者工具"
    echo ""
    echo "请按照以下步骤安装："
    echo "1. 访问: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
    echo "2. 下载 macOS 版本"
    echo "3. 安装到应用程序文件夹"
    echo ""
    echo "或者运行: ./快速安装.sh"
fi

echo "=========================================="

