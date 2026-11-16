import { Children } from 'react'
import { type TableHeadProps } from './TableHead.types'
import { styles } from './TableHead.variants'

export function TableHead({
	textAlign = 'left',
	mobile = true,
	className,
	children,
	...rest
}: TableHeadProps) {
	const computed = styles.th({
		textAlign,
		empty: Children.count(children) === 0,
		hiddenOnMobile: !mobile
	})
	return (
		<th className={`${computed} ${className ?? ''}`.trim()} {...rest}>
			{children}
		</th>
	)
}
