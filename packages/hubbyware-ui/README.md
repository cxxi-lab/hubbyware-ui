# @cxxi-lab/hubbyware-ui

Hubbyware's design system: its React components, design tokens (`theme.css`) and fonts (`fonts.css`).
A hubby imports it directly; the apps provide one shared instance at run time.

Formerly `@cxxi-lab/hub-ui`. Source: [cxxi-lab/hubbyware-ui](https://github.com/cxxi-lab/hubbyware-ui). MIT.

## Markdown

`<Markdown>{text}</Markdown>` renders Markdown the same way everywhere (an AI's answers, the
back-office, the showcase, the docs): CommonMark and GitHub's extensions (tables, task lists,
strikethrough, autolinks), code blocks with a copy button, styled with the design tokens. Safe by
default — the text may come from a model or a user: raw HTML is shown as text, never rendered;
`javascript:` links are dropped and links open outside; images are shown as links unless `images`.
It re-renders on each chunk of a stream (an unclosed code block already shows as code).
`npm test` checks all this.
