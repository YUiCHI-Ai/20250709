#!/usr/bin/env python3
"""
希少体験おねだりリスト - Python HTTPサーバー
簡単にローカルサーバーを起動するスクリプト
"""

import http.server
import socketserver
import socket
import webbrowser
import threading
import time
import os
import sys
from datetime import datetime

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """カスタムHTTPリクエストハンドラー"""
    
    def log_message(self, format, *args):
        """アクセスログをカスタマイズ"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        client_ip = self.client_address[0]
        print(f"[{timestamp}] {client_ip} - {format % args}")
    
    def end_headers(self):
        """セキュリティヘッダーを追加"""
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def get_local_ip():
    """ローカルIPアドレスを取得"""
    try:
        # ダミーのUDP接続でローカルIPを取得
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
        return local_ip
    except:
        return "localhost"

def check_port_available(port):
    """ポートが使用可能かチェック"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('', port))
            return True
    except:
        return False

def find_available_port(start_port=8000):
    """使用可能なポートを検索"""
    for port in range(start_port, start_port + 100):
        if check_port_available(port):
            return port
    return None

def open_browser(url, delay=2):
    """ブラウザを遅延して開く"""
    time.sleep(delay)
    webbrowser.open(url)

def main():
    """メイン関数"""
    print("🚀 希少体験おねだりリスト - Pythonサーバー")
    print("=" * 50)
    
    # 作業ディレクトリを設定
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # 使用可能なポートを探す
    port = find_available_port(8000)
    if not port:
        print("❌ 使用可能なポートが見つかりません")
        sys.exit(1)
    
    local_ip = get_local_ip()
    
    print(f"📁 サーバーディレクトリ: {script_dir}")
    print(f"🌐 ポート: {port}")
    print()
    
    # HTTPサーバーを作成
    try:
        with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
            print("✅ サーバーが起動しました！")
            print()
            print("📍 アクセス方法:")
            print(f"   ローカル: http://localhost:{port}")
            print(f"   同一ネットワーク: http://{local_ip}:{port}")
            print()
            print("🛑 サーバーを停止するには: Ctrl+C")
            print()
            print("📋 アクセスログ:")
            
            # ブラウザを自動で開く
            browser_thread = threading.Thread(
                target=open_browser, 
                args=(f"http://localhost:{port}",)
            )
            browser_thread.daemon = True
            browser_thread.start()
            
            # サーバーを起動
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n")
        print("🛑 サーバーを停止しています...")
        print("✅ サーバーが正常に停止しました")
    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()