import { tv } from 'tailwind-variants'

export const styles = {
	th: tv({
		base: 'py-2',
		variants: {
			textAlign: {
				left: 'text-left',
				center: 'text-center',
				right: 'text-right'
			},
			empty: { false: 'px-4' },
			hiddenOnMobile: { true: 'hidden md:table-cell' }
		}
	})
}
