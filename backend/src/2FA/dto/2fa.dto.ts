import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFactorAuthenticationDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export default TwoFactorAuthenticationDto;
