import { Button } from '../../buttons'
import { Modal } from '../Modal'
import { type InfoModalProps } from './InfoModal.types'
import { styles } from './InfoModal.variants'

export function InfoModal({
	title,
	size,
	dismissLabel = 'OK',
	onClose,
	children
}: InfoModalProps) {
	return (
		<Modal title={title} size={size} onClose={onClose}>
			<div className={styles.content()}>{children}</div>
			<footer className={styles.footer()}>
				<Button label={dismissLabel} onClick={onClose} />
			</footer>
		</Modal>
	)
}
