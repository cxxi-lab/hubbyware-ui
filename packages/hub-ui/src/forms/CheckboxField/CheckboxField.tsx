import { useFormContext } from '../../contexts/FormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { snakeCase } from '../../utils'
import { type CheckboxFieldProps } from './CheckboxField.types'
import { styles } from './CheckboxField.variants'

export function CheckboxField({ name, label, required = false }: CheckboxFieldProps) {
	const { data, setField } = useFormContext()
	const id = `field_${snakeCase(name)}`
	const checked = Boolean(data[name])

	const toggle = () => setField(name, !checked)

	return (
		<div className={styles.field()} onClick={toggle} aria-pressed={checked} aria-controls={id}>
			<div>
				<button type="button" className={styles.check({ checked })}>
					<FontAwesomeIcon icon={faCheck} />
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

			{label && (
				<label htmlFor={id} className={styles.label({ required })}>
					{label}
				</label>
			)}
		</div>
	)
}
