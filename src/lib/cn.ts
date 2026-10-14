/** Une clases descartando valores falsy. Suficiente sin clsx ni tailwind-merge. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
