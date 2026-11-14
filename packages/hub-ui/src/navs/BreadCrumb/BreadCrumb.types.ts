import { type ReactNode } from 'react'

export interface Crumb {
	path: string
	label: ReactNode
}

export interface BreadCrumbProps {
	crumbs: Crumb[]
	separator?: ReactNode
}
