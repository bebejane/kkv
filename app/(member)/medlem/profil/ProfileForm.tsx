'use client';

import s from './ProfileForm.module.scss';
import cn from 'classnames';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WorkshopSchema } from '@/lib/schemas';
import type { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSaveKey from '@/lib/hooks/useSaveKey';
import TipTapEditor from '@/components/form/TipTapEditor';
import FileUpload from '@/components/form/FileUpload';
import MultiSelect from '@/components/form/MultiSelect';
import { sortSwedish } from 'next-dato-utils/utils';

type FormData = z.infer<typeof WorkshopSchema>;

type WorkshopFormProps = {
	data: Partial<FormData>;
	workshop: WorkshopQuery['workshop'];
	allWorkshopGears: WorkshopQuery['allWorkshopGears'];
	onSubmit(data: FormData): Promise<void>;
};

export default function ProfileForm({
	data,
	workshop,
	allWorkshopGears,
	onSubmit,
}: WorkshopFormProps) {
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string>();
	const [imageUrl, setImageUrl] = useState<string | null>(workshop?.image?.url ?? null);
	const router = useRouter();
	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors, isDirty },
	} = useForm<FormData>({
		resolver: zodResolver(WorkshopSchema),
		mode: 'onBlur',
		defaultValues: {
			id: data?.id || '',
			slug: data?.slug || '',
			address: data?.address || '',
			postal_code: data?.postal_code || '',
			website: data?.website || '',
			description: data?.description || '',
			image: data?.image || '',
			gear: data?.gear || [],
		},
	});

	const onSubmitForm = async (data: FormData) => {
		try {
			setSubmitting(true);
			setError(undefined);
			await onSubmit(data);
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ett fel uppstod vid uppdatering');
		} finally {
			setSubmitting(false);
		}
	};

	useSaveKey(() => onSubmitForm(watch()));

	return (
		<form onSubmit={handleSubmit(onSubmitForm)} className={cn(s.form, submitting && s.submitting)}>
			{error && <div className={s.formError}>{error}</div>}

			<input type='hidden' id='id' {...register('id')} />
			{errors.id && <p className='form-error'>{errors.id.message}</p>}
			<input type='hidden' id='slug' {...register('slug')} />
			{errors.slug && <p className='form-error'>{errors.slug.message}</p>}

			<div className={s.field}>
				<label htmlFor='address'>Adress</label>
				<input type='text' id='address' {...register('address')} />
				{errors.address && <p className='form-error'>{errors.address.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='postal_code'>Postnummer</label>
				<input type='text' id='postal_code' {...register('postal_code')} />
				{errors.postal_code && <p className='form-error'>{errors.postal_code.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='website'>Webbplats</label>
				<input type='url' id='website' placeholder='https://...' {...register('website')} />
				{errors.website && <p className='form-error'>{errors.website.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='gear'>Utrustning</label>
				<Controller
					name='gear'
					control={control}
					render={({ field }) => (
						<MultiSelect
							value={field.value}
							options={sortSwedish(allWorkshopGears, 'title').map((g) => ({
								value: g.id,
								label: g.title,
							}))}
							placeholder='Välj utrustning...'
							onChange={(val) => {
								console.log(val);
								field.onChange(val);
							}}
						/>
					)}
				/>
				{errors.gear && <p className='form-error'>{errors.gear.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='description'>Beskrivning</label>
				<Controller
					name='description'
					control={control}
					render={({ field }) => (
						<TipTapEditor initialValue={field.value} onChange={field.onChange} />
					)}
				/>
				{errors.description && <p className='form-error'>{errors.description.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='image'>Bild</label>
				<Controller
					name='image'
					control={control}
					render={({ field }) => (
						<div className={s.upload}>
							<div className={s.dropzone}>
								<FileUpload
									ref={field.ref}
									onChange={(val) => {
										setImageUrl(val.url);
										field.onChange(val.id);
									}}
									onError={(err) => console.log(err)}
									accept='image/*'
								/>
							</div>
							{imageUrl && <img src={`${imageUrl}?w=1200`} className={s.image} />}
						</div>
					)}
				/>
				{errors.image && <p className='form-error'>{errors.image.message}</p>}
			</div>

			<div className={s.buttons}>
				<button type='submit' disabled={submitting || !isDirty} className={s.submitButton}>
					{submitting ? 'Sparar...' : 'Spara'}
				</button>
				<Link
					href={`/verkstader/${workshop?.slug}`}
					aria-disabled={!workshop?.slug || submitting ? true : false}
				>
					<button type='button' disabled={!workshop?.slug || submitting ? true : false}>
						Visa
					</button>
				</Link>
			</div>
		</form>
	);
}
