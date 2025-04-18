'use client';

import { useState } from 'react';
import s from './WorkshopForm.module.scss'; // We'll create this file next
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WorkshopSchema } from '@/lib/schemas';
import type { z } from 'zod';
import TipTapEditor from '@components/common/TipTapEditor';
import Link from '@node_modules/next/link';
import { useRouter } from 'next/navigation';

type FormData = z.infer<typeof WorkshopSchema>;

type WorkshopFormProps = {
	workshop?: Partial<FormData>; // Allow partial workshop data for initial values
	onSubmit: (data: FormData) => Promise<void>;
};

export default function WorkshopForm({ workshop, onSubmit }: WorkshopFormProps) {
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string>();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(WorkshopSchema),
		mode: 'onBlur',
		defaultValues: {
			id: workshop?.id || '',
			slug: workshop?.slug || '',
			address: workshop?.address || '',
			city: workshop?.city || '',
			postal_code: workshop?.postal_code || '',
			website: workshop?.website || '',
			description: workshop?.description || '',
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

	return (
		<form onSubmit={handleSubmit(onSubmitForm)} className={s.form}>
			{error && <div className={s.formError}>{error}</div>}

			<input type='hidden' id='id' {...register('id')} />
			{errors.id && <p className={s.error}>{errors.id.message}</p>}
			<input type='hidden' id='slug' {...register('slug')} />
			{errors.slug && <p className={s.error}>{errors.slug.message}</p>}

			<div className={s.field}>
				<label htmlFor='address'>Adress</label>
				<input type='text' id='address' {...register('address')} />
				{errors.address && <p className={s.error}>{errors.address.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='postal_code'>Postnummer</label>
				<input type='text' id='postal_code' {...register('postal_code')} />
				{errors.postal_code && <p className={s.error}>{errors.postal_code.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='city'>Stad</label>
				<input type='text' id='city' {...register('city')} />
				{errors.city && <p className={s.error}>{errors.city.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='website'>Webbplats</label>
				<input type='url' id='website' placeholder='https://...' {...register('website')} />
				{errors.website && <p className={s.error}>{errors.website.message}</p>}
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
				{errors.description && <p className={s.error}>{errors.description.message}</p>}
			</div>

			<div className={s.buttons}>
				<button type='submit' disabled={submitting} className={s.submitButton}>
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
