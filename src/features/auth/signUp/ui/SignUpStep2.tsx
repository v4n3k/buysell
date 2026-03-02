import { Button, Group, PinInput, Stack, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { SignUpFormValues } from '../model';

interface SignUpStep2Props {
	form: UseFormReturnType<SignUpFormValues>;
	verificationCode: string;
	resendCooldown: number;
	hasAttemptedSubmit: boolean;
	onCodeChange: (code: string) => void;
	onResend: () => void;
}

export const SignUpStep2 = ({
	form,
	verificationCode,
	resendCooldown,
	hasAttemptedSubmit,
	onCodeChange,
	onResend,
}: SignUpStep2Props) => {
	return (
		<Stack align='center' py='md'>
			<Text size='sm' fw={500} ta='center'>
				Введите код, отправленный на{' '}
				<Text fw='700' span>
					{form.values.email}
				</Text>
			</Text>
			<PinInput
				size='lg'
				length={4}
				type='number'
				autoFocus={verificationCode.length === 0}
				value={verificationCode}
				onChange={onCodeChange}
			/>
			{hasAttemptedSubmit && verificationCode.length !== 4 && (
				<Text size='xs' c='red'>
					Введите 4-значный код
				</Text>
			)}
			<Group gap='xs' justify='center'>
				{resendCooldown > 0 ? (
					<Text size='xs' c='dimmed'>
						Отправить снова через{' '}
						<Text span fw={700}>
							{resendCooldown}
						</Text>{' '}
						сек.
					</Text>
				) : (
					<Button type='button' size='xs' variant='subtle' onClick={onResend}>
						Отправить код повторно
					</Button>
				)}
			</Group>
		</Stack>
	);
};
