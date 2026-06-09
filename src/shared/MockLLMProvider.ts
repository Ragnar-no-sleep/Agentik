import { ILLMProvider } from '../shared/llm.js';

export class MockLLMProvider implements ILLMProvider {
  async generate(prompt: string): Promise<string> {
    console.log('--- LLM Prompt ---');
    console.log(prompt);
    return `
[
  {
    "type": "gap",
    "description": "The agent consistently uses TypeScript ESNext modules but GEMINI.md doesn't specify this standard.",
    "evidence": "FileSessionProvider.ts and index.ts implementation",
    "recommendation": "Update GEMINI.md to mandate ESNext modules and NodeNext module resolution.",
    "severity": "medium"
  }
]
`;
  }
}
