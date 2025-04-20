# Google Tasks MCP Server

AI assistants and Google Tasks integration through Model Context Protocol.

AIアシスタントとGoogle Tasksを連携させるModel Context Protocol実装。

## 目次 / Table of Contents

- [English](#english)
- [日本語](#japanese)

<a id="english"></a>
## English

### Google Tasks MCP Server

An implementation for interacting with Google Tasks API through Model Context Protocol (MCP). This server allows you to use Google Tasks task management features from MCP-compatible clients such as Cursor.

This project was created to practice implementing an MCP server, with the goal of enabling AI assistants to interact with Google Tasks management features through the MCP protocol.

### Potential Issues

This project was created for learning purposes, and there may be issues that I'm not aware of due to my limited knowledge.

Please use at your own risk. The developer cannot take responsibility for any problems that may occur.

If you discover any issues, please create an Issue or suggest a fix via Pull Request. See the "Contributing" section below for details.

### Contributing

Contributions to this project are welcome. Bug reports, feature suggestions, pull requests, or any other form of participation are greatly appreciated.

For details, please refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

### Features

This MCP server provides the following functions:

- Fetch task list collections
- Get tasks within a specific task list
- Create new tasks
- Mark tasks as completed
- Delete tasks

### Setup Guide

#### 1. Prerequisites

- Node.js 16 or higher
- npm (included with Node.js)
- Google Cloud Project account

#### 2. Project Preparation

```bash
# Clone the repository (or obtain the project by any method)
git clone <repository URL>
cd mcp-google-tasks

# Install dependencies
npm install
```

#### 3. Google Cloud Project Configuration

1. Access the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing project)
3. From the left menu, select "APIs & Services" → "Library"
4. Search for "Tasks API" in the search box
5. Select "Google Tasks API" and click "Enable"

#### 4. Create OAuth 2.0 Credentials

1. From the left menu, select "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Desktop app" as the application type
4. Enter a name (e.g., "Google Tasks MCP Client") and click "Create"
5. Download the displayed credentials (JSON file)

#### 5. Place Credentials

1. Rename the downloaded JSON file to `credentials.json`
2. Place this file in the project's root directory (same level as package.json)

```
mcp-google-tasks/
├── src/
├── package.json
├── credentials.json  <- place here
└── ...
```

#### 6. Build and Run

```bash
# Build TypeScript
npm run build

# Run the server
node build/index.js
```

On first run, a browser window will open asking for Google account authentication. After authentication is complete, a `token.json` file will be generated, and this token will be used automatically for subsequent runs.

### Integration with Cursor

To use this server with MCP-compatible IDEs like Cursor, configure as follows:

#### For Cursor

1. Navigate to Cursor's configuration directory (typically `~/.cursor`)
2. Create or edit the `mcp.json` file

```json
{
  "mcpServers": {
    "gtasks": {
      "command": "node",
      "args": [
        "/full/path/mcp-google-tasks/build/index.js"
      ]
    }
  }
}
```

Replace `/full/path/` with the actual full path to your project.
Example: `/home/username/projects/mcp-google-tasks/build/index.js`

### Available Tools

#### list_tasklists

Lists all task lists.

Parameters: none

Example:
```
list_tasklists()
=> Task list collection (JSON format)
```

#### list_tasks

Lists tasks within a specific task list.

Parameters:
- `taskListId`: Task list ID (obtainable from list_tasklists)

Example:
```
list_tasks(taskListId: "YOUR_TASK_LIST_ID")
=> Tasks in the specified task list (JSON format)
```

#### create_task

Creates a new task.

Parameters:
- `taskListId`: ID of the task list to add the task to
- `title`: Task title
- `notes` (optional): Detailed task description
- `due` (optional): Due date/time (RFC 3339 format, e.g., 2023-12-31T23:59:59Z)

Example:
```
create_task(
  taskListId: "YOUR_TASK_LIST_ID",
  title: "New Task",
  notes: "Task details",
  due: "2023-12-31T23:59:59Z"
)
=> Created task information (JSON format)
```

#### complete_task

Marks a task as completed.

Parameters:
- `taskListId`: ID of the task list the task belongs to
- `taskId`: ID of the task to mark as completed (obtainable from list_tasks)

Example:
```
complete_task(
  taskListId: "YOUR_TASK_LIST_ID", 
  taskId: "YOUR_TASK_ID"
)
=> Updated task information (JSON format)
```

#### delete_task

Deletes a task.

Parameters:
- `taskListId`: ID of the task list the task belongs to
- `taskId`: ID of the task to delete (obtainable from list_tasks)

Example:
```
delete_task(
  taskListId: "YOUR_TASK_LIST_ID", 
  taskId: "YOUR_TASK_ID"
)
=> Operation success message
```

### Troubleshooting

#### Authentication Error

```
Error: Cannot find module '/path/to/mcp-google-tasks/credentials.json'
```

- Verify that the `credentials.json` file is correctly placed in the project's root directory
- Confirm that the file name is exactly `credentials.json`

#### Access Permission Error

```
Error: invalid_grant
```

- Delete `token.json` and perform authentication again
- Check that the Google Tasks API is enabled for the project in Google Cloud Console

#### Other Errors

Detailed error messages will be displayed in the console, which should help with troubleshooting.

<a id="japanese"></a>
## 日本語

### Google Tasks MCP サーバー

Model Context Protocol (MCP)を使用してGoogle Tasksを操作するためのサーバー実装です。このサーバーを使用すると、CursorなどのMCP対応クライアントからGoogle Tasksのタスク管理機能を利用できます。

このプロジェクトは MCP (Model Context Protocol) サーバーの実装を練習するために作成されました。MCPプロトコルを利用して、AIアシスタントからGoogle Tasksのタスク管理機能を操作できるようにすることを目的としています。

### 潜在的な問題について

このプロジェクトは学習目的で作成されており、私自身の知識不足により把握していない問題が存在する可能性があります。

使用の際は自己責任でお願いします。何らかの問題が発生しても、開発者は責任を負いかねますのでご了承ください。

問題を発見された場合は、Issueを作成するか、プルリクエストで修正案を提案していただけると幸いです。詳細は下記「コントリビュート」セクションをご参照ください。

### コントリビュート

このプロジェクトへの貢献を歓迎します。バグ報告、機能提案、プルリクエストなど、どのような形での参加も大歓迎です。

詳細は[CONTRIBUTING.md](./CONTRIBUTING.md)をご参照ください。

### 機能

このMCPサーバーは、以下の機能を提供します：

- タスクリスト一覧の取得
- 特定のタスクリスト内のタスク一覧の取得
- 新しいタスクの作成
- タスクを完了としてマーク
- タスクの削除

### セットアップ手順

#### 1. 前提条件

- Node.js 16以上
- npm（Node.jsに付属）
- Google Cloud Projectのアカウント

#### 2. プロジェクトの準備

```bash
# リポジトリのクローン（または任意の方法でプロジェクトを取得）
git clone <リポジトリURL>
cd mcp-google-tasks

# 依存パッケージのインストール
npm install
```

#### 3. Google Cloud Projectの設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセスする
2. 新しいプロジェクトを作成する（または既存のプロジェクトを選択）
3. 左側のメニューから「APIとサービス」→「ライブラリ」を選択
4. 検索ボックスに「Tasks API」と入力し、「Google Tasks API」を検索
5. 「Google Tasks API」を選択し、「有効にする」をクリック

#### 4. OAuth 2.0 認証情報の作成

1. 左側のメニューから「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「OAuth クライアントID」をクリック
3. アプリケーションの種類として「デスクトップアプリ」を選択
4. 任意の名前（例: "Google Tasks MCP Client"）を入力し、「作成」をクリック
5. 表示された認証情報をダウンロード（JSONファイル）

#### 5. 認証情報の配置

1. ダウンロードしたJSONファイルを`credentials.json`という名前で変更
2. このファイルをプロジェクトのルートディレクトリ（package.jsonと同じ階層）に配置

```
mcp-google-tasks/
├── src/
├── package.json
├── credentials.json  <- ここに配置
└── ...
```

#### 6. ビルドと実行

```bash
# TypeScriptのビルド
npm run build

# サーバーの実行
node build/index.js
```

初回実行時には、ブラウザウィンドウが開き、Googleアカウントでの認証を求められます。認証が完了すると、`token.json`ファイルが生成され、以降の実行では自動的にこのトークンが使用されます。

### Cursorとの連携設定

CursorなどのMCP対応IDEでこのサーバーを利用するには、以下の設定を行います。

#### Cursorの場合

1. Cursorの設定ディレクトリに移動（通常は`~/.cursor`)
2. `mcp.json`ファイルを作成または編集

