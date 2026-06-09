import { IAnalysisModule } from '../interfaces.js';
import { Trace, Lesson } from '../../shared/types.js';
import { ILLMProvider } from '../../shared/llm.js';
import { WorkspaceProvider } from '../../persistence/WorkspaceProvider.js';

export class GapAnalyzer implements IAnalysisModule {
  public readonly name = 'GapAnalyzer';

  constructor(
    private readonly llm: ILLMProvider,
    private readonly workspace: WorkspaceProvider,
  ) {}

  async analyze(trace: Trace): Promise<Lesson[]> {
    const instructions = await this.workspace.getGeminiInstructions();
    const memory = await this.workspace.getMemory();

    const prompt = `
Analyze the following agent session trace and compare it with the existing project instructions and memory.
Identify any gaps (e.g., the agent followed a pattern not documented, or failed to follow a documented rule) or new lessons learned.

Existing Instructions:
${instructions || 'None'}

Existing Memory:
${memory || 'None'}

Session Trace (last 10 messages for brevity):
${JSON.stringify(trace.messages.slice(-10), null, 2)}

Format your response as a JSON array of Lesson objects:
{
  "type": "gap" | "decision" | "error",
  "description": "string",
  "evidence": "string",
  "recommendation": "string",
  "severity": "low" | "medium" | "high"
}
`;

    const response = await this.llm.generate(prompt);
    try {
      // Basic extraction of JSON array from LLM response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse GapAnalyzer LLM response', e);
    }

    return [];
  }
}
