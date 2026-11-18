// The Markdown component on what matters (npm test): safe by default, GFM, code, a stream mid-block.
import { renderToStaticMarkup } from 'react-dom/server'
import { MarkdownView as Markdown } from '../src/markdown/MarkdownView'
const cases: Record<string, [string, (html: string) => boolean]> = {
	'raw html stays text': ['Hello <script>alert(1)</script> <b>bold</b>', h => !h.includes('<script>') && h.includes('&lt;script&gt;') && !h.includes('<b>')],
	'javascript: link dropped': ['[click](javascript:alert(1))', h => !h.includes('javascript:')],
	'link opens outside': ['[site](https://example.com)', h => h.includes('target="_blank"') && h.includes('rel="noopener noreferrer"')],
	'image not loaded by default': ['![a cat](https://example.com/cat.png)', h => !h.includes('<img') && h.includes('a cat')],
	'table (GFM)': ['| a | b |\n|---|---|\n| 1 | 2 |', h => h.includes('<table') && h.includes('<th')],
	'task list': ['- [x] done\n- [ ] todo', h => (h.match(/type="checkbox"/g) ?? []).length === 2 && h.includes('disabled')],
	'code block + copy': ['```ts\nconst a = 1\n```', h => h.includes('<pre') && h.includes('language-ts') && h.includes('Copy')],
	'inline code chip': ['use `npm i`', h => h.includes('rounded bg-steel-800') && !h.includes('<pre')],
	'unclosed fence while streaming': ['Voici :\n```js\nconst x =', h => h.includes('<pre') && h.includes('const x =')],
	'strikethrough': ['~~old~~', h => h.includes('<del')]
}
let failed = 0
for (const [name, [md, ok]] of Object.entries(cases)) {
	const html = renderToStaticMarkup(<Markdown>{md}</Markdown>)
	const pass = ok(html)
	if (!pass) failed++
	console.log(pass ? 'ok  ' : 'FAIL', name, pass ? '' : html.slice(0, 300))
}
process.exit(failed ? 1 : 0)
