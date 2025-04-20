import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "gtasks",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    }
})

server.tool(
    "get_greeting",
    "Get greeting message.",
    {
        name: z.string().describe("Name of the person (e.g. 'tanaka')"),
    },
    async ({ name }) => {
        return {
            content: [{
                type: "text",
                text: `Hello ${name.toUpperCase()}.`
            }]
        }
    }
)

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Server is running on stdin/stdout");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
