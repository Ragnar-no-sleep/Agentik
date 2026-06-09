import { Trace } from '../shared/types.js';

export interface ISessionProvider {
  /**
   * Fetches a session trace by its unique identifier or path.
   */
  getTrace(sessionId: string): Promise<Trace>;
}
