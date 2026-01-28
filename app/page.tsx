import { Alert, Badge, Button, Divider, Group, Progress } from '@mantine/core';

export default function Home() {
	return (
		<div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
			<Group gap='md'>
				<Button color='blue'>Синяя</Button>
				<Button color='green'>Зелёная</Button>
				<Button color='red'>Красная</Button>
				<Button color='orange'>Оранжевая</Button>
				<Button color='indigo'>Индиго</Button>
			</Group>

			<Divider my='md' />

			<Badge color='green' mr='xs'>
				В наличии
			</Badge>
			<Badge color='red' mr='xs'>
				Продано
			</Badge>
			<Badge color='yellow' mr='xs'>
				Новое
			</Badge>
			<Badge color='blue' mr='xs'>
				Доставка
			</Badge>

			<Divider my='md' />

			<Alert color='green' title='Успех!' mb='xs'>
				Товар добавлен в корзину
			</Alert>

			<Alert color='red' title='Ошибка' mb='xs'>
				Недостаточно средств
			</Alert>

			<Alert color='yellow' title='Внимание' mb='xs'>
				Товар заканчивается
			</Alert>

			<Divider my='md' />

			<Progress color='blue' value={45} mb='xs' />
			<Progress color='green' value={75} mb='xs' />
			<Progress color='red' value={30} mb='xs' />

			<Divider my='md' />

			<Button color='blue' variant='filled' mb='xs'>
				Filled
			</Button>
			<Button color='blue' variant='outline' mb='xs'>
				Outline
			</Button>
			<Button color='blue' variant='light' mb='xs'>
				Light
			</Button>
			<Button color='blue' variant='subtle' mb='xs'>
				Subtle
			</Button>
		</div>
	);
}
