import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { twMerge } from 'tailwind-merge'
import { type ButtonProps } from './Button.types'
import { styles } from './Button.variants'

export function Button({
	label,
	children,
	icon,
	onClick,
	className,
	color,
	isDisabled = false,
	isLoading = false,
	type = 'button',
	...rest
}: ButtonProps) {
	const classList = twMerge(styles.button({ disabled: isDisabled, color }), className)

	return (
		<button
			type={type}
			className={classList}
			onClick={onClick}
			disabled={isDisabled || isLoading}
			{...rest}
		>
			{isLoading
				? <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
				: <>
					{icon && <FontAwesomeIcon icon={icon} />}
					{label ?? children}
				</>
			}
		</button>
	)
}
