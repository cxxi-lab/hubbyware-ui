import { type ReactNode } from 'react'
import { type FormData } from '../../contexts/FormContext'
import { type ModalSize } from '../Modal/Modal.types'

export interface FormModalProps {
	title: ReactNode
	size?: ModalSize
	initialData?: FormData
	submitLabel?: string
	cancelLabel?: string
	onSubmit: (data: FormData) => void | Promise<void>
	onClose: () => void
	children: ReactNode
}
