import { useFormContext } from '../../contexts/FormContext'
import { snakeCase } from '../../utils'
import { type FormFieldProps } from './FormField.types'
import { styles } from './FormField.variants'

export function FormField({ name, label, required = false, children }: FormFieldProps) {
	const { errors } = useFormContext()
	const id = `field_${snakeCase(name)}`
	const hasError = Boolean(errors[name])

	return (
		<div className={styles.field()}>
			{label && (
				<label htmlFor={id} className={styles.label({ required })}>
					{label}
				</label>
			)}

			<div className={styles.inputWrapper()}>
				{children(id, hasError)}
			</div>

			{hasError && <p className={styles.error()}>{errors[name]}</p>}
		</div>
	)
}
