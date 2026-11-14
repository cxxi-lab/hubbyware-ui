import { type ReactNode } from 'react'
import { type FormData } from '../../contexts/FormContext'

export interface FormProps {
	initialData?: FormData
	title?: string
	actions?: ReactNode
	onSubmit: (data: FormData) => void | Promise<void>
	children: ReactNode
	className?: string
}
