'use client';

import { Anchor, Button } from '@/shared/ui';
import {
	Center,
	FileInput,
	Group,
	PinInput,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';

interface SignUpForm {
	name: string;
	avatarFile?: File | null;
	email: string;
	password: string;
	passwordConfirm: string;
}

const STEPS = [1, 2, 3] as const;
type SignUpStep = typeof STEPS[number];
const TOTAL_STEPS = STEPS.length;

const INITIAL_FORM_STATE: SignUpForm = {
	name: '',
	avatarFile: null,
	email: '',
	password: '',
	passwordConfirm: '',
};

export const SignUpPage = () => {
	const [step, setStep] = useState<SignUpStep>(1);
	const [form, setForm] = useState<SignUpForm>(INITIAL_FORM_STATE);
	const [verificationCode, setVerificationCode] = useState('');
	const [resendCooldown, setResendCooldown] = useState(0);

	const { name, email, avatarFile, password, passwordConfirm } = form;
	const currentIndex = STEPS.indexOf(step);

	useEffect(() => {
		if (resendCooldown <= 0) return;
		const timerId = setInterval(
			() => setResendCooldown(prev => prev - 1),
			1000,
		);
		return () => clearInterval(timerId);
	}, [resendCooldown]);

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleAvatarChange = (file: File | null) => {
		setForm(prev => ({ ...prev, avatarFile: file }));
	};

	const startResendTimer = () => setResendCooldown(60);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const next = STEPS[currentIndex + 1];

		if (next) {
			if (next === 2) startResendTimer();
			setStep(next);
		} else {
			console.log('Финальная отправка: ', form);
		}
	};

	const goToPrevStep = () => {
		const prev = STEPS[currentIndex - 1];
		if (prev) setStep(prev);
	};

	const STEPS_CONTENT: Record<SignUpStep, React.ReactNode> = {
		1: (
			<>
				<TextInput
					size='md'
					radius='md'
					variant='filled'
					withAsterisk
					required
					label='Имя'
					placeholder='Введите имя'
					name='name'
					value={name}
					onChange={handleFormChange}
					autoFocus
				/>
				<TextInput
					size='md'
					radius='md'
					variant='filled'
					withAsterisk
					required
					label='Email'
					placeholder='example@mail.com'
					name='email'
					type='email'
					value={email}
					onChange={handleFormChange}
				/>
				<FileInput
					size='md'
					radius='md'
					variant='filled'
					label='Аватар'
					placeholder='Выберите файл'
					accept='image/*'
					value={avatarFile}
					onChange={handleAvatarChange}
				/>
			</>
		),
		2: (
			<Stack align='center' py='md'>
				<Text size='sm' fw={500} ta='center'>
					Введите код, отправленный на{' '}
					<Text fw='700' span>
						{email}
					</Text>
				</Text>
				<PinInput
					size='lg'
					length={4}
					type='number'
					autoFocus={verificationCode.length === 0}
					value={verificationCode}
					onChange={setVerificationCode}
				/>
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
						<Button
							type='button'
							size='xs'
							variant='subtle'
							onClick={() => {
								console.log('Resend to:', email);
								startResendTimer();
							}}
						>
							Отправить код повторно
						</Button>
					)}
				</Group>
			</Stack>
		),
		3: (
			<>
				<TextInput
					size='md'
					radius='md'
					variant='filled'
					withAsterisk
					required
					label='Пароль'
					placeholder='Придумайте сложный пароль'
					type='password'
					name='password'
					value={password}
					onChange={handleFormChange}
					autoFocus
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
					name='passwordConfirm'
					value={passwordConfirm}
					onChange={handleFormChange}
					error={
						password !== passwordConfirm && passwordConfirm.length > 0
							? 'Пароли не совпадают'
							: null
					}
				/>
			</>
		),
	};

	const isNextDisabled =
		(step === 2 &&
			verificationCode.length < 4 &&
			verificationCode.length > 0) ||
		(step === 3 && password !== passwordConfirm && password !== '');

	return (
		<Stack w='100%'>
			<Center>
				<Group>
					<Title order={2}>Регистрация</Title>
					<Text c='dimmed'>
						Шаг {step} / {TOTAL_STEPS}
					</Text>
				</Group>
			</Center>

			<Center pb='5%'>
				<Stack
					gap='sm'
					w='35%'
					miw={350}
					p='xl'
					bd='1px solid #ddd'
					bdrs='md'
					component='form'
					onSubmit={handleSubmit}
				>
					{STEPS_CONTENT[step]}

					<Stack mt='md'>
						<Button size='md' type='submit' disabled={isNextDisabled}>
							{step === TOTAL_STEPS ? 'Зарегистрироваться' : 'Продолжить'}
						</Button>

						{step === 1 && (
							<Group justify='end'>
								<Anchor href='/' size='sm'>
									Уже есть аккаунт? Войти
								</Anchor>
							</Group>
						)}

						{step > 1 && (
							<Button
								variant='subtle'
								size='xs'
								w='fit-content'
								type='button'
								onClick={goToPrevStep}
							>
								Назад
							</Button>
						)}
					</Stack>
				</Stack>
			</Center>
		</Stack>
	);
};
