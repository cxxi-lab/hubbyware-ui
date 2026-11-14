import { type ReactNode, type TdHTMLAttributes } from 'react'
import { type TextAlign } from '../TableHead/TableHead.types'

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'children'> {
	to?: string
	textAlign?: TextAlign
	mobile?: boolean
	children?: ReactNode
}
