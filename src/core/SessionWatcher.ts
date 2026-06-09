import chokidar from 'chokidar';
import { App, AppConfig } from './App.js';
import path from 'node:path';

export class SessionWatcher {
  constructor(private readonly config: AppConfig) {}

  start(): void {
    const chatsDir = path.dirname(this.config.sessionPath);
    console.log(`[ACE Watcher] Monitoring directory: ${chatsDir}`);

    const watcher = chokidar.watch(chatsDir, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
    });

    watcher.on('change', async (filePath) => {
      if (filePath.endsWith('.jsonl')) {
        console.log(`\n[ACE Watcher] Change detected in: ${filePath}`);
        const app = new App({
          ...this.config,
          sessionPath: filePath,
        });

        try {
          await app.run();
        } catch (error) {
          console.error('[ACE Watcher] Analysis failed:', error);
        }
      }
    });

    watcher.on('add', (filePath) => {
      if (filePath.endsWith('.jsonl')) {
        console.log(`[ACE Watcher] New session detected: ${filePath}`);
      }
    });
  }
}
