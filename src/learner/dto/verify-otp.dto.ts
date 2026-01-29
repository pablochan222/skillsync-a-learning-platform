import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 8, { message: 'OTP must be exactly 8 characters' })
  otp: string;
}
