import { useRef, useState } from 'react'
import { useClickOutside } from '../../utils/useClickOutside'
import { useBackHandler } from '../../back'
import { type DropdownProps } from './Dropdown.types'
import { styles } from './Dropdown.variants'

export function Dropdown({
	header,
	children,
	color,
	side,
	isOpen: controlledOpen,
	onOpenChange,
	className
}: DropdownProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
	const isControlled = controlledOpen !== undefined
	const open = isControlled ? controlledOpen : uncontrolledOpen

	const setOpen = (next: boolean) => {
		if (!isControlled) setUncontrolledOpen(next)
		onOpenChange?.(next)
	}

	const containerRef = useRef<HTMLDivElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)

	useClickOutside([containerRef, menuRef], () => setOpen(false))
	useBackHandler(open, () => setOpen(false))

	return (
		<div ref={containerRef} className={styles.container({ class: className })} onClick={() => setOpen(!open)}>
			{header && <div>{typeof header === 'function' ? header(open) : header}</div>}
			<div ref={menuRef} className={styles.menu({ open, color, side })}>
				<div>{children}</div>
			</div>
		</div>
	)
}
