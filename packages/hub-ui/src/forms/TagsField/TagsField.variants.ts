import { styles as fieldStyles } from '../FormField'
import { tv } from 'tailwind-variants'

export const styles = {
	tags: tv({
		extend: fieldStyles.input,
		base: [
			'min-h-11',
			'w-full',
			'flex',
			'flex-wrap',
			'gap-y-2',
			'items-center',
			'focus-within:border-primary-300'
		],
		variants: {
			isFull: { true: 'cursor-not-allowed' }
		}
	}),

	tag: tv({
		base: 'h-full flex items-center font-mono',
		variants: {
			persisted: {
				true: [
					'flex-[initial]',
					'mr-2',
					'border',
					'border-steel-700',
					'rounded-sm',
					'p-[2px]',
					'pl-2',
					'leading-none'
				],
				false: 'flex-1'
			}
		},
		defaultVariants: { persisted: false }
	}),

	tagText: tv({ base: 'text-xs leading-[115%]' }),

	input: tv({
		base: 'outline-none border-0 w-auto grow shrink bg-transparent text-white text-sm',
		variants: {
			isFull: { true: 'cursor-not-allowed' }
		}
	}),

	tagLimit: tv({ base: '-mt-4 pt-1 text-xs text-red-300' })
}
