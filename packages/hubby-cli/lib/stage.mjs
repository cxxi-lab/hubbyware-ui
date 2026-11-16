// Lays out a built hubby (hubby build) for publication, at its version, with each file's
// sha256 (the apps download a version only if every file matches):
//   <stage>/hubbies/<id>/<version>/<file>      offered to everyone (served from /releases/hubbies/)
//   <stage>/restricted/<id>/<version>/<file>   a restricted hubby (`"audience": "restricted"`):
//                                              handed by the server, with signed file URLs, only to
//                                              the accounts given it
// Its native files (hubby.json `native`: { <platform>: { <name>: <path> } }, paths from `root`)
// are published under native/<platform>/<name>, tagged with their platform: each app downloads
// only its own. The version's entry.json (the catalogue entry and its files) is signed alone by
// the CI (entry.json.sig): the server's registry serves the catalogue from those signed entries.
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { readHubby } from './build.mjs'

const sha256 = path => createHash('sha256').update(readFileSync(path)).digest('hex')

/** Stages the hubby of `dir`, built into `dist`, under `stage`; returns the staged entry. */
export function stageHubby({ dir, dist, stage, root = dir }) {
	dir = resolve(dir)
	dist = resolve(dist)
	const info = readHubby(dir)
	const built = JSON.parse(readFileSync(join(dist, 'entry.json'), 'utf8'))
	if (built.id !== info.id || built.version !== info.version) throw new Error(`hubby ${info.id}: ${dist} holds ${built.id} ${built.version}: build it again`)
	const target = join(resolve(stage), info.audience === 'restricted' ? 'restricted' : 'hubbies', info.id, info.version)
	rmSync(target, { recursive: true, force: true })
	mkdirSync(target, { recursive: true })
	const files = readdirSync(dist).filter(name => name !== 'entry.json' && statSync(join(dist, name)).isFile()).sort().map(path => {
		copyFileSync(join(dist, path), join(target, path))
		return { path, sha256: sha256(join(target, path)) }
	})
	for (const [platform, natives] of Object.entries(info.native ?? {})) {
		for (const [name, from] of Object.entries(natives)) {
			const source = resolve(root, from)
			if (!existsSync(source)) throw new Error(`hubby ${info.id}: native file ${from} (${platform}) is missing: build it first`)
			const path = `native/${platform}/${name}`
			mkdirSync(dirname(join(target, path)), { recursive: true })
			copyFileSync(source, join(target, path))
			files.push({ path, sha256: sha256(join(target, path)), platform })
		}
	}
	const entry = { ...built, files }
	writeFileSync(join(target, 'entry.json'), JSON.stringify(entry) + '\n')
	return { entry, target }
}
