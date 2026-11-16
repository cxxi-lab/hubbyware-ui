import { useFormContext } from '../../contexts/FormContext'
import { snakeCase } from '../../utils'
import { type SwitchFieldProps } from './SwitchField.types'
import { styles } from './SwitchField.variants'

export function SwitchField({ name, label, required = false }: SwitchFieldProps) {
	const { data, setField } = useFormContext()
	const id = `field_${snakeCase(name)}`
	const checked = Boolean(data[name])

	const toggle = () => setField(name, !checked)

	return (
		<div className={styles.field()} onClick={toggle} aria-pressed={checked} aria-controls={id}>
			{label && (
				<label htmlFor={id} className={styles.label({ required })}>
					{label}
				</label>
			)}

			<div>
				<button
					type="button"
					className={styles.switch({ checked })}
					role="switch"
					aria-checked={checked}
				>
					<span className={styles.thumb({ checked })} />
				</button>

				<input
					id={id}
					name={name}
					type="checkbox"
					checked={checked}
					className="hidden"
					readOnly
					required={required}
				/>
			</div>
		</div>
	)
}
