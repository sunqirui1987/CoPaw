# 内置工具参考

CoPaw Agent 内置一组工具，用于文件操作、代码执行、搜索、Shell、浏览器、记忆检索等。Skills 可提供额外工具；本文档仅涵盖**内置工具**。

> 相对路径均相对于工作目录（默认 `~/.copaw`）。

---

## 文件 I/O

### read_file

读取文件内容。支持按行范围读取。

| 参数        | 类型 | 必填 | 说明                                      |
| ----------- | ---- | ---- | ----------------------------------------- |
| `file_path` | str  | 是   | 文件路径（相对或绝对）                    |
| `start_line`| int  | 否   | 起始行（1-based，含）                     |
| `end_line`  | int  | 否   | 结束行（1-based，含）                     |

**示例：** `read_file("memory/2025-02-13.md")`、`read_file("config.json", 1, 10)`

---

### write_file

创建或覆盖文件。

| 参数        | 类型 | 必填 | 说明           |
| ----------- | ---- | ---- | -------------- |
| `file_path` | str  | 是   | 文件路径      |
| `content`   | str  | 是   | 文件内容      |

---

### edit_file

在文件中查找并替换文本。**所有**匹配项都会被替换。

| 参数        | 类型 | 必填 | 说明           |
| ----------- | ---- | ---- | -------------- |
| `file_path` | str  | 是   | 文件路径      |
| `old_text`  | str  | 是   | 要替换的文本  |
| `new_text`  | str  | 是   | 替换后的文本  |

---

### append_file

在文件末尾追加内容。

| 参数        | 类型 | 必填 | 说明           |
| ----------- | ---- | ---- | -------------- |
| `file_path` | str  | 是   | 文件路径      |
| `content`   | str  | 是   | 追加内容      |

---

### view_text_file

（来自 AgentScope）查看文本文件内容。

### write_text_file

（来自 AgentScope）写入文本文件。

---

## 文件搜索

### grep_search

在文件中按模式搜索内容，递归搜索目录。输出格式：`path:line_number: content`。

| 参数             | 类型 | 必填 | 说明                                      |
| ---------------- | ---- | ---- | ----------------------------------------- |
| `pattern`        | str  | 是   | 搜索字符串或正则（当 `is_regex=True`）    |
| `path`           | str  | 否   | 文件或目录，默认工作目录                  |
| `is_regex`       | bool | 否   | 是否将 pattern 视为正则，默认 False      |
| `case_sensitive` | bool | 否   | 是否区分大小写，默认 True                |
| `context_lines`  | int  | 否   | 匹配行前后上下文行数（类似 grep -C）      |

**限制：** 跳过二进制/大文件（如 .pdf、.docx、>2MB）；最多返回 200 条匹配。

---

### glob_search

按 glob 模式查找文件（如 `*.py`、`**/*.json`）。

| 参数      | 类型 | 必填 | 说明                     |
| --------- | ---- | ---- | ------------------------ |
| `pattern` | str  | 是   | Glob 模式                |
| `path`    | str  | 否   | 搜索根目录，默认工作目录 |

---

## 代码与 Shell

### execute_python_code

（来自 AgentScope）在沙箱中执行 Python 代码。

---

### execute_shell_command

执行 Shell 命令，返回退出码、stdout、stderr。

| 参数      | 类型 | 必填 | 说明                                      |
| --------- | ---- | ---- | ----------------------------------------- |
| `command` | str  | 是   | Shell 命令                               |
| `timeout` | int  | 否   | 超时秒数，默认 60                         |
| `cwd`     | Path | 否   | 工作目录，默认工作目录                    |

**安全：** 运行破坏性命令前 Agent 会先询问用户。

---

## 浏览器

### browser_use

基于 Playwright 的浏览器自动化工具。支持多种操作：`start`、`stop`、`open`、`navigate`、`navigate_back`、`screenshot`、`snapshot`、`click`、`type`、`eval`、`evaluate`、`resize`、`press_key`、`fill_form`、`run_code`、`drag`、`hover`、`select_option`、`tabs`、`wait_for`、`pdf`、`close` 等。

**依赖：** `pip install playwright` 且 `python -m playwright install`

**说明：** 默认以 headless 模式运行。如需可见窗口，可启用 `browser_visible` Skill。

---

## 桌面与文件发送

### desktop_screenshot

截取桌面/屏幕截图。

**依赖：** `pip install mss`

**平台：** Windows、Linux、macOS

---

### send_file_to_user

将文件发送给用户。支持文本、图片、音频、视频及其他文件类型；根据 MIME 类型自动识别并返回对应格式。

| 参数        | 类型 | 必填 | 说明      |
| ----------- | ---- | ---- | --------- |
| `file_path` | str  | 是   | 文件路径  |

---

## 记忆

### memory_search

对 `MEMORY.md` 和 `memory/*.md` 进行语义搜索。回答关于过往工作、决策、日期、人员、偏好或待办的问题前，应优先使用此工具。

| 参数          | 类型  | 必填 | 说明                          |
| ------------- | ----- | ---- | ----------------------------- |
| `query`       | str   | 是   | 语义搜索查询                  |
| `max_results` | int   | 否   | 最大返回结果数，默认 5        |
| `min_score`   | float | 否   | 最低相似度分数，默认 0.1      |

**依赖：** 配置 `EMBEDDING_API_KEY` 可启用向量语义搜索；否则使用 BM25 全文检索。详见 [记忆](./memory)。

---

## 时间

### get_current_time

获取当前系统时间及时区信息。适用于定时任务、调度等场景。

**返回示例：** `2026-02-13 19:30:45 CST (UTC+0800)`

---

## 工具一览表

| 工具名                 | 类别     | 说明                           |
| ---------------------- | -------- | ------------------------------ |
| `read_file`            | 文件 I/O | 读取文件（支持行范围）         |
| `write_file`           | 文件 I/O | 创建或覆盖文件                 |
| `edit_file`            | 文件 I/O | 查找替换                       |
| `append_file`          | 文件 I/O | 追加内容                       |
| `view_text_file`       | 文件 I/O | 查看文本文件（AgentScope）     |
| `write_text_file`      | 文件 I/O | 写入文本文件（AgentScope）     |
| `grep_search`          | 搜索     | 按模式搜索文件内容             |
| `glob_search`          | 搜索     | 按 glob 查找文件               |
| `execute_python_code`  | 代码     | 执行 Python 代码（AgentScope） |
| `execute_shell_command`| Shell    | 执行 Shell 命令                |
| `browser_use`          | 浏览器   | Playwright 浏览器自动化        |
| `desktop_screenshot`   | 桌面     | 截屏                           |
| `send_file_to_user`    | 发送     | 发送文件给用户                 |
| `memory_search`        | 记忆     | 语义搜索记忆文件               |
| `get_current_time`     | 时间     | 获取当前时间                   |

---

## 相关页面

- [Skills](./skills) — Skills 提供的额外工具
- [记忆](./memory) — 记忆系统与 memory_search
- [MCP](./mcp) — 通过 MCP 扩展工具
