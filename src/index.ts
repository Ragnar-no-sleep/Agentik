import { App } from './core/App.js';
import { SessionWatcher } from './core/SessionWatcher.js';
import { MistralLLMProvider } from './shared/MistralLLMProvider.js';
import { MockLLMProvider } from './shared/MockLLMProvider.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  const isWatcher = args.includes('--watch');

  const config = {
    projectRoot: process.cwd(),
    sessionPath: 'C:\\Users\\titou\\.gemini\\tmp\\agentik\\chats\\session-2026-06-09T09-11-aaa607e3.jsonl',
    llmProvider: process.env.MISTRAL_API_KEY 
      ? new MistralLLMProvider() 
      : new MockLLMProvider(),
  };

  if (isWatcher) {
    const watcher = new SessionWatcher(config);
    watcher.start();
  } else {
    const app = new App(config);
    try {
      await app.run();
    } catch (error) {
      console.error('[ACE] Critical failure:', error);
    }
  }
}

main();
