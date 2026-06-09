import { IAnalysisModule, IAnalysisOrchestrator } from './interfaces.js';
import { Trace, Lesson } from '../shared/types.js';

export class AnalysisOrchestrator implements IAnalysisOrchestrator {
  private modules: IAnalysisModule[] = [];

  registerModule(module: IAnalysisModule): void {
    this.modules.push(module);
  }

  async run(trace: Trace): Promise<Lesson[]> {
    const allLessons: Lesson[] = [];

    for (const module of this.modules) {
      try {
        const lessons = await module.analyze(trace);
        allLessons.push(...lessons);
      } catch (error) {
        console.error(`Module ${module.name} failed during analysis:`, error);
      }
    }

    return allLessons;
  }
}
