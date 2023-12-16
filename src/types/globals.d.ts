import type { Prisma } from '@prisma/client';

declare global {
  export declare interface Auth
    extends Prisma.AuthenticatorGetPayload<{
      select: {
        id: true;
        name: true;
      };
    }> {
    code: string;
  }
}
