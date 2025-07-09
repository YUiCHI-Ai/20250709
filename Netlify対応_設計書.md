# Netlify対応_設計書

## 概要
希少体験おねだりリストをNetlifyでホスティングするための設計書です。

## 設計方針
1. **単一ファイル化**: 全機能をindex.htmlに統合
2. **URLエンコード方式**: データをURL自体に埋め込み
3. **モバイル対応**: レスポンシブデザイン
4. **QRコード生成**: 共有URL用QRコード自動生成

## システム構成

### ファイル構成
```
project/
├── index.html          # 単一ファイル（全機能統合）
└── README.md          # 使用方法説明
```

### 技術スタック
- **HTML5**: セマンティック要素
- **CSS3**: Flexbox、Grid、レスポンシブ
- **JavaScript (ES6+)**: モダンブラウザ対応
- **外部API**: QRコード生成サービス

## 機能設計

### 1. 画面遷移設計
```
URL構造:
- 作成画面: https://app-name.netlify.app/#create
- 共有画面: https://app-name.netlify.app/#share?data=エンコードされたデータ
```

### 2. データ構造設計
```javascript
const listData = {
    owner: "ユーザー名",
    restaurants: [
        {
            name: "店名",
            fireLevel: 1-5,
            url: "店舗URL（任意）"
        }
    ],
    createdAt: "作成日時"
};
```

### 3. URL生成・共有機能
- Base64エンコード方式
- URLセーフ文字変換
- QRコード自動生成
- コピー機能

### 4. レスポンシブデザイン
- モバイルファースト設計
- ブレークポイント: 480px, 768px, 1024px
- タッチ操作対応

## 実装設計

### HTMLセクション設計
```html
<div id="app">
    <div id="create-section">
        <!-- リスト作成画面 -->
    </div>
    <div id="share-section">
        <!-- 共有画面 -->
    </div>
</div>
```

### CSS設計
```css
/* モバイルファースト */
@media (max-width: 480px) { /* スマホ */ }
@media (min-width: 481px) and (max-width: 768px) { /* タブレット */ }
@media (min-width: 769px) { /* デスクトップ */ }
```

### JavaScript設計
```javascript
// 主要関数
- initApp(): アプリ初期化
- handleHashChange(): URL変更処理
- addRestaurant(): レストラン追加
- generateShareUrl(): 共有URL生成
- generateQRCode(): QRコード生成
- copyToClipboard(): コピー機能
```

## セキュリティ考慮事項
1. XSS対策: HTML文字エスケープ
2. URL検証: 不正なURLパラメータ処理
3. 入力検証: 必須項目チェック
4. エラーハンドリング: 適切なエラー表示

## パフォーマンス考慮事項
1. 単一ファイル化による高速読み込み
2. 画像最適化（絵文字使用）
3. CSS/JS最小化
4. CDN活用（Netlify標準）

## エラーハンドリング設計
```javascript
// エラーパターン
1. URLデコード失敗 → 作成画面へリダイレクト
2. 必須項目未入力 → アラート表示
3. QRコード生成失敗 → 代替メッセージ表示
4. コピー機能失敗 → 手動コピー案内
```

## 品質保証
- ブラウザ互換性: Chrome, Firefox, Safari, Edge
- レスポンシブ対応: 320px-1920px
- アクセシビリティ: ARIA属性対応
- パフォーマンス: Lighthouse スコア90+

## デプロイ手順
1. index.htmlを作成
2. Netlifyアカウント作成
3. ファイルをドラッグ&ドロップ
4. 自動デプロイ完了
5. URLテスト実施

## 保守・運用
- 更新方法: ファイル差し替えのみ
- 監視: Netlify標準機能
- バックアップ: Git管理推奨
- 分析: Netlify Analytics（オプション）

#2・times.2