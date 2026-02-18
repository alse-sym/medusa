---
permissions:
  contents: read
  actions: read
tools:
  github:
    toolsets: [repos, issues, pull_requests, actions]
  web-fetch:
  web-search:
safe-outputs:
  messages:
    append-only-comments: true
---

# Shared gh-aw Base Configuration

This shared component defines a security-first baseline for gh-aw workflows:

- Read-only permissions for the agent phase.
- GitHub toolsets needed for PR/release analysis.
- Append-only workflow status comments for clean audit trails.
