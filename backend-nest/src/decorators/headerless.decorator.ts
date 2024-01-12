import { SetMetadata } from '@nestjs/common';

export const IS_HEADERLESS_KEY = 'isHeaderless';
export const Headerless = () => SetMetadata(IS_HEADERLESS_KEY, true);
