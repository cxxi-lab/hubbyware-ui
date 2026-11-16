import { type ReactNode } from 'react'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
	title?: ReactNode
	size?: ModalSize
	onClose: () => void
	children: ReactNode
}
