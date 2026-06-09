# Architecture of ACE (Agentik Context Engine)

ACE is designed following the **ETL (Extract, Transform, Load)** pattern to manage agentic session context.

## 1. Extraction Layer (`src/ingestion`)
- **FileSessionProvider:** Responsible for reading `.jsonl` session logs from the Gemini CLI's temporary directory. It normalizes raw data into a structured `Trace` domain model.

## 2. Intelligence Layer (`src/analysis`)
- **AnalysisOrchestrator:** A central hub that runs multiple analysis modules.
- **Analysis Modules:**
  - **PatternDetector:** Uses algorithmic detection to find repeated actions or tool calls.
  - **GapAnalyzer:** Uses an LLM (Mistral or Gemini) to compare the current session against `GEMINI.md` and `MEMORY.md`.
- **LLM Providers:**
  - **MistralLLMProvider:** Integration with Mistral AI SDK for real semantic analysis.
  - **MockLLMProvider:** Fallback for testing environments.

## 3. Persistence Layer (`src/persistence`)
- **WorkspaceProvider:** Reads existing project instructions and memory.
- **MarkdownPersistenceAdapter:** Writes distilled lessons back to `GEMINI.md` and `MEMORY.md`.
- **HealthDashboard:** Generates a visual `ACE_HEALTH_REPORT.html` with context debt metrics.

## 4. Automation Layer (`src/core`)
- **SessionWatcher:** Uses `chokidar` to monitor session logs in real-time, triggering the `App` pipeline on file changes.

## SOLID Principles in ACE
- **Single Responsibility:** Each class has a single, well-defined role (Parsing, Analyzing, or Writing).
- **Open/Closed:** New `IAnalysisModule` implementations can be added without modifying the `AnalysisOrchestrator`.
- **Dependency Inversion:** High-level logic depends on interfaces (`ISessionProvider`, `IAnalysisModule`, `ILLMProvider`), allowing for easy mocking and extension.
