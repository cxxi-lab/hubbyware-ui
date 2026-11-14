import { tv } from 'tailwind-variants'

export const styles = {
	backdrop: tv({
		base: [
			'fixed inset-0',
			'flex',
			'items-start',
			'justify-center',
			// phone: the modal is the whole screen (no margin below sm)
			'sm:p-4',
			'bg-black-overlay',
			'backdrop-blur-xs',
			'pretty-scrollbar',
			'z-999'
		]
	}),

	modal: tv({
		base: [
			'bg-steel-800',
			'text-steel-100',
			'sm:rounded-sm',
			'shadow',
			'sm:my-4',
			'min-h-full sm:min-h-0',
			'h-auto',
			'w-full',
			'relative'
		],
		variants: {
			size: {
				sm: 'sm:max-w-lg',
				md: 'sm:max-w-2xl',
				lg: 'sm:max-w-4xl',
				xl: 'sm:max-w-6xl',
				full: 'max-w-none w-screen h-screen my-0'
			}
		},
		defaultVariants: {
			size: 'sm'
		}
	}),

	header: tv({ base: 'flex justify-between items-center gap-4 p-6 pb-4' }),
	title: tv({ base: 'text-xl font-semibold' }),
	content: tv({ base: 'px-6 pb-6' })
}
