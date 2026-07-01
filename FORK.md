# FORK.md — rubicon/forgejo-mcp

This repository is an upstream-tracked fork of
[`nsvk13/forgejo-mcp-server`](https://github.com/nsvk13/forgejo-mcp-server)
(GPL-3.0), forked at commit `565396b`.

## Remotes

- `origin` -> `git.daxdavis.com/rubicon/forgejo-mcp` (canonical; our work lives here)
- `upstream` -> `github.com/nsvk13/forgejo-mcp-server` (third-party source; read for ingest)

Never push private or fork-local content to `upstream`.

## Intentional divergence from upstream

Files deliberately changed or added relative to `565396b`:

| Path | Change | Upstreamable? |
|------|--------|---------------|
| `src/index.ts`, `src/types/forgejo.types.ts` | Added `list_pull_requests`, `get_pull_request`, `create_pull_request` and a `PullRequest` type | Yes (sent as upstream PR #2) |
| `package.json` | Build switched from Bun to esbuild (Node-native) | Optional (offered in PR #2) |
| `README.md` | Rewritten for Claude Code / Forgejo usage and the security model | No (fork-specific) |
| `FORK.md`, `CLAUDE.md`, `AGENTS.md`, `CHANGELOG.md` | Fork process and docs | No (fork-specific) |
| `.forgejo/workflows/*`, `scripts/smoke.mjs` | Fork CI and test harness | No (fork-specific) |

## Ingesting upstream changes

1. Open an issue.
2. On a `dev/<issue>-<slug>` branch: `git fetch upstream && git merge upstream/main`.
3. Resolve conflicts in the open, run checks, merge via PR. Never advance `main` outside a PR.

Do not use vendor overlay/apply scripts; they clobber local divergence.

## Upstreaming (good-citizen)

Generic, everyone-benefits fixes may be PR'd to `upstream` on GitHub. This
requires per-PR human approval, public content only, and the Outbound PR
Authorship Standard (no AI tells, no em-dashes, no emojis). The pull-request
tools went upstream as `nsvk13/forgejo-mcp-server#2`.

## License

GPL-3.0, inherited from upstream. `LICENSE` and upstream attribution are preserved.
