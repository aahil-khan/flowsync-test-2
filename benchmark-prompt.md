# FlowSync Benchmark Agent Prompt

**Paste this entire document into your AI agent (Copilot, Claude, etc.) inside the test FlowSync project.**

---

## Context

You are running a benchmark of the FlowSync system. FlowSync is a VS Code extension that captures development context on every `git push` — it sends the diff to an AWS Lambda which calls Bedrock Nova Pro for extraction and Titan Embeddings for vector indexing. You will make real commits, observe the results, and record numbers for a performance slide.

The MCP tools available to you are:
- `get_project_context` — retrieve extracted context records for a branch
- `get_recent_changes` — get recent records across branches
- `search_context` — natural language RAG query
- `log_context` — record reasoning manually
- `get_events` — raw event fetch

Your `projectId` and `token` are already configured in the MCP server environment.

---

## Phase 1 — Latency benchmarks (5 test pushes)

Make 5 distinct commits to this repo, each touching different files and with a meaningful commit message. Space them 30 seconds apart. After each push:

1. Wait 15 seconds
2. Call `get_recent_changes` with `limit: 1` and record whether the context record is present
3. If not present after 15s, wait another 15s and retry (record total wait time)

**Suggested commits to make:**

```bash
# Commit 1 — add a simple utility function
echo "export function formatDate(d: Date): string { return d.toISOString().split('T')[0]; }" > src/utils/date.ts
git add . && git commit -m "add formatDate utility"
git push

# Commit 2 — add error handling to an existing file (edit any existing file)
# Add a try/catch block or null-check to any function in the codebase
git add . && git commit -m "add error handling to formatDate"
git push

# Commit 3 — add a new feature file
echo "export const MAX_RETRIES = 3; export const TIMEOUT_MS = 5000;" > src/config/limits.ts
git add . && git commit -m "add retry and timeout config constants"
git push

# Commit 4 — refactor: rename something or split a function
git add . && git commit -m "refactor: extract config constants into separate module"
git push

# Commit 5 — add a comment explaining a design decision
# Edit any file and add a comment like: "// Using exponential backoff to avoid thundering herd"
git add . && git commit -m "docs: explain backoff strategy in retry logic"
git push
```

**Record for each push:**
| Push # | Push time | Context appeared at | Wait (s) | Notes |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

---

## Phase 2 — Extraction quality audit

After all 5 pushes, call `get_recent_changes` with `limit: 5` and retrieve all 5 records.

For each record, evaluate:

| Push # | Feature extracted (accurate?) | Decision populated (Y/N) | Risk populated (Y/N) | Tasks populated (Y/N) | Confidence score | Notes |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

**Score:** Count how many out of 5 had an accurate `feature` field (matches what you actually committed).

---

## Phase 3 — RAG search quality (5 test queries)

Call `search_context` with each of these 5 questions. For each, record whether the top result is the correct/most relevant record:

| # | Query | Top result relevant? (Y/N) | Confidence | Notes |
|---|---|---|---|---|
| 1 | `"What utility functions were added?"` | | | |
| 2 | `"What error handling was introduced?"` | | | |
| 3 | `"What configuration constants exist?"` | | | |
| 4 | `"What refactoring was done?"` | | | |
| 5 | `"What design decisions were documented?"` | | | |

**Score:** Count Y's out of 5.

---

## Phase 4 — Hook performance

Run this from the repo root and record the output:

```bash
time git commit --allow-empty -m "benchmark: empty commit for timing" && time git push
```

Record:
- `git push` real time (wall clock)
- Subtract ~0.5s for network/GitHub — the remainder is the post-push hook overhead

---

## Phase 5 — Collect CloudWatch timing data

After all pushes are complete, go to:

**AWS Console → CloudFormation → FlowSyncStack → Resources → AiProcessingFn → Logs → CloudWatch Logs**

Filter log events by: `BENCHMARK_LOG`

For each log entry you find, the JSON will contain:
```json
{
  "BENCHMARK_LOG": true,
  "bedrock_ms": <number>,
  "embedding_ms": <number>,
  "total_ms": <number>,
  "diff_chars": <number>,
  "confidence": <number>,
  "has_decision": true/false,
  "has_risk": true/false
}
```

Also filter by: `INGESTION_TIMING` in the **IngestionFn** log group to get API response times.

**Fill in from CloudWatch:**

| Push # | bedrock_ms | embedding_ms | total_ms | ingestion_ms | diff_chars |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| **avg** | | | | | |

---

## Phase 6 — log_context tool test

Call `log_context` with this input:

```
reasoning: "Chose to store config constants in a separate module rather than inline values to make them easily discoverable and changeable without touching business logic"
branch: "main"
author: "<your git username>"
decision: "Extracted retry and timeout constants into src/config/limits.ts for single source of truth"
tasks: ["add unit tests for formatDate", "wire MAX_RETRIES into the HTTP client"]
risk: "config module not yet imported by any consumer — dead code until wired up"
```

Then immediately call `search_context` with: `"What was decided about config constants?"`

Record: Did `log_context` result appear in the search results? (Y/N)

---

## Summary table to fill in

At the end, produce this table for the slide:

| Metric | Value | Notes |
|---|---|---|
| Push → context available (p50) | Xs | median of 5 runs |
| Push → context available (p95) | Xs | worst case |
| Git hook overhead | <Xms | `time git push` - network |
| Nova Pro extraction time (avg) | Xms | from `bedrock_ms` in CloudWatch |
| Titan Embeddings time (avg) | Xms | from `embedding_ms` in CloudWatch |
| Ingestion API response time (avg) | Xms | from `ingestion_ms` in CloudWatch |
| AI extraction accuracy | X/5 | correct feature field |
| RAG top-1 relevance | X/5 | correct top result |
| `log_context` → searchable | Y/N | Phase 6 |
| Cost per push | ~$0.00X | Nova Pro ~$0.008 + Titan ~$0.0001 |

---

## Notes for the agent

- Do not skip Phase 5 — the CloudWatch `BENCHMARK_LOG` lines are the most reliable numbers
- If a context record is missing after 30s, it likely means the AI Lambda errored — check CloudWatch logs for `ERROR` lines
- The `processingDuration` field on each context record returned by `get_recent_changes` will also contain the `total_ms` value directly
- All timing is in **milliseconds** in the logs but report in **seconds** on the slide for readability