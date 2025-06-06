'use client';

import s from './CourseForm.module.scss';
import cn from 'classnames';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteCourse, publishCourse } from '@/lib/actions';
import { CourseSchema } from '@/lib/schemas';
import type { z } from 'zod';
import TipTapEditor from '@/components/form/TipTapEditor';
import { useRouter } from 'next/navigation';
import useSaveKey from '@/lib/hooks/useSaveKey';

type FormData = z.infer<typeof CourseSchema>;

type CourseFormProps = {
	course?: FormData & { id?: string };
	onSubmit(data: FormData): Promise<void>;
};

export default function CourseForm({ course, onSubmit }: CourseFormProps) {
	const [submitting, setSubmitting] = useState(false);
	const [publishing, setPublishing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors, isDirty },
	} = useForm<FormData>({
		resolver: zodResolver(CourseSchema),
		defaultValues: course || {
			title: '',
			slug: '',
			intro: '',
			text: '',
			for_members: false,
			where: '',
			sign_up: '',
			date: new Date().toISOString().split('T')[0],
			open_to_all: false,
		},
	});

	const onSubmitForm = async (data: FormData) => {
		try {
			setSubmitting(true);
			setError(null);
			await onSubmit(data);
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ett fel uppstod');
		} finally {
			setSubmitting(false);
		}
	};

	useSaveKey(() => onSubmitForm(watch()));

	return (
		<form onSubmit={handleSubmit(onSubmitForm)} className={cn(s.form, submitting && s.submitting)}>
			{error && <div className={s.formError}>{error}</div>}

			<div className={s.field}>
				<label htmlFor='title'>Titel</label>
				<input type='text' id='title' {...register('title')} />
				{errors.title && <p className='form-error'>{errors.title.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='intro'>Intro</label>
				<Controller
					name='intro'
					control={control}
					render={({ field }) => (
						<TipTapEditor initialValue={field.value} onChange={field.onChange} controls={false} />
					)}
				/>
				{errors.intro && <p className='form-error'>{errors.intro.message}</p>}
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
				{errors.text && <p className='form-error'>{errors.text.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='date'>Datum</label>
				<input type='date' id='date' {...register('date')} />
				{errors.date && <p className='form-error'>{errors.date.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='where'>Var</label>
				<input type='text' id='where' {...register('where')} />
				{errors.where && <p className='form-error'>{errors.where.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='sign_up'>Anmäl dig</label>
				<input type='text' id='sign_up' {...register('sign_up')} />
				{errors.sign_up && <p className='form-error'>{errors.sign_up.message}</p>}
			</div>

			<div className={s.field}>
				<label htmlFor='slug'>Permalänk</label>
				<input type='text' id='slug' {...register('slug')} />
				{errors.slug && <p className='form-error'>{errors.slug.message}</p>}
			</div>

			<div className={s.checkbox}>
				<input type='checkbox' id='for_members' {...register('for_members')} />
				<label htmlFor='for_members'>För medlemmar</label>
			</div>

			<div className={s.checkbox}>
				<input type='checkbox' id='open_to_all' {...register('open_to_all')} />
				<label htmlFor='open_to_all'>Öppen för alla</label>
			</div>

			<div className={s.buttons}>
				<button
					type='submit'
					disabled={submitting || isPending || !isDirty}
					className={s.submitButton}
				>
					{submitting ? 'Sparar...' : 'Spara'}
				</button>
				<button
					type='button'
					disabled={
						publishing || submitting || isPending || !course?.id || course?._status === 'published'
					}
					className={s.submitButton}
					onClick={() => {
						if (!course?.id) return;
						setPublishing(true);
						setError(null);
						startTransition(() => {
							publishCourse(course.id as string)
								.catch((e) => setError(e.message))
								.finally(() => setPublishing(false));
						});
					}}
				>
					{publishing ? 'Publicerar...' : 'Publicera'}
				</button>
				<button
					type='button'
					disabled={!course?.id || isPending || submitting}
					className={s.deleteButton}
					onClick={() => {
						if (confirm('Är du säker på att du vill radera kursen?')) {
							startTransition(() => deleteCourse(course.id as string));
						}
					}}
				>
					{isPending && submitting ? 'Tar bort kurs...' : 'Ta bort'}
				</button>

				<Link
					href={`/kurser/${course?.slug}/utkast`}
					aria-disabled={!course?.id || submitting ? true : false}
				>
					<button type='button' disabled={!course?.id || submitting ? true : false}>
						Visa
					</button>
				</Link>
			</div>
		</form>
	);
}
