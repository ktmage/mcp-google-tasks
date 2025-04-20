// モジュールのインポート
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTaskTools } from "./modules/taskTools.js";

/**
 * サーバーの初期化
 */
function initializeServer() {
    const server = new McpServer({
        name: "gtasks",
        version: "1.0.0",
        capabilities: {
            resources: {},
            tools: {},
        }
    });

    // ツールの登録
    registerTaskTools(server);

    return server;
}

/**
 * メイン関数
 */
async function main() {
    const server = initializeServer();
    const transport = new StdioServerTransport();
    
    await server.connect(transport);
    console.error("Google Tasks MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
