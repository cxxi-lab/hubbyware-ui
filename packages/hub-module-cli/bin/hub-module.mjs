#!/usr/bin/env node
// hub-module build [dir] [--out <dist>]                      builds a module (default: here, into dist)
// hub-module stage <stage dir> [dir] [--dist <dist>] [--root <dir>]
//                                                            lays it out for publication
import { parseArgs } from 'node:util'
import { join, resolve } from 'node:path'
import { buildModule, stageModule } from '../lib/index.mjs'

const { positionals, values } = parseArgs({
	allowPositionals: true,
	options: { out: { type: 'string' }, dist: { type: 'string' }, root: { type: 'string' } }
})
const [command, ...args] = positionals

if (command === 'build') {
	const dir = resolve(args[0] ?? '.')
	const entry = await buildModule({ dir, out: values.out ?? join(dir, 'dist') })
	console.log(`module ${entry.id} ${entry.version}: built${entry.css ? ' (+ css)' : ''}${entry.models ? ' (+ models)' : ''}`)
}
else if (command === 'stage') {
	if (!args[0]) throw new Error('usage: hub-module stage <stage dir> [dir]')
	const dir = resolve(args[1] ?? '.')
	const { entry, target } = stageModule({ dir, dist: values.dist ?? join(dir, 'dist'), stage: args[0], root: values.root ?? dir })
	console.log(`${entry.id} ${entry.version}: ${entry.files.map(f => f.path).join(', ')} → ${target}`)
}
else {
	console.error('usage: hub-module build [dir] [--out dist] | hub-module stage <stage dir> [dir] [--dist dist] [--root dir]')
	process.exit(1)
}
