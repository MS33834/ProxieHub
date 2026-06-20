# Contributing to ProxieHub

Thanks for helping make ProxieHub better! Please read this guide before opening an issue or pull request.

## How to Contribute

### 1. Report a broken source or tool

Use the **Broken Source Report** issue template and include:
- Source/tool name
- URL
- What is broken (404, no nodes, format changed, etc.)
- Any error messages

### 2. Add a new public source

Edit `config/sources.json` and add an entry under `free_node_sources` or `free_proxy_apis`:

```json
{
  "name": "my-source",
  "type": "github_raw",
  "url": "https://raw.githubusercontent.com/user/repo/main/nodes.txt",
  "enabled": true,
  "decode_base64": false
}
```

Requirements:
- The source must be **publicly accessible** without authentication.
- The source must allow automated fetching (respect `robots.txt` and terms of service).
- Do **not** add sources that distribute private, paid, or cracked content.

### 3. Improve code or documentation

- Fork the repository.
- Create a feature branch.
- Make your changes.
- Run `python tests/test_parser.py` and ensure tests pass.
- Open a pull request with a clear description.

## Development Setup

```bash
git clone https://github.com/MS33834/ProxieHub.git
cd ProxieHub
pip install -r requirements.txt
python scripts/update.py
python tests/test_parser.py
```

## Code Style

- Follow PEP 8 for Python code.
- Keep functions focused and add type hints where helpful.
- Do not commit secrets, tokens, or personal node lists.

## Questions?

Open a discussion or check the [FAQ](docs/faq.md).
