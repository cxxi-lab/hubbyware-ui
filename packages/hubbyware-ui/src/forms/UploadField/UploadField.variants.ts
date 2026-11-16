import { tv } from 'tailwind-variants'

export const styles = {
	dropzone: tv({
		base: [
			'flex flex-col items-center justify-center gap-2',
			'min-h-24',
			'p-4',
			'border-2 border-dashed border-steel-700',
			'rounded-xs',
			'cursor-pointer',
			'transition',
			'text-sm text-steel-300',
			'hover:border-primary-500 hover:text-primary-500'
		],
		variants: {
			dragActive: { true: 'border-primary-500! text-primary-500!' },
			error: { true: 'border-red-500!' }
		}
	}),

	previews: tv({ base: 'mt-3 text-xs text-steel-100 list-disc list-inside' })
}
