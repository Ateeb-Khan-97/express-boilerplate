import { z } from 'zod';
import { config } from 'dotenv';
config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']).default('development'),
  PORT: z.string().default('5000'),
  JWT_ACCESS_SECRET: z.string(),
});

export type IEnv = z.infer<typeof EnvSchema>;

function envInitializer() {
  try {
    return EnvSchema.parse(process.env);
  } catch (error: any) {
    console.log('Env', error.errors[0].path[0], 'is', error.errors[0].message);
    process.exit(1);
  }
}

export const ENV: IEnv = envInitializer();
export const isDev = () => ENV.NODE_ENV == 'development';
export const isProd = () => ENV.NODE_ENV == 'production';
