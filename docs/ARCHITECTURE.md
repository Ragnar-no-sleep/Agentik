# Architecture of ACE (Agentik Context Engine)

ACE is designed following the **ETL (Extract, Transform, Load)** pattern to manage agentic session context.

## 1. Extraction Layer (`src/ingestion`)
- **FileSessionProvider:** Responsible for reading `.jsonl` session logs from the Gemini CLI's temporary directory. It normalizes raw data into a structured `Trace` domain model.

## 2. Intelligence Layer (`src/analysis`)
- **AnalysisOrchestrator:** A central hub that runs multiple analysis modules.
- **Analysis Modules:**
  - **PatternDetector:** Uses algorithmic detection to find repeated actions or tool calls.
  - **GapAnalyzer:** Uses an LLM to compare the current session against `GEMINI.md` and `MEMORY.md` to identify missing instructions or new decisions.

## 3. Persistence Layer (`src/persistence`)
- **WorkspaceProvider:** Reads existing project instructions and memory.
- **MarkdownPersistenceAdapter:** Writes distilled lessons back to `GEMINI.md` (for long-term rules) and `MEMORY.md` (for short-term patterns).

## 4. Core Orchestration (`src/core`)
- **App:** The entry point that ties all components together and executes the pipeline.

## SOLID Principles in ACE
- **Single Responsibility:** Each class has a single, well-defined role (Parsing, Analyzing, or Writing).
- **Open/Closed:** New `IAnalysisModule` implementations can be added without modifying the `AnalysisOrchestrator`.
- **Dependency Inversion:** High-level logic depends on interfaces (`ISessionProvider`, `IAnalysisModule`, `ILLMProvider`), allowing for easy mocking and extension.
