import { type ReactNode } from 'react'

/**
 * A switch between two choices (this || that, not on/off): both labels sit in the track, the
 * thumb slides under the picked one. SwitchField's look, blue on both sides.
 */
export function ChoiceSwitch<V extends string>({ value, options, label, onChange }: {
	value: V
	/** `count`: a number shown after the label (e.g. results waiting there) */
	options: [{ value: V, label: string, icon?: ReactNode, count?: number }, { value: V, label: string, icon?: ReactNode, count?: number }]
	/** said to screen readers */
	label: string
	onChange: (value: V) => void
}) {
	const second = value === options[1].value
	return (
		<div role="radiogroup" aria-label={label} className="relative inline-grid grid-cols-2 h-8 p-0.5 border border-steel-300 rounded-xs">
			<span
				aria-hidden
				className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-xs bg-primary-500 transition-transform duration-200 ${second ? 'translate-x-full' : 'translate-x-0'}`}
			/>
			{options.map(o => {
				const picked = o.value === value
				return (
					<button
						key={o.value}
						type="button"
						role="radio"
						aria-checked={picked}
						onClick={() => onChange(o.value)}
						className={`relative z-10 flex items-center justify-center gap-1.5 px-3 text-xs font-semibold bg-transparent border-0 cursor-pointer transition-colors duration-200 ${picked ? 'text-steel-950' : 'text-steel-100 hover:text-white'}`}
					>
						{o.icon}
						{o.label}
						{o.count !== undefined && (
							<span className={`min-w-5 h-4 px-1 rounded-full text-[10px] leading-4 tabular-nums ${picked ? 'bg-steel-950/25 text-steel-950' : 'bg-steel-800 text-steel-100'}`}>{o.count}</span>
						)}
					</button>
				)
			})}
		</div>
	)
}
