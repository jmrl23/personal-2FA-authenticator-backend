import { vendors } from '@jmrl23/express-helper';

export class AuthenticatorDeleteDto {
  @vendors.classValidator.IsUUID('4')
  id: string;
}
