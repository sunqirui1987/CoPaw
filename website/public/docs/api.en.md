# API Reference

CoPaw exposes REST APIs via FastAPI with the default prefix `/api`. After starting the service, access at `http://127.0.0.1:8088`.

> If `DOCS_ENABLED` is set, visit `/docs` (Swagger) or `/redoc` for interactive docs.

---

## Overview

| Module       | Prefix              | Description                    |
| ------------ | ------------------- | ------------------------------ |
| Agent        | `/api/agent`        | Chat, persona files, run config |
| Config       | `/api/config`       | Channel configuration          |
| Chats        | `/api/chats`        | Session CRUD                   |
| Cron         | `/api/cron`         | Scheduled jobs                 |
| Local Models | `/api/local-models` | Local models (llama.cpp/MLX)   |
| Ollama Models| `/api/ollama-models`| Ollama models                  |
| Providers    | `/api/models`       | LLM providers and active model |
| Skills       | `/api/skills`       | Skill management               |
| Workspace    | `/api/workspace`    | Workspace info, upload/download |
| Envs         | `/api/envs`         | Environment variables          |
| MCP          | `/api/mcp`          | MCP clients                    |
| Console      | `/api/console`      | Console push messages          |

---

## Agent

### POST /api/agent/process

Process user input and return Agent response. Supports SSE streaming.

**Request body:**

```json
{
  "input": [
    {
      "role": "user",
      "content": [{"type": "text", "text": "Hello"}]
    }
  ],
  "session_id": "session123"
}
```

**Response:** SSE stream or JSON (depends on `Accept` etc.)

**Example:**

```bash
curl -N -X POST "http://localhost:8088/api/agent/process" \
  -H "Content-Type: application/json" \
  -d '{"input":[{"role":"user","content":[{"type":"text","text":"Hello"}]}],"session_id":"session123"}'
```

### GET /api/agent/files

List Agent persona Markdown files (e.g. SOUL.md, AGENTS.md).

### GET /api/agent/files/{md_name}

Read a persona file.

### PUT /api/agent/files/{md_name}

Update a persona file.

### GET /api/agent/memory

List memory-related files.

### GET /api/agent/memory/{md_name}

Read a memory file.

### PUT /api/agent/memory/{md_name}

Update a memory file.

### GET /api/agent/running-config

Get Agent runtime config (e.g. max_iters, max_input_length).

### PUT /api/agent/running-config

Update Agent runtime config.

---

## Config

### GET /api/config/channels

Get all channel configs.

### GET /api/config/channels/types

Get available channel type identifiers.

### PUT /api/config/channels

Update all channel configs at once.

### GET /api/config/channels/{channel_name}

Get a single channel config (e.g. `dingtalk`, `feishu`).

### PUT /api/config/channels/{channel_name}

Update a single channel config.

---

## Chats

### GET /api/chats

List sessions. Supports `user_id`, `channel` query params.

### POST /api/chats

Create a new session.

### GET /api/chats/{chat_id}

Get session details and message history.

### PUT /api/chats/{chat_id}

Update session (e.g. rename).

### DELETE /api/chats/{chat_id}

Delete session.

### POST /api/chats/batch-delete

Batch delete sessions. Body: `{"chat_ids": ["id1", "id2"]}`.

---

## Cron

### GET /api/cron/jobs

List all cron jobs.

### GET /api/cron/jobs/{job_id}

Get job details.

### POST /api/cron/jobs

Create job. Body: `CronJobSpec`.

### PUT /api/cron/jobs/{job_id}

Replace job config.

### DELETE /api/cron/jobs/{job_id}

Delete job.

### POST /api/cron/jobs/{job_id}/pause

Pause job.

### POST /api/cron/jobs/{job_id}/resume

Resume job.

### POST /api/cron/jobs/{job_id}/run

Run job once immediately.

### GET /api/cron/jobs/{job_id}/state

Get job run state (e.g. next run time).

---

## Local Models

### GET /api/local-models

List downloaded local models. Optional `backend` query param (`llamacpp` / `mlx`).

### POST /api/local-models/download

Start model download. Body: `{"repo_id": "...", "backend": "llamacpp", "source": "huggingface"}`.

### GET /api/local-models/download-status

Get download task status.

### DELETE /api/local-models/{model_id}

Delete a downloaded local model.

### POST /api/local-models/cancel-download/{task_id}

Cancel an active download.

---

## Ollama Models

### GET /api/ollama-models

List Ollama models.

### POST /api/ollama-models/download

Pull Ollama model. Body: `{"model": "mistral:7b"}`.

### GET /api/ollama-models/download-status

Get Ollama download status.

### DELETE /api/ollama-models/download/{task_id}

Cancel Ollama download.

### DELETE /api/ollama-models/{name}

Delete Ollama model.

---

## Providers (Models)

### GET /api/models

List all LLM providers.

### PUT /api/models/{provider_id}/config

Update provider config (API Key, Base URL, etc.).

### POST /api/models/custom-providers

Create custom provider.

### DELETE /api/models/custom-providers/{provider_id}

Delete custom provider.

### POST /api/models/{provider_id}/models

Refresh provider model list.

### DELETE /api/models/{provider_id}/models/{model_id}

Remove model from provider.

### GET /api/models/active

Get active LLM (provider_id, model).

### PUT /api/models/active

Set active LLM. Body: `{"provider_id": "...", "model": "..."}`.

---

## Skills

### GET /api/skills

List all skills and enabled state.

### GET /api/skills/available

List available skills (for Hub install).

### GET /api/skills/hub/search

Search Skills Hub. Query param: `q`.

### POST /api/skills/hub/install

Install from Hub. Body: `{"url": "https://..."}`.

### POST /api/skills

Create custom skill. Body: `{"name": "...", "content": "..."}`.

### POST /api/skills/{skill_name}/enable

Enable skill.

### POST /api/skills/{skill_name}/disable

Disable skill.

### DELETE /api/skills/{skill_name}

Delete custom skill.

### POST /api/skills/batch-enable

Batch enable. Body: `["skill1", "skill2"]`.

### POST /api/skills/batch-disable

Batch disable. Body: `["skill1", "skill2"]`.

---

## Workspace

### GET /api/workspace

Get workspace info (path, stats).

### GET /api/workspace/download

Download workspace as zip.

### POST /api/workspace/upload

Upload file to workspace.

---

## Envs

### GET /api/envs

List env vars (values masked).

### PUT /api/envs

Update env vars. Body: `[{"key": "TAVILY_API_KEY", "value": "..."}]`.

### DELETE /api/envs/{key}

Delete env var.

---

## MCP

### GET /api/mcp

List MCP clients.

### GET /api/mcp/{client_key}

Get single MCP client config.

### POST /api/mcp

Create MCP client. Body: MCP config JSON.

### PUT /api/mcp/{client_key}

Update MCP client config.

### PATCH /api/mcp/{client_key}/toggle

Toggle MCP client enabled state.

### DELETE /api/mcp/{client_key}

Delete MCP client.

---

## Console

### GET /api/console/push-messages

Get console push messages. Optional `session_id` query param.

---

## Other

### GET /api/version

Return CoPaw version. Path: `/api/version`.

---

## Related Pages

- [Quick start](./quickstart) — Verify install example
- [CLI](./cli) — Most APIs have CLI equivalents
- [Config & working dir](./config) — Config structure
