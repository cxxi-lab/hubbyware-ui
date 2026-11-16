import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { twMerge } from 'tailwind-merge'
import { type IconButtonProps } from './IconButton.types'
import { styles } from './IconButton.variants'

export function IconButton({
	icon,
	onClick,
	className,
	active = false,
	highlighted = false,
	isDisabled = false,
	isLoading = false,
	color,
	shape,
	size,
	type = 'button',
	...rest
}: IconButtonProps) {
	const classList = twMerge(
		styles.button({ active, highlighted, disabled: isDisabled, color, shape, size }),
		className
	)

	return (
		<button
			type={type}
			className={classList}
			onClick={onClick}
			disabled={isDisabled || isLoading}
			{...rest}
		>
			<FontAwesomeIcon
				icon={isLoading ? faCircleNotch : icon}
				className={styles.icon({ loading: isLoading })}
			/>
		</button>
	)
}
