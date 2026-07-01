# forgejo-mcp — Project Instructions

An MCP server that gives AI clients tools to talk to a Forgejo/Gitea instance
(repositories, issues, files, pull requests) over the REST API. This is a fork;
read `FORK.md`.

## Process policy (authoritative)

This repository follows the canonical General Repository Process Policy:

**issue -> `dev/<issue>-<slug>` branch -> focused semantic commits -> PR (linking
the issue with `Closes #N`) -> checks pass -> merge.**

- No direct pushes to `main`. No force-pushes to `main`.
- Trivial changes still go through a branch and a PR.
- Semantic commit prefixes only: `feat` `fix` `chore` `docs` `test` `ci` `refactor`.
- `origin` is GitHub (`rubicon/forgejo-mcp-server`, canonical) via a
  repo-specific override of the policy's Forgejo default; Forgejo is a read-only
  mirror (see `FORK.md`). `upstream` is the third-party GitHub source; push there
  only for approved good-citizen upstream PRs (see `FORK.md`), and those must
  follow the Outbound PR Authorship Standard (no AI tells, no em-dashes, no
  emojis, no AI-authorship trailers).

## Build and test

```bash
npm install
npm run build          # esbuild -> dist/index.js (single bundled file)
node scripts/smoke.mjs # MCP handshake + tools/list; must report 8 tools
```

## Architecture

Single-file server: all 8 tool definitions and request handlers live in
`src/index.ts`; Forgejo API response shapes are in `src/types/forgejo.types.ts`.
No web framework — it speaks MCP over stdio via `@modelcontextprotocol/sdk` and
calls the Forgejo REST API with `fetch`. esbuild bundles everything to the
single `dist/index.js`.

The 8 tools: `list_repositories`, `get_repository`, `list_issues`,
`create_issue`, `get_file_content`, `list_pull_requests`, `get_pull_request`,
`create_pull_request`. (`scripts/smoke.mjs` asserts this count of 8.)

There is no test runner or linter; `scripts/smoke.mjs` is the only check.
`npm run dev` rebuilds and runs in one step.

## Design constraints (do not violate)

- The server exposes read tools plus `create_issue` and `create_pull_request`
  only. There are no merge, delete, or admin tools. This keeps it safe for
  unattended use and caps the blast radius of the API token. Do not add
  destructive tools without explicit owner sign-off and a matching token-scope
  review.
- The token is supplied at runtime via `FORGEJO_TOKEN` and `FORGEJO_BASE_URL`.
  Never hardcode a token in the repo, configs, or tests. The deployed token is
  least-privilege (repository R/W, issue R/W, user Read).

## Consumers

Registered in Claude Code, Codex, and OpenCode via a shared launcher that
injects the token from a local secret file. One binary, one token source.

`AGENTS.md` is a symlink to this file — Codex/OpenCode read it and get these
exact instructions. Keep it a symlink; never replace it with a standalone copy,
so there is only one version to maintain.
