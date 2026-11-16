import { styles } from './SwitchField.variants'

/** The SwitchField switch on its own, outside a form: controlled by `checked`. */
export function Switch({ checked, onChange, title }: { checked: boolean, onChange: (checked: boolean) => void, title?: string }) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={title}
			title={title}
			onClick={() => onChange(!checked)}
			className={`${styles.switch({ checked })} shrink-0 p-0 bg-clip-padding`}
		>
			<span className={styles.thumb({ checked })} />
		</button>
	)
}
