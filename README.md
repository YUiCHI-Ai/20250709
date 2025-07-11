# 希少体験おねだりリスト

行きたいレストランをリスト化し、そのリストを共有URLやQRコードで他の人に送ることができるWebアプリケーションです。

## 🌟 機能

- **リスト作成**: 店名、熱意レベル（🔥1〜5）、店舗URLを入力してリストを作成
- **共有機能**: 作成したリストを他の人と共有するためのURLを生成
- **QRコード生成**: 共有URLのQRコードを自動生成・ダウンロード可能
- **レスポンシブデザイン**: スマートフォン、タブレット、デスクトップに対応
- **データ永続化**: ローカルストレージに下書きを自動保存

## 🚀 使用方法

### リスト作成
1. あなたの名前を入力
2. 店名を入力
3. 熱意レベルを🔥で選択（1〜5）
4. 店舗URL（オプション）を入力
5. 「リストに追加」ボタンをクリック

### 共有
1. 「共有URLを生成」ボタンをクリック
2. 生成されたURLをコピーして共有
3. QRコードを使って簡単に共有
4. QRコードの画像をダウンロード可能

## 🔧 技術仕様

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **QRコード生成**: qrcode.js library
- **ホスティング**: GitHub Pages
- **デプロイメント**: GitHub Actions

## 📱 対応ブラウザ

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）

## 🎯 QRコード機能

### 作成画面
- 共有URL生成時に自動でQRコードを生成
- QRコードをPNG形式でダウンロード可能

### 共有画面
- 現在の画面のQRコードを表示
- 他の人が同じリストを再共有する際に便利

## 🛠️ 開発・カスタマイズ

### ローカル開発

#### 簡単な方法（HTMLファイル直接開く）
1. リポジトリをクローン
2. `index.html`をブラウザで開く
3. 編集後、リロードで確認

#### ローカルサーバー起動（推奨）
```bash
# 自動設定スクリプト（推奨）
./setup-local-server.sh

# Node.js Express サーバー
npm install
npm start

# Python HTTPサーバー
python3 start-server.py
```

#### 同一ネットワークからのアクセス
- 他の端末（スマートフォン、タブレット）からテスト可能
- 詳細は [`同一ネットワークアクセス設定ガイド.md`](同一ネットワークアクセス設定ガイド.md) を参照

### デプロイメント
- `main`ブランチにプッシュすると自動的にGitHub Pagesにデプロイ
- GitHub Actionsが自動実行

## 📋 プロジェクト構成

```
.
├── index.html                          # メインアプリケーションファイル
├── README.md                           # プロジェクト説明
├── CLAUDE.md                           # AI開発ガイドライン
├── package.json                        # Node.js依存関係
├── server.js                           # Express サーバー
├── setup-local-server.sh               # 自動設定スクリプト
├── start-server.py                     # Python HTTPサーバー
├── 同一ネットワークアクセス設定ガイド.md    # ネットワーク設定ガイド
├── .github/workflows/                  # GitHub Actions設定
│   └── pages.yml                      # Pages デプロイメント設定
├── 仕様書A,B.md                       # 原仕様書
├── 設計書.md                          # アーキテクチャ設計
├── 実装ガイド.md                      # 実装手順書
├── テスト仕様書.md                    # テストケース
├── テスト計画書.md                    # テスト計画
└── URL発行・QR生成対応_*              # 拡張機能ドキュメント
```

## 🧪 テスト

### 基本機能テスト
- リスト作成・編集・削除
- URL生成・共有
- QRコード生成・ダウンロード
- レスポンシブデザイン

### 対応確認
- 各種ブラウザでの動作確認
- スマートフォンでのQRコード読み取り
- 異なるデバイス間での共有
- 同一ネットワーク内の複数端末でのアクセス

### ローカルサーバーテスト
```bash
# サーバー起動
./setup-local-server.sh

# 他の端末からアクセステスト
# 1. 同一Wi-Fiネットワークに接続
# 2. 表示されたIPアドレスにアクセス
# 3. QRコード機能のテスト（Node.jsサーバーのみ）
```

## 🤝 貢献

このプロジェクトは[Claude Code](https://claude.ai/code)を使用して開発されました。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

🤖 Generated with [Claude Code](https://claude.ai/code)