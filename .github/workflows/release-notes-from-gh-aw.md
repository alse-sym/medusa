---
on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      tag:
        description: "Release tag to regenerate notes for (optional)"
        required: false
        type: string
permissions:
  contents: read
  actions: read
engine: claude
imports:
  - shared/gh-aw-base.md
safe-outputs:
  update-release:
    max: 1
    footer: false
steps:
  - uses: actions/checkout@v5
    with:
      fetch-depth: 0
  - name: Collect release context
    run: |
      mkdir -p /tmp/gh-aw/agent
      TAG="$RELEASE_TAG"
      if [ -z "$TAG" ]; then
        TAG="$(gh release list --limit 1 --json tagName --jq '.[0].tagName')"
      fi
      echo "$TAG" > /tmp/gh-aw/agent/tag.txt
      gh release view "$TAG" --json name,tagName,body,publishedAt,isDraft,isPrerelease,url > /tmp/gh-aw/agent/release.json
      gh pr list --state merged --limit 150 --json number,title,mergedAt,author,labels,url > /tmp/gh-aw/agent/merged-prs.json
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      RELEASE_TAG: ${{ github.event.release.tag_name || github.event.inputs.tag }}
  - name: Notify docs repo to cut version
    run: |
      TAG="$(cat /tmp/gh-aw/agent/tag.txt)"
      gh api \
        --method POST \
        "/repos/alse-sym/medusa-docs/dispatches" \
        -f event_type="medusa-release" \
        -F client_payload[version]="$TAG"
    env:
      GH_TOKEN: ${{ secrets.CROSS_REPO_PAT }}
---

# Release Notes Automation

Generate release notes for the target tag in `/tmp/gh-aw/agent/tag.txt` using:

- `/tmp/gh-aw/agent/release.json`
- `/tmp/gh-aw/agent/merged-prs.json`

Output goals:

1. Produce structured notes with sections:
   - Highlights
   - Breaking Changes (or "None")
   - Enhancements
   - Fixes
   - Upgrade Notes
2. Keep each bullet concise and actionable.
3. Prefer links to relevant PRs when available.
4. If confidence is low for a claim, move it to a "Known Gaps" section.

Use the `update-release` safe output to replace the release body with the generated notes.
