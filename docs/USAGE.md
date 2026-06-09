# Usage Guide for ACE

## Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

## Development
- **Run the prototype:**
  ```bash
  npm run dev
  ```
- **Run tests:**
  ```bash
  npm test
  ```
- **Build the project:**
  ```bash
  npm run build
  ```

## Configuration
Currently, ACE is configured to point to a specific session log file in `src/index.ts`. In a production environment, this would be passed as a CLI argument or integrated via a post-session hook.

### LLM Provider
ACE uses an `ILLMProvider` interface. By default, a `MockLLMProvider` is used for testing. To use a real LLM, implement the interface with your preferred API (e.g., Gemini API).

## Knowledge Base
ACE automatically updates the following files in your project root:
- **GEMINI.md:** Contains codified rules and architectural decisions.
- **MEMORY.md:** Contains recent patterns and errors to watch out for.
