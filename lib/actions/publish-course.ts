'use server';

import { getSession } from '@/lib/auth';
import client from '@/lib/client';
import { revalidatePath } from 'next/cache';
import { sleep } from 'next-dato-utils/utils';
import { buildRoute } from '@lib/routes';

export async function publishCourse(id: string) {
  await getSession();
  const course = await client.items.publish(id)
  await sleep(3000);
  const paths = buildRoute('course', course)

  try {
    paths.forEach(path => revalidatePath(path));
  } catch (e) {
    console.log(e)
  }
}
