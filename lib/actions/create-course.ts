'use server';

import { getSession } from '@/lib/auth';
import { CourseSchema } from '../schemas';
import client from '@/lib/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { buildRoute } from '@/lib/routes';

export async function createCourse(formData: FormData) {
  const session = await getSession();
  const data = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    intro: formData.get('intro'),
    text: formData.get('text'),
    date: formData.get('date'),
    for_memebers: formData.get('for_memebers') === 'true',
    where: formData.get('where'),
    sign_up: formData.get('sign_up'),
    open_to_all: formData.get('open_to_all') === 'true',
  };

  const validated = CourseSchema.parse(data);

  const course = await client.items.create({
    item_type: { type: 'item_type', id: process.env.DATOCMS_WORKSHOP_MODEL_ID },
    ...validated,
    workshop: session.user.id,
  });

  const paths = buildRoute('course', course)
  try {
    paths.forEach(p => revalidatePath(p));
  } catch (e) {
    console.log(e)
  }
  redirect(`/medlem/kurser/${course.id}`);
}
