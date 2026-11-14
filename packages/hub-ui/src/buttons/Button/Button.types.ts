import { type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { type MouseEventHandler, type ReactNode } from 'react'

export type ButtonColor = 'primary' | 'secondary' | 'danger'

export interface ButtonProps {
	label?: ReactNode
	children?: ReactNode
	icon?: IconDefinition
	color?: ButtonColor
	isDisabled?: boolean
	isLoading?: boolean
	className?: string
	onClick?: MouseEventHandler<HTMLButtonElement>
	type?: 'button' | 'submit' | 'reset'
	title?: string
	'aria-label'?: string
}
