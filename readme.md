
## Instructions for Development

* Develop particular feature/function using developer own branch(like a `develop-igor`), feature specified branch (like a `json-schema-validation`) or https://github.com/udx/infrastructure/ issue related branch (like a `develop-296`);

* Test implementation using the particular branch, like a `uses: udx-actions/ghost-inspector@develop-dmitry`, for example, https://github.com/udx/www.udx.io/blob/5a3aa8de687d880bde830b94f18dd7f20faadb52/.github/workflows/pages-check.yml#L13

* Update the package version https://github.com/udx-actions/ghost-inspector/blob/master/package.json#L3, which will be used for github releases;

* Once work is complete, create PR into `master` branch. @kavaribes or @fqjony will review and merge. Developers not allowed to merge it into `master` by themself. After merging PR need to be sure to remove the related branch after work is done. 

* Report at the related issue(s) about completed work and mention about created PR;

## Inputs

* `api_key`. Required. API Key for Ghost Inspector.
* `suite`. Required. ID of Ghost Inspector suite to run.
* `start_url`. Optional. Starting URL for test.

## Outputs

* `content`. JSON stringified response body of executed suite
* `time`.
* `executionTime`.
* `passing`.
* `name`.
* `endUrl`.
* `screenshot`. Screenshot Original default URL.
* `code`.

## Example usage

```yaml
name: Run Ghost Inspector Tests
uses: udx-actions/ghost-inspector@master
with:
    api_key: ${{ secrets.GHOSTINSPECTOR_API_KEY }}
    suite: 5db84ff3800a6b124a51ac1a
```

```yaml
name: Run Ghost Inspector Tests
uses: udx-actions/ghost-inspector@master
with:
    api_key: ${{ secrets.GHOSTINSPECTOR_API_KEY }}
    suite: 5db84ff3800a6b124a51ac1a
    start_url: https://udx.io
```

## Release (Should be done with github actions on push to master, don't run this manually)

```
npm prune --production
git add --all;
git commit -a -m "version bump"
git push;
git tag $(node -e "console.log(require('./package').version)")
git push --tags;
```
