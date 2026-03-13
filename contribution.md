# contribution.md

このリポジトリをフォークして、自分の GitHub プロフィール README として使うための手順をまとめます。

## 前提

このリポジトリは、GitHub Actions 上で以下を自動生成します。

- GitHub プロフィール README
- SVG カード
- ダッシュボード HTML
- GitHub Pages 用の出力

現在の実装では、フォーク先のトークン所有者を基準に GitHub データを取得するようにしてあります。

## 重要な前提条件

GitHub のプロフィール README にするには、リポジトリ名が GitHub ユーザ名と一致している必要があります。

例:

- ユーザ名が `octocat` の場合、リポジトリ名は `octocat`
- 最終的なリポジトリは `octocat/octocat`

そのため、単に `soranjiro/soranjiro` をフォークするだけでは足りません。通常は次のどちらかを行います。

1. フォーク後にリポジトリ名を自分の GitHub ユーザ名に変更する
2. 自分の GitHub ユーザ名と同じ名前の新規リポジトリを作り、このリポジトリの内容を入れる

## セットアップ手順

1. このリポジトリをフォークする、または内容をコピーした新規リポジトリを作る
2. リポジトリ名を自分の GitHub ユーザ名と同じにする
3. リポジトリを `Public` にする
4. `Settings > Actions > General` で GitHub Actions を有効にする
5. `Settings > Actions > General > Workflow permissions` で `Read and write permissions` を許可する
6. `Settings > Pages` で `Build and deployment` の source を `GitHub Actions` にする
7. `Settings > Secrets and variables > Actions` で必要な Secret を登録する
8. 必要なら [conf/profile.yml](conf/profile.yml) と [conf/display.yml](conf/display.yml) を編集する
9. `Actions > Update Profile README` を手動実行する

## 必要な Secret

### PERSONAL_ACCESS_TOKEN

GitHub API と GitHub Models API を呼ぶために使います。

このリポジトリでは以下に使われています。

- GitHub GraphQL API: viewer のプロフィール、contributions、pinned repos、organizations
- GitHub REST API: commit search など
- GitHub Models API: `gpt-4o-mini` による要約生成

該当実装:

