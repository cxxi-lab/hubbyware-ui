import { useEffect, useRef, useState } from 'react'

/**
 * A code typed digit by digit (a PIN, a 2FA code): one box per digit, as a phone's code screens
 * show it. One real input under the boxes, see-through: a phone opens its numeric keypad, a pasted
 * or auto-filled code (`one-time-code`) lands whole, backspace and arrows behave as in a field.
 * `masked`: dots instead of the digits (a PIN). `onComplete` when the last digit is typed.
 */
export function CodeInput({ length = 6, value, onChange, onComplete, masked = false, autoFocus = false, isDisabled = false, isInvalid = false, label }: {
	length?: number
	value: string
	onChange: (value: string) => void
	onComplete?: (value: string) => void
	masked?: boolean
	autoFocus?: boolean
	isDisabled?: boolean
	/** the boxes in red (a wrong code) */
	isInvalid?: boolean
	/** said to screen readers */
	label: string
}) {
	const input = useRef<HTMLInputElement>(null)
	const [focused, setFocused] = useState(false)
	useEffect(() => { if (autoFocus) input.current?.focus() }, [autoFocus])

	const change = (raw: string) => {
		const digits = raw.replace(/\D/g, '').slice(0, length)
		onChange(digits)
		if (digits.length === length) onComplete?.(digits)
	}

	return (
		<div className="relative inline-flex gap-2" onClick={() => input.current?.focus()}>
			{Array.from({ length }, (_, i) => {
				const digit = value[i]
				const current = focused && (i === value.length || (i === length - 1 && value.length === length))
				return (
					<div
						key={i}
						aria-hidden
						className={[
							'flex items-center justify-center w-11 h-13 max-sm:w-10 max-sm:h-12 rounded border text-xl font-semibold text-white bg-steel-950 transition-colors',
							isInvalid ? 'border-red-500' : current ? 'border-primary-500' : digit !== undefined ? 'border-steel-300' : 'border-steel-700'
						].join(' ')}
					>
						{digit === undefined ? '' : masked ? <span className="size-2.5 rounded-full bg-white" /> : digit}
					</div>
				)
			})}
			<input
				ref={input}
				aria-label={label}
				type="text"
				inputMode="numeric"
				pattern="[0-9]*"
				autoComplete="one-time-code"
				maxLength={length}
				value={value}
				disabled={isDisabled}
				onChange={e => change(e.target.value)}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				className="absolute inset-0 w-full h-full opacity-0 cursor-text caret-transparent text-transparent bg-transparent border-0 outline-none"
			/>
		</div>
	)
}
