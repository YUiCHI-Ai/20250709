# Netlify対応_実装ガイド

## 実装手順

### Phase 1: 基本構造作成（15分）

#### 1.1 index.html基本構造
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>希少体験おねだりリスト</title>
    <style>
        /* CSS統合エリア */
    </style>
</head>
<body>
    <div id="app">
        <div id="create-section">
            <!-- 作成画面 -->
        </div>
        <div id="share-section">
            <!-- 共有画面 -->
        </div>
    </div>
    <script>
        /* JavaScript統合エリア */
    </script>
</body>
</html>
```

#### 1.2 CSS基本スタイル
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Hiragino Sans', 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}

#app {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.section {
    background: white;
    border-radius: 10px;
    padding: 30px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.hidden {
    display: none;
}
```

### Phase 2: 作成画面実装（20分）

#### 2.1 作成画面HTML
```html
<div id="create-section" class="section">
    <h1>希少体験おねだりリスト</h1>
    
    <div class="form-group">
        <label for="ownerName">あなたの名前</label>
        <input type="text" id="ownerName" placeholder="名前を入力してください" />
    </div>
    
    <div class="form-group">
        <label for="restaurantName">店名</label>
        <input type="text" id="restaurantName" placeholder="店名を入力してください" />
    </div>
    
    <div class="form-group">
        <label for="restaurantUrl">店舗URL（任意）</label>
        <input type="url" id="restaurantUrl" placeholder="https://..." />
    </div>
    
    <div class="form-group">
        <label>希少度</label>
        <div id="fireSelector">
            <button type="button" class="fire-button" data-level="1">🔥</button>
            <button type="button" class="fire-button" data-level="2">🔥🔥</button>
            <button type="button" class="fire-button" data-level="3">🔥🔥🔥</button>
            <button type="button" class="fire-button" data-level="4">🔥🔥🔥🔥</button>
            <button type="button" class="fire-button" data-level="5">🔥🔥🔥🔥🔥</button>
        </div>
    </div>
    
    <button id="addButton" class="btn-primary">リストに追加</button>
    
    <div id="currentList">
        <!-- 現在のリスト表示 -->
    </div>
    
    <div id="shareUrlSection" class="hidden">
        <button id="generateUrlButton" class="btn-secondary">共有URLを生成</button>
        <div id="urlResult" class="hidden">
            <input type="text" id="shareUrlInput" readonly />
            <button id="copyButton" class="btn-copy">コピー</button>
            <div id="qrCode"></div>
        </div>
    </div>
</div>
```

#### 2.2 作成画面CSS
```css
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s;
}

.form-group input:focus {
    outline: none;
    border-color: #4CAF50;
}

#fireSelector {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.fire-button {
    background: #f0f0f0;
    border: 2px solid #ddd;
    border-radius: 25px;
    padding: 10px 15px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 44px;
}

.fire-button:hover {
    background: #e0e0e0;
}

.fire-button.selected {
    background: #FF6B6B;
    border-color: #FF6B6B;
    color: white;
}

.btn-primary, .btn-secondary, .btn-copy {
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 44px;
}

.btn-primary {
    background: #4CAF50;
    color: white;
}

.btn-primary:hover {
    background: #45a049;
}

.btn-secondary {
    background: #2196F3;
    color: white;
}

.btn-secondary:hover {
    background: #1976D2;
}

.btn-copy {
    background: #FF9800;
    color: white;
}

.btn-copy:hover {
    background: #F57C00;
}
```

### Phase 3: 共有画面実装（15分）

#### 3.1 共有画面HTML
```html
<div id="share-section" class="section hidden">
    <h1 id="shareTitle">〇〇さんの行きたいお店リスト</h1>
    
    <div id="restaurantList">
        <!-- 動的生成されるリスト -->
    </div>
    
    <div id="shareActions">
        <button id="backToCreate" class="btn-secondary">新しいリストを作成</button>
        <div id="shareUrlDisplay">
            <input type="text" id="currentShareUrl" readonly />
            <button id="copyShareUrl" class="btn-copy">URLをコピー</button>
        </div>
    </div>
</div>
```

