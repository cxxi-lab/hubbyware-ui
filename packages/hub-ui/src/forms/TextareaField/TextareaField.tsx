import { useFormContext } from '../../contexts/FormContext'
import { FormField } from '../FormField'
import { type TextareaFieldProps } from './TextareaField.types'
import { styles } from './TextareaField.variants'

export function TextareaField({
	name,
	label,
	rows = 4,
	required = false,
	placeholder = '',
	...rest
}: TextareaFieldProps) {
	const { data, setField } = useFormContext()

	return (
		<FormField name={name} label={label} required={required}>
			{(id, hasError) => (
				<textarea
					id={id}
					name={name}
					rows={rows}
					value={(data[name] as string | undefined) ?? ''}
					placeholder={placeholder}
					className={styles.input({ error: hasError })}
					onChange={e => setField(name, e.target.value)}
					required={required}
					{...rest}
				/>
			)}
		</FormField>
	)
}
