# URL発行・QR生成対応 - 設計書

## 1. 要件概要

### 1.1 追加要件
- 実際にURLを発行して動作可能にする
- QRコード生成機能を追加
- インターネット経由でアクセス可能なURL構築

### 1.2 対応範囲
- GitHub Pages によるホスティング設定
- QRコード生成機能の実装
- 実際のURL発行・共有機能の実装

## 2. アーキテクチャ設計

### 2.1 ホスティング環境
- **サービス**: GitHub Pages
- **URL形式**: `https://username.github.io/repository-name/`
- **デプロイ方法**: GitHub Actions (自動デプロイ)

### 2.2 QRコード生成システム
- **ライブラリ**: qrcode.js (CDN)
- **生成タイミング**: 共有URL生成時
- **表示方法**: 画面内にQRコード表示
- **ダウンロード**: QRコード画像のダウンロード機能

### 2.3 URL構成
```
Base URL: https://username.github.io/repository-name/
作成画面: https://username.github.io/repository-name/#create
共有画面: https://username.github.io/repository-name/#share?data=encodedData
```

## 3. 機能設計

### 3.1 QRコード生成機能

#### 3.1.1 UI要素
```html
<!-- 共有URL生成後に表示 -->
<div id="qrCodeArea" style="display: none;">
    <h3>QRコード</h3>
    <div id="qrCodeContainer"></div>
    <button id="downloadQrButton">QRコードをダウンロード</button>
</div>
```

#### 3.1.2 JavaScript機能
```javascript
// QRコード生成関数
function generateQRCode(url) {
    const qrContainer = document.getElementById('qrCodeContainer');
    qrContainer.innerHTML = '';
    
    const qr = qrcode(0, 'M');
    qr.addData(url);
    qr.make();
    
    qrContainer.innerHTML = qr.createImgTag(5);
}

// QRコードダウンロード機能
function downloadQRCode() {
    const qrImg = document.querySelector('#qrCodeContainer img');
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrImg.src;
    link.click();
}
```

### 3.2 GitHub Pages対応

#### 3.2.1 必要ファイル
- `index.html` (既存)
- `.github/workflows/pages.yml` (GitHub Actions設定)
- `README.md` (更新)

#### 3.2.2 GitHub Actions設定
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Pages
      uses: actions/configure-pages@v2
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v1
      with:
        path: '.'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v1
```

## 4. 実装仕様

### 4.1 index.html への追加実装

#### 4.1.1 CDN追加
```html
<!-- QRコード生成ライブラリ -->
<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
```

#### 4.1.2 CSS追加
```css
.qr-section {
    margin-top: 20px;
    padding: 20px;
    border: 2px solid #4ECDC4;
    border-radius: 8px;
    background: white;
    text-align: center;
}

.qr-section h3 {
    color: #4ECDC4;
    margin-bottom: 15px;
}

#qrCodeContainer {
    margin: 15px 0;
}

#downloadQrButton {
    background-color: #4ECDC4;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}
```

#### 4.1.3 HTML構造追加
```html
<!-- generateUrlButton の後に追加 -->
<div id="qrCodeArea" class="qr-section" style="display: none;">
    <h3>QRコード</h3>
    <div id="qrCodeContainer"></div>
    <button id="downloadQrButton">QRコードをダウンロード</button>
</div>
```

#### 4.1.4 JavaScript機能追加
```javascript
// generateShareUrl関数を拡張
function generateShareUrl() {
    if (listData.restaurants.length === 0) {
        showError('リストが空です');
        return;
    }
    
    const encoded = encodeListData(listData);
    const shareUrl = `${window.location.origin}${window.location.pathname}#share?data=${encoded}`;
    
    document.getElementById('shareUrlInput').value = shareUrl;
    document.getElementById('copyUrlArea').style.display = 'block';
    
    // QRコード生成
    generateQRCode(shareUrl);
    document.getElementById('qrCodeArea').style.display = 'block';
}

// QRコード生成関数
function generateQRCode(url) {
    const qrContainer = document.getElementById('qrCodeContainer');
    qrContainer.innerHTML = '';
    
    QRCode.toCanvas(qrContainer, url, {
        width: 200,
        height: 200,
        margin: 2,
        color: {
            dark: '#2C3E50',
            light: '#FFFFFF'
        }
    }, function (error) {
        if (error) {
            console.error(error);
            showError('QRコードの生成に失敗しました');
        } else {
            showSuccess('QRコードを生成しました');
        }
    });
}

// QRコードダウンロード機能
function downloadQRCode() {
    const canvas = document.querySelector('#qrCodeContainer canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = 'wishlist-qrcode.png';
        link.href = canvas.toDataURL();
        link.click();
        showSuccess('QRコードをダウンロードしました');
    }
}
```

## 5. セキュリティ設計

### 5.1 GitHub Pages セキュリティ
- HTTPS 強制
- CSP (Content Security Policy) 設定
- 外部リソースの制限

### 5.2 QRコード セキュリティ
- URL検証機能
- 悪意のあるURL検出
- サイズ制限

## 6. パフォーマンス設計

### 6.1 QRコード生成最適化
- 非同期処理
- キャッシュ機能
- サイズ最適化

### 6.2 GitHub Pages最適化
- 静的ファイル配信
- CDN利用
- 画像最適化

## 7. 運用設計

### 7.1 デプロイメント
- GitHub Actions による自動デプロイ
- PRレビュー必須
- ステージング環境

### 7.2 監視・メンテナンス
- GitHub Pages ステータス監視
- 外部CDN可用性監視
- 定期的なセキュリティアップデート

## 8. 制約事項

### 8.1 GitHub Pages制約
- 静的サイトのみ
- 100GB ストレージ制限
- 月100GB帯域制限

### 8.2 QRコード制約
- URL長さ制限（2083文字）
- 読み取り精度
- モバイル端末対応

## 9. 今後の拡張性

### 9.1 追加機能候補
- カスタムQRコードデザイン
- 分析機能
- ソーシャル共有機能

### 9.2 技術的拡張
- PWA対応
- オフライン機能
- プッシュ通知