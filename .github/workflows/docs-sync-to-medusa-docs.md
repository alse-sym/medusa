---
on:
  pull_request:
    types: [opened, reopened, synchronize, ready_for_review]
    branches: [develop, main]
permissions:
  contents: read
  actions: read
engine: claude
imports:
  - shared/gh-aw-base.md
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
  - name: Collect PR context
    run: |
      mkdir -p /tmp/gh-aw/agent
      gh pr view "$PR_NUMBER" --json number,title,body,author,baseRefName,headRefName,labels,url,mergedAt > /tmp/gh-aw/agent/pr-metadata.json
      gh pr diff "$PR_NUMBER" > /tmp/gh-aw/agent/pr.diff
      gh pr view "$PR_NUMBER" --json files > /tmp/gh-aw/agent/pr-files.json
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      PR_NUMBER: ${{ github.event.pull_request.number }}
  - name: Checkout docs repository
    uses: actions/checkout@v5
    with:
      repository: alse-sym/medusa-docs
      token: ${{ secrets.CROSS_REPO_PAT }}
      path: docs-repo
---

# PR Documentation Sync

Analyze the code pull request and create documentation updates in `docs-repo` (the `alse-sym/medusa-docs` repository).

Use these artifacts for analysis:

- `/tmp/gh-aw/agent/pr-metadata.json`
- `/tmp/gh-aw/agent/pr-files.json`
- `/tmp/gh-aw/agent/pr.diff`

Execution requirements:

1. Update docs only for user-facing or integration-facing behavior changes.
2. Create or update markdown pages under `docs-repo/docs/`.
3. Keep edits scoped; avoid broad unrelated rewrites.
4. Add a short migration section if backward compatibility changed.
5. If no meaningful docs change is needed, emit a no-op with a short rationale.

For writing style and structure, align with the local `.claude` guidance from this repository.
