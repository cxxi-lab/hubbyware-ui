// A hubby's AI models (hubby.json "ai", client docs/plan-ia-moteur.md § 5): the models it can use,
// by name, each with its variants by size; every file pinned (a Hugging Face repo at a commit, the
// file's sha256 and size) so what a device downloads is checked. `hubby ai pin` fills them in.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const NAME = /^[a-z][a-z0-9-]{0,39}$/
const FAMILIES = ['text', 'image', 'voice']
const REPO = /^[A-Za-z0-9][A-Za-z0-9._-]{0,95}\/[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/
const COMMIT = /^[0-9a-f]{40}$/
const SHA256 = /^[0-9a-f]{64}$/
// a file of the repo: words, dots, dashes, at most a few folders, never `..`
const PATH = /^(?!.*\.\.)[A-Za-z0-9._-]{1,120}(\/[A-Za-z0-9._-]{1,120}){0,3}$/
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v)

/** Its hubby.json "ai", checked (throws on what a device would refuse). */
export function checkAi(id, ai) {
	if (ai === undefined) return
	if (!object(ai) || Object.keys(ai).length === 0) throw new Error(`hubby ${id}: hubby.json "ai" is an object of models, by name`)
	for (const [name, model] of Object.entries(ai)) {
		const at = `hubby ${id}: hubby.json "ai", ${name}`
		if (!NAME.test(name)) throw new Error(`${at}: a model's name is a word (a-z, 0-9, -)`)
		if (!object(model) || !FAMILIES.includes(model.family)) throw new Error(`${at}: its family is ${FAMILIES.join(', ')}`)
		if (!Array.isArray(model.variants) || model.variants.length === 0) throw new Error(`${at}: it has variants (hubby ai pin)`)
		const unknown = Object.keys(model).filter(k => !['family', 'description', 'variants'].includes(k))
		if (unknown.length) throw new Error(`${at}: unknown key ${unknown.join(', ')}`)
		model.variants.forEach((v, i) => {
			const vat = `${at}, variant ${i + 1}`
			if (!object(v) || !REPO.test(v.repo ?? '')) throw new Error(`${vat}: its repo is <owner>/<name> on Hugging Face`)
			if (!COMMIT.test(v.revision ?? '')) throw new Error(`${vat}: its revision is a commit (40 hex: hubby ai pin resolves it)`)
			if (!Array.isArray(v.files) || v.files.length === 0) throw new Error(`${vat}: it has files`)
			for (const f of v.files) {
				if (!object(f) || !PATH.test(f.path ?? '') || !SHA256.test(f.sha256 ?? '') || !Number.isInteger(f.size) || f.size <= 0) {
					throw new Error(`${vat}: each file has a path in the repo, its sha256 and its size (hubby ai pin)`)
				}
			}
			if (v.requires !== undefined) {
				if (!object(v.requires) || Object.entries(v.requires).some(([k, n]) => !['vram', 'ram'].includes(k) || !Number.isInteger(n) || n <= 0)) {
					throw new Error(`${vat}: requires is { vram?, ram? } in MiB`)
				}
			}
		})
	}
}

async function hf(path, init) {
	const res = await fetch(`https://huggingface.co/api/models/${path}`, init)
	if (!res.ok) throw new Error(`Hugging Face ${path}: HTTP ${res.status}`)
	return res.json()
}

/**
 * Pins a variant of the model `name` in the hubby's hubby.json: the repo at `ref` (a branch, a tag
 * or a commit) resolved to its commit, each file's sha256 and size read from Hugging Face. A variant
 * of the same repo is replaced; otherwise it is added (the declared order is the device's
 * preference: larger first). `family` is needed for a new model.
 */
export async function pinModel({ dir, name, ref, files, family, vram, ram, description }) {
	if (!NAME.test(name)) throw new Error(`hubby ai pin: "${name}" is not a model name (a-z, 0-9, -)`)
	const [repo, revision = 'main'] = ref.split('@')
	if (!REPO.test(repo)) throw new Error(`hubby ai pin: "${repo}" is not a Hugging Face repo (<owner>/<name>)`)
	if (!files.length || files.some(f => !PATH.test(f))) throw new Error('hubby ai pin: give the repo\'s files to download (their paths)')
	const commit = COMMIT.test(revision) ? revision : (await hf(`${repo}/revision/${encodeURIComponent(revision)}`)).sha
	const body = new URLSearchParams(files.map(f => ['paths', f]))
	const info = await hf(`${repo}/paths-info/${commit}`, { method: 'POST', body })
	const pinned = files.map(path => {
		const f = info.find(x => x.path === path)
		if (!f) throw new Error(`hubby ai pin: ${repo}@${commit.slice(0, 8)} has no ${path}`)
		const sha256 = f.lfs?.oid
		if (!SHA256.test(sha256 ?? '')) throw new Error(`hubby ai pin: ${path} has no sha256 on Hugging Face (not an LFS file)`)
		return { path, sha256, size: f.lfs.size ?? f.size }
	})
	const file = join(dir, 'hubby.json')
	const text = readFileSync(file, 'utf8')
	const hubby = JSON.parse(text)
	hubby.ai ??= {}
	const model = hubby.ai[name] ?? { family }
	if (!model.family) throw new Error(`hubby ai pin: ${name} is a new model: give its --family (${FAMILIES.join(', ')})`)
	if (family && family !== model.family) throw new Error(`hubby ai pin: ${name} is a ${model.family} model`)
	if (description) model.description = description
	const variant = { repo, revision: commit, files: pinned }
	if (vram || ram) variant.requires = { ...(vram ? { vram: Number(vram) } : {}), ...(ram ? { ram: Number(ram) } : {}) }
	const variants = model.variants ?? []
	const at = variants.findIndex(v => v.repo === repo && v.files.map(f => f.path).join() === files.join())
	if (at >= 0) variants[at] = variant
	else variants.push(variant)
	hubby.ai[name] = { family: model.family, ...(model.description ? { description: model.description } : {}), variants }
	checkAi(hubby.id ?? name, hubby.ai)
	const indent = /^\{\n(\s+)/.exec(text)?.[1] ?? '\t'
	writeFileSync(file, JSON.stringify(hubby, null, indent) + '\n')
	return { repo, commit, files: pinned }
}
