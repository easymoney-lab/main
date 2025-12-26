#!/bin/bash

# 体验版问题检查脚本

echo "=========================================="
echo "体验版问题诊断"
echo "=========================================="
echo ""

ERRORS=0
WARNINGS=0

# 检查权限配置
echo "1️⃣ 检查权限配置..."
if grep -q "scope.userLocation" app.json; then
    echo "   ✅ 位置权限已配置"
else
    echo "   ⚠️  警告：未找到位置权限配置"
    WARNINGS=$((WARNINGS + 1))
fi

# 检查页面配置
echo ""
echo "2️⃣ 检查页面配置..."
REQUIRED_PAGES=("pages/index/index" "pages/add/add" "pages/detail/detail" "pages/settings/settings")
for page in "${REQUIRED_PAGES[@]}"; do
    if grep -q "\"$page\"" app.json; then
        echo "   ✅ $page 已配置"
    else
        echo "   ❌ 错误：$page 未配置"
        ERRORS=$((ERRORS + 1))
    fi
done

# 检查文件完整性
echo ""
echo "3️⃣ 检查文件完整性..."
for page in "${REQUIRED_PAGES[@]}"; do
    page_dir=$(dirname "$page")
    page_name=$(basename "$page")
    
    if [ -f "$page_dir/$page_name.js" ] && [ -f "$page_dir/$page_name.wxml" ]; then
        echo "   ✅ $page 文件完整"
    else
        echo "   ❌ 错误：$page 文件不完整"
        ERRORS=$((ERRORS + 1))
    fi
done

# 检查工具文件
echo ""
echo "4️⃣ 检查工具文件..."
if [ -f "utils/util.js" ]; then
    echo "   ✅ utils/util.js 存在"
    
    # 检查关键函数
    if grep -q "saveTrip" utils/util.js && grep -q "getTrips" utils/util.js; then
        echo "   ✅ 关键函数存在"
    else
        echo "   ⚠️  警告：关键函数可能缺失"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "   ❌ 错误：utils/util.js 不存在"
    ERRORS=$((ERRORS + 1))
fi

# 检查定位功能
echo ""
echo "5️⃣ 检查定位功能..."
if grep -q "chooseLocation\|getLocation" pages/add/add.js; then
    echo "   ✅ 定位功能代码存在"
else
    echo "   ⚠️  警告：定位功能代码可能缺失"
    WARNINGS=$((WARNINGS + 1))
fi

# 检查调试模式
echo ""
echo "6️⃣ 检查调试模式..."
if grep -q "return false" app.js | grep -q "isDebugMode"; then
    echo "   ✅ 调试模式已关闭（适合发布）"
else
    DEBUG_COUNT=$(grep -c "return true" app.js | grep -c "isDebugMode" || echo "0")
    if [ "$DEBUG_COUNT" -gt 0 ]; then
        echo "   ⚠️  警告：调试模式可能未关闭"
        WARNINGS=$((WARNINGS + 1))
    fi
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
    echo "✅ 代码检查通过"
    echo ""
    echo "如果体验版仍有问题，请检查："
    echo "1. 体验版版本是否最新"
    echo "2. 体验者是否正确添加"
    echo "3. 体验者手机权限设置"
    echo "4. 查看具体错误信息"
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  有警告，但不影响基本功能"
    echo ""
    echo "建议修复警告后再测试"
else
    echo "❌ 发现错误，请修复后再测试"
    echo ""
    echo "请修复上述错误后重新上传体验版"
fi

echo ""
echo "详细排查步骤请查看：体验版问题排查.md"

