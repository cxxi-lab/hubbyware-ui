import { useState, type FormEvent } from 'react'
import { FormContextProvider, useFormContext } from '../../contexts/FormContext'
import { withLoading } from '../../utils'
import { type FormProps } from './Form.types'
import { styles } from './Form.variants'

export function Form({ initialData, children, ...props }: FormProps) {
	return (
		<FormContextProvider initialData={initialData}>
			<InnerForm {...props}>{children}</InnerForm>
		</FormContextProvider>
	)
}

type InnerProps = Omit<FormProps, 'initialData'>

function InnerForm({ title, actions, onSubmit, children, className }: InnerProps) {
	const { data } = useFormContext()
	const [, setLoading] = useState(false)

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		await withLoading(setLoading, () => Promise.resolve(onSubmit(data)))
	}

	return (
		<form onSubmit={handleSubmit} className={className}>
			{title && (
				<header className={styles.header()}>
					<h1 className={styles.title()}>{title}</h1>
				</header>
			)}

			<div className={styles.content()}>{children}</div>

			{actions && (
				<footer className={styles.footer()}>{actions}</footer>
			)}
		</form>
	)
}
