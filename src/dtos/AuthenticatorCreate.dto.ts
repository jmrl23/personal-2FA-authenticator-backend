import { vendors } from '@jmrl23/express-helper';

export class AuthenticatorCreateDto {
  @vendors.classValidator.IsString()
  @vendors.classValidator.IsNotEmpty()
  name: string;

  @vendors.classValidator.IsString()
  @vendors.classValidator.IsNotEmpty()
  key: string;
}
