# Usage Guide for ACE

## Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

## Development
- **Run the prototype (Single run):**
  ```bash
  npm run dev
  ```
- **Run in Watch Mode (Automation):**
  ```bash
  npm run watch
  ```
- **Run tests:**
  ```bash
  npm test
  ```

## Configuration
### Environment Variables
Create a `.env` file in the root directory:
```env
MISTRAL_API_KEY=your_mistral_api_key
```

### LLM Provider
ACE uses an `ILLMProvider` interface. 
- If `MISTRAL_API_KEY` is present, it uses `MistralLLMProvider`.
- Otherwise, it falls back to `MockLLMProvider`.

## Knowledge Base & Health
ACE automatically updates:
- **GEMINI.md:** Long-term rules and codified lessons.
- **MEMORY.md:** Recent errors and patterns.
- **ACE_HEALTH_REPORT.html:** A visual dashboard of your workspace health and context debt.
