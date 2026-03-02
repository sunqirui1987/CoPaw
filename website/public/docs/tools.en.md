# Built-in Tools Reference

CoPaw Agent includes a set of built-in tools for file operations, code execution, search, shell, browser, and memory retrieval. Skills can add more tools; this document covers **built-in tools** only.

> Relative paths are resolved from the working directory (default `~/.copaw`).

---

## File I/O

### read_file

Read file contents. Supports line-range reading.

| Parameter   | Type | Required | Description                          |
| ----------- | ---- | -------- | ------------------------------------ |
| `file_path` | str  | Yes      | File path (relative or absolute)    |
| `start_line`| int  | No       | First line (1-based, inclusive)     |
| `end_line`  | int  | No       | Last line (1-based, inclusive)      |

**Example:** `read_file("memory/2025-02-13.md")`, `read_file("config.json", 1, 10)`

---

### write_file

Create or overwrite a file.

| Parameter   | Type | Required | Description    |
| ----------- | ---- | -------- | -------------- |
| `file_path` | str  | Yes      | File path      |
| `content`   | str  | Yes      | File content   |

---

### edit_file

Find-and-replace text in a file. **All** occurrences are replaced.

| Parameter   | Type | Required | Description      |
| ----------- | ---- | -------- | ---------------- |
| `file_path` | str  | Yes      | File path        |
| `old_text`  | str  | Yes      | Text to replace  |
| `new_text`  | str  | Yes      | Replacement text |

---

### append_file

Append content to the end of a file.

| Parameter   | Type | Required | Description    |
| ----------- | ---- | -------- | -------------- |
| `file_path` | str  | Yes      | File path      |
| `content`   | str  | Yes      | Content to append |

---

### view_text_file

(From AgentScope) View text file contents.

### write_text_file

(From AgentScope) Write text file.

---

## File Search

### grep_search

Search file contents by pattern, recursively. Output format: `path:line_number: content`.

| Parameter       | Type | Required | Description                          |
| --------------- | ---- | -------- | ------------------------------------ |
| `pattern`      | str  | Yes      | Search string or regex (when `is_regex=True`) |
| `path`         | str  | No       | File or directory; default: working dir |
| `is_regex`     | bool | No       | Treat pattern as regex; default False |
| `case_sensitive` | bool | No    | Case-sensitive; default True         |
| `context_lines`| int  | No       | Context lines before/after match (like grep -C) |

**Limits:** Skips binary/large files (e.g. .pdf, .docx, >2MB); max 200 matches.

---

### glob_search

Find files matching a glob pattern (e.g. `*.py`, `**/*.json`).

| Parameter | Type | Required | Description              |
| --------- | ---- | -------- | ------------------------ |
| `pattern` | str  | Yes      | Glob pattern             |
| `path`    | str  | No       | Root directory; default: working dir |

---

## Code & Shell

### execute_python_code

(From AgentScope) Execute Python code in a sandbox.

---

### execute_shell_command

Execute a shell command; returns exit code, stdout, stderr.

| Parameter | Type | Required | Description                    |
| --------- | ---- | -------- | ------------------------------ |
| `command` | str  | Yes      | Shell command                  |
| `timeout` | int  | No       | Timeout in seconds; default 60 |
| `cwd`     | Path | No       | Working directory; default: working dir |

**Safety:** Agent asks before running destructive commands.

---

## Browser

### browser_use

Playwright-based browser automation. Supports: `start`, `stop`, `open`, `navigate`, `navigate_back`, `screenshot`, `snapshot`, `click`, `type`, `eval`, `evaluate`, `resize`, `press_key`, `fill_form`, `run_code`, `drag`, `hover`, `select_option`, `tabs`, `wait_for`, `pdf`, `close`, etc.

**Dependency:** `pip install playwright` and `python -m playwright install`

**Note:** Runs headless by default. Enable `browser_visible` Skill for a visible window.

---

## Desktop & File Sending

### desktop_screenshot

Capture desktop/screen screenshot.

**Dependency:** `pip install mss`

**Platform:** Windows, Linux, macOS

---

### send_file_to_user

Send a file to the user. Supports text, image, audio, video, and other types; auto-detects MIME type.

| Parameter   | Type | Required | Description   |
| ----------- | ---- | -------- | ------------- |
| `file_path` | str  | Yes      | File path     |

---

## Memory

### memory_search

Semantic search over `MEMORY.md` and `memory/*.md`. Use before answering questions about past work, decisions, dates, people, preferences, or todos.

| Parameter    | Type  | Required | Description                    |
| ------------ | ----- | -------- | ------------------------------ |
| `query`      | str   | Yes      | Semantic search query          |
| `max_results`| int   | No       | Max results; default 5         |
| `min_score`  | float | No       | Min similarity score; default 0.1 |

**Dependency:** Set `EMBEDDING_API_KEY` for vector search; otherwise BM25 full-text. See [Memory](./memory).

---

## Time

### get_current_time

Get current system time and timezone. Useful for scheduling, cron, etc.

**Example output:** `2026-02-13 19:30:45 CST (UTC+0800)`

---

## Tool Summary

| Tool                   | Category   | Description                    |
| ---------------------- | ---------- | ------------------------------ |
| `read_file`            | File I/O   | Read file (with line range)    |
| `write_file`           | File I/O   | Create or overwrite file       |
| `edit_file`            | File I/O   | Find and replace               |
| `append_file`          | File I/O   | Append content                 |
| `view_text_file`       | File I/O   | View text file (AgentScope)    |
| `write_text_file`      | File I/O   | Write text file (AgentScope)   |
| `grep_search`          | Search     | Search file contents by pattern|
| `glob_search`          | Search     | Find files by glob             |
| `execute_python_code`  | Code       | Execute Python (AgentScope)    |
| `execute_shell_command`| Shell      | Execute shell command          |
| `browser_use`          | Browser    | Playwright browser automation  |
| `desktop_screenshot`   | Desktop    | Screenshot                     |
| `send_file_to_user`    | Send       | Send file to user              |
| `memory_search`        | Memory     | Semantic search in memory      |
| `get_current_time`     | Time       | Get current time               |

---

## Related Pages

- [Skills](./skills) — Additional tools from Skills
- [Memory](./memory) — Memory system and memory_search
- [MCP](./mcp) — Extend tools via MCP
