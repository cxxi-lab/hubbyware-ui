import { type ReactNode } from 'react'

export type FormFieldRenderer = (id: string, hasError: boolean) => ReactNode

export interface FormFieldProps {
	name: string
	label?: string
	required?: boolean
	children: FormFieldRenderer
}
