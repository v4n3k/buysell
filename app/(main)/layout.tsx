'use client';

import { Header } from '@/widgets/Header';
import { AppShell, Burger, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';

interface HomeLayoutProps {
	children: ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
	const [opened, { toggle }] = useDisclosure();

	const isLoggedIn = false;

	return (
		<AppShell header={{ height: isLoggedIn ? 120 : 60 }}>
			<AppShell.Header>
				<Container size={1200} mx='auto' p='sm'>
					<Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
					<Header />
				</Container>
			</AppShell.Header>

			<AppShell.Main>
				<Container size={1200} p='sm' mx='auto'>
					{children}
				</Container>
			</AppShell.Main>
		</AppShell>
	);
};

export default HomeLayout;
