import { Link } from 'react-router'
import { HubLogo } from './HubLogo'
import { type BrandProps } from './Brand.types'
import { styles } from './Brand.variants'

export function Brand({ to, onClick }: BrandProps) {
	const content = (
		<>
			<HubLogo className={styles.icon()} />
			<span className={styles.text()}>hub</span>
		</>
	)

	if (to) {
		return (
			<Link to={to} onClick={onClick} className={`${styles.wrap()} cursor-pointer`}>
				{content}
			</Link>
		)
	}

	return <div className={styles.wrap()}>{content}</div>
}
