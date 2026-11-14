import { tv } from 'tailwind-variants'

export const styles = {
	td: tv({
		base: 'px-4 leading-none',
		variants: {
			isLink: { false: 'py-2' },
			textAlign: {
				left: 'text-left',
				center: 'text-center',
				right: 'text-right'
			},
			hiddenOnMobile: { true: 'hidden md:table-cell' }
		}
	}),
	link: tv({
		base: [
			'inline-block',
			'w-full',
			'py-2',
			'hover:text-primary-500',
			'hover:underline',
			'underline-offset-3'
		]
	})
}
