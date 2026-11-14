# hub-ui

The packages hub's modules are built with:

| Package | |
|---|---|
| [`@cxxi-lab/hub-ui`](packages/hub-ui) | the design system: React components, design tokens (`theme.css`), fonts (`fonts.css`) |
| [`@cxxi-lab/hub-module-cli`](packages/hub-module-cli) | `hub-module build` / `hub-module stage`: builds a module on its own and lays it out for publication |

The module SDK (`@cxxi-lab/hub-sdk`) is published from [`cxxi-lab/hub-apps`](https://github.com/cxxi-lab/hub-apps), where it is implemented.

## Publishing

A push to `main` publishes each package whose version is not on npm yet (`publish.yml`, npm trusted publishing).

## Releasing a module

A module's repository calls the reusable workflow [`module-release.yml`](.github/workflows/module-release.yml) on each push to `main`: it bumps the module's version from the commits since its last release (`feat:` minor, `fix:`/`perf:` patch, `BREAKING` major), builds and stages it (`hub-module`), signs its entry and uploads it to the server's releases.

MIT licensed.
