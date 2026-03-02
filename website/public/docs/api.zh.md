# API 参考

CoPaw 服务通过 FastAPI 暴露 REST API，默认前缀为 `/api`。服务启动后可通过 `http://127.0.0.1:8088` 访问。

> 若启用 `DOCS_ENABLED`，可访问 `/docs`（Swagger）或 `/redoc` 查看交互式文档。

---

## 概览

| 模块       | 前缀              | 说明                     |
| ---------- | ----------------- | ------------------------ |
| Agent      | `/api/agent`      | 对话处理、人设文件、运行配置 |
| Config     | `/api/config`     | 频道配置                 |
| Chats      | `/api/chats`      | 会话 CRUD                |
| Cron       | `/api/cron`       | 定时任务                 |
| Local Models | `/api/local-models` | 本地模型（llama.cpp/MLX）|
| Ollama Models | `/api/ollama-models` | Ollama 模型           |
| Providers  | `/api/models`     | LLM 提供商与激活模型     |
| Skills     | `/api/skills`     | 技能管理                 |
| Workspace  | `/api/workspace`  | 工作区信息、上传/下载    |
| Envs       | `/api/envs`       | 环境变量                 |
| MCP        | `/api/mcp`        | MCP 客户端               |
| Console    | `/api/console`    | 控制台推送消息           |

---

## Agent

### POST /api/agent/process

处理用户输入，返回 Agent 回复。支持 SSE 流式响应。

**请求体：**

```json
{
  "input": [
    {
      "role": "user",
      "content": [{"type": "text", "text": "你好"}]
    }
  ],
  "session_id": "session123"
}
```

**响应：** SSE 流式，或 JSON（取决于 `Accept` 等）

**示例：**

```bash
curl -N -X POST "http://localhost:8088/api/agent/process" \
  -H "Content-Type: application/json" \
  -d '{"input":[{"role":"user","content":[{"type":"text","text":"你好"}]}],"session_id":"session123"}'
```

### GET /api/agent/files

列出 Agent 人设相关 Markdown 文件（如 SOUL.md、AGENTS.md）。

### GET /api/agent/files/{md_name}

读取指定人设文件内容。

### PUT /api/agent/files/{md_name}

更新指定人设文件内容。

### GET /api/agent/memory

列出记忆相关文件。

### GET /api/agent/memory/{md_name}

读取指定记忆文件内容。

### PUT /api/agent/memory/{md_name}

更新指定记忆文件内容。

### GET /api/agent/running-config

获取 Agent 运行时配置（如 max_iters、max_input_length）。

### PUT /api/agent/running-config

更新 Agent 运行时配置。

---

## Config

### GET /api/config/channels

获取所有频道配置。

### GET /api/config/channels/types

获取可用频道类型列表。

### PUT /api/config/channels

整体更新频道配置。

### GET /api/config/channels/{channel_name}

获取单个频道配置（如 `dingtalk`、`feishu`）。

### PUT /api/config/channels/{channel_name}

更新单个频道配置。

---

## Chats

### GET /api/chats

列出会话。支持 `user_id`、`channel` 查询参数筛选。

### POST /api/chats

创建新会话。

### GET /api/chats/{chat_id}

获取会话详情及消息历史。

### PUT /api/chats/{chat_id}

更新会话（如重命名）。

### DELETE /api/chats/{chat_id}

删除会话。

### POST /api/chats/batch-delete

批量删除会话。请求体：`{"chat_ids": ["id1", "id2"]}`。

---

## Cron

### GET /api/cron/jobs

列出所有定时任务。

### GET /api/cron/jobs/{job_id}

获取任务详情。

### POST /api/cron/jobs

创建任务。请求体为 `CronJobSpec`。

### PUT /api/cron/jobs/{job_id}

替换任务配置。

### DELETE /api/cron/jobs/{job_id}

删除任务。

### POST /api/cron/jobs/{job_id}/pause

暂停任务。

### POST /api/cron/jobs/{job_id}/resume

恢复任务。

### POST /api/cron/jobs/{job_id}/run

