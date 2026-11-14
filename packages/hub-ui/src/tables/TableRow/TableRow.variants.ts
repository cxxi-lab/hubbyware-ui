import { tv } from 'tailwind-variants'

export const styles = {
	tr: tv({
		base: 'hover:bg-primary-700/40 transition-colors',
		variants: {
			highlighted: {
				true: 'bg-product-pink/15 hover:bg-product-pink/25'
			}
		}
	})
}
