import fs from 'node:fs/promises';
import path from 'node:path';
import { Lesson } from '../shared/types.js';

export class MarkdownPersistenceAdapter {
  constructor(private readonly projectRoot: string) {}

  async updateGeminiInstructions(lessons: Lesson[]): Promise<void> {
    const filePath = path.join(this.projectRoot, 'GEMINI.md');
    let content = '';
    try {
      content = await fs.readFile(filePath, 'utf-8');
    } catch {
      content = '# Project Instructions\n';
    }

    const gapLessons = lessons.filter((l) => l.type === 'gap' || l.type === 'decision');
    if (gapLessons.length === 0) return;

    let lessonsSection = '\n## Lessons Learned & Rules to Codify\n';
    for (const lesson of gapLessons) {
      lessonsSection += `- **${lesson.description}**\n  - *Recommendation:* ${lesson.recommendation}\n  - *Evidence:* ${lesson.evidence}\n`;
    }

    // Simple append for now, could be more sophisticated (e.g., avoid duplicates)
    await fs.writeFile(filePath, content + lessonsSection);
  }

  async updateMemory(lessons: Lesson[]): Promise<void> {
    const filePath = path.join(this.projectRoot, 'MEMORY.md');
    let content = '';
    try {
      content = await fs.readFile(filePath, 'utf-8');
    } catch {
      content = '# Project Memory\n';
    }

    const errorLessons = lessons.filter((l) => l.type === 'error' || l.type === 'pattern');
    if (errorLessons.length === 0) return;

    let memorySection = '\n## Recent Patterns & Errors to Watch\n';
    for (const lesson of errorLessons) {
      memorySection += `- [ ] **${lesson.type.toUpperCase()}:** ${lesson.description}\n  - *Action:* ${lesson.recommendation}\n`;
    }

    await fs.writeFile(filePath, content + memorySection);
  }
}
