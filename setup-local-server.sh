#!/bin/bash

# 希少体験おねだりリスト - ローカルサーバー自動設定スクリプト

echo "🚀 希少体験おねだりリスト - ローカルサーバー設定"
echo "================================================"

# 現在のディレクトリを確認
CURRENT_DIR=$(pwd)
echo "📁 現在のディレクトリ: $CURRENT_DIR"

# IPアドレスを取得
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "🌐 ローカルIPアドレス: $LOCAL_IP"

# ポート使用状況をチェック
echo "📊 ポート使用状況チェック中..."
AVAILABLE_PORT=""
for port in 8000 8001 8080 3000 5000; do
    if ! lsof -i :$port > /dev/null 2>&1; then
        AVAILABLE_PORT=$port
        break
    fi
done

if [ -z "$AVAILABLE_PORT" ]; then
    echo "❌ 使用可能なポートが見つかりません"
    exit 1
fi

echo "✅ 使用可能ポート: $AVAILABLE_PORT"

# サーバー起動オプションを表示
echo ""
echo "🎯 サーバー起動オプション:"
echo "1. Python簡易サーバー（推奨）"
echo "2. Node.js Express サーバー"
echo "3. 自動ブラウザ起動付きPythonサーバー"

read -p "選択してください (1-3): " choice

case $choice in
    1)
        echo "🐍 Python簡易サーバーを起動します..."
        echo "📍 アクセス方法:"
        echo "   ローカル: http://localhost:$AVAILABLE_PORT"
        echo "   外部: http://$LOCAL_IP:$AVAILABLE_PORT"
        echo ""
        echo "🛑 停止するには Ctrl+C を押してください"
        echo ""
        python3 -m http.server $AVAILABLE_PORT
        ;;
    2)
        echo "🟢 Node.js Express サーバーを起動します..."
        if ! command -v node &> /dev/null; then
            echo "❌ Node.js がインストールされていません"
            echo "https://nodejs.org/ からインストールしてください"
            exit 1
        fi
        
        if [ ! -f "package.json" ]; then
            echo "📦 package.json が見つかりません。依存関係をインストールしています..."
            npm install express
        fi
        
        echo "📍 アクセス方法:"
        echo "   ローカル: http://localhost:3000"
        echo "   外部: http://$LOCAL_IP:3000"
        echo ""
        node server.js
        ;;
    3)
        echo "🐍 自動ブラウザ起動付きPythonサーバーを起動します..."
        echo "📍 アクセス方法:"
        echo "   ローカル: http://localhost:$AVAILABLE_PORT"
        echo "   外部: http://$LOCAL_IP:$AVAILABLE_PORT"
        echo ""
        python3 start-server.py
        ;;
    *)
        echo "❌ 無効な選択です"
        exit 1
        ;;
esac