# @cxxi-lab/hubby-cli

Builds a hubby on its own and lays it out for publication:

```sh
hubby build [dir] [--out dist]
hubby stage <stage dir> [dir] [--dist dist] [--root dir]
hubby dev [dir] [--out <modules dir>]
```

`hubby dev` develops a hubby in the desktop app run from its sources (`npm run dev` in
`hubbyware-client`): it builds the hubby into the app's hubbies (`platforms/desktop/out/renderer/modules/<id>`,
found from a `repos/` layout next to `client/`, else `--out`), and again on each change of its sources,
its `hubby.json` or its models; the app reloads its frame after each build (its page kept).

A hubby's repository releases through the reusable workflow
[`hubby-release.yml`](https://github.com/cxxi-lab/hubbyware-ui/blob/main/.github/workflows/hubby-release.yml).

Formerly `@cxxi-lab/hub-module-cli`. MIT.