- [src/fetch-data.mjs](src/fetch-data.mjs#L8)
- [src/fetch-data.mjs](src/fetch-data.mjs#L28)
- [src/fetch-data.mjs](src/fetch-data.mjs#L199)
- [src/fetch-data.mjs](src/fetch-data.mjs#L276)
- [.github/workflows/update-profile.yml](.github/workflows/update-profile.yml#L26)

### EMAIL

workflow 内の自動コミット用メールアドレスです。

該当箇所:

- [.github/workflows/update-profile.yml](.github/workflows/update-profile.yml#L41)

通常は以下のどちらかで十分です。

- GitHub に登録しているメールアドレス
- GitHub の noreply メールアドレス

## GitHub Copilot の認証は必要か

GitHub Actions 上でこのリポジトリを動かすだけなら、VS Code 側の GitHub Copilot ログインは不要です。

このリポジトリは GitHub Actions 内で直接 API を叩いており、VS Code 拡張の Copilot セッションを使っていません。

ただし、AI 要約部分は GitHub Models API を使っているため、`PERSONAL_ACCESS_TOKEN` の所有者が GitHub Models を利用できる必要があります。

要点は次のとおりです。

- VS Code の Copilot 認証: 不要
- GitHub Actions 用のトークン: 必須
- GitHub Models API の利用資格: 必要

補足:

- このリポジトリは README 文言として `GitHub Copilot SDK` と書いていますが、実装上は GitHub Models の REST API を直接利用しています
- AI 要約生成に失敗した場合も、一部はフォールバックして生成継続します

## 推奨トークン

### いちばん安全に動かしたい場合

まずは Classic PAT を使うのが無難です。

推奨 scope:

- `repo`
- `read:org`
- `models:read`

理由:

- `repo`: private repository を含むプロフィール情報や commit / PR / issue 集計を取りやすい
- `read:org`: organization 関連の情報取得に必要になりやすい
- `models:read`: GitHub Models API の利用に必要

この構成は最小権限ではありませんが、このリポジトリの用途では最も詰まりにくいです。

### Fine-grained PAT を使いたい場合

Fine-grained PAT でも動く可能性はありますが、このリポジトリは以下をまたいで参照します。

- viewer ベースの GraphQL
- organization 配下の repository 情報
- commit search
- pinned repository の README 取得
- GitHub Models API

そのため、権限不足で一部データだけ欠けるケースが起きやすいです。

少なくとも検討対象になるのは次です。

- Repository access: 対象リポジトリ、必要なら private repo も含めて許可
- Repository permissions: `Metadata: Read`
- Repository permissions: `Contents: Read`
- Organization permissions: 必要に応じて org の read 権限
- Models permission: `models:read`

ただし、実際に必要な権限は、公開リポジトリだけを集計するか、private repo や所属 org の repo まで反映したいかで変わります。

## `GITHUB_TOKEN` だけではだめか

このリポジトリでは `GITHUB_TOKEN` だけに頼らず、`PERSONAL_ACCESS_TOKEN` を使う前提です。

理由:

- `GITHUB_TOKEN` は workflow 実行中のリポジトリに強く紐づく
- プロフィール全体の viewer 情報や、アカウント全体の検索集計には向かない
- GitHub Models API の利用も `PERSONAL_ACCESS_TOKEN` 前提にしている

一方で、リポジトリへの commit / push 自体は workflow 側の権限設定で行っています。

## GitHub Models とプランについて

AI 要約は GitHub Models API を使って `gpt-4o-mini` を呼び出しています。

該当箇所:

- [src/fetch-data.mjs](src/fetch-data.mjs#L203)
- [src/fetch-data.mjs](src/fetch-data.mjs#L348)
- [src/fetch-data.mjs](src/fetch-data.mjs#L639)

GitHub Docs 上は、GitHub Models API をローカルやアプリから使うには `models:read` 権限を持つトークンが必要です。

また、GitHub Models の利用可否やレート制限は、アカウント種別や契約状況の影響を受けます。

そのため、次のどちらかに当てはまる必要があります。

- GitHub Models を使えるアカウントである
- もしくは将来的に BYOK など別経路に実装を変える

## fork 後に自分のデータになる条件

以下を満たせば、基本的にはそのユーザ自身のデータで生成されます。

- `PERSONAL_ACCESS_TOKEN` が自分の GitHub アカウントのトークンである
- リポジトリ名が自分の GitHub ユーザ名と一致している
- Actions と Pages が有効になっている
- トークンに十分な権限がある

## カスタマイズポイント

### [conf/profile.yml](conf/profile.yml)

AI 要約に反映したい自己紹介や役割、興味関心を入れます。

### [conf/display.yml](conf/display.yml)

表示したくない言語やセクション、tech stack 表示の調整を行います。

## よくあるハマりどころ

### README がプロフィールに出ない

リポジトリ名が GitHub ユーザ名と一致していない可能性が高いです。

### workflow は通るが AI 要約だけ失敗する

`PERSONAL_ACCESS_TOKEN` に `models:read` がない、または GitHub Models が使えないアカウントの可能性があります。

### organization の活動が少なく見える

`read:org` あるいは相当する権限が不足している可能性があります。

### private repo が反映されない

公開 repo だけ見えるトークンになっている可能性があります。Classic PAT の `repo` scope を確認してください。

### push で失敗する

`Settings > Actions > General > Workflow permissions` が read-only のままの可能性があります。

## まず必要なものだけ整理すると

最低限は次の 5 つです。

1. ユーザ名と同名の public repository
2. `PERSONAL_ACCESS_TOKEN`
3. `EMAIL`
4. GitHub Actions の write 権限
5. GitHub Pages の有効化

## 参考

- GitHub Models API は `models:read` 権限付きトークンで利用する
- GraphQL は要求するデータに応じて必要権限が変わる
- fine-grained PAT は最小権限に寄せやすい一方、このリポジトリ用途では権限不足の切り分けがやや面倒

運用開始を優先するなら、最初は Classic PAT の `repo + read:org + models:read` で動かし、必要なら後で絞るのが現実的です。
