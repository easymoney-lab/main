#!/bin/bash

# 发布前检查脚本

echo "=========================================="
echo "微信小程序发布前检查"
echo "=========================================="
echo ""

ERRORS=0
WARNINGS=0

# 检查调试模式
echo "1️⃣ 检查调试模式..."
DEBUG_IN_APP=$(grep -n "return true" app.js | grep -i "debug\|isDebugMode" | wc -l | tr -d ' ')
DEBUG_IN_UTIL=$(grep -n "const DEBUG = true" utils/util.js | wc -l | tr -d ' ')

if [ "$DEBUG_IN_APP" -gt 0 ] || [ "$DEBUG_IN_UTIL" -gt 0 ]; then
    echo "   ⚠️  警告：调试模式未关闭"
    echo "   请将 app.js 中的 isDebugMode() 返回 false"
    echo "   请将 utils/util.js 中的 DEBUG 设为 false"
    WARNINGS=$((WARNINGS + 1))
else
    echo "   ✅ 调试模式已关闭"
fi

# 检查 AppID
echo ""
echo "2️⃣ 检查 AppID 配置..."
APPID=$(grep -o '"appid": "[^"]*"' project.config.json | cut -d'"' -f4)
if [ "$APPID" = "touristappid" ] || [ -z "$APPID" ]; then
    echo "   ⚠️  警告：使用的是测试 AppID"
    echo "   正式发布需要注册小程序账号并配置真实 AppID"
    WARNINGS=$((WARNINGS + 1))
else
    echo "   ✅ AppID 已配置: $APPID"
fi

# 检查必要文件
echo ""
echo "3️⃣ 检查必要文件..."
REQUIRED_FILES=("app.js" "app.json" "app.wxss" "sitemap.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file 存在"
    else
        echo "   ❌ 错误：$file 不存在"
        ERRORS=$((ERRORS + 1))
    fi
done

# 检查页面文件
echo ""
echo "4️⃣ 检查页面文件..."
PAGES=("pages/index" "pages/add" "pages/detail" "pages/settings")
for page in "${PAGES[@]}"; do
    if [ -d "$page" ]; then
        if [ -f "$page/index.js" ] || [ -f "$page/add.js" ] || [ -f "$page/detail.js" ] || [ -f "$page/settings.js" ]; then
            echo "   ✅ $page 页面完整"
        else
            echo "   ❌ 错误：$page 页面文件不完整"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo "   ❌ 错误：$page 目录不存在"
        ERRORS=$((ERRORS + 1))
    fi
done

# 检查工具文件
echo ""
echo "5️⃣ 检查工具文件..."
if [ -f "utils/util.js" ]; then
    echo "   ✅ utils/util.js 存在"
else
    echo "   ❌ 错误：utils/util.js 不存在"
    ERRORS=$((ERRORS + 1))
fi

# 总结
echo ""
echo "=========================================="
echo "检查完成"
echo "=========================================="
echo "错误数量: $ERRORS"
echo "警告数量: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ 所有检查通过，可以准备发布！"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  有警告，建议修复后再发布"
    exit 0
else
    echo "❌ 发现错误，请修复后再发布"
    exit 1
fi

