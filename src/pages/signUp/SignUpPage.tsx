'use client';

import {
	avatarSchema,
	SignUpFormValues,
	step1Schema,
	step2Schema,
	step3Schema,
} from '@/features/auth/signUp/model';
import { SignUpStep2, SignUpStep3 } from '@/features/auth/signUp/ui';
import { SignUpStep1 } from '@/features/auth/signUp/ui/';
import { Anchor, Button } from '@/shared/ui';
import { Box, Center, Group, Stack, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useInterval } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

const STEPS = [1, 2, 3] as const;
type SignUpStep = typeof STEPS[number];
const TOTAL_STEPS = STEPS.length;

export const SignUpPage = () => {
	const [step, setStep] = useState<SignUpStep>(1);
	const [verificationCode, setVerificationCode] = useState('');
	const [resendCooldown, setResendCooldown] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarError, setAvatarError] = useState<string | null>(null);
	const [hasAutoFocused, setHasAutoFocused] = useState(false);
	const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
	const [sessionToken, setSessionToken] = useState<string | null>(null);

	const form = useForm<SignUpFormValues>({
		initialValues: {
			name: '',
			email: '',
			password: '',
			passwordConfirm: '',
			avatarFile: null,
		},
	});

	const nameInputRef = useRef<HTMLInputElement>(null);
	const emailInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);

	const router = useRouter();

	const interval = useInterval(() => setResendCooldown(prev => prev - 1), 1000);

	useEffect(() => {
		setHasAutoFocused(false);
		setHasAttemptedSubmit(false);
	}, [step]);

	useEffect(() => {
		if (hasAutoFocused) return;

		const timer = setTimeout(() => {
			if (step === 1) {
				if (!form.values.name) {
					nameInputRef.current?.focus();
				} else if (!form.values.email) {
					emailInputRef.current?.focus();
				}
			} else if (step === 3) {
				if (!form.values.password) {
					passwordInputRef.current?.focus();
				}
			}
			setHasAutoFocused(true);
		}, 100);

		return () => clearTimeout(timer);
	}, [step, hasAutoFocused]);

	const startResendTimer = () => {
		setResendCooldown(60);
		interval.start();
	};

	const handleAvatarChange = (file: File | null) => {
		setAvatarFile(file);
		setAvatarError(null);

		if (file) {
			const result = avatarSchema.safeParse(file);
			if (!result.success) {
				const firstIssue = result.error.issues[0];
				setAvatarError(firstIssue?.message || 'Ошибка файла');
				setAvatarFile(null);
			}
		}
	};

	const validateCurrentStep = (): boolean => {
		form.clearErrors();
		setAvatarError(null);

		if (step === 1) {
			const result = step1Schema.safeParse({
				name: form.values.name,
				email: form.values.email,
				avatarFile,
			});

			if (!result.success) {
				const errors: Record<string, string> = {};
				result.error.issues.forEach(issue => {
					const path = issue.path.join('.');
					if (path) {
						if (path === 'avatarFile') {
							setAvatarError(issue.message);
						} else {
							errors[path] = issue.message;
						}
					}
				});
				form.setErrors(errors);
				return false;
			}
		}

		if (step === 2) {
			const result = step2Schema.safeParse({ verificationCode });
			if (!result.success) {
				const errors: Record<string, string> = {};
				result.error.issues.forEach(issue => {
					const path = issue.path.join('.');
					if (path) {
						errors[path] = issue.message;
					}
				});
				form.setErrors(errors);
				return false;
			}
		}

		if (step === 3) {
			const result = step3Schema.safeParse({
				password: form.values.password,
				passwordConfirm: form.values.passwordConfirm,
			});

			if (!result.success) {
				const errors: Record<string, string> = {};
				result.error.issues.forEach(issue => {
					const path = issue.path.join('.');
					if (path) {
						errors[path] = issue.message;
					}
				});
				form.setErrors(errors);
				return false;
			}
		}

		return true;
	};

	const handleNextStep = async (values: SignUpFormValues) => {
		if (!validateCurrentStep()) {
			setHasAttemptedSubmit(true);
			return;
		}

		setIsSubmitting(true);

		try {
			if (step === 1) {
				const formData = new FormData();
				formData.append('name', values.name);
				formData.append('email', values.email);
				if (avatarFile) formData.append('avatarFile', avatarFile);

				const res = await fetch(
					'http://localhost:4200/api/auth/register/start',
					{
						method: 'POST',
						body: formData,
						credentials: 'include',
					},
				);

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.message || 'Ошибка регистрации');
				}

				setSessionToken(data.sessionToken);
				setStep(2);
				startResendTimer();
			} else if (step === 2) {
				if (!sessionToken) {
					throw new Error('Сессия не найдена. Начните сначала.');
				}

				const res = await fetch(
					'http://localhost:4200/api/auth/register/verify',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						credentials: 'include',
						body: JSON.stringify({
							sessionToken,
							verificationCode,
						}),
					},
				);

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.message || 'Неверный код');
				}

				setStep(3);
			} else if (step === 3) {
				if (!sessionToken) {
					throw new Error('Сессия не найдена. Начните сначала.');
				}

				const res = await fetch(
					'http://localhost:4200/api/auth/register/finish',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						credentials: 'include',
						body: JSON.stringify({
							password: values.password,
							passwordConfirm: values.passwordConfirm,
							sessionToken,
						}),
					},
				);

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.message || 'Ошибка создания аккаунта');
				}

				localStorage.setItem('token', data.token);
				localStorage.setItem('user', JSON.stringify(data.user));

				router.replace('/');
			}
		} catch (error) {
			console.error('Registration error:', error);
			alert(error instanceof Error ? error.message : 'Произошла ошибка');
		} finally {
			setIsSubmitting(false);
		}
	};

	const goToPrevStep = () => {
		const prev = STEPS[STEPS.indexOf(step) - 1];
		if (prev) {
			form.clearErrors();
			setAvatarError(null);
			setStep(prev);
		}
	};

	const sendCodeAgain = async () => {
		if (!sessionToken) return;

		try {
			const res = await fetch(
				'http://localhost:4200/api/auth/register/resend',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ sessionToken }),
				},
			);

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Ошибка отправки кода');
			}

			startResendTimer();
		} catch (error) {
			console.error('Resend error:', error);
			alert(
				error instanceof Error ? error.message : 'Не удалось отправить код',
			);
		}
	};

	const STEPS_CONTENT: Record<SignUpStep, React.ReactNode> = {
		1: (
			<SignUpStep1
				form={form}
				avatarFile={avatarFile}
				onAvatarChange={handleAvatarChange}
				avatarError={avatarError}
				refs={{ name: nameInputRef, email: emailInputRef }}
			/>
		),
		2: (
			<SignUpStep2
				form={form}
				verificationCode={verificationCode}
				resendCooldown={resendCooldown}
				hasAttemptedSubmit={hasAttemptedSubmit}
				onCodeChange={setVerificationCode}
				onResend={sendCodeAgain}
			/>
		),
		3: (
			<SignUpStep3
				form={form}
				refs={{
					password: passwordInputRef,
				}}
			/>
		),
	};

	const isNextDisabled = isSubmitting;

	return (
		<Stack w='100%' px='xl'>
			<SignUpFormHeader step={step} totalSteps={TOTAL_STEPS} />

			<Center
				pb={{
					base: '15%',
					sm: '8%',
					md: '5%',
					lg: '4%',
					xl: '3%',
				}}
			>
				<Box
					w='100%'
					component='form'
					onSubmit={form.onSubmit(handleNextStep, errors =>
						console.log('Validation errors:', errors),
					)}
				>
					<Center w='100%'>
						<Stack
							gap='sm'
							w='100%'
							maw={450}
							p='xl'
							bd='1px solid #ddd'
							bdrs='md'
						>
							{STEPS_CONTENT[step]}

							<SignUpFormFooter
								isNextDisabled={isNextDisabled}
								isSubmitting={isSubmitting}
								step={step}
								goToPrevStep={goToPrevStep}
							/>
						</Stack>
					</Center>
				</Box>
			</Center>
		</Stack>
	);
};

const SignUpFormHeader = ({
	step,
	totalSteps,
}: {
	step: number;
	totalSteps: number;
}) => {
	return (
		<Center>
			<Group>
				<Title order={2}>Регистрация</Title>
				<Text c='dimmed'>
					Шаг {step} / {totalSteps}
				</Text>
			</Group>
		</Center>
	);
};

const SignUpFormFooter = ({
	isNextDisabled,
	isSubmitting,
	step,
	goToPrevStep,
}: {
	isNextDisabled: boolean;
	isSubmitting: boolean;
	step: number;
	goToPrevStep: () => void;
}) => {
	return (
		<Stack mt='md'>
			<Button
				size='md'
				type='submit'
				disabled={isNextDisabled}
				loading={isSubmitting}
			>
				{step === TOTAL_STEPS ? 'Зарегистрироваться' : 'Продолжить'}
			</Button>

			{step === 1 && (
				<Group justify='end'>
					<Anchor href='/auth/sign-in' size='sm'>
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
					disabled={isSubmitting}
				>
					Назад
				</Button>
			)}
		</Stack>
	);
};
