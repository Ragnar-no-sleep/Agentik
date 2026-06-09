import { Trace, Lesson } from '../shared/types.js';

export interface IAnalysisModule {
  /**
   * Unique name of the analysis module.
   */
  name: string;

  /**
   * Executes the analysis on a given trace.
   */
  analyze(trace: Trace): Promise<Lesson[]>;
}

export interface IAnalysisOrchestrator {
  /**
   * Runs all registered analysis modules on a trace.
   */
  run(trace: Trace): Promise<Lesson[]>;

  /**
   * Registers a new analysis module.
   */
  registerModule(module: IAnalysisModule): void;
}
