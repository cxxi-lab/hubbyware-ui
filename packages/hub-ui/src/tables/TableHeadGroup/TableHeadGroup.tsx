import { type ReactNode } from 'react'
import { styles } from './TableHeadGroup.variants'

export function TableHeadGroup({ children }: { children: ReactNode }) {
	return (
		<thead className={styles.thead()}>
			<tr className={styles.rowHead()}>{children}</tr>
		</thead>
	)
}
