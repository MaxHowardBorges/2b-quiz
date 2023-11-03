import { ValidationError } from '@/utils/valdiationError';

export async function throwIfNotOK(response, statusCodeRequired) {
  if (
    !response.ok ||
    (statusCodeRequired && response.status !== statusCodeRequired)
  ) {
    const content = await response.json();
    throw new ValidationError(content.message);
  }
}