```json
{
  "mcpServers": {
    "gtasks": {
      "command": "node",
      "args": [
        "/フルパス/mcp-google-tasks/build/index.js"
      ]
    }
  }
}
```

`/フルパス/`部分は、プロジェクトの実際のフルパスに置き換えてください。
例: `/home/username/projects/mcp-google-tasks/build/index.js`

### 利用可能なツール

#### list_tasklists

すべてのタスクリストを一覧表示します。

パラメータ：なし

例:
```
list_tasklists()
=> タスクリスト一覧（JSONフォーマット）
```

#### list_tasks

特定のタスクリスト内のタスクを一覧表示します。

パラメータ：
- `taskListId`: タスクリストのID（list_tasklistsから取得可能）

例:
```
list_tasks(taskListId: "YOUR_TASK_LIST_ID")
=> 指定したタスクリスト内のタスク（JSONフォーマット）
```

#### create_task

新しいタスクを作成します。

パラメータ：
- `taskListId`: タスクを追加するタスクリストのID
- `title`: タスクのタイトル
- `notes` (オプション): タスクの詳細説明
- `due` (オプション): 期限日時 (RFC 3339形式、例: 2023-12-31T23:59:59Z)

例:
```
create_task(
  taskListId: "YOUR_TASK_LIST_ID",
  title: "新しいタスク",
  notes: "タスクの詳細説明",
  due: "2023-12-31T23:59:59Z"
)
=> 作成されたタスクの情報（JSONフォーマット）
```

