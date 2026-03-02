# Local Models

CoPaw can run LLMs entirely on your machine — no API keys or cloud services required. Ideal for privacy-sensitive, offline, or fully self-hosted use cases.

---

## Supported Backends

| Backend       | Platform                      | Install                          |
| ------------- | ----------------------------- | -------------------------------- |
| **llama.cpp** | macOS / Linux / Windows       | `pip install 'copaw[llamacpp]'` |
| **MLX**       | Apple Silicon (M1/M2/M3/M4)   | `pip install 'copaw[mlx]'`      |
| **Ollama**    | Cross-platform (install separately) | `pip install ollama`        |

---

## Installation

### llama.cpp (Cross-platform)

```bash
pip install 'copaw[llamacpp]'
```

Requires `llama-cpp-python` and `huggingface_hub`. Works with GGUF-format models.

### MLX (Apple Silicon)

```bash
pip install 'copaw[mlx]'
```

Requires `mlx-lm` and `huggingface_hub`. Apple Silicon Macs only.

### Ollama

1. Install Ollama from [ollama.com](https://ollama.com) and start the daemon
2. Install the Ollama Python SDK: `pip install ollama`
3. Models are managed by Ollama; CoPaw calls the API

---

## Downloading Models

### llama.cpp / MLX (CoPaw-managed)

```bash
# Download GGUF model (auto-selects Q4_K_M quantization)
copaw models download Qwen/Qwen3-4B-GGUF

# Specify filename
copaw models download TheBloke/Mistral-7B-Instruct-v0.2-GGUF \
  -f mistral-7b-instruct-v0.2.Q4_K_M.gguf

# Download from ModelScope (better for some regions)
copaw models download Qwen/Qwen2-0.5B-Instruct-GGUF --source modelscope

# Download MLX model (Apple Silicon)
copaw models download Qwen/Qwen3-4B --backend mlx
```

| Option      | Short | Default       | Description                          |
| ----------- | ----- | ------------- | ------------------------------------ |
| `--backend` | `-b`  | `llamacpp`   | Target backend (`llamacpp` or `mlx`) |
| `--source`  | `-s`  | `huggingface`| Download source (`huggingface` or `modelscope`) |
| `--file`    | `-f`  | _(auto)_      | Specific filename; omit to auto-select GGUF (prefer Q4_K_M) |

### Ollama (Ollama-managed)

```bash
# Pull Ollama models
copaw models ollama-pull mistral:7b
copaw models ollama-pull qwen2.5:3b

# List installed Ollama models
copaw models ollama-list

# Remove Ollama model
copaw models ollama-remove mistral:7b --yes
```

---

## Listing and Managing Local Models

```bash
# List downloaded local models
copaw models local

# Filter by backend
copaw models local --backend llamacpp
copaw models local --backend mlx

# Remove downloaded model
copaw models remove-local <model_id>
copaw models remove-local <model_id> --yes   # Skip confirmation
```

---

## Configuration and Usage

1. Run `copaw models config` or `copaw models set-llm`
2. Select the `llamacpp` or `mlx` provider (if installed)
3. Choose a downloaded model from the list
4. Start `copaw app` to use it

You can also manage models in **Console → Settings → Models**: select the provider, then use "Local Models" to view, download, or delete models.

---

## Console UI

In Console **Settings → Models**:

- View downloaded llama.cpp / MLX models
- Start new downloads (with progress)
- Delete unwanted models
- Select the active model

---

## Local vs Cloud Models

| Aspect      | Local (llama.cpp / MLX) | Cloud (DashScope, ModelScope) |
| ----------- | ----------------------- | ---------------------------- |
| API Key     | Not required            | Required                     |
| Privacy     | Data stays on device    | Requests sent to cloud       |
| Cost        | No per-token fees; needs hardware | Per-token billing    |
| Performance | Depends on local GPU/CPU | Usually stronger             |
| Model choice| Download GGUF/MLX yourself | Provider pre-loaded models  |

---

## Choosing a Backend

- **Privacy-first, offline:** Local models
- **Apple Silicon Mac:** Prefer MLX for efficient inference
- **Windows / Linux, no GPU:** llama.cpp + small quantized models (e.g. Qwen2-0.5B, Qwen3-4B)
- **Already using Ollama:** Use Ollama integration; no CoPaw download needed

---

## FAQ

**Q: Download fails or is very slow?**

- Use `--source modelscope` for ModelScope; often more stable in some regions
- For HuggingFace, configure `HF_ENDPOINT` or a proxy if needed

**Q: "Local model dependencies not installed"?**

- Run `pip install 'copaw[llamacpp]'` or `pip install 'copaw[mlx]'`

**Q: Model fails to load?**

- Ensure the model file is complete and path is correct
- llama.cpp needs GGUF format; MLX needs MLX-format directory

---

## Related Pages

- [Quick start](./quickstart) — Install and first run
- [CLI](./cli) — `copaw models` commands
- [Config & working dir](./config) — Model provider configuration
