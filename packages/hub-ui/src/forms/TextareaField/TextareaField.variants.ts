import { styles as fieldStyles } from '../FormField'
import { tv } from 'tailwind-variants'

export const styles = {
	input: tv({
		extend: fieldStyles.input,
		base: 'min-h-11 resize-y',
		variants: {
			error: {
				true: 'border-red-500!'
			}
		}
	})
}
