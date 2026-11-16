import { styles as fieldStyles } from '../FormField'
import { tv } from 'tailwind-variants'

export const styles = {
	field: tv({ base: 'relative w-full pb-1' }),

	htmlSelect: tv({ base: 'hidden absolute w-full' }),

	inputWrapper: tv({
		base: ['w-full', 'rounded-xs', 'border', 'border-transparent'],
		variants: {
			open: { true: 'border-primary-300' }
		}
	}),

	input: tv({
		extend: fieldStyles.input,
		base: [
			'relative',
			'w-full',
			'flex',
			'items-center',
			'h-11',
			'bg-steel-800',
			'cursor-pointer'
		],
		variants: {
			open: { true: 'border-primary-300' }
		}
	}),

	inputText: tv({ base: 'flex-1' }),
	inputIcon: tv({ base: 'mr-1' }),

	choices: tv({ base: 'py-1 my-2' }),
	choice: tv({ base: 'py-1 px-3 text-sm hover:bg-steel-700 cursor-pointer' })
}
