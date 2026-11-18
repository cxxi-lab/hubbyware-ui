# @cxxi-lab/hubby-cli

Builds a hubby on its own and lays it out for publication:

```sh
hubby build [dir] [--out dist]
hubby stage <stage dir> [dir] [--dist dist] [--root dir]
hubby dev [dir] [--out <modules dir>]
```

`hubby dev` develops a hubby in the desktop app run from its sources (`npm run dev` in
`hubbyware-client`): it builds the hubby into the app's hubbies (`platforms/desktop/out/renderer/modules/<id>`,
found from a `repos/` layout next to `client/`, else `--out`), and again on each change of its sources,
its `hubby.json` or its models; the app reloads its frame after each build (its page kept).

A hubby's repository releases through the reusable workflow
[`hubby-release.yml`](https://github.com/cxxi-lab/hubbyware-ui/blob/main/.github/workflows/hubby-release.yml).

Formerly `@cxxi-lab/hub-module-cli`. MIT.

## Its API (api.json)

A hubby can offer methods to the other hubbies (client docs/plan-api-hubbies.md). It implements
them in its definition (`defineHubby({ …, api: { 'notes.search': async input => … } })`) and
describes them in `api.json`, next to its `hubby.json`:

```json
{
	"methods": {
		"notes.search": {
			"description": "The notes whose title contains a text",
			"effect": "read",
			"input": { "type": "object", "properties": { "query": { "type": "string" } } },
			"output": { "type": "array", "items": { "type": "object", "required": ["id", "title"] } },
			"interface": "optional: the interface it implements"
		}
	}
}
```

The build checks it and publishes it, with `api.md` (how to use it, for an AI agent) when there is
one. The schemas use a subset of JSON Schema, the one the app checks: `type`, `properties`,
`required`, `additionalProperties`, `items`, `enum`, `const`, `anyOf`, `minimum`, `maximum`,
`minLength`, `maxLength`, `minItems`, `maxItems`, `pattern` (and `description`, `title`,
`default`, `examples`, `format`, not checked). Any other keyword fails the build.

## Its AI models (hubby.json "ai")

A hubby can use AI models that run on the user's device (client docs/plan-ia-moteur.md): it
declares them in its `hubby.json`, by name, each with its variants by size (the first one the device
can run is used: list them larger first). Every file is pinned — a Hugging Face repo at a commit,
the file's sha256 and size — so what a device downloads is checked:

```sh
hubby ai pin chat bartowski/Qwen_Qwen3-1.7B-GGUF Qwen_Qwen3-1.7B-Q4_K_M.gguf --family text --vram 2000 --ram 3000
hubby ai pin chat bartowski/Qwen_Qwen3-0.6B-GGUF Qwen_Qwen3-0.6B-Q8_0.gguf --ram 1500
```

`pin` resolves the ref (`<repo>@<branch|tag|commit>`, default `main`) to its commit and reads each
file's sha256 and size from Hugging Face; a variant of the same repo and files is replaced. `--vram`
and `--ram` (MiB) are what it needs to run well (on the GPU) and at all (on the CPU); the device
warns, or refuses, accordingly. The build refuses a model not pinned this way.
