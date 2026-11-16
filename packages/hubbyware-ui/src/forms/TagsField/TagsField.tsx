import { useRef, useState, type KeyboardEvent, type ChangeEvent } from 'react'
import { useFormContext } from '../../contexts/FormContext'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from '../../buttons'
import { FormField } from '../FormField'
import { type TagsFieldProps } from './TagsField.types'
import { styles } from './TagsField.variants'

export function TagsField({
	name,
	label,
	tagLimit = 10,
	required = false,
	placeholder = ''
}: TagsFieldProps) {
	const { data, setField } = useFormContext()
	const [limitWarning, setLimitWarning] = useState<string | null>(null)
	const [input, setInput] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const tags = Array.isArray(data[name]) ? (data[name] as string[]) : []
	const isFull = Boolean(limitWarning)

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === ' ' && input.length === 0) {
			e.preventDefault()
			return
		}
		if ((e.key === ' ' || e.key === 'Enter') && input.trim() !== '') {
			e.preventDefault()
			const next = input.trim()

			if (tags.length >= tagLimit) {
				if (!limitWarning) setLimitWarning(`Tag limit reached. A maximum of ${tagLimit} tags is allowed.`)
				return
			}
			if (limitWarning) setLimitWarning(null)

			if (!tags.includes(next)) {
				setField(name, [...tags, next])
			}
			setInput('')
		}
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const sanitized = e.target.value
			.toLowerCase()
			.replace(/_/g, '-')
			.replace(/[^a-z0-9-]/g, '')
		setInput(sanitized)
	}

	const handleRemove = (index: number) => {
		const next = [...tags]
		next.splice(index, 1)
		setField(name, next)
		if (limitWarning) setLimitWarning(null)
	}

	const handleBlur = () => {
		if (input.trim() !== '') setInput('')
	}

	const focusInput = () => inputRef.current?.focus()

	return (
		<>
			<FormField name={name} label={label} required={required}>
				{id => (
					<ul className={styles.tags({ isFull })} onClick={focusInput}>
						{tags.map((tag, i) => (
							<li key={i} className={styles.tag({ persisted: true })}>
								<span className={styles.tagText()} style={{ width: `${tag.length + 0.5}ch` }}>
									{tag}
								</span>
								<IconButton
									type="button"
									icon={faXmark}
									color="secondary"
									size="xxs"
									onClick={() => handleRemove(i)}
									aria-label={`Remove ${tag}`}
								/>
							</li>
						))}
						<li className={styles.tag({ persisted: false })}>
							<input
								ref={inputRef}
								id={id}
								type="text"
								className={styles.input({ isFull })}
								maxLength={24}
								value={input}
								onChange={handleChange}
								onBlur={handleBlur}
								onKeyDown={handleKeyDown}
								placeholder={placeholder}
								required={required && tags.length === 0}
							/>
						</li>
					</ul>
				)}
			</FormField>

			{limitWarning && <p className={styles.tagLimit()}>{limitWarning}</p>}
		</>
	)
}
