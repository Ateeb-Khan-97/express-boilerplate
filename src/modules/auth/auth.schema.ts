import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type SignInDto = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  phoneNumber: z.string().optional(),
});
export type SignUpDto = z.infer<typeof SignUpSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});
export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>;
