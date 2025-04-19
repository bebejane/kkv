import s from './FileUpload.module.scss';
import React, { useEffect, useState, useCallback, RefObject, RefCallback, useRef } from 'react';
import { OnProgressInfo } from '@datocms/cma-client-browser';
import { buildClient } from '@datocms/cma-client-browser';
import { SimpleSchemaTypes } from '@datocms/cma-client';
import { useDropzone } from 'react-dropzone';
//import { MAX_ALLOWED_IMAGES, MIN_IMAGE_HEIGHT, MIN_IMAGE_WIDTH } from '/lib/constant'

const client = buildClient({
	apiToken: process.env.NEXT_PUBLIC_UPLOADS_API_TOKEN,
	environment: process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT || 'main',
});

export type ImageData = {
	width: number;
	height: number;
	src: string;
};

export type Props = {
	customData?: any;
	value?: string | null | undefined;
	accept: string;
	sizeLimit?: number;
	tags?: string[];
	onChange: (upload: Upload) => void;
	onUploading?: (uploading: boolean) => void;
	onProgress?: (percentage: number) => void;
	onError?: (err: Error | unknown) => void;
	ref?: RefObject<HTMLInputElement> | RefCallback<HTMLInputElement> | null;
};

export type Upload = SimpleSchemaTypes.Upload;

export default function FileUpload({
	customData = {},
	tags,
	accept,
	sizeLimit,
	value,
	onChange,
	onUploading,
	onProgress,
	onError,
	ref: forwardedRef,
}: Props) {
	const [error, setError] = useState<Error | unknown | undefined>();
	const [allTags, setAllTags] = useState<string[]>(['upload']);
	const [upload, setUpload] = useState<Upload | undefined>();
	const [progress, setProgress] = useState<number | null>(null);
	const [generatingObject, setGeneratingObject] = useState<boolean>(false);
	const internalInputRef = useRef<HTMLInputElement>(null);

	const onDrop = useCallback((acceptedFiles) => {
		createUpload(acceptedFiles[0]).then(setUpload).catch(setError);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	/* Combine internal ref and forwarded ref
	const handleRef = useCallback(
		(node: HTMLInputElement | null) => {
			// Keep track of the node instance using the internal ref
			(internalInputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
			// Handle the forwarded ref
			if (typeof forwardedRef === 'function') {
				forwardedRef(node);
			} else if (forwardedRef && typeof forwardedRef === 'object') {
				(forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
			}
		},
		[forwardedRef]
	);
	*/

	const resetInput = useCallback(() => {
		setProgress(null);
		setUpload(undefined);
		onUploading?.(false);
		setError(undefined);
		setGeneratingObject(false);
		if (internalInputRef.current) {
			internalInputRef.current.value = '';
		}
	}, [setUpload, setError, onUploading]);

	const createUpload = useCallback(
		async (file: File): Promise<Upload> => {
			if (!file) return Promise.reject(new Error('Ingen fil vald'));

			resetInput();
			onUploading?.(true);

			return new Promise((resolve, reject) => {
				client.uploads
					.createFromFileOrBlob({
						fileOrBlob: file,
						filename: file.name,
						tags: allTags,
						default_field_metadata: {
							sv: {
								alt: '',
								title: '',
								custom_data: customData ?? {},
							},
						},
						onProgress: (info: OnProgressInfo) => {
							if (info.type === 'UPLOADING_FILE' && info.payload && 'progress' in info.payload) {
								setProgress(info.payload.progress);
							}
							//@ts-ignore
							if (info.type === 'CREATING_UPLOAD_OBJECT') {
								setGeneratingObject(true);
							}
						},
					})
					.then(resolve)
					.catch(reject)
					.finally(() => {
						onUploading?.(false);
						setProgress(null);
						setGeneratingObject(false);
					});
			});
		},
		[customData, onUploading, onProgress, resetInput, allTags] // Corrected dependency array
	);

	const handleChange = useCallback(
		async (event: Event) => {
			// Changed event type to Event
			const target = event.target as HTMLInputElement; // Type assertion
			const file = target.files?.[0]; // Safe access using asserted target
			if (!file) return;

			try {
				const fileMb = file.size / 1024 ** 2;

				if (sizeLimit && fileMb > sizeLimit)
					throw new Error(`Storleken på filen får ej vara större än ${sizeLimit}mb`);

				if (file.type.includes('image')) {
					let image: ImageData;
					try {
						image = await parseImageFile(file);
					} catch (err) {
						console.log('error getting image dimensions');
					}

					if (image) {
						/*
          if ((image.width < MIN_IMAGE_WIDTH && image.height < MIN_IMAGE_HEIGHT))
            throw new Error(`Bildens upplösning är för låg. Bilder måste minst vara ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT} pixlar.`)
          if ((image.width < MIN_IMAGE_WIDTH && image.width > image.height))
            throw new Error(`Bildens upplösning är för låg. Bilder måste  minst vara ${MIN_IMAGE_WIDTH} pixlar bred.`)
          if ((image.height < MIN_IMAGE_HEIGHT && image.height > image.width))
						throw new Error(`Bildens upplösning är för låg. Bilder måste minst vara ${MIN_IMAGE_HEIGHT} pixlar hög.`)
          */
						// onImageData?.(image); // Removed: onImageData prop doesn't exist
					}
				}

				const upload = await createUpload(file); // Removed extra allTags argument
				onChange(upload);
			} catch (err) {
				console.error('File upload error:', err);
				setError(err); // Pass unknown error type
			} finally {
				onUploading?.(false);
			}
		},
		[createUpload, onUploading, onChange, setError, allTags, sizeLimit]
	);

	// Use internal ref for event listener management
	useEffect(() => {
		const node = internalInputRef.current;
		if (!node) return;

		node.addEventListener('change', handleChange);
		return () => node.removeEventListener('change', handleChange);
	}, [handleChange]); // Dependency array only needs handleChange

	useEffect(() => {
		if (!upload) return;
		onChange(upload);
	}, [upload, onChange]); // Add onChange to dependencies

	useEffect(() => {
		if (error) {
			onError?.(error); // Use optional chaining
			if (internalInputRef.current) {
				internalInputRef.current.value = ''; // Use internal ref
			}
		}
	}, [error, onError]); // Add onError to dependencies

	useEffect(() => {
		setAllTags((s) => (tags ? [...tags, 'upload'] : ['upload']));
	}, [tags]);

	return (
		<>
			<div {...getRootProps()} className={s.dropzone}>
				<input {...getInputProps()} accept={accept} multiple={false} />
				{generatingObject ? (
					<p>Sparar bilden...</p>
				) : progress !== null ? (
					<p>Laddar upp {progress}%</p>
				) : isDragActive ? (
					<p>Släpp filerna här...</p>
				) : (
					<p>Dra och släpp filen här eller klicka för att välja fil</p>
				)}
			</div>
		</>
	);
}

const parseImageFile = async (file: File): Promise<ImageData> => {
	if (!file) return Promise.reject('Invalid file');

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = (err) => reject(err);
		reader.onload = (e) => {
			const image = new Image();
			if (e.target.result === 'data:') return reject('invalid');
			image.src = e.target.result as string;
			image.onload = function () {
				resolve({ width: image.width, height: image.height, src: image.src });
			};
		};
		reader.readAsDataURL(file);
	});
};
