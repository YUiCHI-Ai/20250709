# URL発行・QR生成対応 - 実装ガイド

## 1. 実装手順概要

### 1.1 実装ステップ
1. GitHub リポジトリ作成・設定
2. GitHub Pages 有効化
3. QRコード生成機能実装
4. index.html の更新
5. GitHub Actions 設定
6. 動作確認・テスト

## 2. GitHub リポジトリ設定

### 2.1 新規リポジトリ作成
```bash
# GitHubでリポジトリを作成後、ローカルで実行
git init
git add .
git commit -m "Initial commit: 希少体験おねだりリスト"
git branch -M main
git remote add origin https://github.com/username/wishlist-app.git
git push -u origin main
```

### 2.2 GitHub Pages 有効化
1. GitHub リポジトリの Settings タブ
2. Pages セクションで Source を「GitHub Actions」に設定
3. Custom domain 設定（オプション）

## 3. QRコード機能実装

### 3.1 index.html への CDN 追加
```html
<!-- head タグ内に追加 -->
<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
```

### 3.2 CSS スタイル追加
```css
/* 既存スタイルに追加 */
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

#qrCodeContainer canvas {
    border: 1px solid #ddd;
    border-radius: 4px;
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

#downloadQrButton:hover {
    background-color: #3db3aa;
}
```

### 3.3 HTML 構造追加
```html
<!-- copyUrlArea の後に追加 -->
<div id="qrCodeArea" class="qr-section" style="display: none;">
    <h3>QRコード</h3>
    <div id="qrCodeContainer"></div>
    <button id="downloadQrButton">QRコードをダウンロード</button>
</div>
```

### 3.4 JavaScript 機能追加

#### 3.4.1 generateShareUrl 関数の更新
```javascript
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
```

#### 3.4.2 QRコード生成関数の追加
```javascript
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
```

#### 3.4.3 QRコードダウンロード機能の追加
```javascript
function downloadQRCode() {
    const canvas = document.querySelector('#qrCodeContainer canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.download = `wishlist-qrcode-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showSuccess('QRコードをダウンロードしました');
    } else {
        showError('QRコードが見つかりません');
    }
}
```

#### 3.4.4 イベントリスナーの追加
```javascript
// setupCreateViewListeners 関数内に追加
function setupCreateViewListeners() {
    // 既存のイベントリスナー...
    
    // QRコードダウンロードボタン
    const downloadQrButton = document.getElementById('downloadQrButton');
    if (downloadQrButton) {
        downloadQrButton.addEventListener('click', downloadQRCode);
    }
}
```

## 4. GitHub Actions 設定

### 4.1 ワークフローファイル作成
```yaml
# .github/workflows/pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Pages
      uses: actions/configure-pages@v3
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: '.'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

### 4.2 リポジトリ権限設定
1. Settings > Actions > General
2. "Read and write permissions" を選択
3. "Allow GitHub Actions to create and approve pull requests" を有効化

## 5. 完全な実装ファイル

### 5.1 更新された index.html
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>希少体験おねだりリスト</title>
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    <style>
        /* 既存のCSSスタイル... */
        
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

        #qrCodeContainer canvas {
            border: 1px solid #ddd;
            border-radius: 4px;
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

        #downloadQrButton:hover {
            background-color: #3db3aa;
        }
    </style>
</head>
<body>
    <div id="app">
        <!-- 動的にコンテンツを挿入 -->
    </div>

    <script>
        // 既存のJavaScriptコード...
        
        // 更新された generateShareUrl 関数
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
                link.download = `wishlist-qrcode-${new Date().getTime()}.png`;
                link.href = canvas.toDataURL();
                link.click();
                showSuccess('QRコードをダウンロードしました');
            } else {
                showError('QRコードが見つかりません');
            }
        }
        
        // 更新された setupCreateViewListeners 関数
        function setupCreateViewListeners() {
            // 既存のイベントリスナー...
            
            // QRコードダウンロードボタン
            const downloadQrButton = document.getElementById('downloadQrButton');
            if (downloadQrButton) {
                downloadQrButton.addEventListener('click', downloadQRCode);
            }
        }
    </script>
</body>
</html>
```

## 6. デプロイメント手順

### 6.1 初回デプロイ
```bash
# 変更をコミット
git add .
git commit -m "Add QR code generation and GitHub Pages support"
git push origin main
```

### 6.2 デプロイ確認
1. GitHub Actions タブで実行状況を確認
2. Pages 設定で公開URLを確認
3. 公開URLにアクセスして動作確認

## 7. 動作確認項目

### 7.1 基本機能確認
- [ ] リスト作成機能
- [ ] 共有URL生成機能
- [ ] QRコード生成機能
- [ ] QRコードダウンロード機能
- [ ] 共有画面表示機能

### 7.2 QRコード確認
- [ ] QRコード読み取り（スマートフォン）
- [ ] 正しいURLに遷移
- [ ] 画像ダウンロード機能
- [ ] 異なるデバイスでの表示確認

### 7.3 エラーハンドリング確認
- [ ] QRコード生成失敗時の処理
- [ ] ダウンロード失敗時の処理
- [ ] 不正なURLでの動作

## 8. トラブルシューティング

### 8.1 GitHub Pages 関連
- デプロイ失敗: Actions の権限設定を確認
- 404エラー: リポジトリの公開設定を確認
- SSL証明書エラー: 時間をおいて再試行

### 8.2 QRコード 関連
- 生成失敗: CDNの読み込み状況を確認
- 読み取り不可: URL長さを確認
- ダウンロード失敗: ブラウザのファイル許可設定を確認

## 9. 最適化・改善

### 9.1 パフォーマンス最適化
- QRコード生成のキャッシュ化
- 非同期処理の活用
- 画像圧縮の実装

### 9.2 ユーザビリティ改善
- QRコードサイズ調整機能
- カスタムファイル名設定
- 共有機能の拡張