import { type ReactNode } from 'react'

export type DropdownColor = 'menu' | 'field'
export type DropdownSide = 'left' | 'center' | 'right'

export type DropdownHeader = ReactNode | ((isOpen: boolean) => ReactNode)

export interface DropdownProps {
	header?: DropdownHeader
	children: ReactNode
	color?: DropdownColor
	side?: DropdownSide
	isOpen?: boolean
	onOpenChange?: (open: boolean) => void
	/** extra classes on the root (e.g. to size it inside a flex row) */
	className?: string
}
