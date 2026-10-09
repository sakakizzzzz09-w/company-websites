# PLACES — 会社・店舗サイト

Next.js App Router・TypeScript・Tailwind CSSによる、日本語の会社・店舗ディレクトリです。現時点の会社名・所在地・メニュー・価格・イラストはすべてデモ情報です。

## 開発

Node.js 20.9以上（この環境では24.19.0）、npmを使用します。

```sh
npm ci
npm run dev
```

通常はポート3000で起動します。クラウド環境でnpmキャッシュを書き込めない場合は、`npm_config_cache=/workspace/.npm-cache` をコマンドに付けてください。

```sh
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

## ページと更新方法

- `/`：会社・店舗の一覧
- `/companies/[slug]`：会社情報と運営店舗
- `/stores/[slug]`：店舗情報とおすすめメニュー
- 存在しないページ：日本語の404ページ

`src/lib/directory.ts` の `companies` と `stores` が情報の管理元です。新しい会社は固有の `slug` を付けて追加し、店舗の `companySlug` を会社の `slug` に合わせてください。店舗の `menu` は空配列にも対応します。写真は `public/images/` に配置し、店舗の `photo` に `/images/ファイル名` を指定します。

ページは共通テンプレートから静的生成されるため、情報を更新した後は再ビルド・再デプロイが必要です。現在は管理画面・データベース・認証を実装していません。将来CMSを導入する際は、データ取得部分を置き換え、会社と店舗の関連付けを維持できます。

## デザイン

スマートフォンでは1列、画面幅に応じて2〜3列で店舗を表示します。日本語の見出し、落ち着いた配色、キーボードのフォーカス表示、本文へのスキップリンク、動きを抑える設定に対応しています。フォント・画像取得に外部サービスやAPIキーは不要です。

## スタッフ紹介（OUR MEMBERS）

- 店舗ページの「OUR MEMBERS」から一覧へ移動します。
- 一覧：`/stores/<店舗slug>/members`
- 個別：`/stores/<店舗slug>/members/<スタッフslug>`（共有URLで直接アクセス可）
- Chill Chiba：`/stores/chill-chiba`、スタッフ一覧：`/stores/chill-chiba/members`。公式Instagramのみ確認済みです。所在地・営業時間・定休日は確認中、スタッフは未掲載です。
- このチェックアウトには別の独立サイトはありません。既存の総合サイト・会社・店舗ページを維持し、カード・写真・SNS部品を `src/components/members.tsx` に共通化しています。他店舗も同じルートと部品を利用できます。

### 追加・編集方法

`src/lib/members.ts` の `membersByStore` を店舗slugごとに編集してください。掲載許可のない情報・推測した個人SNSは登録しないでください。現在はすべて空配列です。以下は記入形式で、公開情報ではありません。

```ts
"chill-chiba": [
  {
    id: "変更しない一意のID",
    slug: "承認済みスタッフのURL用ID",
    name: "掲載許可済みの名前",
    nickname: "掲載許可済みのニックネーム", // 省略可
    role: "STAFF", // OWNER / MANAGER / STAFF / GUEST
    // photo: "/images/members/写真ファイル.jpg", // 後から登録可
    introduction: "掲載許可済みの自己紹介",
    favoriteFlavors: [],
    recommendedMix: "",
    socials: {}, // 確認・許可済みの instagram / tiktok / x のHTTPS URLのみ
    publication: { consent: false, status: "draft" },
    order: 10,
  },
],
```

公開条件は `consent: true` **かつ** `status: "published"` です。本人の掲載許可を確認してから変更してください。非公開・未許可のスタッフは一覧、個別ページ、静的生成対象すべてから除外されます。許可撤回時は `consent: false` にして再ビルドしてください。

編集は該当オブジェクトの更新、削除は配列から除去、表示順変更は `order` の変更（小さい順）です。店舗内で `id` と `slug` を重複させないでください。公開後の `slug` を変更すると共有URLも変わります。顔写真は `public/images/members/` に本人の許可済みファイルを置き、`photo` を指定します。未登録時は人物シルエットを表示します。

SNS未登録・不正URLのアイコンは非表示です。公式ホストのHTTPS URLのみ受け付け、写真・名前・PROFILEとは別リンクとして新しいタブで開きます。店舗公式Instagramは `src/lib/directory.ts` の `officialInstagram` に管理し、個人SNSと混同しません。

将来の管理画面では、この型をCMS/APIのモデルに対応させ、`publishedMembers` / `publishedMember` のデータ取得部分を差し替えられます。現時点ではログイン・管理画面・データベースはありません。許可確認・編集権限は将来のサーバー側でも必ず検証してください。Chill Chibaの店舗・スタッフ画面はブラック・ダークブラウン・ボルドー・ゴールドの専用テーマ、他店舗は既存サイトに合わせたテーマです。

### プレビュー・検証

```sh
npm ci
npm run dev -- --hostname 0.0.0.0 --port 3000
```

開発環境のポート3000で上記ページを確認してください。写真・名前・PROFILEから個別ページへ、SNSから外部サイトへ移動します。未掲載の状態では一覧に準備中メッセージが表示されます。データ変更後の本番反映には再ビルドが必要です。本番公開は別途行ってください。

```sh
npm run lint
npm run build
npx --no-install tsc --noEmit
node tests/members.mjs
```

ブラウザテストには Playwright と Chromium が必要です（このクラウド環境には導入済み）。他環境では `npm install --no-save --package-lock=false playwright` と `npx playwright install chromium` で準備できます。システムの `/usr/bin/chromium` があれば使用し、別パスは `CHROMIUM_PATH` で指定できます。テスト前にこのプロジェクトの開発サーバーを停止してください（Next.jsの開発ロックを共有するため）。テストはポート3100を使用します。`src/lib/members.ts` に架空データを一時挿入して、終了時に元へ戻します。同時にこのファイルを編集しないでください。テスト中のCtrl+C等で強制終了した場合は架空データが残っていないか確認してください。SNSテストはプラットフォームの一般ページを使い、架空の個人アカウントは作りません。外部SNSへのリクエストはテストで置き換え、クリックで正しいURLへ別タブ遷移することを確認します。外部サイトのログインやコンテンツの可用性は検証対象外です。

個別ページは名前・店舗名のtitle、description、Open Graph、Twitter Cardを生成します。実際の公開ドメインが決まったら `NEXT_PUBLIC_SITE_URL` にHTTPSのサイトURL（例示ドメインをそのまま使用しない）を設定してビルドすると、canonicalと共有用絶対URL・登録写真が追加されます。公開ドメインが未提供の現在は架空のcanonicalを生成しません。
