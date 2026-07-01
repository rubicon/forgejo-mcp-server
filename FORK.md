# FORK.md — rubicon/forgejo-mcp-server

This repository is an upstream-tracked fork of
[`nsvk13/forgejo-mcp-server`](https://github.com/nsvk13/forgejo-mcp-server)
(GPL-3.0). The canonical `main` tracks upstream `main` and adds a small
additive fork layer (docs, CI, a rewritten README); code changes are
upstreamed rather than carried.

## Remotes

- `origin` -> `github.com/rubicon/forgejo-mcp-server` (canonical; our work lives here)
- `upstream` -> `github.com/nsvk13/forgejo-mcp-server` (third-party source; read for ingest)
- `mirror` -> `git.daxdavis.com/rubicon/forgejo-mcp-server` (read-only mirror of `origin`)

Never push private or fork-local content to `upstream`.

## Canonical host (repo-specific override)

The General Repository Process Policy defaults forks to Forgejo-canonical. This
repository takes the policy's sanctioned repo-specific override and makes
**GitHub the canonical host**: it is a contribution-first fork with no private
layer, so it lives where its upstream lives, consistent with the "GitHub for
open source" convention. Forgejo is kept as a read-only mirror. The override
applies to this repository only; if this fork ever starts carrying a private
layer, revisit it.

## Intentional divergence from upstream

Code is kept identical to upstream; the fork layer is additive. Files that
differ from upstream `main`:

| Path | Change | Notes |
|------|--------|-------|
| `README.md` | Rewritten for Claude Code usage and the security model | Fork-specific; the "safe for unattended use" section is offered upstream as a goodwill PR |
| `FORK.md`, `CLAUDE.md`, `AGENTS.md`, `CHANGELOG.md` | Fork process and docs | Fork-owned |
| `.forgejo/workflows/*`, `scripts/smoke.mjs` | Fork CI and token-free smoke test | Fork-owned (CI migrating to GitHub Actions) |
| `.gitignore` | Fork-specific ignores | Fork-owned |

The pull-request tools and the Node-native build were contributed upstream
(`nsvk13/forgejo-mcp-server#2` and `#3`) and are no longer fork divergence.

## Ingesting upstream changes

1. Open an issue.
2. On a `dev/<issue>-<slug>` branch: `git fetch upstream && git merge upstream/main`.
3. Resolve conflicts in the open, run checks, merge via PR. Never advance `main` outside a PR.

Because `main` descends cleanly from upstream, these merges are conflict-free
apart from the additive fork files. Do not use vendor overlay/apply scripts;
they clobber local divergence.

## Upstreaming (good-citizen)

Generic, everyone-benefits fixes may be PR'd to `upstream` on GitHub. This
requires per-PR human approval, public content only, and the Outbound PR
Authorship Standard (no AI tells, no em-dashes, no emojis). Contributed so far:
the pull-request tools (`#2`) and the Node-native build (`#3`).

## License

GPL-3.0, inherited from upstream. `LICENSE` and upstream attribution are preserved.
