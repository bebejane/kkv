'use client';

import { useState, useTransition } from 'react';
import s from './CourseForm.module.scss';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteCourse } from '../actions/delete';
import { CourseSchema } from '../actions/schema';
import type { z } from 'zod';
import TipTapEditor from '@/components/common/TipTapEditor';

type FormData = z.infer<typeof CourseSchema>;

type CourseFormProps = {
	course?: FormData & { id?: string };
	onSubmit: (data: FormData) => Promise<void>;
};

export default function CourseForm({ course, onSubmit }: CourseFormProps) {
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string>();
	const [isPending, startTransition] = useTransition();

	const {
		register,
		handleSubmit,
		control, // Get control object from useForm
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(CourseSchema),
		defaultValues: course || {
			title: '',
			slug: '',
			intro: '',
			text: '',
			date: new Date().toISOString().split('T')[0],
			open_to_all: false,
		},
	});

	const onSubmitForm = async (data: FormData) => {
		try {
			setSubmitting(true);
			setError(undefined);
			await onSubmit(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ett fel uppstod');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmitForm)} className={s.form}>
			{error && <div className={s.formError}>{error}</div>}

			<div className={s.field}>
				<label htmlFor='title'>Titel</label>
				<input type='text' id='title' {...register('title')} />
				{errors.title && <p className={s.error}>{errors.title.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='intro'>Intro</label>
				<Controller
					name='intro'
					control={control}
					render={({ field }) => (
						<TipTapEditor initialValue={field.value} onChange={field.onChange} />
					)}
				/>
				{errors.intro && <p className={s.error}>{errors.intro.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='text'>Text</label>
				<Controller
					name='text'
					control={control}
					render={({ field }) => (
						<TipTapEditor initialValue={field.value} onChange={field.onChange} />
					)}
				/>
				{errors.text && <p className={s.error}>{errors.text.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='date'>Datum</label>
				<input type='date' id='date' {...register('date')} />
				{errors.date && <p className={s.error}>{errors.date.message}</p>}
			</div>

			<div className={s.checkbox}>
				<input type='checkbox' id='open_to_all' {...register('open_to_all')} />
				<label htmlFor='open_to_all'>Öppen för alla</label>
			</div>

			<div className={s.field}>
				<label htmlFor='slug'>Permalänk</label>
				<input type='text' id='slug' {...register('slug')} />
				{errors.slug && <p className={s.error}>{errors.slug.message}</p>}
			</div>

			<div className={s.buttons}>
				<button type='submit' disabled={submitting || isPending} className={s.submitButton}>
					{submitting ? 'Sparar...' : course ? 'Uppdatera' : 'Spara kurs'}
				</button>

				{course?.id && (
					<button
						type='button'
						disabled={isPending}
						className={s.deleteButton}
						onClick={() => {
							if (confirm('Är du säker på att du vill radera kursen?')) {
								startTransition(() => deleteCourse(course.id as string));
							}
						}}
					>
						{isPending ? 'Tar bort kurs...' : 'Ta bort'}
					</button>
				)}

				<Link href={`/kurser/${course?.slug}`} aria-disabled={!course?.id ? true : false}>
					<button type='button' disabled={!course?.id ? true : false}>
						Visa
					</button>
				</Link>
			</div>
		</form>
	);
}
