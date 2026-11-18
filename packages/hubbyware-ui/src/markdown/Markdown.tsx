import { lazy, Suspense } from 'react'
import { twMerge } from 'tailwind-merge'
import type { MarkdownViewProps } from './MarkdownView'

/**
 * Markdown, rendered the same everywhere (./MarkdownView.tsx: safe by default, GFM, code blocks).
 * Its parser is loaded on first use only — a hubby's frame that never shows Markdown never loads it;
 * until it is there (a moment, once), the text shows as it is.
 */
export type MarkdownProps = MarkdownViewProps

const View = lazy(() => import('./MarkdownView').then(m => ({ default: m.MarkdownView })))

export function Markdown(props: MarkdownProps) {
	return (
		<Suspense fallback={<div className={twMerge('text-sm leading-relaxed text-steel-100 break-words whitespace-pre-wrap', props.className)}>{props.children}</div>}>
			<View {...props} />
		</Suspense>
	)
}
