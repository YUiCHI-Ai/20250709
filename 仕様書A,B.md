# 希少体験おねだりリスト - 実装仕様書

## 概要
希少体験おねだりリストは、行きたいレストランをリスト化し、そのリストを共有URLで他の人に送ることができるWebアプリケーションです。

## 作業分担概要
- **Aさん**: フロントエンド（UI/表示系）担当
- **Bさん**: ロジック/データ処理担当

両者は独立して作業可能で、最後に結合します。

## 実装方式
単一HTMLファイル（index.html）として実装し、即座にデモ可能な形式とします。

---

## Aさん用仕様書（フロントエンド担当）

### 担当範囲
HTMLとCSSのみを使用して、2つの画面のUIを作成

### 1. リスト作成画面 (create.html)
```html
<!-- 必要な要素 -->
- <input id="ownerNameInput" placeholder="あなたの名前を入力">
- <input id="restaurantName" placeholder="店名を入力">
- <div id="fireSelector">
    - 🔥ボタン5つ（data-fire-level="1"〜"5"）
    - クリックで選択状態をトグル
- <button id="addButton">リストに追加</button>
- <div id="currentList">現在のリスト表示エリア</div>
- <button id="generateUrlButton">共有URLを生成</button>
- <div id="copyUrlArea" style="display:none;">
    - <input id="shareUrlInput" readonly>
    - <button id="copyButton">URLをコピー</button>
</div>
```

### 2. 共有画面 (share.html)
```html
<!-- 必要な要素 -->
- <h1 id="ownerName">〇〇さんの行きたいお店リスト</h1>
- <div id="restaurantList">
    各店舗は以下の形式：
    <div class="restaurant-item">
        <span class="fire-level">🔥🔥🔥</span>
        <span class="restaurant-name">店名</span>
    </div>
- <div id="shareUrl">URLコピーエリア</div>
```

### スタイル要件
```css
/* 最低限必要なCSS */
- モバイルファースト（max-width: 600px）
- 店舗リストは見やすく整列
- 🔥の選択状態を視覚的に表現
- ボタンは押しやすいサイズ（最小44px）
```

### Bさんとの連携ポイント
- 全てのインタラクティブ要素にIDを付ける
- データ属性（data-*）を使用してメタ情報を保持
- グローバルなJavaScript関数名は使わない

---

## Bさん用仕様書（ロジック担当）

### 担当範囲
JavaScriptのみを使用して、データ処理とインタラクションを実装

### 1. データ構造
```javascript
// リストデータの形式
const listData = {
    owner: "高宮さん",
    restaurants: [
        { name: "鮨さいとう", fireLevel: 5 },
        { name: "かんだ", fireLevel: 4 }
    ]
};
```

### 2. 必要な関数（app.js）

```javascript
// URLエンコード/デコード
function encodeListData(data) {
    // データをBase64エンコードしてURLセーフに
    return btoa(encodeURIComponent(JSON.stringify(data)));
}

function decodeListData(encoded) {
    // URLからデータを復元
    return JSON.parse(decodeURIComponent(atob(encoded)));
}

// リスト操作
function addRestaurant(name, fireLevel) {
    // 現在のリストに追加
    // DOMの更新はupdateListDisplay()を呼ぶ
}

function updateListDisplay() {
    // #currentListの内容を更新
}

function generateShareUrl() {
    // 現在のリストデータをURLに変換
    // 形式: https://domain.com/share.html?data=エンコードされたデータ
}

// 共有画面用
function loadSharedList() {
    // URLパラメータからデータを読み込み
    // #restaurantListに表示
}
```

### 3. イベントリスナー設定
```javascript
// DOMContentLoaded時に設定
- #addButton → addRestaurant()
- .fire-button → 選択状態の管理
- #generateUrlButton → generateShareUrl()
```

### Aさんとの連携ポイント
- DOM要素はIDで取得（getElementByIdを使用）
- CSSクラスの追加/削除でUIの状態を制御
- HTMLの構造は変更せず、内容のみ更新

---

## 統合手順（15分）

1. **Aさんの成果物**
   - create.html
   - share.html  
   - style.css

2. **Bさんの成果物**
   - app.js

3. **統合作業**
   ```html
   <!-- 両方のHTMLに追加 -->
   <link rel="stylesheet" href="style.css">
   <script src="app.js"></script>
   ```

