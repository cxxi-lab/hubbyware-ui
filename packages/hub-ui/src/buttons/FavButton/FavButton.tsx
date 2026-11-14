import { useEffect, useState } from 'react'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from '../IconButton'
import { type FavButtonProps } from './FavButton.types'
import { styles } from './FavButton.variants'

export function FavButton({ initialState = false, onClick, size, className, ...rest }: FavButtonProps) {
	const [favorite, setFavorite] = useState(initialState)

	useEffect(() => setFavorite(initialState), [initialState])

	const handleClick = () => {
		const next = !favorite
		setFavorite(next)
		onClick?.(next)
	}

	return (
		<IconButton
			icon={faStar}
			color="secondary"
			shape="square"
			size={size}
			onClick={handleClick}
			className={[styles.button({ favorite }), className].filter(Boolean).join(' ')}
			{...rest}
		/>
	)
}
