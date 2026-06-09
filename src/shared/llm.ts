export interface ILLMProvider {
  /**
   * Generates a completion or analysis based on a prompt.
   */
  generate(prompt: string): Promise<string>;
}
