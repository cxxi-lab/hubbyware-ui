import { useId } from 'react'

/** The Hubbyware mark (inline: the package needs no SVG loader in its consumers' bundler), in the accent colour. */
export function HubLogo({ className }: { className?: string }) {
	const gradient = `hub-logo-${useId()}`
	return (
		<svg className={className} width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M32 100.641C32 68.391 54.1651 41.3515 84 34.1102V1.28125C36.3772 8.98855 0 50.5392 0 100.641C0 150.742 36.3772 192.293 84 200V167.171C54.1651 159.93 32 132.89 32 100.641ZM200 100.641C200 150.742 163.623 192.293 116 200V167.171C145.835 159.93 168 132.89 168 100.641C168 68.391 145.835 41.3515 116 34.1102V1.28125C163.623 8.98855 200 50.5392 200 100.641Z"
				fill={`url(#${gradient})`}
			/>
			<defs>
				<linearGradient id={gradient} x1="157.5" y1="33.0763" x2="44.7421" y2="148.561" gradientUnits="userSpaceOnUse">
					{/* the accent's (styles/theme.css), the blue without one */}
					<stop offset="0.0509862" style={{ stopColor: 'var(--color-brand-300, oklch(77.48% 0.1158 256.78))' }} />
					<stop offset="1" style={{ stopColor: 'var(--color-brand-500, oklch(69.57% 0.1612 257.18))' }} />
				</linearGradient>
			</defs>
		</svg>
	)
}
