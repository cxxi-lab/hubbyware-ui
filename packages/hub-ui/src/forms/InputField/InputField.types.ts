import { type HTMLInputTypeAttribute } from 'react'

export interface InputFieldProps {
	name: string
	label?: string
	type?: HTMLInputTypeAttribute
	required?: boolean
	placeholder?: string
	autoComplete?: string
	autoFocus?: boolean
	min?: number | string
	max?: number | string
	step?: number | string
}
