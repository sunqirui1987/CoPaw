# 部署指南

本文档汇总 CoPaw 的多种部署方式，从本地开发到生产环境。

---

## 部署方式概览

| 方式           | 适用场景                 | 复杂度 |
| -------------- | ------------------------ | ------ |
| 一键安装       | 本地快速体验             | 低     |
| pip 安装       | 自行管理 Python 环境     | 低     |
| Docker         | 容器化、可移植部署       | 中     |
| 魔搭创空间     | 云端、无需本地安装       | 低     |
| 阿里云 ECS     | 生产级云服务器           | 中     |

---

## 方式一：一键安装

无需预装 Python，安装脚本通过 [uv](https://docs.astral.sh/uv/) 自动管理环境。

**macOS / Linux：**

```bash
curl -fsSL https://copaw.agentscope.io/install.sh | bash
```

**Windows（PowerShell）：**

```powershell
irm https://copaw.agentscope.io/install.ps1 | iex
```

安装后打开新终端，执行：

```bash
copaw app
```

配置（API Key、模型、频道等）可在浏览器打开控制台后完成。

**可选参数：**

- `--version 0.0.2`：安装指定版本
- `--from-source`：从源码安装（开发/测试）
- `--extras llamacpp`：安装 llama.cpp 本地模型支持
- `--extras mlx`：安装 MLX 支持（Apple Silicon）
- `--extras llamacpp,mlx`：同时安装两者

---

## 方式二：pip 安装

适合已配置 Python 环境的用户（需 Python >= 3.10, < 3.14）。

```bash
pip install copaw
copaw app
```

**推荐：** 使用虚拟环境：

```bash
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# 或 .venv\Scripts\Activate.ps1  # Windows
pip install copaw
```

**本地模型支持：**

```bash
pip install 'copaw[llamacpp]'   # llama.cpp
pip install 'copaw[mlx]'        # MLX (Apple Silicon)
```

---

## 方式三：Docker

```bash
docker pull agentscope/copaw:latest
docker run -p 8088:8088 -v copaw-data:/app/working agentscope/copaw:latest
```

**传递环境变量（如 API Key）：**

```bash
docker run -p 8088:8088 -v copaw-data:/app/working \
  -e DASHSCOPE_API_KEY=sk-xxx \
  agentscope/copaw:latest
```

或使用 `.env` 文件：

```bash
docker run -p 8088:8088 -v copaw-data:/app/working \
  --env-file .env \
  agentscope/copaw:latest
```

**数据持久化：** 配置、记忆、技能等存储在 `copaw-data` 卷中。

**自定义工作目录：** 可将宿主机目录挂载为 `/app/working`：

```bash
docker run -p 8088:8088 -v /path/to/your/copaw:/app/working agentscope/copaw:latest
```

---

## 方式四：魔搭创空间

无需本地安装，一键部署到云端。

1. 前往 [魔搭](https://modelscope.cn/register?back=%2Fhome) 注册并登录
2. 打开 [CoPaw 创空间](https://modelscope.cn/studios/fork?target=AgentScope/CoPaw)
3. 一键配置即可使用

**重要：** 请将空间设为 **非公开**，否则他人可能操纵你的 CoPaw。

---

## 方式五：阿里云 ECS

在阿里云上一键部署 CoPaw。

1. 打开 [CoPaw 阿里云 ECS 部署链接](https://computenest.console.aliyun.com/service/instance/create/cn-hangzhou?type=user&ServiceId=service-1ed84201799f40879884)
2. 按页面提示填写部署参数
3. 确认费用并创建实例
4. 部署完成后获取访问地址

详细步骤见 [阿里云开发者社区：CoPaw 3 分钟部署你的 AI 助理](https://developer.aliyun.com/article/1713682)。

---

## 生产环境建议

### 绑定地址与端口

默认 `127.0.0.1:8088` 仅本机可访问。若需外网访问：

```bash
copaw app --host 0.0.0.0 --port 8088
```

### 反向代理与 HTTPS

建议使用 Nginx 或 Caddy 做反向代理，并配置 HTTPS：

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

### 进程管理（PM2）

若需自动重启、日志管理，可使用 PM2：

```bash
pip install copaw
cd /path/to/copaw
# 使用 uvicorn 直接运行（需根据实际入口调整）
pm2 start "copaw app --host 0.0.0.0" --name copaw
```

或参考 [website/README.md](https://github.com/agentscope-ai/CoPaw/blob/main/website/README.md) 中的 PM2 配置。

### 安全建议

- 不要将 CoPaw 直接暴露在公网，建议通过反向代理 + 认证
- API Key、Token 等敏感信息使用环境变量，勿写入代码
- 定期更新 CoPaw 及依赖

---

## 相关页面

- [快速开始](./quickstart) — 安装与首次启动
- [配置与工作目录](./config) — 工作目录与配置
- [CLI](./cli) — 命令行参考
