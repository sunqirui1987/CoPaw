# Deployment Guide

This document summarizes deployment options for CoPaw, from local development to production.

---

## Deployment Options Overview

| Method        | Use Case                    | Complexity |
| ------------- | --------------------------- | ---------- |
| One-line install | Quick local setup        | Low        |
| pip install  | Self-managed Python env     | Low        |
| Docker       | Containerized, portable     | Medium     |
| ModelScope Studio | Cloud, no local install | Low        |
| Alibaba Cloud ECS | Production cloud server | Medium     |

---

## Option 1: One-line Install

No Python required. The installer uses [uv](https://docs.astral.sh/uv/) to manage the environment.

**macOS / Linux:**

```bash
curl -fsSL https://copaw.agentscope.io/install.sh | bash
```

**Windows (PowerShell):**

```powershell
irm https://copaw.agentscope.io/install.ps1 | iex
```

Open a new terminal and run:

```bash
copaw app
```

Configure API keys, models, channels, etc. in the Console after it starts.

**Optional flags:**

- `--version 0.0.2`: Install specific version
- `--from-source`: Install from source (dev/testing)
- `--extras llamacpp`: Add llama.cpp local model support
- `--extras mlx`: Add MLX support (Apple Silicon)
- `--extras llamacpp,mlx`: Both

---

## Option 2: pip Install

For users with Python already configured (Python >= 3.10, < 3.14).

```bash
pip install copaw
copaw app
```

**Recommended:** Use a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# or .venv\Scripts\Activate.ps1  # Windows
pip install copaw
```

**Local model support:**

```bash
pip install 'copaw[llamacpp]'   # llama.cpp
pip install 'copaw[mlx]'        # MLX (Apple Silicon)
```

---

## Option 3: Docker

```bash
docker pull agentscope/copaw:latest
docker run -p 8088:8088 -v copaw-data:/app/working agentscope/copaw:latest
```

**Pass environment variables (e.g. API keys):**

```bash
docker run -p 8088:8088 -v copaw-data:/app/working \
  -e DASHSCOPE_API_KEY=sk-xxx \
  agentscope/copaw:latest
```

Or use `.env`:

```bash
docker run -p 8088:8088 -v copaw-data:/app/working \
  --env-file .env \
  agentscope/copaw:latest
```

**Data persistence:** Config, memory, skills are stored in the `copaw-data` volume.

**Custom working dir:** Mount a host directory as `/app/working`:

```bash
docker run -p 8088:8088 -v /path/to/your/copaw:/app/working agentscope/copaw:latest
```

---

## Option 4: ModelScope Studio

Deploy to the cloud without local install.

1. Register at [ModelScope](https://modelscope.cn/register?back=%2Fhome)
2. Open [CoPaw Studio](https://modelscope.cn/studios/fork?target=AgentScope/CoPaw)
3. One-click setup

**Important:** Set the studio to **non-public** so others cannot control your CoPaw.

---

## Option 5: Alibaba Cloud ECS

One-click deploy on Alibaba Cloud.

1. Open [CoPaw ECS deployment link](https://computenest.console.aliyun.com/service/instance/create/cn-hangzhou?type=user&ServiceId=service-1ed84201799f40879884)
2. Fill in deployment parameters
3. Confirm cost and create instance
4. Get access URL after deployment

See [Alibaba Cloud Developer: Deploy your AI assistant in 3 minutes](https://developer.aliyun.com/article/1713682) for details.

---

## Production Recommendations

### Host and Port

Default `127.0.0.1:8088` is local only. For external access:

```bash
copaw app --host 0.0.0.0 --port 8088
```

### Reverse Proxy and HTTPS

Use Nginx or Caddy for reverse proxy and HTTPS:

```nginx
server {
    listen 443 ssl;
    server_name copaw.example.com;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:8088;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Process Manager (PM2)

For auto-restart and logging:

```bash
pip install copaw
copaw app --host 0.0.0.0
# Or use PM2 with appropriate start command
pm2 start "copaw app --host 0.0.0.0" --name copaw
```

See [website/README.md](https://github.com/agentscope-ai/CoPaw/blob/main/website/README.md) for PM2 config.

### Security

- Use a reverse proxy instead of exposing CoPaw directly
- Store API keys via environment variables, not in code
- Keep CoPaw and dependencies updated

---

## Related Pages

- [Quick start](./quickstart) — Install and first run
- [Config & working dir](./config) — Working directory and config
- [CLI](./cli) — Command reference
