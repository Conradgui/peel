#!/bin/bash
# 自动切换到当前脚本所在的根目录
CWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$CWD"

echo "=================================================="
echo "      🍊 Peel - 可视化时间追踪器 启动助手 🍊"
echo "=================================================="
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 本地未检测到 Node.js，请先前往官网下载并安装: https://nodejs.org"
    echo "安装完成后，重新双击此脚本即可。"
    echo ""
    echo "按任意键退出..."
    read -n 1
    exit 1
fi

# 检查 pnpm 是否安装，如果没有，使用 npx pnpm 代替
PM="pnpm"
if ! command -v pnpm &> /dev/null; then
    echo "⚠️ 提示: 未检测到 pnpm，将使用 Node.js 自带的 npx 执行..."
    PM="npx pnpm"
fi

# 检查 node_modules 是否存在，若不存在则安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次启动，正在为您安装项目所需的依赖包，请稍候..."
    $PM install
    if [ $? -ne 0 ]; then
        echo "❌ 错误: 依赖安装失败，请检查网络连接后重试。"
        echo "按任意键退出..."
        read -n 1
        exit 1
    fi
    echo "✅ 依赖安装完成！"
    echo ""
fi

echo "🚀 正在为您启动 Peel 专注时钟..."
# 延迟 3 秒待服务器加载后，自动在浏览器中打开地址
(sleep 3 && open "http://localhost:3000") &

# 运行本地服务
$PM dev
