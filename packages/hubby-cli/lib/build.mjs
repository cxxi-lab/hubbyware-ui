// Builds one hubby, on its own (its repository, or a folder of the monorepo), into <out>:
//   index.js     the hubby: its definition, run in its frame
//   style.css    its utilities (hubby.css), when it has any
//   models.json  its collections' models (models/*.json, by collection), when it declares any:
//                published with it; the server enforces them, the app seals what they say
//   api.json     its API for the other hubbies (and an agent), when it has one: its api.json,
//   api.md       checked, and its api.md (how to use it) (client docs/plan-api-hubbies.md)
//   scrape.json  its scrape rules (hubby.json "scrape": the path of its rules file), when it has
//                any: published with it; the server validates them and applies them for it
//                (server docs/plan-scrape.md)
//   entry.json   its catalogue entry, without its files (hubby stage adds them): hubby.json
//                (id, version, sdk range, label, description, scopes…), its icon's svg path, css,
//                models
// Every hubby runs isolated (client docs/plan-isolation.md; hubby.json "isolated": true): in its
// frame, React, react-router, the design system and the SDK (its common API) stay bare imports,
// resolved by the frame's import map. Its entry: index.tsx, else manifest.tsx (its definition). A
// hubby running in the app is no longer built (the apps don't load one any more).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, join, resolve } from 'node:path'
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import * as solid from '@fortawesome/free-solid-svg-icons'
import { checkAi } from './ai.mjs'

const require = createRequire(import.meta.url)
/** What an isolated hubby's frame provides (its import map). */
const FRAME_IMPORTS = ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', 'react-router', '@fortawesome/react-fontawesome', '@cxxi-lab/hubbyware-sdk', '@cxxi-lab/hubbyware-sdk/frame', '@cxxi-lab/hubbyware-ui']
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
	// a hubby brings no code the host runs natively: the platform's components come with the apps
	if (info.native !== undefined || info.nativeSources !== undefined) throw new Error(`${file}: \`native\` is no longer allowed: a hubby brings no native file (the VPN tunnel is the platform's)`)
	// its AI models (client docs/plan-ia-moteur.md § 5): each file pinned, or a device refuses it
	checkAi(id, info.ai)
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

const METHOD = /^[a-z][a-z0-9-]{0,39}(\.[a-z][a-z0-9-]{0,39}){0,4}$/
const schemaOf = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
// what the app checks of a schema (client app/src/core/hubby/schema.ts): any other keyword refused,
// none silently ignored
const SCHEMA_KEYWORDS = new Set(['type', 'properties', 'required', 'additionalProperties', 'items', 'enum', 'const', 'anyOf',
	'minimum', 'maximum', 'minLength', 'maxLength', 'minItems', 'maxItems', 'pattern', 'description', 'title', 'default', 'examples', 'format'])

function checkSchema(schema, at) {
	if (!schemaOf(schema)) throw new Error(`${at}: a schema is an object`)
	for (const key of Object.keys(schema)) {
		if (!SCHEMA_KEYWORDS.has(key)) throw new Error(`${at}: "${key}" is not supported (${[...SCHEMA_KEYWORDS].join(', ')})`)
	}
	for (const [name, sub] of Object.entries(schema.properties ?? {})) checkSchema(sub, `${at}.properties.${name}`)
	if (schemaOf(schema.additionalProperties)) checkSchema(schema.additionalProperties, `${at}.additionalProperties`)
	if (schema.items !== undefined) checkSchema(schema.items, `${at}.items`)
	for (const [i, sub] of (schema.anyOf ?? []).entries()) checkSchema(sub, `${at}.anyOf[${i}]`)
	if (schema.pattern !== undefined) {
		try { new RegExp(schema.pattern, 'u') }
		catch { throw new Error(`${at}: its pattern is not a valid regular expression`) }
	}
}

/**
 * Its API (api.json: { methods: { "<name>": { description, input, output, effect, interface? } } },
 * the schemas JSON Schema), checked; null: none. Its methods run in its own frame (its `api` in
 * defineHubby); the host validates what goes in and out against these schemas.
 */