#### complete_task

タスクを完了としてマークします。

パラメータ：
- `taskListId`: タスクが属するタスクリストのID
- `taskId`: 完了としてマークするタスクのID（list_tasksから取得可能）

例:
```
complete_task(
  taskListId: "YOUR_TASK_LIST_ID", 
  taskId: "YOUR_TASK_ID"
)
=> 更新されたタスクの情報（JSONフォーマット）
```

#### delete_task

タスクを削除します。

パラメータ：
- `taskListId`: タスクが属するタスクリストのID
- `taskId`: 削除するタスクのID（list_tasksから取得可能）

例:
```
delete_task(
  taskListId: "YOUR_TASK_LIST_ID", 
  taskId: "YOUR_TASK_ID"
)
=> 操作の成功メッセージ
```

### トラブルシューティング

#### 認証エラー

```
Error: Cannot find module '/path/to/mcp-google-tasks/credentials.json'
```

- `credentials.json`ファイルがプロジェクトのルートディレクトリに正しく配置されているか確認してください
- ファイル名が正確に`credentials.json`であるか確認してください

#### アクセス権限エラー

```
Error: invalid_grant
```

- `token.json`を削除し、再度認証を行ってください
- Google Cloud Consoleで該当のプロジェクトに対してGoogle Tasks APIが有効になっているか確認してください

#### その他のエラー

詳細なエラーメッセージがコンソールに表示されるので、それに基づいて対処してください。