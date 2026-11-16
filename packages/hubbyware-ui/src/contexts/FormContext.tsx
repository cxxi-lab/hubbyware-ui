import { createContext, useContext, useState, type ReactNode } from 'react'

export type FormData = Record<string, unknown>
export type FormErrors = Record<string, string | null>

export interface FormContextValue {
	data: FormData
	errors: FormErrors
	setField: (field: string, value: unknown) => void
	setError: (field: string, message: string | null) => void
	clearError: (field: string) => void
	reset: () => void
}

interface FormContextProviderProps {
	children: ReactNode
	initialData?: FormData
}

const FormContext = createContext<FormContextValue | undefined>(undefined)

export function FormContextProvider({ children, initialData = {} }: FormContextProviderProps) {
	const [data, setData] = useState<FormData>(initialData)
	const [errors, setErrors] = useState<FormErrors>({})

	const setField = (field: string, value: unknown) => {
		setData(prev => ({ ...prev, [field]: value }))
		setErrors(prev => ({ ...prev, [field]: null }))
	}

	const setError = (field: string, message: string | null) => {
		setErrors(prev => ({ ...prev, [field]: message }))
	}

	const clearError = (field: string) => {
		setErrors(prev => ({ ...prev, [field]: null }))
	}

	const reset = () => {
		setData(initialData)
		setErrors({})
	}

	return (
		<FormContext.Provider value={{ data, errors, setField, setError, clearError, reset }}>
			{children}
		</FormContext.Provider>
	)
}

export function useFormContext(): FormContextValue {
	const context = useContext(FormContext)
	if (!context) {
		throw new Error('useFormContext must be used within a FormContextProvider')
	}
	return context
}
