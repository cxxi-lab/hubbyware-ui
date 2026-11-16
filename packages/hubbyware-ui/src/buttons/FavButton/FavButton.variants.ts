import { tv } from 'tailwind-variants'

export const styles = {
	button: tv({
		variants: {
			favorite: {
				true: 'text-primary-500!',
				false: 'text-steel-800!'
			}
		}
	})
}
