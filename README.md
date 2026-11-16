# hubbyware-ui

The packages Hubbyware's hubbies are built with:

| Package | |
|---|---|
| [`@cxxi-lab/hubbyware-ui`](packages/hubbyware-ui) | the design system: React components, design tokens (`theme.css`), fonts (`fonts.css`) |
| [`@cxxi-lab/hubby-cli`](packages/hubby-cli) | `hubby build` / `hubby stage`: builds a hubby on its own and lays it out for publication |

The hubby SDK (`@cxxi-lab/hubbyware-sdk`) is published from [`cxxi-lab/hubbyware-client`](https://github.com/cxxi-lab/hubbyware-client), where it is implemented.

Formerly `@cxxi-lab/hub-ui` and `@cxxi-lab/hub-module-cli` (up to 0.4.1 and 0.2.1, deprecated).

## Publishing

A push to `main` publishes each package whose version is not on npm yet (`publish.yml`, npm trusted publishing).

## Releasing a hubby

A hubby's repository calls the reusable workflow [`hubby-release.yml`](.github/workflows/hubby-release.yml) on each push to `main`: it bumps the hubby's version from the commits since its last release (`feat:` minor, `fix:`/`perf:` patch, `BREAKING` major), builds and stages it (`hubby`), signs its entry and uploads it to the server's releases.

MIT licensed.
