import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from '../../buttons'
import { type ModalProps } from './Modal.types'
import { styles } from './Modal.variants'
import { useBackHandler } from '../../back'

export function Modal({ title, size, onClose, children }: ModalProps) {
	// the phone's back button closes it
	useBackHandler(true, onClose)
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [onClose])

	return createPortal(
		<div className={styles.backdrop()} onMouseDown={e => e.target === e.currentTarget && onClose()}>
			<div className={styles.modal({ size })} role="dialog" aria-modal="true">
				{title !== undefined && (
					<header className={styles.header()}>
						<h2 className={styles.title()}>{title}</h2>
						<IconButton color="secondary" icon={faXmark} onClick={onClose} aria-label="Close" />
					</header>
				)}
				<div className={styles.content()}>{children}</div>
			</div>
		</div>,
		document.body
	)
}
