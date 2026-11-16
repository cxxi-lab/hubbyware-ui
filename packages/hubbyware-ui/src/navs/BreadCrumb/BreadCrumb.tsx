import { Fragment } from 'react'
import { Link } from 'react-router'
import { type BreadCrumbProps } from './BreadCrumb.types'
import { styles } from './BreadCrumb.variants'

export function BreadCrumb({ crumbs, separator = '/' }: BreadCrumbProps) {
	return (
		<ul className={styles.container()}>
			{crumbs.map((crumb, i) => (
				<Fragment key={`crumb-${i}`}>
					{i > 0 && <li className={styles.separator()}>{separator}</li>}
					<li className={styles.crumb()}>
						<Link to={crumb.path}>{crumb.label}</Link>
					</li>
				</Fragment>
			))}
		</ul>
	)
}
