import { Anchor, Button, SearchBar } from '@/shared/ui';
import { Avatar, Center, Flex, Group, Stack } from '@mantine/core';
import {
	IconBasketFilled,
	IconBellFilled,
	IconBoxMultiple,
	IconHeartFilled,
	IconMapPin,
	IconMenu2,
	IconMessageFilled,
	IconPlus,
} from '@tabler/icons-react';

export const Header = () => {
	return (
		<Flex direction='row' gap='xl' align='center'>
			<Stack gap='xs' w='100%'>
				<Group align='center' justify='space-between' w='100%'>
					<Group>
						<Anchor href='/'>Продавцу</Anchor>
						<Anchor href='/'>Покупателю</Anchor>
					</Group>

					<Group>
						<Button
							variant='subtle'
							color='black'
							leftSection={<IconPlus size='18' />}
						>
							Разместить объявление
						</Button>
						<Button
							variant='subtle'
							color='black'
							leftSection={<IconBoxMultiple size='18' />}
						>
							Мои объявления
						</Button>

						<Anchor href='/'>
							<Center>
								<IconHeartFilled size='26' />
							</Center>
						</Anchor>
						<Anchor href='/'>
							<Center>
								<IconBellFilled size='26' />
							</Center>
						</Anchor>
						<Anchor href='/'>
							<Center>
								<IconMessageFilled size='26' />
							</Center>
						</Anchor>
						<Anchor href='/'>
							<Center>
								<IconBasketFilled size='26' />
							</Center>
						</Anchor>

						<Avatar />
					</Group>
				</Group>

				<Group>
					<Anchor href='/' td='none' c='black' size='xl' fw='700'>
						BuySell
					</Anchor>

					<Group>
						<Button leftSection={<IconMenu2 size={18} />}>Все категории</Button>
						<SearchBar placeholder='Поиск по объявлениям' />
					</Group>

					<Button variant='subtle' leftSection={<IconMapPin />}>
						Москва
					</Button>
				</Group>
			</Stack>
		</Flex>
	);
};
