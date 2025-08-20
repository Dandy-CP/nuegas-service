import { customAlphabet } from 'nanoid';

const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function genClassCode() {
  const length = Math.floor(Math.random() * 4) + 5; // generate 5 - 8 random Character
  const code = customAlphabet(alphabet, length)();

  return code;
}
