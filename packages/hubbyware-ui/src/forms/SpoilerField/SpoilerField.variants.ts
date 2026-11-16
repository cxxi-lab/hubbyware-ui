import { styles as fieldStyles } from '../FormField'
import { tv } from 'tailwind-variants'

export const styles = {
	field: tv({ base: 'relative' }),

	input: tv({
		extend: fieldStyles.input,
		base: 'h-11 pr-8',
		variants: {
			error: {
				true: 'border-red-500!'
			}
		}
	}),

	revealer: tv({
		base: [
			'absolute',
			'right-2',
			'top-1/2',
			'-translate-y-1/2',
			'text-steel-300',
			'hover:text-primary-500',
			'focus:outline-none',
			'cursor-pointer',
			'bg-transparent',
			'border-0'
		]
	})
}
