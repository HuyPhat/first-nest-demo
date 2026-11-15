import { Transform } from 'class-transformer';

/** Trims and lower-cases an email, so "A@x.com " and "a@x.com" are the same User. */
export const NormaliseEmail = () =>
  Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  );
