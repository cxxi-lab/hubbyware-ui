import { type ReactNode } from 'react'
import { styles } from './TableRowGroup.variants'

export function TableRowGroup({ children }: { children: ReactNode }) {
	return <tbody className={styles.tbody()}>{children}</tbody>
}
