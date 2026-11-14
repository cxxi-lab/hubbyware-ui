import { tv } from 'tailwind-variants'

export const styles = {
	button: tv({
		base: [
			'inline-flex',
			'items-center',
			'justify-center',
			'gap-2',
			'px-4',
			'h-9',
			'rounded',
			'text-sm',
			'font-semibold',
			'leading-none',
			// a label on one line, the button never squeezed by its neighbours (a narrow header)
			'whitespace-nowrap',
			'shrink-0',
			'cursor-pointer',
			'transition'
		],
		variants: {
			color: {
				primary: 'bg-primary-500 text-steel-950 hover:bg-primary-300',
				secondary: 'bg-steel-800 text-steel-100 hover:bg-steel-700 hover:text-white',
				danger: 'bg-red-500 text-steel-950 hover:bg-red-300'
			},
			disabled: {
				true: 'opacity-25 pointer-events-none'
			}
		},
		defaultVariants: {
			color: 'primary'
		}
	})
}
