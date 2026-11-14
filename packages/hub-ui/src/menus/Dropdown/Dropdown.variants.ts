import { tv } from 'tailwind-variants'

export const styles = {
	container: tv({ base: 'relative' }),

	menu: tv({
		base: [
			'absolute',
			'w-fit',
			'rounded-xs',
			'border',
			'origin-top',
			'transition-transform',
			'transition-opacity',
			'z-50'
		],

		variants: {
			color: {
				menu: 'bg-steel-800 border-steel-700 shadow-out',
				field: 'bg-steel-800 border-steel-300 shadow'
			},
			side: {
				left: 'start-0',
				center: 'start-0 w-full end-0',
				right: 'end-0'
			},
			open: {
				true: 'scale-y-100 opacity-100 pointer-events-auto',
				false: 'scale-y-0 opacity-0 pointer-events-none'
			}
		},

		defaultVariants: {
			color: 'menu',
			side: 'left'
		},

		compoundVariants: [
			{ side: ['left', 'right'], color: 'menu', class: 'top-[calc(100%+8px)]' },
			{ side: 'center', color: 'field', class: 'top-12' }
		]
	})
}
