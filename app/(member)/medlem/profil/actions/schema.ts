import { id } from "date-fns/locale";
import { z } from "zod";

export const WorkshopSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2, { message: "Permalänk måste vara minst 2 bokstäver" }),
  address: z.string().min(2, { message: "Adress måste vara minst 2 bokstäver" }),
  city: z.string().optional(),
  postal_code: z.string().optional(), // Consider adding regex for postal code format if needed
  website: z.string().url({ message: "Ogiltig webbadress" }).optional().or(z.literal('')), // Allow empty string or valid URL
  description: z.string().optional(),
});
