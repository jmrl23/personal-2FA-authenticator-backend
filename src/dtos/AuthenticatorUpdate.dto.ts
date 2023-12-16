import { vendors } from '@jmrl23/express-helper';

export class AuthenticatorUpdateDto {
  @vendors.classValidator.IsUUID('4')
  id: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString()
  @vendors.classValidator.IsNotEmpty()
  name?: string;

  @vendors.classValidator.IsOptional()
  @vendors.classValidator.IsString()
  @vendors.classValidator.IsNotEmpty()
  key?: string;
}
