import { z } from "zod";

const isEmailOrUrl = (str: string) => {
  if (!str) return true;
  const isEmail = str.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim);
  const isUrl = str.match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig);
  return isEmail || isUrl;
};

export const CourseSchema = z.object({
  title: z.string().min(2, { message: "Titel måste vara minst 2 bokstaver" }),
  text: z.string().min(0, { message: "Text saknas" }),
  date: z.string().min(10, { message: "Datum saknas" }),
  intro: z.string().min(0, { message: "Intro saknas" }),
  for_members: z.boolean(),
  where: z.string().optional(),
  sign_up: z.string().refine(value => isEmailOrUrl(value), { message: "Ogiltig email eller webbadress" }).optional(),
  slug: z.string()
    .min(2, { message: "Permalänk måste vara minst 2 bokstaver långt" })
    .regex(/^[a-z](-?[a-z])*$/, { message: "Permalänk får endast innehålla små bokstäver och bindestreck" }),
  open_to_all: z.boolean(),
  _status: z.string().optional(),
});

export const WorkshopSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2, { message: "Permalänk måste vara minst 2 bokstäver" }),
  address: z.string().min(2, { message: "Adress måste vara minst 2 bokstäver" }),
  city: z.string().optional(),
  postal_code: z.string().optional(), // Consider adding regex for postal code format if needed
  website: z.string().url({ message: "Ogiltig webbadress" }).optional().or(z.literal('')), // Allow empty string or valid URL
  description: z.string().optional(),
  image: z.string().optional(),
  gear: z.array(z.object({ value: z.string(), label: z.string() })),
});

