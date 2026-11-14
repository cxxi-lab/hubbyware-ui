import { Link } from 'react-router'
import { type TableCellProps } from './TableCell.types'
import { styles } from './TableCell.variants'

export function TableCell({
	to,
	textAlign = 'left',
	mobile = true,
	className,
	children,
	...rest
}: TableCellProps) {
	const computed = styles.td({
		textAlign,
		hiddenOnMobile: !mobile,
		isLink: Boolean(to)
	})

	return (
		<td className={`${computed} ${className ?? ''}`.trim()} {...rest}>
			{to
				? <Link to={to} className={styles.link()}>{children}</Link>
				: <span>{children}</span>
			}
		</td>
	)
}