#### 3.2 共有画面CSS
```css
.restaurant-item {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.restaurant-item .fire-level {
    font-size: 18px;
    min-width: 100px;
}

.restaurant-item .restaurant-name {
    flex: 1;
    font-weight: bold;
    text-decoration: none;
    color: #333;
}

.restaurant-item .restaurant-name:hover {
    color: #4CAF50;
}

#shareActions {
    margin-top: 30px;
    text-align: center;
}

#shareUrlDisplay {
    margin-top: 15px;
    display: flex;
    gap: 10px;
}

#shareUrlDisplay input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 3px;
}

#qrCode {
    margin-top: 15px;
    text-align: center;
}

#qrCode img {
    max-width: 200px;
    height: auto;
}
```

### Phase 4: JavaScript実装（30分）

#### 4.1 アプリ初期化
```javascript
let currentList = [];
let selectedFireLevel = 3;

// アプリ初期化
function initApp() {
    setupEventListeners();
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
}

// イベントリスナー設定
function setupEventListeners() {
    // 火レベル選択
    document.querySelectorAll('.fire-button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.fire-button').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedFireLevel = parseInt(e.target.dataset.level);
        });
    });
    
    // レストラン追加
    document.getElementById('addButton').addEventListener('click', addRestaurant);
    
    // URL生成
    document.getElementById('generateUrlButton').addEventListener('click', generateShareUrl);
    
    // コピー機能
    document.getElementById('copyButton').addEventListener('click', copyToClipboard);
    document.getElementById('copyShareUrl').addEventListener('click', copyShareUrl);
    
    // 戻るボタン
    document.getElementById('backToCreate').addEventListener('click', () => {
        window.location.hash = '#create';
    });
}
```

#### 4.2 データ処理機能
```javascript
// レストラン追加
function addRestaurant() {
    const name = document.getElementById('restaurantName').value.trim();
    const url = document.getElementById('restaurantUrl').value.trim();
    
    if (!name) {
        alert('店名を入力してください');
        return;
    }
    
    const restaurant = {
        name: name,
        fireLevel: selectedFireLevel,
        url: url || null
    };
    
    currentList.push(restaurant);
    updateCurrentListDisplay();
    
    // フォームリセット
    document.getElementById('restaurantName').value = '';
    document.getElementById('restaurantUrl').value = '';
    
    // 共有URLセクション表示
    if (currentList.length > 0) {
        document.getElementById('shareUrlSection').classList.remove('hidden');
    }
}

// 現在のリスト表示更新
function updateCurrentListDisplay() {
    const container = document.getElementById('currentList');
    container.innerHTML = '';
    
    currentList.forEach((restaurant, index) => {
        const item = document.createElement('div');
        item.className = 'restaurant-item';
        item.innerHTML = `
            <span class="fire-level">${'🔥'.repeat(restaurant.fireLevel)}</span>
            <span class="restaurant-name">${escapeHtml(restaurant.name)}</span>
            <button onclick="removeRestaurant(${index})" class="btn-remove">削除</button>
        `;
        container.appendChild(item);
    });
}

// レストラン削除
function removeRestaurant(index) {
    currentList.splice(index, 1);
    updateCurrentListDisplay();
    
    if (currentList.length === 0) {
        document.getElementById('shareUrlSection').classList.add('hidden');
    }
}
```

#### 4.3 URL生成・共有機能
```javascript
// 共有URL生成
function generateShareUrl() {
    const ownerName = document.getElementById('ownerName').value.trim() || '名無し';
    
    if (currentList.length === 0) {
        alert('まずはお店を追加してください');
        return;
    }
    
    const data = {
        owner: ownerName,
        restaurants: currentList,
        createdAt: new Date().toISOString()
    };
    
    const encoded = encodeShareData(data);
    const shareUrl = `${window.location.origin}${window.location.pathname}#share?data=${encoded}`;
    
    document.getElementById('shareUrlInput').value = shareUrl;
    document.getElementById('urlResult').classList.remove('hidden');
    
    // QRコード生成
    generateQRCode(shareUrl);
}

// データエンコード
function encodeShareData(data) {
    try {
        const json = JSON.stringify(data);
        return btoa(encodeURIComponent(json));
    } catch (error) {
        console.error('エンコードエラー:', error);
        return null;
    }
}

