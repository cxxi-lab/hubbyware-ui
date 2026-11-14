import { type ReactNode, type ThHTMLAttributes } from 'react'

export type TextAlign = 'left' | 'center' | 'right'

export interface TableHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'children'> {
	textAlign?: TextAlign
	mobile?: boolean
	children?: ReactNode
}