立即执行一次任务。

### GET /api/cron/jobs/{job_id}/state

获取任务运行状态（如下次运行时间）。

---

## Local Models

### GET /api/local-models

列出已下载的本地模型。可选 `backend` 查询参数（`llamacpp` / `mlx`）。

### POST /api/local-models/download

发起模型下载。请求体：`{"repo_id": "...", "backend": "llamacpp", "source": "huggingface"}`。

### GET /api/local-models/download-status

查询下载任务状态。

### DELETE /api/local-models/{model_id}

删除已下载的本地模型。

### POST /api/local-models/cancel-download/{task_id}

取消正在进行的下载。

---

## Ollama Models

### GET /api/ollama-models

列出 Ollama 模型。

### POST /api/ollama-models/download

拉取 Ollama 模型。请求体：`{"model": "mistral:7b"}`。

### GET /api/ollama-models/download-status

查询 Ollama 下载状态。

### DELETE /api/ollama-models/download/{task_id}

取消 Ollama 下载。

### DELETE /api/ollama-models/{name}

删除 Ollama 模型。

---

## Providers (Models)

### GET /api/models

列出所有 LLM 提供商。

### PUT /api/models/{provider_id}/config

更新提供商配置（API Key、Base URL 等）。

### POST /api/models/custom-providers

创建自定义提供商。

### DELETE /api/models/custom-providers/{provider_id}

删除自定义提供商。

### POST /api/models/{provider_id}/models

刷新提供商模型列表。

### DELETE /api/models/{provider_id}/models/{model_id}

从提供商中移除指定模型。

### GET /api/models/active

获取当前激活的 LLM（provider_id、model）。

### PUT /api/models/active

设置激活的 LLM。请求体：`{"provider_id": "...", "model": "..."}`。

---

## Skills

### GET /api/skills

列出所有技能及启用状态。

### GET /api/skills/available

列出可用的技能（未安装的可从 Hub 导入）。

### GET /api/skills/hub/search

从 Skills Hub 搜索。查询参数：`q`。

### POST /api/skills/hub/install

从 Hub 安装技能。请求体：`{"url": "https://..."}`。

### POST /api/skills

创建自定义技能。请求体：`{"name": "...", "content": "..."}`。

### POST /api/skills/{skill_name}/enable

启用技能。

### POST /api/skills/{skill_name}/disable

禁用技能。

### DELETE /api/skills/{skill_name}

删除自定义技能。

### POST /api/skills/batch-enable

批量启用。请求体：`["skill1", "skill2"]`。

### POST /api/skills/batch-disable

批量禁用。请求体：`["skill1", "skill2"]`。

---

## Workspace

### GET /api/workspace

获取工作区信息（路径、统计等）。

### GET /api/workspace/download

下载工作区为 zip。

### POST /api/workspace/upload

上传文件到工作区。

---

## Envs

### GET /api/envs

列出环境变量（值脱敏）。

### PUT /api/envs

更新环境变量。请求体：`[{"key": "TAVILY_API_KEY", "value": "..."}]`。

### DELETE /api/envs/{key}

删除环境变量。

---

## MCP

### GET /api/mcp

列出 MCP 客户端。

### GET /api/mcp/{client_key}

获取单个 MCP 客户端配置。

### POST /api/mcp

创建 MCP 客户端。请求体为 MCP 配置 JSON。

### PUT /api/mcp/{client_key}

更新 MCP 客户端配置。

### PATCH /api/mcp/{client_key}/toggle

切换 MCP 客户端启用/禁用状态。

### DELETE /api/mcp/{client_key}

删除 MCP 客户端。

---

## Console

### GET /api/console/push-messages

获取控制台推送消息。可选 `session_id` 查询参数。

---

## 其他

### GET /api/version

返回 CoPaw 版本。路径：`/api/version`（无 router 前缀）。

---

## 相关页面

- [快速开始](./quickstart) — 验证安装示例
- [CLI](./cli) — 多数 API 有对应 CLI 命令
- [配置与工作目录](./config) — 配置结构
