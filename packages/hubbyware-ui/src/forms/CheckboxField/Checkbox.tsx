import { type ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { styles } from './CheckboxField.variants'

/** The CheckboxField box on its own, outside a form: controlled by `checked`, its label beside it. */
export function Checkbox({ checked, label, onChange }: { checked: boolean, label: ReactNode, onChange: (checked: boolean) => void }) {
	return (
		<label className="inline-flex items-center gap-2 cursor-pointer select-none">
			<input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
			<span aria-hidden className={styles.check({ checked })}>
				<FontAwesomeIcon icon={faCheck} />
			</span>
			<span className="inline-flex items-center gap-2 text-sm text-steel-100">{label}</span>
		</label>
	)
}
