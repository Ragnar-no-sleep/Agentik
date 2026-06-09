# Design Document: Agentik Context Engine (ACE)

## 1. Vision & Problem Statement
Developers often lose context when switching between sessions. Important decisions, error resolutions, and architectural patterns are frequently trapped in transient chat histories. ACE solves this by acting as an "Observability Layer" for agentic sessions.

## 2. Architectural Principles (SOLID)

### Single Responsibility Principle (SRP)
Each component has one reason to change:
- `SessionProvider`: Responsible only for fetching raw logs from different sources.
- `KnowledgeDistiller`: Responsible only for the LLM-driven synthesis of data.
- `WorkspaceAdapter`: Responsible only for updating local workspace files like `GEMINI.md`.

### Open/Closed Principle (OCP)
The analysis engine is closed for modification but open for extension via **Analysis Modules**. A new module can be added to detect, for example, "Security Anti-patterns" without touching the core orchestration logic.

### Liskov Substitution Principle (LSP)
Analysis modules follow a strict interface, ensuring the orchestrator can execute any combination of modules interchangeably.

### Interface Segregation Principle (ISP)
Clients (agents) interact with specific, lean interfaces rather than a "God Object" context.

### Dependency Inversion Principle (DIP)
High-level policy (Analysis Logic) does not depend on low-level details (File System/API). Both depend on abstractions.

## 3. The ETL Pipeline

### Extract
- **Source:** `.jsonl` session files from `.gemini/tmp/`.
- **Normalization:** Raw logs are converted into a standardized `Trace` object containing thoughts, tool calls, and messages.

### Transform (The Intelligence Layer)
- **Pattern Matching:** Algorithmic detection of repeated actions.
- **LLM Synthesis:** Specialized agents analyze the `Trace` to extract "Lessons Learned" and "Documentation Gaps".
- **Validation:** Ensuring extracted knowledge doesn't contradict existing global policies.

### Load
- **Instruction Update:** Injecting new knowledge into `GEMINI.md`.
- **Memory Persistence:** Updating `MEMORY.md` for short-term session recall.
- **Reporting:** Generating a "Workflow Health Report" for the human developer.

## 4. Technology Stack
- **Language:** TypeScript (for type-safe domain modeling).
- **Runtime:** Node.js.
- **Validation:** Zod for rigorous schema enforcement.
- **Intelligence:** Gemini API (1.5 Pro/Flash).

## 5. Roadmap
1. **Milestone 1:** Basic Parser for `.jsonl` logs and domain model definition.
2. **Milestone 2:** "Lesson Extractor" agent implementation.
3. **Milestone 3:** Automatic `GEMINI.md` updater.
4. **Milestone 4:** Full CLI integration and reporting dashboard.
