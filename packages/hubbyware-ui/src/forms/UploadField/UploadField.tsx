import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { useFormContext } from '../../contexts/FormContext'
import { FormField } from '../FormField'
import { type UploadFieldProps } from './UploadField.types'
import { styles } from './UploadField.variants'

export function UploadField({
	name,
	label,
	required = false,
	multiple = false,
	accept = 'image/*'
}: UploadFieldProps) {
	const { data, setField } = useFormContext()
	const inputRef = useRef<HTMLInputElement>(null)
	const [dragActive, setDragActive] = useState(false)

	const value = data[name]
	const files: File[] = value
		? (multiple ? (value as File[]) : [value as File])
		: []

	const apply = (incoming: FileList | File[]) => {
		const arr = Array.from(incoming)
		if (arr.length === 0) return
		setField(name, multiple ? arr : arr[0])
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) apply(e.target.files)
	}

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		setDragActive(false)
		if (e.dataTransfer.files) apply(e.dataTransfer.files)
	}

	return (
		<FormField name={name} label={label} required={required}>
			{(id, hasError) => (
				<div
					id={id}
					className={styles.dropzone({ dragActive, error: hasError })}
					onClick={() => inputRef.current?.click()}
					onDragOver={e => { e.preventDefault(); setDragActive(true) }}
					onDragLeave={() => setDragActive(false)}
					onDrop={handleDrop}
				>
					<input
						ref={inputRef}
						type="file"
						name={name}
						accept={accept}
						multiple={multiple}
						required={required && files.length === 0}
						className="hidden"
						onChange={handleChange}
					/>
					<p>{dragActive ? 'Drop the file here…' : 'Drag a file or click to select'}</p>
					{files.length > 0 && (
						<ul className={styles.previews()}>
							{files.map((f, i) => <li key={i}>{f.name}</li>)}
						</ul>
					)}
				</div>
			)}
		</FormField>
	)
}
