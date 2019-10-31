

``` 
name: Run Ghost Inspector Tests
uses: udx-actions/ghost-inspector@0.0.3
with:
    api_key: ${{ secrets.GHOSTINSPECTOR_API_KEY }}
    suite: 5db84ff3800a6b124a51ac1a
```

## Release

```
npm prune --production
git commit -a -m "prod dependencies"
git push origin releases/v1
```