import { type ReactNode } from 'react'
import { type ModalSize } from '../Modal/Modal.types'

export interface InfoModalProps {
	title: ReactNode
	size?: ModalSize
	dismissLabel?: string
	onClose: () => void
	children: ReactNode
}
