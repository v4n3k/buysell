import { z } from 'zod';

export const avatarSchema = z
	.instanceof(File, { message: 'Выберите файл' })
	.nullable()
	.optional()
	.refine(
		file => {
			if (!file) return true;
			return file.size <= 5 * 1024 * 1024;
		},
		{ message: 'Размер файла не должен превышать 5MB' },
	)
	.refine(
		file => {
			if (!file) return true;
			return file.type.startsWith('image/');
		},
		{ message: 'Загрузите только изображения' },
	);

export const step1Schema = z.object({
	name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
	email: z.email('Некорректный email'),
	avatarFile: avatarSchema,
});

export const step2Schema = z.object({
	verificationCode: z.string().length(4, 'Введите 4-значный код'),
});

export const step3Schema = z
	.object({
		password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
		passwordConfirm: z.string(),
	})
	.refine(data => data.password === data.passwordConfirm, {
		message: 'Пароли не совпадают',
		path: ['passwordConfirm'],
	});
