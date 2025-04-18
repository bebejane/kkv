'use server';

import client from '@/lib/client';
import { WorkshopSchema } from './schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@lib/utils';
import { sleep } from 'next-dato-utils/utils';

type FormData = z.infer<typeof WorkshopSchema>;

export async function updateWorkshop(data: FormData) {
  const session = await getSession();
  const validatedData = WorkshopSchema.safeParse(data);

  if (!validatedData.success) {
    // Combine error messages for better feedback
    const errorMessages = validatedData.error.errors.map((e) => e.message).join(', ');
    console.log(validatedData.error, data)
    throw new Error(`Validation failed: ${errorMessages}`);
  }

  const userId = session.user.id; // Assuming session.user.id holds the DatoCMS item ID for the profile

  try {
    let workshop = await client.items.update(userId, {
      address: validatedData.data.address,
      city: validatedData.data.city,
      postal_code: validatedData.data.postal_code,
      website: validatedData.data.website,
      description: validatedData.data.description,
    });

    workshop = await client.items.publish(userId);

    revalidatePath('/verkstader');
    revalidatePath(`/verkstader/${workshop.slug}`);
    revalidatePath('/medlem/profil');

  } catch (error) {
    console.error('DatoCMS update failed:', error);
    // Check for specific DatoCMS errors if needed
    if (error.response?.status === 404) {
      throw new Error(`Profile item with ID ${userId} not found in DatoCMS.`);
    }
    throw new Error('Failed to update profile in DatoCMS.');
  }
}
