import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { capitalize } from "next-dato-utils/utils";

export function formatDate(date: string): string {
  if (!date) return ''
  return capitalize(format(new Date(date), 'd MMMM yyyy', { locale: sv }))
}