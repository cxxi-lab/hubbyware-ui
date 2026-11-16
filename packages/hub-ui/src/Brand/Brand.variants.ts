import { tv } from 'tailwind-variants'

export const styles = {
	wrap: tv({
		// the family here, the weight on the word (tailwind-merge takes the two for one group)
		base: 'inline-flex items-center gap-1.5 px-1 text-2xl font-["Fredoka"] select-none outline-none'
	}),
	icon: tv({ base: 'size-6' }),
	text: tv({ base: 'brand-gradient font-semibold lowercase tracking-[-0.01em]' })
}
