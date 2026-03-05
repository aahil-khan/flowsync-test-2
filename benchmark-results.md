# FlowSync Benchmark Results

**Date:** March 5, 2026  
**Repo:** flowsync-test-2  
**Branch:** main  
**Agent:** GitHub Copilot (Claude Sonnet 4.6)  
**Project ID:** 5bc7728e-ed1e-4e62-b94c-bd2e4238c252

---

## Phase 1 — Latency Benchmarks (5 Test Pushes)

| Push # | Commit Message | Push Time | Context Appeared At | Wait (s) | Notes |
|--------|----------------|-----------|---------------------|----------|-------|
| 1 | add formatDate utility | TBD | TBD | TBD | |
| 2 | add error handling to formatDate | TBD | TBD | TBD | |
| 3 | add retry and timeout config constants | TBD | TBD | TBD | |
| 4 | refactor: extract config constants into separate module | TBD | TBD | TBD | |
| 5 | docs: explain backoff strategy in retry logic | TBD | TBD | TBD | |

---

## Phase 2 — Extraction Quality Audit

| Push # | Feature Extracted (Accurate?) | Decision Populated (Y/N) | Risk Populated (Y/N) | Tasks Populated (Y/N) | Confidence Score | Notes |
|--------|-------------------------------|--------------------------|----------------------|-----------------------|-----------------|-------|
| 1 | TBD | TBD | TBD | TBD | TBD | |
| 2 | TBD | TBD | TBD | TBD | TBD | |
| 3 | TBD | TBD | TBD | TBD | TBD | |
| 4 | TBD | TBD | TBD | TBD | TBD | |
| 5 | TBD | TBD | TBD | TBD | TBD | |

**Accuracy Score:** TBD / 5

---

## Phase 3 — RAG Search Quality (5 Test Queries)

| # | Query | Top Result Relevant? (Y/N) | Confidence | Notes |
|---|-------|---------------------------|------------|-------|
| 1 | "What utility functions were added?" | TBD | TBD | |
| 2 | "What error handling was introduced?" | TBD | TBD | |
| 3 | "What configuration constants exist?" | TBD | TBD | |
| 4 | "What refactoring was done?" | TBD | TBD | |
| 5 | "What design decisions were documented?" | TBD | TBD | |

**RAG Score:** TBD / 5

---

## Phase 4 — Hook Performance

| Metric | Value |
|--------|-------|
| `git push` real time (wall clock) | TBD |
| Network baseline (~0.5s estimate) | ~0.5s |
| Post-push hook overhead | TBD |

---

## Phase 5 — CloudWatch Timing Data

| Push # | bedrock_ms | embedding_ms | total_ms | ingestion_ms | diff_chars |
|--------|-----------|-------------|---------|-------------|-----------|
| 1 | TBD | TBD | TBD | TBD | TBD |
| 2 | TBD | TBD | TBD | TBD | TBD |
| 3 | TBD | TBD | TBD | TBD | TBD |
| 4 | TBD | TBD | TBD | TBD | TBD |
| 5 | TBD | TBD | TBD | TBD | TBD |
| **avg** | TBD | TBD | TBD | TBD | TBD |

> Note: CloudWatch data requires manual access to AWS Console → CloudFormation → FlowSyncStack → AiProcessingFn logs. Filter by `BENCHMARK_LOG` and `INGESTION_TIMING`.

---

## Phase 6 — log_context Tool Test

| Check | Result |
|-------|--------|
| log_context call succeeded | TBD |
| search_context returned log_context result | TBD |
| Notes | TBD |

---

## Summary Table

| Metric | Value | Notes |
|--------|-------|-------|
| Push → context available (p50) | TBDs | median of 5 runs |
| Push → context available (p95) | TBDs | worst case |
| Git hook overhead | TBDms | `time git push` - network |
| Nova Pro extraction time (avg) | TBDms | from `bedrock_ms` in CloudWatch |
| Titan Embeddings time (avg) | TBDms | from `embedding_ms` in CloudWatch |
| Ingestion API response time (avg) | TBDms | from `ingestion_ms` in CloudWatch |
| AI extraction accuracy | TBD/5 | correct feature field |
| RAG top-1 relevance | TBD/5 | correct top result |
| `log_context` → searchable | TBD | Phase 6 |
| Cost per push | ~$0.00X | Nova Pro ~$0.008 + Titan ~$0.0001 |

---

## Raw Results Log

### Phase 1 Raw get_recent_changes Responses

*(Populated during benchmark execution)*

### Phase 2 Raw Record Details

*(Populated after all 5 pushes)*

### Phase 3 Raw Search Results

*(Populated during RAG testing)*

### Phase 6 Raw log_context + Search Response

*(Populated during Phase 6)*
