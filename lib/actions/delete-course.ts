'use server';

import { getSession } from '@/lib/auth';
import client from '@/lib/client';
import { buildRoute } from '@lib/routes';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteCourse(id: string) {
  await getSession();
  const course = await client.items.find(id);
  await client.items.destroy(id);

  const paths = buildRoute('course', course)

  try {
    paths.forEach(p => revalidatePath(p));

  } catch (e) {
    console.log(e)
  }
  redirect('/medlem');
}
