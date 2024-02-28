import { z } from 'zod';
import { config } from 'dotenv';
config();

const EnvSchema = z.object({
  PORT: z.string().default('5000'),
});

export type IEnv = z.infer<typeof EnvSchema>;

function envInitializer() {
  try {
    return EnvSchema.parse(process.env);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
envInitializer();
export const ENV: IEnv = envInitializer();
