import { useState } from 'react'
import { useFormContext } from '../../contexts/FormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FormField } from '../FormField'
import { type SpoilerFieldProps } from './SpoilerField.types'
import { styles } from './SpoilerField.variants'

export function SpoilerField({
	name,
	label,
	required = false,
	placeholder = '',
	...rest
}: SpoilerFieldProps) {
	const { data, setField } = useFormContext()
	const [revealed, setRevealed] = useState(false)

	return (
		<FormField name={name} label={label} required={required}>
			{(id, hasError) => (
				<div className={styles.field()}>
					<input
						id={id}
						name={name}
						type={revealed ? 'text' : 'password'}
						value={(data[name] as string | undefined) ?? ''}
						placeholder={placeholder}
						className={styles.input({ error: hasError })}
						onChange={e => setField(name, e.target.value)}
						required={required}
						{...rest}
					/>

					<button
						type="button"
						onClick={() => setRevealed(r => !r)}
						className={styles.revealer()}
						tabIndex={-1}
						aria-label={revealed ? 'Hide value' : 'Reveal value'}
					>
						<FontAwesomeIcon icon={revealed ? faEyeSlash : faEye} />
					</button>
				</div>
			)}
		</FormField>
	)
}
