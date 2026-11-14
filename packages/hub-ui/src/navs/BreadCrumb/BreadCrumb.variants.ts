import { tv } from 'tailwind-variants'

export const styles = {
	container: tv({ base: 'flex gap-2 text-xs mb-1' }),
	crumb: tv({ base: 'hover:underline underline-offset-3 text-steel-100' }),
	separator: tv({ base: 'text-steel-300' })
}
