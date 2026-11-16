import { type ReactNode } from 'react'
import { type ButtonColor } from '../../buttons/Button/Button.types'
import { type ModalSize } from '../Modal/Modal.types'

export interface ConfirmationModalProps {
	title: ReactNode
	size?: ModalSize
	confirmLabel?: string
	confirmColor?: ButtonColor
	cancelLabel?: string
	onConfirm: () => void | Promise<void>
	onClose: () => void
	children: ReactNode
}
