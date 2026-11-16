export interface DropdownChoice {
	value: string
	label: string
}

export interface DropdownFieldProps {
	name: string
	label?: string
	choices: DropdownChoice[]
	required?: boolean
}
