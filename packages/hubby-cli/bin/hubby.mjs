#!/usr/bin/env node
// hubby build [dir] [--out <dist>]                      builds a hubby (default: here, into dist)
// hubby stage <stage dir> [dir] [--dist <dist>] [--root <dir>]
//                                                            lays it out for publication
// hubby dev [dir] [--out <modules dir>]                 builds it again on each change, into the
//                                                            development app's hubbies (its frame
//                                                            reloads): see README
// hubby ai pin <model> <repo>[@<ref>] <file>... [--family text|image|voice|embed] [--vram MiB] [--ram MiB]
//                                                            pins a variant of an AI model in its
//                                                            hubby.json (commit, sha256, size)
import { parseArgs } from 'node:util'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { buildHubby, pinModel, readHubby, stageHubby } from '../lib/index.mjs'

/**
 * The development desktop's hubbies folder (repos/client/platforms/desktop/out/renderer/modules,
 * served for the hubbies not installed), found from a hubby's folder in the repos' layout.
 */
function devModules(dir) {
	for (let d = dir; d !== dirname(d); d = dirname(d)) {
		const renderer = join(d, 'client/platforms/desktop/out/renderer')
		if (existsSync(renderer)) return join(renderer, 'modules')
	}
	return null
}

const { positionals, values } = parseArgs({
	allowPositionals: true,
	options: { out: { type: 'string' }, dist: { type: 'string' }, root: { type: 'string' }, family: { type: 'string' }, vram: { type: 'string' }, ram: { type: 'string' }, description: { type: 'string' }, dir: { type: 'string' } }
})
const [command, ...args] = positionals

if (command === 'build') {
	const dir = resolve(args[0] ?? '.')
	const entry = await buildHubby({ dir, out: values.out ?? join(dir, 'dist') })
	console.log(`hubby ${entry.id} ${entry.version}: built${entry.css ? ' (+ css)' : ''}${entry.models ? ' (+ models)' : ''}`)
}
else if (command === 'stage') {
	if (!args[0]) throw new Error('usage: hubby stage <stage dir> [dir]')
	const dir = resolve(args[1] ?? '.')
	const { entry, target } = stageHubby({ dir, dist: values.dist ?? join(dir, 'dist'), stage: args[0], root: values.root ?? dir })
	console.log(`${entry.id} ${entry.version}: ${entry.files.map(f => f.path).join(', ')} → ${target}`)
}
else if (command === 'dev') {
	const dir = resolve(args[0] ?? '.')
	const { id } = readHubby(dir)
	const modules = values.out ? resolve(values.out) : devModules(dir)
	if (!modules) throw new Error('hubby dev: no development desktop found next to this hubby (repos/client/platforms/desktop/out/renderer: run the desktop in development once), give --out <modules dir>')
	const out = join(modules, id)
	await buildHubby({
		dir, out, watch: true, quiet: true,
		onBuilt: entry => console.log(`${new Date().toLocaleTimeString()} hubby ${entry.id}: built → ${out}`)
	})
	console.log('watching its sources (Ctrl+C to stop)')
}
else if (command === 'ai' && args[0] === 'pin') {
	const [, name, ref, ...files] = args
	if (!name || !ref || !files.length) throw new Error('usage: hubby ai pin <model> <repo>[@<ref>] <file>... [--family text|image|voice|embed] [--vram MiB] [--ram MiB] [--dir <hubby>]')
	const pinned = await pinModel({ dir: resolve(values.dir ?? '.'), name, ref, files, family: values.family, vram: values.vram, ram: values.ram, description: values.description })
	console.log(`${name}: ${pinned.repo}@${pinned.commit.slice(0, 8)}, ${pinned.files.map(f => `${f.path} (${(f.size / 2 ** 30).toFixed(2)} GiB)`).join(', ')}`)
}
else {
	console.error('usage: hubby build [dir] [--out dist] | hubby stage <stage dir> [dir] [--dist dist] [--root dir] | hubby dev [dir] [--out modules dir] | hubby ai pin <model> <repo>[@<ref>] <file>...')
	process.exit(1)
}
