#!/usr/bin/env node
// hubby build [dir] [--out <dist>]                      builds a hubby (default: here, into dist)
// hubby stage <stage dir> [dir] [--dist <dist>] [--root <dir>]
//                                                            lays it out for publication
import { parseArgs } from 'node:util'
import { join, resolve } from 'node:path'
import { buildHubby, stageHubby } from '../lib/index.mjs'

const { positionals, values } = parseArgs({
	allowPositionals: true,
	options: { out: { type: 'string' }, dist: { type: 'string' }, root: { type: 'string' } }
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
else {
	console.error('usage: hubby build [dir] [--out dist] | hubby stage <stage dir> [dir] [--dist dist] [--root dir]')
	process.exit(1)
}
