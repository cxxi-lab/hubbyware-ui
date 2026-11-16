// Builds one hubby, on its own (its repository, or a folder of the monorepo), into <out>:
//   index.js     the hubby: its manifest as an export (in-process), or its definition (isolated)
//   style.css    its utilities (hubby.css), when it has any
//   models.json  its collections' models (models/*.json, by collection), when it declares any:
//                published with it; the server enforces them, the app seals what they say
//   entry.json   its catalogue entry, without its files (hubby stage adds them): hubby.json
//                (id, version, sdk range, label, description, scopes…), its icon's svg path, css,
//                models
// An in-process hubby (manifest.tsx) runs in the app: the SDK, the design system and the shared
// libraries are not embedded, they are imported from the app's shared/<name>.js entries
// (@cxxi-lab/hubbyware-sdk/shared.json), one instance of each. An isolated one (index.tsx,
// hubby.json "isolated": true) runs in its frame: React, the design system and the frame SDK stay
// bare imports, resolved by the frame's import map.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, join, resolve } from 'node:path'
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import * as solid from '@fortawesome/free-solid-svg-icons'

const require = createRequire(import.meta.url)
const SHARED = JSON.parse(readFileSync(require.resolve('@cxxi-lab/hubbyware-sdk/shared.json'), 'utf8'))
/** What an isolated hubby's frame provides (its import map). */
const FRAME_IMPORTS = ['react', 'react/jsx-runtime', 'react-dom/client', '@fortawesome/react-fontawesome', '@cxxi-lab/hubbyware-sdk/frame', '@cxxi-lab/hubbyware-ui']
const ID = /^[a-z][a-z0-9-]{0,38}[a-z0-9]$/
const VERSION = /^\d+\.\d+\.\d+$/

/** A hubby's hubby.json, checked; its id from the file, else its folder's name. */
export function readHubby(dir) {
	const file = join(dir, 'hubby.json')
	if (!existsSync(file)) throw new Error(`${dir}: no hubby.json`)
	const info = JSON.parse(readFileSync(file, 'utf8'))
	const id = info.id ?? basename(resolve(dir))
	if (!ID.test(id)) throw new Error(`${file}: invalid id "${id}"`)
	if (!VERSION.test(info.version ?? '')) throw new Error(`${file}: invalid version "${info.version}"`)
	if (typeof info.sdk !== 'string') throw new Error(`${file}: no sdk range`)
	return { ...info, id }
}

/** A Font Awesome solid icon by name (or alias), as [width, height, svg path]. */
function icon(id, name) {
	if (!name) return null
	const def = Object.values(solid).find(d => d && typeof d === 'object' && 'icon' in d
		&& (d.iconName === name || (d.icon[2] ?? []).includes(name)))
	if (!def) throw new Error(`hubby ${id}: no solid icon named "${name}" (hubby.json)`)
	const [width, height, , , path] = def.icon
	return [width, height, Array.isArray(path) ? path.join(' ') : path]
}

/** Its models, by collection (null: none). */
function models(id, dir) {
	const folder = join(dir, 'models')
	if (!existsSync(folder)) return null
	const all = {}
	for (const name of readdirSync(folder).filter(n => n.endsWith('.json')).sort()) {
		const model = JSON.parse(readFileSync(join(folder, name), 'utf8'))
		if (typeof model.collection !== 'string' || model.collection === '') throw new Error(`hubby ${id}: models/${name} has no collection`)
		if (all[model.collection]) throw new Error(`hubby ${id}: collection ${model.collection} declared twice`)
		all[model.collection] = model
	}
	return Object.keys(all).length ? all : null
}

/**
 * Builds the hubby in `dir` into `out`; returns its catalogue entry. `alias`: extra resolve
 * aliases (the monorepo's).
 */
export async function buildHubby({ dir, out, alias = {}, quiet = false }) {
	dir = resolve(dir)
	out = resolve(out)
	const info = readHubby(dir)
	const isolated = info.isolated === true
	const entry = join(dir, isolated ? 'index.tsx' : 'manifest.tsx')
	if (!existsSync(entry)) throw new Error(`hubby ${info.id}: no ${isolated ? 'index.tsx' : 'manifest.tsx'}`)
	await build({
		configFile: false,
		root: dir,
		logLevel: quiet ? 'silent' : 'warn',
		publicDir: false,
		plugins: [react(), tailwindcss()],
		resolve: { alias },
		define: { 'process.env.NODE_ENV': JSON.stringify('production') },
		build: {
			outDir: out,
			emptyOutDir: true,
			copyPublicDir: false,
			lib: { entry, formats: ['es'], fileName: () => 'index.js', cssFileName: 'style' },
			rollupOptions: isolated
				? { external: FRAME_IMPORTS }
				: {
					external: Object.keys(SHARED),
					output: { paths: Object.fromEntries(Object.entries(SHARED).map(([spec, name]) => [spec, `../../shared/${name}.js`])) }
				}
		}
	})
	const declared = models(info.id, dir)
	if (declared) writeFileSync(join(out, 'models.json'), JSON.stringify(declared) + '\n')
	const { native: _native, nativeSources: _sources, ...described } = info
	const catalogEntry = { ...described, css: existsSync(join(out, 'style.css')), models: declared !== null, icon: icon(info.id, info.icon) }
	writeFileSync(join(out, 'entry.json'), JSON.stringify(catalogEntry) + '\n')
	return catalogEntry
}
