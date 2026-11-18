import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { twMerge } from 'tailwind-merge'

/**
 * The Markdown renderer itself (loaded on first use by Markdown, ./Markdown.tsx: its parser weighs
 * ~100 kB gzipped, the frames that never show Markdown never load it). Markdown, as the design system renders it everywhere (an AI's answers, a hubby's notes, the
 * back-office, the showcase, the docs). Safe by default — its text may come from a model or a user:
 * no raw HTML is ever rendered (shown as text), links open outside (and `javascript:` ones are
 * dropped), images are not loaded unless `images` allows them. CommonMark + GitHub's extensions
 * (tables, task lists, strikethrough, autolinks); code blocks with a copy button. Re-rendered on each
 * chunk of a stream without flicker (an unclosed code block already shows as code).
 */
export interface MarkdownViewProps {
	children: string
	/** load the images it links to (default: shown as links) */
	images?: boolean
	className?: string
}

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)
	return (
		<button
			type="button"
			onClick={() => void navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
			className="absolute top-1.5 right-1.5 rounded px-1.5 py-0.5 text-[11px] text-steel-300 bg-steel-800/80 border border-steel-700 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
		>
			{copied ? 'Copied' : 'Copy'}
		</button>
	)
}

/** The text of a rendered node (a code block's, for its copy button). */
function textOf(node: ReactNode): string {
	if (typeof node === 'string' || typeof node === 'number') return String(node)
	if (Array.isArray(node)) return node.map(textOf).join('')
	if (node && typeof node === 'object' && 'props' in node) return textOf((node as { props: { children?: ReactNode } }).props.children)
	return ''
}

function components(images: boolean): Components {
	return {
		h1: ({ node: _n, ...p }) => <h1 className="mt-4 mb-2 text-xl font-semibold text-white first:mt-0" {...p} />,
		h2: ({ node: _n, ...p }) => <h2 className="mt-4 mb-2 text-lg font-semibold text-white first:mt-0" {...p} />,
		h3: ({ node: _n, ...p }) => <h3 className="mt-3 mb-1.5 text-base font-semibold text-white first:mt-0" {...p} />,
		h4: ({ node: _n, ...p }) => <h4 className="mt-3 mb-1 text-sm font-semibold text-white first:mt-0" {...p} />,
		p: ({ node: _n, ...p }) => <p className="my-2 first:mt-0 last:mb-0" {...p} />,
		a: ({ node: _n, ...p }) => <a className="text-primary-400 underline underline-offset-2 hover:text-primary-300" target="_blank" rel="noopener noreferrer" {...p} />,
		ul: ({ node: _n, className, ...p }) => <ul className={twMerge('my-2 pl-5 list-disc marker:text-steel-400', className?.includes('contains-task-list') && 'pl-1 list-none')} {...p} />,
		ol: ({ node: _n, ...p }) => <ol className="my-2 pl-5 list-decimal marker:text-steel-400" {...p} />,
		li: ({ node: _n, ...p }) => <li className="my-0.5" {...p} />,
		input: ({ node: _n, ...p }) => <input {...p} disabled className="mr-1.5 align-middle accent-primary-500" />,
		blockquote: ({ node: _n, ...p }) => <blockquote className="my-2 border-l-2 border-steel-600 pl-3 text-steel-200" {...p} />,
		hr: () => <hr className="my-4 border-steel-700" />,
		del: ({ node: _n, ...p }) => <del className="text-steel-400" {...p} />,
		pre: ({ node: _n, children }) => (
			<div className="group relative my-2">
				<pre className="overflow-x-auto rounded-md bg-steel-950 border border-steel-800 p-3 text-[13px] leading-relaxed">{children}</pre>
				<CopyButton text={textOf(children).replace(/\n$/, '')} />
			</div>
		),
		code: ({ node: _n, className, ...p }: ComponentPropsWithoutRef<'code'> & { node?: unknown }) => (
			// in a block (<pre>): its language class; inline: a chip
			className?.startsWith('language-') || (p.children && String(p.children).includes('\n'))
				? <code className={twMerge('font-mono text-steel-100', className)} {...p} />
				: <code className="rounded bg-steel-800 px-1 py-0.5 font-mono text-[0.9em] text-steel-100" {...p} />
		),
		table: ({ node: _n, ...p }) => <div className="my-2 overflow-x-auto"><table className="border-collapse text-sm" {...p} /></div>,
		th: ({ node: _n, ...p }) => <th className="border border-steel-700 bg-steel-800 px-2 py-1 text-left font-semibold text-white" {...p} />,
		td: ({ node: _n, ...p }) => <td className="border border-steel-700 px-2 py-1" {...p} />,
		img: ({ node: _n, src, alt }) => images && typeof src === 'string'
			? <img src={src} alt={alt ?? ''} className="my-2 max-w-full rounded" loading="lazy" />
			: <a href={typeof src === 'string' ? src : undefined} target="_blank" rel="noopener noreferrer" className="text-primary-400 underline">{alt || 'image'}</a>
	}
}

const PLAIN = components(false)
const WITH_IMAGES = components(true)

export function MarkdownView({ children, images = false, className }: MarkdownViewProps) {
	return (
		<div className={twMerge('text-sm leading-relaxed text-steel-100 break-words', className)}>
			<ReactMarkdown remarkPlugins={[remarkGfm]} components={images ? WITH_IMAGES : PLAIN} skipHtml={false}>
				{children}
			</ReactMarkdown>
		</div>
	)
}
