import { type TableProps } from './Table.types'
import { styles } from './Table.variants'

export function Table({ children, className }: TableProps) {
	return <table className={className ?? styles.table()}>{children}</table>
}
