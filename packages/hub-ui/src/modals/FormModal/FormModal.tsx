import { useState } from 'react'
import { withLoading } from '../../utils'
import { type FormData } from '../../contexts/FormContext'
import { Button } from '../../buttons'
import { Form } from '../../forms'
import { Modal } from '../Modal'
import { type FormModalProps } from './FormModal.types'

export function FormModal({
	title,
	size,
	initialData,
	submitLabel = 'Submit',
	cancelLabel = 'Cancel',
	onSubmit,
	onClose,
	children
}: FormModalProps) {
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (data: FormData) => {
		await withLoading(setLoading, () => Promise.resolve(onSubmit(data)))
		onClose()
	}

	const actions = (
		<>
			<Button
				type="button"
				color="secondary"
				label={cancelLabel}
				onClick={onClose}
				isDisabled={loading}
			/>
			<Button type="submit" label={submitLabel} isLoading={loading} />
		</>
	)

	return (
		<Modal title={title} size={size} onClose={onClose}>
			<Form initialData={initialData} onSubmit={handleSubmit} actions={actions}>
				{children}
			</Form>
		</Modal>
	)
}
