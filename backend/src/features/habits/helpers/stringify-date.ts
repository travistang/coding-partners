import { format } from "date-fns";

export const stringifyDate = (date: Date | number) => format(date, 'dd/MM/yyyy');