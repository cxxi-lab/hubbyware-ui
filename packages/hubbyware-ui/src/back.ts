import { useEffect, useRef } from 'react'

/**
 * The phone's back button (Android): it closes what is open on top (a menu, a modal, the hubby
 * drawer…), most recent first; with nothing open, it goes back a page; on the home page, the app
 * goes to the background. The host wires handleBack() to its back button (the app: window.hubBack,
 * called by the Android shell, which does the last part itself when it answers false).
 */

const handlers: Array<{ close: () => void }> = []
const depthListeners = new Set<(depth: number) => void>()
const changed = () => depthListeners.forEach(l => l(handlers.length))

/** How many things the back button would close, now and on each change (a hubby's frame tells its host). */
export function onBackDepth(listener: (depth: number) => void): () => void {
	depthListeners.add(listener)
	listener(handlers.length)
	return () => { depthListeners.delete(listener) }
}

/** While `open`, the back button closes this (onClose). */
export function useBackHandler(open: boolean, onClose: () => void): void {
	const latest = useRef(onClose)
	latest.current = onClose
	useEffect(() => {
		if (!open) return
		const entry = { close: () => latest.current() }
		handlers.push(entry)
		changed()
		return () => {
			const at = handlers.indexOf(entry)
			if (at >= 0) handlers.splice(at, 1)
			changed()
		}
	}, [open])
}

/** The back button: true when handled here (something closed, or a page back). */
export function handleBack(): boolean {
	const top = handlers.pop()
	if (top) {
		changed()
		top.close()
		return true
	}
	const at = window.location.hash.replace(/^#/, '') || '/'
	if (at !== '/' && window.history.length > 1) {
		window.history.back()
		return true
	}
	return false
}
