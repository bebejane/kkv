'use server';

import { getSession } from '@/lib/utils';
import { CourseSchema } from './schema';
import client from '@/lib/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateCourse(id: string, formData: FormData) {
  const session = await getSession();

  const data = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    intro: formData.get('intro'),
    text: formData.get('text'),
    date: formData.get('date'),
    open_to_all: formData.get('open_to_all') === 'true',
  };

  const validated = CourseSchema.parse(data);

  const course = await client.items.update(id, {
    ...validated,
    workshop: session.user.id,
  });
  await client.items.publish(id);

  const path = `/medlem/kurs/${course.slug}`

  try {
    revalidatePath('/medlem');
    revalidatePath(path);
    redirect(path);
  } catch (e) {
    console.log(e)
  }
}
