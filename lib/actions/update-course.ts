'use server';

import { getSession } from '@/lib/auth';
import { CourseSchema } from '../schemas';
import client from '@/lib/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sleep } from 'next-dato-utils/utils';

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
  //await client.items.publish(id);
  await sleep(3000);

  const paths = [`/medlem/kurser/${course.id}`, '/kurser', `/kurser/${course.slug}`, '/medlem']

  try {
    paths.forEach(path => revalidatePath(path));
    //redirect(`/medlem/kurser/${course.id}`);
  } catch (e) {
    console.log(e)
  }
}
