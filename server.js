const express = require('express');
const path = require('path');
const os = require('os');
const qrcode = require('qrcode');
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

// QRコード生成エンドポイント
app.get('/api/qr', async (req, res) => {
    try {
        const localIP = getLocalIpAddress();
        const url = `http://${localIP}:${PORT}`;
        const qrCodeDataURL = await qrcode.toDataURL(url, {
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        res.json({
            url: url,
            qrCode: qrCodeDataURL,
            message: '同一ネットワークの他の端末からアクセスできます'
        });
    } catch (error) {
        res.status(500).json({ error: 'QRコード生成に失敗しました' });
    }
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
const server = app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIpAddress();
    console.log('🚀 希少体験おねだりリスト サーバーが起動しました！');
    console.log('');
    console.log('📍 アクセス方法:');
    console.log(`   ローカル: http://localhost:${PORT}`);
    console.log(`   同一ネットワーク: http://${localIP}:${PORT}`);
    console.log('');
    console.log('💡 他の端末からのアクセス方法:');
    console.log(`   1. 同一Wi-Fiネットワークに接続`);
    console.log(`   2. ブラウザで http://${localIP}:${PORT} にアクセス`);
    console.log(`   3. QRコード: http://${localIP}:${PORT}/api/qr`);
    console.log('');
    console.log('🔧 ファイアウォール設定:');
    console.log('   macOS: システム環境設定 > セキュリティとプライバシー > ファイアウォール');
    console.log(`   ポート ${PORT} の受信接続を許可してください`);
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