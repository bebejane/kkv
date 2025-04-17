'use server';

import { getSession } from '@/lib/utils';
import client from '@/lib/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteCourse(id: string) {
  await getSession();
  await client.items.destroy(id);

  try {
    revalidatePath('/medlem');
    revalidatePath('/kurser');

  } catch (e) {
    console.log(e)
  }
  redirect('/medlem');
}
