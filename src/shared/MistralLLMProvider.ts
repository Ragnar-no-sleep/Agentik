import { Mistral } from '@mistralai/mistralai';
import { ILLMProvider } from './llm.js';
import dotenv from 'dotenv';

dotenv.config();

export class MistralLLMProvider implements ILLMProvider {
  private client: Mistral;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.MISTRAL_API_KEY;
    if (!key) {
      throw new Error('Mistral API Key is missing. Set MISTRAL_API_KEY in .env');
    }
    this.client = new Mistral({ apiKey: key });
  }

  async generate(prompt: string): Promise<string> {
    try {
      const response = await this.client.chat.complete({
        model: 'mistral-tiny', // or mistral-small-latest for better analysis
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.choices?.[0]?.message?.content;
      if (typeof content === 'string') {
        return content;
      }
      throw new Error('Unexpected response format from Mistral');
    } catch (error) {
      console.error('[MistralLLMProvider] Error:', error);
      throw error;
    }
  }
}
