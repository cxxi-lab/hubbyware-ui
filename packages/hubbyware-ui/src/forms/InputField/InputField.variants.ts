import { styles as fieldStyles } from '../FormField'
import { tv } from 'tailwind-variants'

export const styles = {
	input: tv({
		extend: fieldStyles.input,
		base: 'h-11',
		variants: {
			error: {
				true: 'border-red-500!'
			}
		}
	})
}
