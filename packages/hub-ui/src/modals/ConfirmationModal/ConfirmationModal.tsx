import { useState } from 'react'
import { withLoading } from '../../utils'
import { Button } from '../../buttons'
import { Modal } from '../Modal'
import { type ConfirmationModalProps } from './ConfirmationModal.types'
import { styles } from './ConfirmationModal.variants'

export function ConfirmationModal({
	title,
	size,
	confirmLabel = 'Confirm',
	confirmColor,
	cancelLabel = 'Cancel',
	onConfirm,
	onClose,
	children
}: ConfirmationModalProps) {
	const [loading, setLoading] = useState(false)

	const handleConfirm = async () => {
		await withLoading(setLoading, () => Promise.resolve(onConfirm()))
		onClose()
	}

	return (
		<Modal title={title} size={size} onClose={onClose}>
			<div className={styles.content()}>{children}</div>
			<footer className={styles.footer()}>
				<Button
					label={cancelLabel}
					color="secondary"
					onClick={onClose}
					isDisabled={loading}
				/>
				<Button
					label={confirmLabel}
					color={confirmColor}
					onClick={handleConfirm}
					isLoading={loading}
				/>
			</footer>
		</Modal>
	)
}
