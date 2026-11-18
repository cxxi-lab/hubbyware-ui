// Builds one hubby, on its own (its repository, or a folder of the monorepo), into <out>:
//   index.js     the hubby: its manifest as an export (in-process), or its definition (isolated)
//   style.css    its utilities (hubby.css), when it has any
//   models.json  its collections' models (models/*.json, by collection), when it declares any:
//                published with it; the server enforces them, the app seals what they say
//   scrape.json  its scrape rules (hubby.json "scrape": the path of its rules file), when it has
//                any: published with it; the server validates them and applies them for it
//                (server docs/plan-scrape.md)
//   entry.json   its catalogue entry, without its files (hubby stage adds them): hubby.json
//                (id, version, sdk range, label, description, scopes…), its icon's svg path, css,
//                models
// An in-process hubby (manifest.tsx) runs in the app: the SDK, the design system and the shared
// libraries are not embedded, they are imported from the app's shared/<name>.js entries
// (@cxxi-lab/hubbyware-sdk/shared.json), one instance of each (the SDK's entry: one per hubby,
// sharedPath). An isolated one (index.tsx,
// hubby.json "isolated": true) runs in its frame: React, react-router, the design system and the
// SDK (its common API, client docs/plan-isolation.md § 2) stay bare imports, resolved by the
// frame's import map.
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
const FRAME_IMPORTS = ['react', 'react/jsx-runtime', 'react-dom/client', 'react-router', '@fortawesome/react-fontawesome', '@cxxi-lab/hubbyware-sdk', '@cxxi-lab/hubbyware-sdk/frame', '@cxxi-lab/hubbyware-ui']
const ID = /^[a-z][a-z0-9-]{0,38}[a-z0-9]$/
/** From this SDK on, each in-process hubby gets its own instance of the SDK's entry. */
const OWN_SDK = [3, 2]
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
	// a hubby brings no code the host runs natively: the platform's components come with the apps
	if (info.native !== undefined || info.nativeSources !== undefined) throw new Error(`${file}: \`native\` is no longer allowed: a hubby brings no native file (the VPN tunnel is the platform's)`)
	return { ...info, id }
}

/**
 * Where an in-process hubby imports a shared entry from. The SDK: its own instance from SDK 3.2
 * on (shared/sdk.js?hubby=<id>: its API calls carry its token, the server knows which hubby makes
 * each one); a hubby fitting an older app still shares the one instance.
 */
function sharedPath(name, info) {
	if (name !== 'sdk') return `../../shared/${name}.js`
	const [major, minor] = (/(\d+)\.(\d+)/.exec(info.sdk) ?? []).slice(1).map(Number)
	const own = major > OWN_SDK[0] || (major === OWN_SDK[0] && minor >= OWN_SDK[1])
	return own ? `../../shared/sdk.js?hubby=${info.id}` : '../../shared/sdk.js'
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

/** Its scrape rules (hubby.json `scrape`: a JSON file of its folder), as published; null: none. */
function scrapeRules(id, dir, path) {
	if (path === undefined) return null
	if (typeof path !== 'string' || path === '' || path.startsWith('/') || path.split(/[\\/]/).includes('..')) throw new Error(`hubby ${id}: hubby.json "scrape" must be a path inside the hubby`)
	const file = join(dir, path)
	if (!existsSync(file)) throw new Error(`hubby ${id}: no ${path} (hubby.json "scrape")`)
	let rules
	try { rules = JSON.parse(readFileSync(file, 'utf8')) }
	catch (err) { throw new Error(`hubby ${id}: ${path} is not valid JSON (${err.message})`) }
	if (!rules || typeof rules !== 'object' || !Array.isArray(rules.sites)) throw new Error(`hubby ${id}: ${path} has no "sites" (scrape rules)`)
	return rules
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
	// isolated: its index.tsx, else its manifest.tsx (the same definition runs in its frame:
	// client docs/plan-isolation.md § 2, a hubby switching by its `isolated` flag alone)
	const candidates = isolated ? ['index.tsx', 'manifest.tsx'] : ['manifest.tsx']
	const entry = candidates.map(name => join(dir, name)).find(existsSync)
	if (!entry) throw new Error(`hubby ${info.id}: no ${candidates.join(' or ')}`)
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
					output: { paths: Object.fromEntries(Object.entries(SHARED).map(([spec, name]) => [spec, sharedPath(name, info)])) }
				}
		}
	})
	const declared = models(info.id, dir)
	if (declared) writeFileSync(join(out, 'models.json'), JSON.stringify(declared) + '\n')
	const rules = scrapeRules(info.id, dir, info.scrape)
	if (rules) writeFileSync(join(out, 'scrape.json'), JSON.stringify(rules) + '\n')
	const catalogEntry = { ...info, css: existsSync(join(out, 'style.css')), models: declared !== null, scrape: rules !== null, icon: icon(info.id, info.icon) }
	writeFileSync(join(out, 'entry.json'), JSON.stringify(catalogEntry) + '\n')
	return catalogEntry
}
