# 本地模型

CoPaw 支持在本地运行 LLM，无需 API Key 或云端服务。适合隐私敏感、离线或希望完全自托管的用户。

---

## 支持的后端

| 后端       | 适用平台                     | 安装方式                         |
| ---------- | ---------------------------- | -------------------------------- |
| **llama.cpp** | macOS / Linux / Windows       | `pip install 'copaw[llamacpp]'` |
| **MLX**       | Apple Silicon（M1/M2/M3/M4） | `pip install 'copaw[mlx]'`      |
| **Ollama**    | 跨平台（需单独安装 Ollama）  | `pip install ollama`            |

---

## 安装

### llama.cpp（跨平台）

```bash
pip install 'copaw[llamacpp]'
```

依赖 `llama-cpp-python` 和 `huggingface_hub`。适用于 GGUF 格式模型。

### MLX（Apple Silicon）

```bash
pip install 'copaw[mlx]'
```

依赖 `mlx-lm` 和 `huggingface_hub`。仅支持 Apple Silicon Mac。

### Ollama

1. 从 [ollama.com](https://ollama.com) 安装 Ollama 并启动守护进程
2. 安装 Ollama Python SDK：`pip install ollama`
3. 模型由 Ollama 管理，CoPaw 通过 API 调用

---

## 下载模型

### llama.cpp / MLX（CoPaw 管理）

```bash
# 下载 GGUF 模型（自动选择 Q4_K_M 量化）
copaw models download Qwen/Qwen3-4B-GGUF

# 指定文件名
copaw models download TheBloke/Mistral-7B-Instruct-v0.2-GGUF \
  -f mistral-7b-instruct-v0.2.Q4_K_M.gguf

# 从 ModelScope 下载（国内网络友好）
copaw models download Qwen/Qwen2-0.5B-Instruct-GGUF --source modelscope

# 下载 MLX 模型（Apple Silicon）
copaw models download Qwen/Qwen3-4B --backend mlx
```

| 选项        | 简写 | 默认值        | 说明                           |
| ----------- | ---- | ------------- | ------------------------------ |
| `--backend` | `-b` | `llamacpp`    | 目标后端（`llamacpp` 或 `mlx`）|
| `--source`  | `-s` | `huggingface` | 下载源（`huggingface` 或 `modelscope`）|
| `--file`    | `-f` | _（自动）_    | 指定文件名；省略时自动选择 GGUF（优先 Q4_K_M）|

### Ollama（Ollama 管理）

```bash
# 拉取 Ollama 模型
copaw models ollama-pull mistral:7b
copaw models ollama-pull qwen2.5:3b

# 查看已安装的 Ollama 模型
copaw models ollama-list

# 删除 Ollama 模型
copaw models ollama-remove mistral:7b --yes
```

---

## 查看与管理本地模型

```bash
# 列出已下载的本地模型
copaw models local

# 按后端筛选
copaw models local --backend llamacpp
copaw models local --backend mlx

# 删除已下载模型
copaw models remove-local <model_id>
copaw models remove-local <model_id> --yes   # 跳过确认
```

---

## 配置与使用

1. 运行 `copaw models config` 或 `copaw models set-llm`
2. 选择 `llamacpp` 或 `mlx` 提供商（若已安装）
3. 从列表中选择已下载的模型
4. 启动 `copaw app` 即可使用

也可在**控制台 → 设置 → 模型**中管理：选择对应提供商，在「本地模型」中查看、下载、删除模型。

---

## 控制台 UI

在控制台 **设置 → 模型** 中：

- 查看已下载的 llama.cpp / MLX 模型
- 发起新下载（支持进度显示）
- 删除不需要的模型
- 选择当前使用的模型

---

## 与云模型对比

| 方面       | 本地模型（llama.cpp / MLX） | 云模型（DashScope、ModelScope） |
| ---------- | --------------------------- | ------------------------------- |
| API Key    | 不需要                       | 需要                            |
| 隐私       | 数据不离开本机               | 请求发送到云端                  |
| 成本       | 无按量费用，需硬件           | 按 token 计费                   |
| 性能       | 取决于本地 GPU/CPU          | 通常更强                        |
| 模型选择   | 需自行下载 GGUF/MLX         | 提供商预置模型                  |

---

## 选型建议

- **隐私优先、离线场景**：本地模型
- **Apple Silicon Mac**：优先考虑 MLX，推理效率高
- **Windows / Linux、无 GPU**：llama.cpp + 小参数量化模型（如 Qwen2-0.5B、Qwen3-4B）
- **已有 Ollama 环境**：直接使用 Ollama 集成，无需 CoPaw 下载

---

## 常见问题

**Q: 下载失败或很慢？**

- 使用 `--source modelscope` 从魔搭下载，国内网络更稳定
- 若使用 HuggingFace，可配置 `HF_ENDPOINT` 或代理

**Q: 提示 "Local model dependencies not installed"？**

- 执行 `pip install 'copaw[llamacpp]'` 或 `pip install 'copaw[mlx]'`

**Q: 模型加载失败？**

- 确认模型文件完整、路径正确
- llama.cpp 需 GGUF 格式；MLX 需 MLX 格式目录

---

## 相关页面

- [快速开始](./quickstart) — 安装与首次启动
- [CLI](./cli) — `copaw models` 命令详解
- [配置与工作目录](./config) — 模型提供商配置
