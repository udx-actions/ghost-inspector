
## Inputs

### `api_key`

**Required** API Key for Ghost Inspector.

### `suite`

**Required** ID of Ghost Inspector suite to run.

## Outputs

### `code`

Response code for suite.

## Example usage

```yaml
name: Run Ghost Inspector Tests
uses: udx-actions/ghost-inspector@0.0.3
with:
    api_key: ${{ secrets.GHOSTINSPECTOR_API_KEY }}
    suite: 5db84ff3800a6b124a51ac1a
```

## Release

```
npm prune --production
git commit -a -m "version bump"
git push;
git tag $(node -e "console.log(require('./package').version)")
git push --tags;
```