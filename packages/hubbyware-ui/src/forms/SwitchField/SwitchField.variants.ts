import { tv } from 'tailwind-variants'

export const styles = {
	field: tv({
		base: [
			'w-full',
			'h-11',
			'flex',
			'items-center',
			'justify-between',
			'cursor-pointer',
			'select-none'
		]
	}),

	switch: tv({
		base: [
			'relative',
			'w-10',
			'h-5',
			'border',
			'rounded-xs',
			'transition-colors',
			'duration-200',
			'cursor-pointer'
		],
		variants: {
			checked: {
				true: 'border-steel-300 bg-primary-700',
				false: 'border-steel-300 bg-transparent'
			}
		}
	}),

	thumb: tv({
		base: [
			'absolute',
			'top-0.5',
			'left-0.5',
			'size-[14px]',
			'rounded-xs',
			'transition-transform',
			'duration-200',
			'cursor-pointer'
		],
		variants: {
			checked: {
				true: 'translate-x-5 bg-primary-500',
				false: 'translate-x-0 bg-steel-300'
			}
		}
	}),

	label: tv({
		base: 'text-sm',
		variants: {
			required: {
				true: 'after:content-["*"] after:ml-1 after:text-red-500'
			}
		}
	})
}
