#!/bin/bash

# セキュリティ設定スクリプト

echo "🔒 ローカルサーバー - セキュリティ設定"
echo "===================================="

# macOSファイアウォール設定
echo "🛡️  macOSファイアウォール設定中..."

# ファイアウォールの現在の状態を確認
firewall_status=$(sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate)
echo "現在のファイアウォール状態: $firewall_status"

# ファイアウォール有効化
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# Python3の通信を許可
echo "🐍 Python3の通信を許可中..."
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/bin/python3
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock /usr/bin/python3

# Node.jsの通信を許可（インストールされている場合）
if command -v node &> /dev/null; then
    echo "🟢 Node.jsの通信を許可中..."
    NODE_PATH=$(which node)
    sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add "$NODE_PATH"
    sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock "$NODE_PATH"
fi

# ステルスモードを有効化（pingに応答しない）
echo "👻 ステルスモードを有効化中..."
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on

# ログを有効化
echo "📋 ファイアウォールログを有効化中..."
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setloggingmode on

echo "✅ セキュリティ設定完了"
echo ""
echo "📋 推奨事項:"
echo "1. 外部公開時は信頼できるネットワークでのみ使用してください"
echo "2. 重要な情報は含めないでください"
echo "3. 使用後はサーバーを停止してください"
echo "4. 定期的にアクセスログを確認してください"
echo ""
echo "🔍 ファイアウォール設定確認:"
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getstealthmode
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getloggingmode