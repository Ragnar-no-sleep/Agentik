import { App } from './core/App.js';
import { MockLLMProvider } from './shared/MockLLMProvider.js';

async function main() {
  const config = {
    projectRoot: 'C:\\Users\\titou\\Documents\\Agentik',
    sessionPath: 'C:\\Users\\titou\\.gemini\\tmp\\agentik\\chats\\session-2026-06-09T09-11-aaa607e3.jsonl',
    llmProvider: new MockLLMProvider(),
  };

  const app = new App(config);

  try {
    await app.run();
  } catch (error) {
    console.error('[ACE] Critical failure:', error);
  }
}

main();
