# GitHub Action: Enforce Branch Name

[![GitHub Super-Linter](https://github.com/finleyfamily/action-enforce-branch-name/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/finleyfamily/action-enforce-branch-name/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/finleyfamily/action-enforce-branch-name/actions/workflows/check-dist.yml/badge.svg)](https://github.com/finleyfamily/action-enforce-branch-name/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/finleyfamily/action-enforce-branch-name/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/finleyfamily/action-enforce-branch-name/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)
[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://github.com/pre-commit/pre-commit)
[![renovate](https://img.shields.io/badge/enabled-brightgreen?logo=renovatebot&logoColor=%2373afae&label=renovate)](https://developer.mend.io/github/finleyfamily/action-branch-name)

GitHub Action to enforce a branch naming convention.
Inspired by [deepakputhraya/action-branch-name](https://github.com/deepakputhraya/action-branch-name).

**Table Of Contents** <!-- markdownlint-disable-line MD036 -->

<!-- mdformat-toc start --slug=github --no-anchors --maxlevel=6 --minlevel=2 -->

- [Usage](#usage)
  - [Inputs](#inputs)
  - [Outputs](#outputs)

<!-- mdformat-toc end -->

## Usage

```yaml
name: Enforce Branch Name

on:
  pull_request:

jobs:
  enforce-branch-name:
    name: enforce-branch-name
    runs-on: ubuntu-latest
    steps:
      - name: 💂 Enforce Branch Name
        uses: finleyfamily/action-enforce-branch-name@vx.x.x  # it is HIGHLY recommended to pin this to a release
        with:
          allowed_prefixes: >-
            bugfix,chore,dependabot,docs,feat,feature,fix,hotfix,
            maint,maintain,maintenance,release,renovate
```

### Inputs

| Key                | Description                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowed_prefixes` | Comma delimited list of prefix that must be used in every branch (e.g. `feature,hotfix`).                                                    |
| `exclude`          | Comma delimited list of branch names to exclude from this check (e.g. `main,master`). Defaults to `main,master,pre-commit-ci-update-config`. |
| `regex`            | Regex pattern to validate the branch name. Defaults to `([a-z])+\/([a-zA-Z0-9\-\_])+`.                                                       |

### Outputs

This action provides no outputs.
