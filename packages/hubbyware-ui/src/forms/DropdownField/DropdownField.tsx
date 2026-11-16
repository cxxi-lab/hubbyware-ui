import { useEffect, useMemo } from 'react'
import { useFormContext } from '../../contexts/FormContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FormField } from '../FormField'
import { Dropdown } from '../../menus'
import { type DropdownFieldProps } from './DropdownField.types'
import { styles } from './DropdownField.variants'

export function DropdownField({ name, label, choices, required = false }: DropdownFieldProps) {
	const { data, setField } = useFormContext()

	const allChoices = useMemo(
		() => (required ? choices : [{ value: '', label: 'No selection' }, ...choices]),
		[choices, required]
	)

	useEffect(() => {
		if (data[name] === undefined) {
			setField(name, allChoices[0]?.value ?? '')
		}
	}, [allChoices, data, name, setField])

	const selected = data[name] as string | undefined
	const selectedLabel = allChoices.find(c => c.value === selected)?.label ?? 'Select an option'

	const handleSelection = (value: string) => setField(name, value)

	const dropdownHeader = (isOpen: boolean) => (
		<div className={styles.inputWrapper({ open: isOpen })}>
			<div className={styles.input({ open: isOpen })}>
				<span className={styles.inputText()}>{selectedLabel}</span>
				<FontAwesomeIcon icon={faChevronDown} className={styles.inputIcon()} />
			</div>
		</div>
	)

	return (
		<FormField name={name} label={label} required={required}>
			{id => (
				<div className={styles.field()}>
					<select
						id={id}
						name={name}
						value={selected ?? ''}
						required={required}
						className={styles.htmlSelect()}
						onChange={e => handleSelection(e.target.value)}
					>
						{allChoices.map(c => (
							<option key={c.value} value={c.value}>{c.label}</option>
						))}
					</select>

					<Dropdown side="center" color="field" header={dropdownHeader}>
						<ul className={styles.choices()}>
							{allChoices.map(c => (
								<li
									key={c.value}
									className={styles.choice()}
									onClick={() => handleSelection(c.value)}
								>
									{c.label}
								</li>
							))}
						</ul>
					</Dropdown>
				</div>
			)}
		</FormField>
	)
}
