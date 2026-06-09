import { IAnalysisModule } from '../interfaces.js';
import { Trace, Lesson } from '../../shared/types.js';

export class PatternDetector implements IAnalysisModule {
  public readonly name = 'PatternDetector';

  async analyze(trace: Trace): Promise<Lesson[]> {
    const lessons: Lesson[] = [];
    const toolCallCounts: Record<string, number> = {};

    for (const msg of trace.messages) {
      if (msg.toolCalls) {
        for (const tc of msg.toolCalls) {
          const key = `${tc.name}:${JSON.stringify(tc.args)}`;
          toolCallCounts[key] = (toolCallCounts[key] || 0) + 1;
        }
      }
    }

    for (const [key, count] of Object.entries(toolCallCounts)) {
      if (count > 1) {
        const [name, args] = key.split(':', 1); // Careful with splitting
        const nameOnly = key.substring(0, key.indexOf(':'));
        const argsOnly = key.substring(key.indexOf(':') + 1);

        lessons.push({
          type: 'pattern',
          description: `Repeated tool call detected: ${nameOnly} was called ${count} times with the same arguments.`,
          evidence: argsOnly,
          recommendation: `Consider modularizing this action or checking if the agent is stuck in a loop.`,
          severity: 'medium',
        });
      }
    }

    return lessons;
  }
}
