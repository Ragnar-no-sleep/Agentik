import { FileSessionProvider } from '../ingestion/FileSessionProvider.js';
import { AnalysisOrchestrator } from '../analysis/AnalysisOrchestrator.js';
import { PatternDetector } from '../analysis/modules/PatternDetector.js';
import { GapAnalyzer } from '../analysis/modules/GapAnalyzer.js';
import { WorkspaceProvider } from '../persistence/WorkspaceProvider.js';
import { MarkdownPersistenceAdapter } from '../persistence/MarkdownPersistenceAdapter.js';
import { HealthDashboard } from '../persistence/HealthDashboard.js';
import { ILLMProvider } from '../shared/llm.js';
import path from 'node:path';

export interface AppConfig {
  projectRoot: string;
  sessionPath: string;
  llmProvider: ILLMProvider;
}

export class App {
  constructor(private readonly config: AppConfig) {}

  async run(): Promise<void> {
    const provider = new FileSessionProvider(path.dirname(this.config.sessionPath));
    const workspace = new WorkspaceProvider(this.config.projectRoot);
    const persistence = new MarkdownPersistenceAdapter(this.config.projectRoot);
    const dashboard = new HealthDashboard(this.config.projectRoot);

    const orchestrator = new AnalysisOrchestrator();
    orchestrator.registerModule(new PatternDetector());
    orchestrator.registerModule(new GapAnalyzer(this.config.llmProvider, workspace));

    console.log(`[ACE] Processing session: ${this.config.sessionPath}`);
    const trace = await provider.getTrace(this.config.sessionPath);
    
    console.log(`[ACE] Extracted ${trace.messages.length} messages.`);
    
    const lessons = await orchestrator.run(trace);
    console.log(`[ACE] Identified ${lessons.length} lessons.`);

    if (lessons.length > 0) {
      await persistence.updateGeminiInstructions(lessons);
      await persistence.updateMemory(lessons);
      const reportPath = await dashboard.generateReport(lessons);
      console.log(`[ACE] Knowledge base updated.`);
      console.log(`[ACE] Health report generated: ${reportPath}`);
    } else {
      console.log(`[ACE] No significant lessons to persist.`);
    }
  }
}
