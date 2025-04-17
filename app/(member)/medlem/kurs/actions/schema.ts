import { z } from "zod";

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
