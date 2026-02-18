---
on:
  push:
    branches: [develop, main]
permissions:
  contents: read
  actions: read
engine: claude
imports:
  - shared/gh-aw-base.md
  - ../agents/docs-maintainer.md
safe-outputs:
  github-token: ${{ secrets.CROSS_REPO_PAT }}
  create-pull-request:
    target-repo: "alse-sym/medusa-docs"
    base-branch: "main"
    title-prefix: "[docs] "
    labels: [documentation, automation]
    draft: false
    if-no-changes: warn
    fallback-as-issue: false
steps:
  - uses: actions/checkout@v5
    with:
      fetch-depth: 0
  - name: Collect push context
    run: |
      mkdir -p /tmp/gh-aw/agent
      cp "$GITHUB_EVENT_PATH" /tmp/gh-aw/agent/push-event.json
      git diff --name-status "$BEFORE_SHA" "$AFTER_SHA" > /tmp/gh-aw/agent/changed-files.txt
      git diff "$BEFORE_SHA" "$AFTER_SHA" > /tmp/gh-aw/agent/changes.diff
    env:
      BEFORE_SHA: ${{ github.event.before }}
      AFTER_SHA: ${{ github.event.after }}
  - name: Checkout docs repository
    uses: actions/checkout@v5
    with:
      repository: alse-sym/medusa-docs
      token: ${{ secrets.CROSS_REPO_PAT }}
      path: docs-repo
---

# Push Documentation Sync

Analyze the merged code changes and create documentation updates in `docs-repo` (the `alse-sym/medusa-docs` repository).

Use these artifacts for analysis:

- `/tmp/gh-aw/agent/push-event.json`
- `/tmp/gh-aw/agent/changed-files.txt`
- `/tmp/gh-aw/agent/changes.diff`

Execution requirements:

1. Update docs only for user-facing or integration-facing behavior changes.
2. Create or update markdown pages under `docs-repo/docs/`.
3. Keep edits scoped; avoid broad unrelated rewrites.
4. Add a short migration section if backward compatibility changed.
5. If no meaningful docs change is needed, emit a no-op with a short rationale.

For writing style and structure, align with the local `.claude` guidance from this repository and the imported docs-maintainer agent instructions.
