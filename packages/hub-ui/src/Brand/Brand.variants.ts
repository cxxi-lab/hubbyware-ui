import { tv } from 'tailwind-variants'

export const styles = {
	wrap: tv({
		base: 'inline-flex items-center gap-1 px-1 text-2xl font-["Sofia"] select-none outline-none'
	}),
	icon: tv({ base: 'size-6' }),
	text: tv({ base: 'brand-gradient font-bold mx-1 lowercase' })
}
