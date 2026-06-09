import test from 'node:test';
import assert from 'node:assert';
import { PatternDetector } from './PatternDetector.js';
import { Trace } from '../../shared/types.js';

test('PatternDetector identifies repeated tool calls', async () => {
  const detector = new PatternDetector();
  const trace: Trace = {
    sessionId: 'test-1',
    startTime: 'now',
    messages: [
      {
        role: 'gemini',
        content: '',
        toolCalls: [
          { id: '1', name: 'ls', args: { path: '.' } }
        ]
      },
      {
        role: 'gemini',
        content: '',
        toolCalls: [
          { id: '2', name: 'ls', args: { path: '.' } }
        ]
      }
    ]
  };

  const lessons = await detector.analyze(trace);
  assert.strictEqual(lessons.length, 1);
  assert.strictEqual(lessons[0].type, 'pattern');
  assert.match(lessons[0].description, /ls was called 2 times/);
});
