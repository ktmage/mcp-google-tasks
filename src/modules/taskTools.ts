import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getTasksService } from "./auth.js";

/**
 * タスク関連のツールをサーバーに登録する
 */
export function registerTaskTools(server: McpServer) {
    // タスクリスト一覧を取得するツール
    server.tool(
        "list_tasklists",
        "List all task lists.",
        {},
        async () => {
            try {
                const service = await getTasksService();
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
    );

    // タスク一覧を取得するツール
    server.tool(
        "list_tasks",
        "List tasks in a specific task list.",
        {
            taskListId: z.string().describe("ID of the task list to get tasks from"),
        },
        async ({ taskListId }) => {
            try {
                const service = await getTasksService();
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
    );

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
                const service = await getTasksService();
                
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
    );

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
                const service = await getTasksService();
                
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
    );

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
                const service = await getTasksService();
                
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
    );
} 