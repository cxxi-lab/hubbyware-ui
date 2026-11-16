import { type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { type MouseEventHandler } from 'react'

export type IconButtonColor = 'primary' | 'secondary' | 'danger' | 'dark'
export type IconButtonShape = 'square' | 'circle'
export type IconButtonSize = 'xxs' | 'xs' | 'sm' | 'md' | 'xl'

export interface IconButtonProps {
	icon: IconDefinition
	onClick?: MouseEventHandler<HTMLButtonElement>
	className?: string
	active?: boolean
	highlighted?: boolean
	isDisabled?: boolean
	isLoading?: boolean
	color?: IconButtonColor
	shape?: IconButtonShape
	size?: IconButtonSize
	type?: 'button' | 'submit' | 'reset'
	title?: string
	'aria-label'?: string
	'aria-expanded'?: boolean
}
