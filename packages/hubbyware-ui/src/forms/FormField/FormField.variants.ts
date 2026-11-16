import { tv } from 'tailwind-variants'

export const styles = {
	field: tv({ base: 'flex flex-col mb-4' }),

	label: tv({
		base: 'text-xs font-semibold mb-1',
		variants: {
			required: {
				true: "after:content-['*'] after:pl-[2px] after:text-red-100"
			}
		}
	}),

	inputWrapper: tv({
		base: [
			'w-full',
			'rounded-xs',
			'border',
			'border-transparent',
			'focus-within:border-primary-300'
		]
	}),

	input: tv({
		base: [
			'w-full',
			'min-w-3xs',
			'py-2',
			'px-[6px]',
			'rounded-xs',
			'border',
			'border-steel-300',
			'focus:border-primary-300',
			'outline-none',
			'text-sm',
			'bg-transparent',
			'text-white',
			'placeholder:text-steel-300'
		]
	}),

	error: tv({ base: 'pt-1 text-red-500 text-xs' })
}