function hubbyApi(id, dir) {
	const file = join(dir, 'api.json')
	if (!existsSync(file)) return null
	let api
	try { api = JSON.parse(readFileSync(file, 'utf8')) }
	catch (err) { throw new Error(`hubby ${id}: api.json is not valid JSON (${err.message})`) }
	const methods = api?.methods
	if (!schemaOf(methods) || Object.keys(methods).length === 0) throw new Error(`hubby ${id}: api.json has no "methods"`)
	for (const [name, m] of Object.entries(methods)) {
		const at = `hubby ${id}: api.json, ${name}`
		if (!METHOD.test(name)) throw new Error(`${at}: a method's name is words (a-z, 0-9, -) joined by dots`)
		if (!schemaOf(m) || typeof m.description !== 'string' || m.description.trim() === '') throw new Error(`${at}: a description is required`)
		if (!schemaOf(m.input) || !schemaOf(m.output)) throw new Error(`${at}: its input and output are JSON Schemas`)
		checkSchema(m.input, `${at}, input`)
		checkSchema(m.output, `${at}, output`)
		if (m.effect !== 'read' && m.effect !== 'write') throw new Error(`${at}: its effect is "read" or "write"`)
		if (m.interface !== undefined && (typeof m.interface !== 'string' || !METHOD.test(m.interface))) throw new Error(`${at}: its interface is a method's name`)
		const unknown = Object.keys(m).filter(k => !['description', 'input', 'output', 'effect', 'interface'].includes(k))
		if (unknown.length) throw new Error(`${at}: unknown key ${unknown.join(', ')}`)
	}
	return api
}

/** What goes next to its code: models.json, scrape.json, api.json, entry.json; its catalogue entry. */
function writeExtras(dir, out) {
	const info = readHubby(dir)
	const declared = models(info.id, dir)
	if (declared) writeFileSync(join(out, 'models.json'), JSON.stringify(declared) + '\n')
	const rules = scrapeRules(info.id, dir, info.scrape)
	if (rules) writeFileSync(join(out, 'scrape.json'), JSON.stringify(rules) + '\n')
	const api = hubbyApi(info.id, dir)
	if (api) writeFileSync(join(out, 'api.json'), JSON.stringify(api) + '\n')
	if (api && existsSync(join(dir, 'api.md'))) writeFileSync(join(out, 'api.md'), readFileSync(join(dir, 'api.md')))
	const catalogEntry = { ...info, css: existsSync(join(out, 'style.css')), models: declared !== null, scrape: rules !== null, api: api !== null, icon: icon(info.id, info.icon) }
	writeFileSync(join(out, 'entry.json'), JSON.stringify(catalogEntry) + '\n')
	return catalogEntry
}

/**
 * Builds the hubby in `dir` into `out`; returns its catalogue entry. `alias`: extra resolve
 * aliases (the monorepo's). `watch`: builds again on each change of its sources (its hubby.json
 * and models too), `onBuilt(entry)` after each build; resolves with the first build's entry and
 * keeps watching (hubby dev).
 */
export async function buildHubby({ dir, out, alias = {}, quiet = false, watch = false, onBuilt }) {
	dir = resolve(dir)
	out = resolve(out)
	const info = readHubby(dir)
	if (info.isolated !== true) throw new Error(`hubby ${info.id}: every hubby runs isolated (hubby.json "isolated": true; client docs/plan-isolation.md)`)
	// its index.tsx, else its manifest.tsx (its definition)
	const candidates = ['index.tsx', 'manifest.tsx']
	const entry = candidates.map(name => join(dir, name)).find(existsSync)
	if (!entry) throw new Error(`hubby ${info.id}: no ${candidates.join(' or ')}`)
	let first
	const done = new Promise((resolve, reject) => { first = { resolve, reject } })
	let built = null
	const extras = {
		name: 'hubby-extras',
		buildStart() {
			// what isn't imported but makes the hubby: watched too
			for (const file of ['hubby.json', ...(existsSync(join(dir, 'models')) ? readdirSync(join(dir, 'models')).filter(n => n.endsWith('.json')).map(n => join('models', n)) : [])]) {
				this.addWatchFile(join(dir, file))
			}
			if (typeof info.scrape === 'string' && existsSync(join(dir, info.scrape))) this.addWatchFile(join(dir, info.scrape))
		},
		writeBundle() {
			built = writeExtras(dir, out)
			onBuilt?.(built)
			first.resolve(built)
		},
		buildEnd(error) {
			if (error) {
				if (!watch) first.reject(error)
				else console.error(`hubby ${info.id}: build failed`, error.message)
			}
		}
	}
	await build({
		configFile: false,
		root: dir,
		logLevel: quiet ? 'silent' : 'warn',
		publicDir: false,
		plugins: [react(), tailwindcss(), extras],
		resolve: { alias },
		define: { 'process.env.NODE_ENV': JSON.stringify('production') },
		build: {
			outDir: out,
			emptyOutDir: true,
			copyPublicDir: false,
			lib: { entry, formats: ['es'], fileName: () => 'index.js', cssFileName: 'style' },
			rollupOptions: { external: FRAME_IMPORTS },
			watch: watch ? {} : null
		}
	})
	return done
}