// データデコード
function decodeShareData(encoded) {
    try {
        return JSON.parse(decodeURIComponent(atob(encoded)));
    } catch (error) {
        console.error('デコードエラー:', error);
        return null;
    }
}

// QRコード生成
function generateQRCode(url) {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    const qrContainer = document.getElementById('qrCode');
    qrContainer.innerHTML = `<img src="${qrApiUrl}" alt="QRコード" />`;
}

// コピー機能
function copyToClipboard() {
    const input = document.getElementById('shareUrlInput');
    input.select();
    document.execCommand('copy');
    alert('URLをコピーしました！');
}

function copyShareUrl() {
    const input = document.getElementById('currentShareUrl');
    input.select();
    document.execCommand('copy');
    alert('URLをコピーしました！');
}
```

#### 4.4 画面遷移制御
```javascript
// URLハッシュ変更処理
function handleHashChange() {
    const hash = window.location.hash;
    
    if (hash.startsWith('#share')) {
        showShareView();
    } else {
        showCreateView();
    }
}

// 作成画面表示
function showCreateView() {
    document.getElementById('create-section').classList.remove('hidden');
    document.getElementById('share-section').classList.add('hidden');
    
    // デフォルトで火レベル3を選択
    document.querySelector('.fire-button[data-level="3"]').classList.add('selected');
}

// 共有画面表示
function showShareView() {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const data = urlParams.get('data');
    
    if (!data) {
        window.location.hash = '#create';
        return;
    }
    
    const listData = decodeShareData(data);
    if (!listData) {
        alert('データの読み込みに失敗しました');
        window.location.hash = '#create';
        return;
    }
    
    displaySharedList(listData);
    document.getElementById('create-section').classList.add('hidden');
    document.getElementById('share-section').classList.remove('hidden');
}

// 共有リスト表示
function displaySharedList(data) {
    document.getElementById('shareTitle').textContent = `${data.owner}さんの行きたいお店リスト`;
    
    const container = document.getElementById('restaurantList');
    container.innerHTML = '';
    
    data.restaurants.forEach(restaurant => {
        const item = document.createElement('div');
        item.className = 'restaurant-item';
        
        const nameElement = restaurant.url ? 
            `<a href="${restaurant.url}" target="_blank" class="restaurant-name">${escapeHtml(restaurant.name)}</a>` :
            `<span class="restaurant-name">${escapeHtml(restaurant.name)}</span>`;
        
        item.innerHTML = `
            <span class="fire-level">${'🔥'.repeat(restaurant.fireLevel)}</span>
            ${nameElement}
        `;
        container.appendChild(item);
    });
    
    // 現在のURL表示
    document.getElementById('currentShareUrl').value = window.location.href;
}

// HTMLエスケープ
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// アプリ開始
document.addEventListener('DOMContentLoaded', initApp);
```

### Phase 5: レスポンシブ対応（10分）

#### 5.1 モバイル対応CSS
```css
@media (max-width: 480px) {
    #app {
        padding: 10px;
    }
    
    .section {
        padding: 20px;
    }
    
    #fireSelector {
        flex-direction: column;
        gap: 5px;
    }
    
    .fire-button {
        width: 100%;
        justify-content: center;
    }
    
    #shareUrlDisplay {
        flex-direction: column;
    }
    
    .restaurant-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}

@media (min-width: 481px) and (max-width: 768px) {
    #app {
        padding: 15px;
    }
    
    .fire-button {
        min-width: 60px;
    }
}
```

### Phase 6: デプロイ（5分）

#### 6.1 Netlifyデプロイ手順
1. 完成したindex.htmlをローカルで作成
2. https://netlify.com でアカウント作成
3. 「New site from Git」を選択
4. ファイルをドラッグ&ドロップ
5. 自動デプロイ開始
6. 発行されたURLをテスト

#### 6.2 動作確認項目
- [ ] 作成画面での店舗追加
- [ ] 火レベル選択
- [ ] 共有URL生成
- [ ] QRコード表示
- [ ] URLコピー機能
- [ ] 共有画面での表示
- [ ] モバイル表示
- [ ] 戻るボタン

**合計実装時間**: 約90分
**デプロイ時間**: 5分
**総所要時間**: 95分

#2・times.2