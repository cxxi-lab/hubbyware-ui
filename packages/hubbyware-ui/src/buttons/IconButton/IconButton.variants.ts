import { tv } from 'tailwind-variants'

export const styles = {
	button: tv({
		base: [
			'inline-flex',
			'justify-center',
			'items-center',
			'aspect-square',
			'font-semibold',
			'leading-none',
			'cursor-pointer',
			'transition'
		],
		variants: {
			color: {
				primary: 'text-steel-950 bg-primary-500 hover:bg-primary-300',
				secondary: 'text-steel-300 hover:bg-steel-700 hover:text-white',
				danger: 'text-steel-950 bg-red-500 hover:bg-red-300',
				dark: 'text-steel-300 bg-steel-800 hover:bg-steel-700 hover:text-white'
			},
			active: {
				true: 'bg-primary-700! text-primary-300!'
			},
			highlighted: {
				true: 'text-primary-300!'
			},
			shape: {
				square: 'rounded',
				circle: 'rounded-full'
			},
			size: {
				xxs: 'size-4 text-[11px]',
				xs: 'size-6 text-xs',
				sm: 'size-7 text-sm',
				md: 'size-9 text-base',
				xl: 'size-10 text-lg'
			},
			disabled: {
				true: 'opacity-25 pointer-events-none'
			}
		},
		defaultVariants: {
			color: 'dark',
			shape: 'circle',
			size: 'md'
		}
	}),
	icon: tv({
		variants: {
			loading: {
				true: 'animate-spin'
			}
		}
	})
}
