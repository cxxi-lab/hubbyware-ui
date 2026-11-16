import { useEffect, type RefObject } from 'react'

type Refs = ReadonlyArray<RefObject<HTMLElement | null>>

export function useClickOutside(refs: Refs, callback: () => void): void {
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			const target = e.target as Node
			if (refs.every(ref => ref.current && !ref.current.contains(target))) {
				callback()
			}
		}
		document.addEventListener('mousedown', handler)
		return () => document.removeEventListener('mousedown', handler)
	}, [refs, callback])
}
