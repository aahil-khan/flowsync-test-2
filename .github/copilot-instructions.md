# FlowSync Context Instructions

Before starting any task:
1. Call the FlowSync MCP tool `get_project_context` to understand the current state of the project.
2. Use the returned context to inform your work — decisions, active risks, and pending tasks.

When logging context after a push:
- Call `log_context` once, after the push lands, when prompted by the FlowSync VS Code notification.
- Never call `log_context` during exploration or before work is committed and pushed.
