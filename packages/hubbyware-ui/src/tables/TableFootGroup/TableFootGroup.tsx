import { type ReactNode } from 'react'
import { styles } from './TableFootGroup.variants'

export function TableFootGroup({ children }: { children: ReactNode }) {
	return (
		<tfoot className={styles.tfoot()}>
			<tr className={styles.rowFoot()}>{children}</tr>
		</tfoot>
	)
}
