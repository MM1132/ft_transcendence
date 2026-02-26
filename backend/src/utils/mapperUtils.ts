import type { DateTime } from 'luxon';

export const buildDateTime = (dateTime: DateTime): string => {
  return dateTime.toJSON() as string;
};

export const buildDateTimeNullable = (dateTime: DateTime): string | null => {
  return dateTime ? dateTime.toJSON() : null;
};
