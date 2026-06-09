import fs from 'node:fs/promises';
import { ISessionProvider } from './interfaces.js';
import { Trace, Message, MessageRole } from '../shared/types.js';

export class FileSessionProvider implements ISessionProvider {
  constructor(private readonly baseDir: string) {}

  async getTrace(sessionFilePath: string): Promise<Trace> {
    const content = await fs.readFile(sessionFilePath, 'utf-8');
    const lines = content.split('\n').filter((line: string) => line.trim() !== '');

    let sessionId = '';
    let projectHash = '';
    let startTime = '';
    const messages: Message[] = [];

    for (const line of lines) {
      try {
        const obj = JSON.parse(line);

        // 1. Check for metadata line
        if (obj.sessionId && !obj.type) {
          sessionId = obj.sessionId;
          projectHash = obj.projectHash;
          startTime = obj.startTime;
          continue;
        }

        // 2. Check for direct message objects or $set updates
        const rawMessages = this.extractMessages(obj);
        for (const rawMsg of rawMessages) {
          const normalized = this.normalizeMessage(rawMsg);
          if (normalized) {
            messages.push(normalized);
          }
        }
      } catch (e) {
        console.error(`Failed to parse line: ${line}`, e);
      }
    }

    return {
      sessionId,
      projectHash,
      startTime,
      messages,
    };
  }

  private extractMessages(obj: any): any[] {
    if (obj.type === 'user' || obj.type === 'gemini' || obj.type === 'system') {
      return [obj];
    }
    if (obj.$set && obj.$set.messages) {
      return obj.$set.messages;
    }
    return [];
  }

  private normalizeMessage(raw: any): Message | null {
    const roleMap: Record<string, MessageRole> = {
      user: 'user',
      gemini: 'gemini',
      system: 'system',
    };

    const role = roleMap[raw.type];
    if (!role) return null;

    let content = '';
    if (typeof raw.content === 'string') {
      content = raw.content;
    } else if (Array.isArray(raw.content)) {
      content = raw.content
        .map((part: any) => part.text || '')
        .join('\n')
        .trim();
    }

    return {
      id: raw.id,
      role,
      content,
      timestamp: raw.timestamp,
      thoughts: raw.thoughts,
      toolCalls: raw.toolCalls?.map((tc: any) => ({
        id: tc.id,
        name: tc.name,
        args: tc.args,
        result: tc.result,
      })),
    };
  }
}
