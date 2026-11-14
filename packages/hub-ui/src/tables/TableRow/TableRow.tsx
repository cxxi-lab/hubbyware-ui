import { type TableRowProps } from './TableRow.types'
import { styles } from './TableRow.variants'

export function TableRow({ children, highlighted = false, className }: TableRowProps) {
	const computed = styles.tr({ highlighted })
	return <tr className={`${computed} ${className ?? ''}`.trim()}>{children}</tr>
}
