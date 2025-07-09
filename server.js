const express = require('express');
const path = require('path');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルを提供
app.use(express.static(__dirname));

// セキュリティヘッダー設定
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
});

// ルートアクセス時にindex.htmlを返す
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API エンドポイント（将来的な拡張用）
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        server: 'local-wishlist-server'
    });
});

// IPアドレス取得関数
function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // IPv4 かつ 内部アドレスでない場合
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// サーバー起動
app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIpAddress();
    console.log('🚀 希少体験おねだりリスト サーバーが起動しました！');
    console.log('');
    console.log('📍 アクセス方法:');
    console.log(`   ローカル: http://localhost:${PORT}`);
    console.log(`   同一ネットワーク: http://${localIP}:${PORT}`);
    console.log('');
    console.log('🛑 サーバーを停止するには: Ctrl+C');
    console.log('');
    console.log('📋 ログ:');
});

// アクセスログ
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleString('ja-JP');
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${clientIP}`);
    next();
});

// エラーハンドリング
app.use((err, req, res, next) => {
    console.error('エラーが発生しました:', err.message);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

// 404エラー
app.use((req, res) => {
    res.status(404).json({ error: 'ページが見つかりません' });
});

// graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 サーバーを停止しています...');
    server.close(() => {
        console.log('✅ サーバーが正常に停止しました');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🛑 サーバーを停止しています...');
    process.exit(0);
});