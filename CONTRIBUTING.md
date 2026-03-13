# CONTRIBUTING

このリポジトリをフォークして、自分の GitHub プロフィールとして使うための最低限の手順です。

## 1. リポジトリ準備

1. このリポジトリをフォークする
2. フォーク先のリポジトリ名を自分の GitHub ユーザ名と同じにする
3. リポジトリを Public にする

例: ユーザ名が `octocat` なら `octocat/octocat`

## 2. GitHub 設定

1. Actions を有効化する
2. Workflow permissions を Read and write permissions にする
3. Pages の source を GitHub Actions にする

## 3. Secrets を設定

Actions Secrets に次を登録する。

- `PERSONAL_ACCESS_TOKEN`
- `EMAIL`

### PERSONAL_ACCESS_TOKEN の推奨権限

最初は Classic PAT で次の scope を付けるのが簡単です。

- `repo`
- `read:org`
- `models:read`

## 4. 実行

1. 必要なら [conf/profile.yml](conf/profile.yml) を編集
2. 必要なら [conf/display.yml](conf/display.yml) を編集
3. Actions の `Update Profile README` を手動実行

## 5. 重要ポイント

- この構成では `GITHUB_TOKEN` ではなく `PERSONAL_ACCESS_TOKEN` を使う
- VS Code 側の認証は不要
- GitHub Models が使えるトークンであることが必要
