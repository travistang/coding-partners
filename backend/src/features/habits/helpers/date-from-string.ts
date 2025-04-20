import { parse } from "date-fns";

export const dateFromString = (dateString: string) => parse(dateString, 'dd/MM/yyyy', new Date());