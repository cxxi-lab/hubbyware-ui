import { useFormContext } from '../../contexts/FormContext'
import { FormField } from '../FormField'
import { type InputFieldProps } from './InputField.types'
import { styles } from './InputField.variants'

export function InputField({
	name,
	label,
	type = 'text',
	required = false,
	placeholder = '',
	...rest
}: InputFieldProps) {
	const { data, setField } = useFormContext()

	return (
		<FormField name={name} label={label} required={required}>
			{(id, hasError) => (
				<input
					id={id}
					name={name}
					type={type}
					value={(data[name] as string | number | undefined) ?? ''}
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
