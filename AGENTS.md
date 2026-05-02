<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Data

All data intended for agents must be placed in the `agents/` directory.

Use this structure:

- `agents/rules/` - agent rules and operating constraints
- `agents/skills/` - reusable agent skills and capability instructions
- `agents/workflows/` - repeatable agent workflows and procedures

Agents should look in `agents/` first when project-specific agent context is required.
Project-specific rules are stored in `agents/rules/`.

Project planning and documentation are stored in `info/` as Markdown files. These files are intended to be read and edited with Obsidian, so keep links and formatting compatible with Obsidian where practical.