4. **動作確認**
   - リスト作成 → URL生成 → 共有画面で表示


# 追加部分
現在の仕様では以下の点が不足しています：

## 追加が必要な仕様

### 1. ホスティング環境の指定
**問題**: URLを実際に共有するにはWebサーバーが必要

**追加仕様**:
- **第1推奨**: Netlify（無料・設定簡単・即時公開）
- **第2推奨**: CodePen（最も簡単・5分で共有URL取得）
- **第3推奨**: Vercel（無料・高性能・開発者向け）
- **緊急時**: JSFiddle（即座にテスト・共有可能）
- **外部サーバー不要**: URLエンコード方式（ローカルファイルでも動作）

### 2. 店舗URL機能の追加

**Aさんへの追加仕様**:
```html
<!-- リスト作成画面に追加 -->
<input id="restaurantUrl" placeholder="お店のURL（任意）">

<!-- 共有画面の店舗アイテムを更新 -->
<div class="restaurant-item">
    <span class="fire-level">🔥🔥🔥</span>
    <a class="restaurant-name" href="#" target="_blank">店名</a>
</div>
```

**Bさんへの追加仕様**:
```javascript
// データ構造を更新
const listData = {
    owner: "高宮さん",
    restaurants: [
        { 
            name: "鮨さいとう", 
            fireLevel: 5,
            url: "https://tabelog.com/..." // 追加
        }
    ]
};

// 関数の更新
function addRestaurant(name, fireLevel, url) {
    // URLも含めて保存
}
```

### 3. 単一ファイル版の作成（即座にデモ可能）

**統合版仕様（index.html）**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>希少体験おねだりリスト</title>
    <style>
        /* すべてのCSSをここに */
    </style>
</head>
<body>
    <div id="app">
        <!-- 作成画面と共有画面を切り替え表示 -->
    </div>
    <script>
        // すべてのJavaScriptをここに
        // URLのハッシュ部分でデータを管理
        // #create または #share?data=xxx で画面切り替え
    </script>
</body>
</html>
```

### 4. デモ用の即時動作仕様

**URL形式**:
```
作成画面: index.html#create
共有画面: index.html#share?data=エンコードされたデータ
```

**これにより**:
- ファイルをブラウザで開くだけで動作
- URLをコピペして他の人に共有可能
- Netlify/CodePen/Vercelにアップすれば世界中から閲覧可能
- QRコード生成機能でモバイル共有も簡単

### 5. 作業分担の更新

**Aさん**: 
- 単一HTMLファイルの骨組み作成
- CSS部分の実装

**Bさん**:
- JavaScript部分の実装
- URL処理とハッシュ変更の検知
- データのエンコード/デコード処理
- 画面切り替えロジック

この仕様追加により、1時間以内に完全に動作するデモが作成可能です。

## 最終成果物

### ファイル構成
```
index.html  # 単一ファイルで全機能を実装
```

### 機能一覧
1. **リスト作成機能**
   - 店名入力
   - 🔥レベル選択（1-5）
   - 店舗URL入力（オプション）
   - リストへの追加
   - 現在のリスト表示

2. **共有機能**
   - 共有URL生成
   - URLのコピー機能

3. **共有画面表示機能**
   - リスト所有者名の表示
   - 店舗リストの表示（🔥レベル付き）
   - 店舗URLへのリンク（存在する場合）

### 技術仕様
- **フレームワーク**: 使用しない（純粋なHTML/CSS/JavaScript）
- **データ永続化**: URLパラメータに保存
- **文字エンコーディング**: UTF-8
- **対応ブラウザ**: モダンブラウザ（Chrome, Firefox, Safari, Edge）

### エラーハンドリング
1. **入力検証**
   - 店名が空の場合はアラート表示
   - 🔥レベルが選択されていない場合はデフォルト値（3）を使用
   - オーナー名が空の場合は「名無しさん」をデフォルト値とする

2. **URL処理**
   - 不正なURLパラメータの場合はエラーメッセージ表示
   - デコード失敗時は作成画面にリダイレクト

### ユーザビリティ向上
1. **視覚的フィードバック**
   - ボタンクリック時のアニメーション
   - 追加成功時の確認メッセージ
   - コピー成功時の通知

2. **レスポンシブ対応**
   - スマートフォン、タブレット、デスクトップ対応
   - タッチデバイスでの操作性確保
