export async function withLoading(
	setLoading: (loading: boolean) => void,
	fn?: () => Promise<void> | void
): Promise<void> {
	if (!fn) return
	setLoading(true)
	try {
		await fn()
	}
	finally {
		setLoading(false)
	}
}
