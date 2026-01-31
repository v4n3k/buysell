'use client';

import { Header } from '@/widgets/Header';
import { AppShell, Burger, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const HomeLayout = () => {
	const [opened, { toggle }] = useDisclosure();

	return (
		<AppShell padding='md' header={{ height: 120 }}>
			<AppShell.Header>
				<Container size={1200} mx='auto' p='md'>
					<Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
					<Header />
				</Container>
			</AppShell.Header>

			<AppShell.Main>
				<Container size={1200} p={0} mx='auto'>
					Main
				</Container>
			</AppShell.Main>
		</AppShell>
	);
};

export default HomeLayout;
