import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ファイルパスを取得するための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// スコープの設定
const SCOPES = ['https://www.googleapis.com/auth/tasks'];
// トークンパスの設定
const TOKEN_PATH = path.join(__dirname, '../token.json');
// 認証情報パスの設定
const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');

const server = new McpServer({
    name: "gtasks",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    }
})

/**
 * 保存されたトークンの読み込み、または新しい認証の実行
 */
async function authorize() {
    let client = null;
    try {
        // トークンファイルが存在する場合は読み込む
        const content = fs.readFileSync(TOKEN_PATH);
        const credentials = JSON.parse(content.toString());
        client = google.auth.fromJSON(credentials);
    } catch (err) {
        // トークンファイルが存在しない場合は新しい認証を実行
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        // トークンを保存
        if (client.credentials) {
            const keys = JSON.parse(fs.readFileSync(CREDENTIALS_PATH).toString());
            const payload = JSON.stringify({
                type: 'authorized_user',
                client_id: keys.installed.client_id,
                client_secret: keys.installed.client_secret,
                refresh_token: client.credentials.refresh_token,
            });
            fs.writeFileSync(TOKEN_PATH, payload);
        }
    }
    return client;
}

// タスクリスト一覧を取得するツール
server.tool(
    "list_tasklists",
    "List all task lists.",
    {},
    async () => {
        try {
            const auth = await authorize();
            const service = google.tasks({
                version: 'v1',
                auth: auth as any
            });
            const response = await service.tasklists.list();
            
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(response.data, null, 2)
                }]
            };
        } catch (error: any) {
            console.error("Error listing task lists:", error);
            return {
                content: [{
                    type: "text",
                    text: `Error: ${error.message}`
                }],
                isError: true
            };
        }
    }
)

// タスク一覧を取得するツール
server.tool(
    "list_tasks",
    "List tasks in a specific task list.",
    {
        taskListId: z.string().describe("ID of the task list to get tasks from"),
    },
    async ({ taskListId }) => {
        try {
            const auth = await authorize();
            const service = google.tasks({
                version: 'v1',
                auth: auth as any
            });
            const response = await service.tasks.list({
                tasklist: taskListId,
            });
            
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(response.data, null, 2)
                }]
            };
        } catch (error: any) {
            console.error("Error listing tasks:", error);
            return {
                content: [{
                    type: "text",
                    text: `Error: ${error.message}`
                }],
                isError: true
            };
        }
    }
)

// 新しいタスクを作成するツール
server.tool(
    "create_task",
    "Create a new task in a task list.",
    {
        taskListId: z.string().describe("ID of the task list to add task to"),
        title: z.string().describe("Title of the task"),
        notes: z.string().optional().describe("Optional notes for the task"),
        due: z.string().optional().describe("Due date in RFC 3339 format (e.g. 2023-12-31T23:59:59Z)")
    },
    async ({ taskListId, title, notes, due }) => {
        try {
            const auth = await authorize();
            const service = google.tasks({
                version: 'v1',
                auth: auth as any
            });
            
            const taskData: any = {
                title: title,
            };
            
            if (notes) taskData.notes = notes;
            if (due) taskData.due = due;
            
            const response = await service.tasks.insert({
                tasklist: taskListId,
                requestBody: taskData
            });
            
            return {
                content: [{
                    type: "text",
                    text: `Task created successfully: ${JSON.stringify(response.data, null, 2)}`
                }]
            };
        } catch (error: any) {
            console.error("Error creating task:", error);
            return {
                content: [{
                    type: "text",
                    text: `Error: ${error.message}`
                }],
                isError: true
            };
        }
    }
)

// タスクを完了としてマークするツール
server.tool(
    "complete_task",
    "Mark a task as completed.",
    {
        taskListId: z.string().describe("ID of the task list the task belongs to"),
        taskId: z.string().describe("ID of the task to mark as completed"),
    },
    async ({ taskListId, taskId }) => {
        try {
            const auth = await authorize();
            const service = google.tasks({
                version: 'v1',
                auth: auth as any
            });
            
            // まず現在のタスク情報を取得
            const taskInfo = await service.tasks.get({
                tasklist: taskListId,
                task: taskId
            });
            
            // 完了としてマーク
            const response = await service.tasks.update({
                tasklist: taskListId,
                task: taskId,
                requestBody: {
                    ...taskInfo.data,
                    status: 'completed',
                    completed: new Date().toISOString()
                }
            });
            
            return {
                content: [{
                    type: "text",
                    text: `Task marked as completed: ${JSON.stringify(response.data, null, 2)}`
                }]
            };
        } catch (error: any) {
            console.error("Error completing task:", error);
            return {
                content: [{
                    type: "text",
                    text: `Error: ${error.message}`
                }],
                isError: true
            };
        }
    }
)

// タスクを削除するツール
server.tool(
    "delete_task",
    "Delete a task.",
    {
        taskListId: z.string().describe("ID of the task list the task belongs to"),
        taskId: z.string().describe("ID of the task to delete"),
    },
    async ({ taskListId, taskId }) => {
        try {
            const auth = await authorize();
            const service = google.tasks({
                version: 'v1',
                auth: auth as any
            });
            
            await service.tasks.delete({
                tasklist: taskListId,
                task: taskId
            });
            
            return {
                content: [{
                    type: "text",
                    text: `Task deleted successfully.`
                }]
            };
        } catch (error: any) {
            console.error("Error deleting task:", error);
            return {
                content: [{
                    type: "text",
                    text: `Error: ${error.message}`
                }],
                isError: true
            };
        }
    }
)

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Google Tasks MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
