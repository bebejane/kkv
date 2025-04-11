import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/(member)/api/auth/[...nextauth]/route';
import { z } from "zod";

export const getSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session;
};

export const CourseSchema = z.object({
  title: z.string().min(2, { message: "Titel måste vara minst 2 bokstaver" }),
  text: z.string().min(0, { message: "Text saknas" }),
  date: z.string().min(10, { message: "Datum saknas" }),
  intro: z.string().min(0, { message: "Intro saknas" }),
  slug: z.string()
    .min(2, { message: "Permalänk måste vara minst 2 bokstaver långt" })
    .regex(/^[a-z](-?[a-z])*$/, { message: "Permalänk får endast innehålla små bokstäver och bindestreck" }),
  open_to_all: z.boolean(),
});
