# Veracode: Safe to Deploy - Github Action

A GitHub Action that evaluates a deployment request against Veracode and returns a decision that can either block the deployment or allow it in observer mode.

## Overview

This action:

- Sends a deployment decision request to Veracode using the provided API credentials
- Evaluates the supplied business application and asset snapshot IDs
- Returns a deployment outcome via action outputs
- Optionally posts a pull request comment when the workflow is triggered by a pull request

## Inputs

| Name | Required | Description |
| --- | --- | --- |
| `vid` | Yes | Veracode API ID |
| `vkey` | Yes | Veracode API Key |
| `github_token` | Yes | GitHub token provided by the GitHub app via `github.event.client_payload.token` |
| `businessApp` | Yes | The UUID identifier or name of the Business Application |
| `businessVersion` | Yes | The version of the Business Application to be deployed. This will be stored on the Decision Record for reference later. |
| `artifacts_list` | Yes | Array of Github repo/assets. stockroom-org1/stockroom-frontend@v0.0.2 or stockroom-org1/stockroom-frontend@commitSHA  |
| `decision_mode` | Yes | Block the deployment (enforcement mode) or record the verdict and continue (observer mode) |
| `repository_owner` | Yes | Repository owner of original commit (provided by GitHub app via `github.event.client_payload.repository.owner`) |
| `repository_name` | Yes | Repository name of original commit (provided by GitHub app via `github.event.client_payload.repository.name`) |
| `source_branch` | Yes | Source branch of the pull request |
| `pull_request` | No | Pull request number |

## Outputs

| Name | Description |
| --- | --- |
| `conclusion` | Decision outcome: `success` for SAFE, `failure` for UNSAFE in enforcement mode, or `neutral` for UNSAFE in observer mode |
| `summary` | Summary of the decision details |

## Decision behavior

The action evaluates the deployment request and then applies the following logic:

- If the decision result is `SAFE`, the action marks the run as successful.
- If the decision result is `UNSAFE` and `decision_mode` is `observer`, the action marks the outcome as `neutral` and continues.
- If the decision result is `UNSAFE` and `decision_mode` is not `observer`, the action marks the run as failed and blocks the deployment.
- If the Veracode request itself fails, the action marks the run as failed and surfaces the returned error details.

## Example usage

```yaml
- name: Veracode Safe to Deploy
  id: safe_to_deploy
  uses: veracode/safe-to-deploy@v0.1.0
  with:
    vid: ${{ secrets.VERACODE_API_ID }}
    vkey: ${{ secrets.VERACODE_API_KEY }}
    github_token: ${{ github.event.client_payload.token }}
    businessApp: ${{ vars.BUSINESS_APP }}
    businessVersion: ${{ github.sha }}
    artifacts_list: ${{ vars.ARTIFACTS_LIST }}
    decision_mode: observer
    repository_owner: ${{ github.event.client_payload.repository.owner }}
    repository_name: ${{ github.event.client_payload.repository.name }}
    source_branch: ${{ github.head_ref || github.ref_name }}
    pull_request: ${{ github.event.pull_request.number }}
```

## Pull request comments

When the workflow runs for a `pull_request` event and the decision response is available, the action will add a pull request comment with the generated decision summary.

## Runtime

This action uses:

- `runs.using: node24`
- `main: dist/index.js`

## Architecture

```text
GitHub Action (veracode/safe-to-deploy@v0.1.0)
      │
      ▼
 HTTP Request
      │
      ▼
 Veracode API
      │
      ▼
 Decision Response
      │
      ▼
 Evaluate Policy
      │
   ┌──┴──┐
   ▼     ▼
SAFE  UNSAFE
   │     │
   ▼     ▼
Allow  Block / Observer
```
