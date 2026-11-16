import type { MouseEvent } from 'react'

export interface BrandProps {
	to?: string
	onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}
