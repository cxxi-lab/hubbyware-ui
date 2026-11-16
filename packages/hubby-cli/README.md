# @cxxi-lab/hubby-cli

Builds a hubby on its own and lays it out for publication:

```sh
hubby build [dir] [--out dist]
hubby stage <stage dir> [dir] [--dist dist] [--root dir]
```

A hubby's repository releases through the reusable workflow
[`hubby-release.yml`](https://github.com/cxxi-lab/hubbyware-ui/blob/main/.github/workflows/hubby-release.yml).

Formerly `@cxxi-lab/hub-module-cli`. MIT.
