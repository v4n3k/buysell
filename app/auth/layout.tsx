'use client';

import { AppShell, Center } from '@mantine/core';
import { ReactNode } from 'react';

interface AuthLayoutProps {
	children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<AppShell h='100vh'>
			<AppShell.Main h='100%'>
				<Center h='100%'>{children}</Center>
			</AppShell.Main>
		</AppShell>
	);
};

export default AuthLayout;
