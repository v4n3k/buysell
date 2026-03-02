import { FileInput, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { SignUpFormValues } from '../model';

interface SignUpStep1Props {
	form: UseFormReturnType<SignUpFormValues>;
	avatarFile: File | null;
	avatarError: string | null;
	onAvatarChange: (file: File | null) => void;
	refs: {
		name: React.RefObject<HTMLInputElement | null>;
		email: React.RefObject<HTMLInputElement | null>;
	};
}

export const SignUpStep1 = ({
	form,
	avatarFile,
	avatarError,
	onAvatarChange,
	refs,
}: SignUpStep1Props) => {
	return (
		<>
			<TextInput
				ref={refs.name}
				size='md'
				radius='md'
				variant='filled'
				withAsterisk
				required
				label='Имя'
				placeholder='Введите имя'
				{...form.getInputProps('name')}
			/>
			<TextInput
				ref={refs.email}
				size='md'
				radius='md'
				variant='filled'
				withAsterisk
				required
				label='Email'
				placeholder='example@mail.com'
				type='email'
				{...form.getInputProps('email')}
			/>
			<FileInput
				size='md'
				radius='md'
				variant='filled'
				label='Аватар'
				placeholder='Выберите файл'
				accept='image/*'
				value={avatarFile}
				onChange={onAvatarChange}
				error={avatarError}
			/>
		</>
	);
};
