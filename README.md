# Forgejo MCP

A Model Context Protocol (MCP) server that gives Claude Code (and any MCP client) tools to interact with a Forgejo/Gitea instance over the REST API: repositories, issues, file contents, and **pull requests**.

This is a fork of [`nsvk13/forgejo-mcp-server`](https://github.com/nsvk13/forgejo-mcp-server) (GPL-3.0, pinned at commit `565396b`) with two changes:

1. **Pull-request tools added** — `list_pull_requests`, `get_pull_request`, `create_pull_request`.
2. **Node-native build** — replaced the Bun build with `esbuild`, so it builds and runs on a stock Node install (no Bun required).

## Design: safe for unattended use

This server is meant to run in autonomous/headless contexts (scheduled jobs, `claude -p`). Two deliberate choices keep it from ever hanging or doing damage:

- **No self-gating prompts.** Tools never pause to ask for confirmation, so an unattended run can't block waiting for a human. Authorization is enforced once, by the API token's scopes.
- **No destructive operations.** There is intentionally no merge, delete, force-push, or admin tool. The blast radius of a leaked or over-trusted token is capped at "create issues/PRs and read." Merges and deletes stay human-only, done interactively in the Forgejo UI or a separate interactive session.

Pair this with a **least-privilege API token** (repo + issue + PR write only) so the token can't exceed what the tools expose.

## Build

```bash
npm install
npm run build      # → dist/index.js (single bundled file)
```

## Available tools

| Tool | Kind | Endpoint |
|---|---|---|
| `list_repositories` | read | `/user/repos` or `/users/{u}/repos` |
| `get_repository` | read | `/repos/{owner}/{repo}` |
| `get_file_content` | read | `/repos/{owner}/{repo}/contents/{path}` |
| `list_issues` | read | `/repos/{owner}/{repo}/issues` |
| `create_issue` | write | `POST /repos/{owner}/{repo}/issues` |
| `list_pull_requests` | read | `/repos/{owner}/{repo}/pulls` |
| `get_pull_request` | read | `/repos/{owner}/{repo}/pulls/{index}` |
| `create_pull_request` | write | `POST /repos/{owner}/{repo}/pulls` |

`create_pull_request` takes `owner`, `repo`, `title`, `head` (source branch), `base` (target branch), and optional `body`.

## Configuration

Two environment variables:

- `FORGEJO_BASE_URL` — your instance, e.g. `https://git.daxdavis.com`
- `FORGEJO_TOKEN` — an API token scoped to repo + issue + PR write

### Claude Code (user scope)

Register it once so every project can use it. In your user `settings.json`:

```json
{
  "mcpServers": {
    "forgejo": {
      "command": "node",
      "args": ["/absolute/path/to/forgejo-mcp/dist/index.js"],
      "env": {
        "FORGEJO_BASE_URL": "https://git.daxdavis.com",
        "FORGEJO_TOKEN": "${FORGEJO_TOKEN}"
      }
    }
  }
}
```

Prefer injecting `FORGEJO_TOKEN` from a secret manager rather than pasting it in plaintext. For unattended runs use a non-interactive source (e.g. a 1Password **service-account** token), since interactive biometric unlock would defeat headless operation.

To run without per-call approval prompts, allowlist the server's tools in `settings.json`:

```json
{ "permissions": { "allow": ["mcp__forgejo"] } }
```

`mcp__forgejo` allows every tool the server exposes. Because the server has no destructive tools, allowing the whole server is safe and is what enables prompt-free unattended runs.

## Requirements

- Node 18+ (built/tested on Node 22)
- A Forgejo/Gitea instance with API access

## License

GPL-3.0, inherited from the upstream project. See `LICENSE`.
