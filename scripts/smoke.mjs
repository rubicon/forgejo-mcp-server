#!/usr/bin/env node
// Token-free smoke test: start the built server, run the MCP handshake, and
// assert the expected tool set is registered. Used by CI and locally.
// Requires `npm run build` first (reads dist/index.js).
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const server = spawn('node', [join(root, 'dist', 'index.js')], {
  env: { ...process.env, FORGEJO_BASE_URL: 'https://example.invalid', FORGEJO_TOKEN: 'dummy' },
  stdio: ['pipe', 'pipe', 'pipe'],
});

let out = '';
server.stdout.on('data', (d) => (out += d.toString()));

const send = (o) => server.stdin.write(JSON.stringify(o) + '\n');
send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'smoke', version: '0' } } });
send({ jsonrpc: '2.0', method: 'notifications/initialized' });
send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });

const EXPECTED = [
  'list_repositories', 'get_repository', 'list_issues', 'create_issue',
  'get_file_content', 'list_pull_requests', 'get_pull_request', 'create_pull_request',
];

setTimeout(() => {
  server.kill();
  const msg = out.split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .find((m) => m && m.id === 2);
  const names = msg?.result?.tools?.map((t) => t.name) ?? [];
  const missing = EXPECTED.filter((e) => !names.includes(e));
  if (missing.length || names.length !== EXPECTED.length) {
    console.error('SMOKE FAIL. got:', names, 'missing:', missing);
    process.exit(1);
  }
  console.log('SMOKE PASS:', names.length, 'tools registered');
  process.exit(0);
}, 4000);
