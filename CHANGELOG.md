# Changelog

All notable changes to this fork are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `FORK.md`, `CLAUDE.md`, `AGENTS.md`, `CHANGELOG.md`, a committed smoke test,
  and `.forgejo` CI (build, smoke test, and PR-policy checks) to align the
  repository with the process policy (#3).

### Changed

- Renamed CI workflow files from `.yml` to `.yaml` to match the file-extension
  standard; no behavior change (#6).

## [0.2.0] - 2026-06-30

### Added

- Pull-request tools: `list_pull_requests`, `get_pull_request`,
  `create_pull_request`, and a `PullRequest` type.

### Changed

- Build switched from Bun to esbuild (Node-native; `npm run build`).
- README rewritten for Claude Code / Forgejo usage and the security model.

Forked from
[`nsvk13/forgejo-mcp-server`](https://github.com/nsvk13/forgejo-mcp-server)
at `565396b`.
