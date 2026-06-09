import fs from 'node:fs/promises';
import path from 'node:path';

export class WorkspaceProvider {
  constructor(private readonly projectRoot: string) {}

  async getGeminiInstructions(): Promise<string> {
    const filePath = path.join(this.projectRoot, 'GEMINI.md');
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch {
      return ''; // No instructions found
    }
  }

  async getMemory(): Promise<string> {
    const filePath = path.join(this.projectRoot, 'MEMORY.md');
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch {
      return '';
    }
  }
}
