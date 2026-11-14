import { type IconButtonSize } from '../IconButton/IconButton.types'

export interface FavButtonProps {
	initialState?: boolean
	onClick?: (next: boolean) => void
	size?: IconButtonSize
	className?: string
	title?: string
	'aria-label'?: string
}
