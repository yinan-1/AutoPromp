#!/bin/zsh -l

# ^ 使用 -l (login) 模式，强制加载用户的 .zshrc / .bash_profile 等配置

# 切换到脚本所在的目录
cd "$(dirname "$0")"

echo "=========================================="
echo "   正在启动 Concept Art Prompt Generator   "
echo "=========================================="

# 尝试手动加载 nvm (如果存在)
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi

# 检查 npm 是否可用
if ! command -v npm &> /dev/null; then
    echo "❌ 严重错误: 仍然无法找到 'npm' 命令。"
    echo ""
    echo "-----------------------------------------------------"
    echo "【排查指南】"
    echo "1. 请确认您是否已安装 Node.js？"
    echo "   - 如果没有安装，请访问官网下载安装： https://nodejs.org/"
    echo "   - 推荐下载 'LTS' (长期支持) 版本。"
    echo ""
    echo "2. 如果您确定已经安装 (例如在终端能运行 node -v)："
    echo "   - 请尝试直接打开终端，拖入此文件夹，然后输入："
    echo "     cd \"$(pwd)\" && npm install && npm run dev"
    echo "-----------------------------------------------------"
    
    # 保持窗口打开
    read -k 1 -s -r "?按任意键退出..."
    exit 1
fi

echo "✅ 环境检查通过: Using Node $(node -v)"

# 修复 npm 缓存权限问题（如果存在）
if [ -d "$HOME/.npm" ]; then
    if [ ! -w "$HOME/.npm/_cacache" ] 2>/dev/null; then
        echo "🔧 检测到 npm 缓存权限问题，正在修复..."
        sudo chown -R $(id -u):$(id -g) "$HOME/.npm" 2>/dev/null || true
    fi
fi

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖 (首次运行可能需要几分钟)..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败。"
        echo "💡 尝试清理缓存后重新安装..."
        rm -rf node_modules package-lock.json
        npm cache clean --force 2>/dev/null || true
        npm install
        if [ $? -ne 0 ]; then
            echo "❌ 依赖安装仍然失败。请检查网络或手动运行: npm install"
            read -k 1 -s -r "?按任意键退出..."
            exit 1
        fi
    fi
fi

echo "🚀 正在启动服务..."
echo "------------------------------------------"

# 启动开发服务器（后台运行）
npm run dev &
NPM_PID=$!

# 等待服务启动并检查端口
echo "⏳ 等待服务启动..."
for i in {1..15}; do
    sleep 1
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "✅ 服务启动成功！"
        break
    fi
    if ! kill -0 $NPM_PID 2>/dev/null; then
        echo "❌ 服务启动失败。"
        echo "💡 可能是依赖问题，正在尝试重新安装..."
        rm -rf node_modules package-lock.json
        npm install
        if [ $? -eq 0 ]; then
            echo "🔄 重新启动服务..."
            npm run dev &
            NPM_PID=$!
            sleep 3
        else
            echo "❌ 无法修复。请手动检查错误。"
            read -k 1 -s -r "?按任意键退出..."
            exit 1
        fi
    fi
done

# 自动打开浏览器
echo "🌐 正在打开浏览器..."
open http://localhost:5173

# 等待用户查看输出
echo ""
echo "✅ 服务已启动！浏览器应该已经打开。"
echo "📌 本地地址: http://localhost:5173"
echo ""
echo "💡 提示: 关闭此窗口将停止服务"
echo "------------------------------------------"

# 等待后台进程
wait
