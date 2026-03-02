import { TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { SignUpFormValues } from '../model';

interface SignUpStep3Props {
	form: UseFormReturnType<SignUpFormValues>;
	refs: {
		password: React.RefObject<HTMLInputElement | null>;
	};
}

export const SignUpStep3 = ({ form, refs }: SignUpStep3Props) => {
	return (
		<>
			<TextInput
				ref={refs.password}
				size='md'
				radius='md'
				variant='filled'
				withAsterisk
				required
				label='Пароль'
				placeholder='Придумайте сложный пароль'
				type='password'
				{...form.getInputProps('password')}
			/>
			<TextInput
				size='md'
				radius='md'
				variant='filled'
				withAsterisk
				required
				label='Подтверждение'
				placeholder='Повторите пароль'
				type='password'
				{...form.getInputProps('passwordConfirm')}
			/>
		</>
	);
};
