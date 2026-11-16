import { tv } from 'tailwind-variants'

export const styles = {
	field: tv({ base: 'flex items-center gap-2 mb-4 cursor-pointer' }),

	label: tv({
		base: 'text-sm font-normal pointer-events-none',
		variants: {
			required: {
				true: "after:content-['*'] after:pl-[2px] after:text-red-100"
			}
		}
	}),

	check: tv({
		base: [
			'size-[14px]',
			'text-[9px]',
			'flex',
			'justify-center',
			'items-center',
			'rounded-xs',
			'border',
			'cursor-pointer'
		],
		variants: {
			checked: {
				true: 'bg-primary-700 text-primary-500 border-primary-500',
				false: 'bg-transparent text-transparent border-steel-300'
			}
		},
		defaultVariants: {
			checked: false
		}
	})
}
