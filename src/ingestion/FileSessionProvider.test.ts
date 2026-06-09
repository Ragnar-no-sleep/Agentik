import test from 'node:test';
import assert from 'node:assert';
import { FileSessionProvider } from '../ingestion/FileSessionProvider.js';
import path from 'node:path';
import fs from 'node:fs/promises';

test('FileSessionProvider normalizes a simple session log', async () => {
  const tempDir = path.join(process.cwd(), 'temp-test-logs');
  await fs.mkdir(tempDir, { recursive: true });
  const logFile = path.join(tempDir, 'test-session.jsonl');

  const logContent = `
{"sessionId":"test-123","projectHash":"hash-456","startTime":"2026-06-09T00:00:00Z","kind":"main"}
{"id":"m1","timestamp":"2026-06-09T00:00:01Z","type":"user","content":[{"text":"Hello"}]}
{"id":"m2","timestamp":"2026-06-09T00:00:02Z","type":"gemini","content":"Hi there","thoughts":[{"subject":"test","description":"thinking","timestamp":"now"}]}
`;
  await fs.writeFile(logFile, logContent.trim());

  const provider = new FileSessionProvider(tempDir);
  const trace = await provider.getTrace(logFile);

  assert.strictEqual(trace.sessionId, 'test-123');
  assert.strictEqual(trace.messages.length, 2);
  assert.strictEqual(trace.messages[0].role, 'user');
  assert.strictEqual(trace.messages[0].content, 'Hello');
  assert.strictEqual(trace.messages[1].role, 'gemini');
  assert.strictEqual(trace.messages[1].thoughts?.length, 1);

  // Cleanup
  await fs.rm(tempDir, { recursive: true });
});
