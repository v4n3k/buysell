import { z } from 'zod';
import { step1Schema, step3Schema } from './schema';

export type Step1Values = z.infer<typeof step1Schema>;
export type Step3Values = z.infer<typeof step3Schema>;

export interface SignUpFormValues extends Step1Values, Step3Values {}

export interface SignUpFormState extends SignUpFormValues {
	verificationCode: string;
	avatarFile: File | null;
}
