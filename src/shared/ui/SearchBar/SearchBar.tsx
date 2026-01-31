import { ActionIcon, Group, TextInput } from '@mantine/core';

import { IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from '../Button';

export interface SearchBarProps {
	placeholder?: string;
	initialValue?: string;
	onSearch?: (query: string) => void;
}

export interface UseSearchOptions {
	initialValue?: string;
	onSearch?: (query: string) => void;
}

export const SearchBar = ({
	placeholder = 'Поиск',
	initialValue = '',
	onSearch,
}: SearchBarProps) => {
	const {
		query,
		setQuery,
		handleSearch,
		handleClear,
		handleKeyDown,
	} = useSearch({
		initialValue,
		onSearch,
	});

	return (
		<Group gap={2}>
			<TextInput
				value={query}
				type='search'
				onChange={event => setQuery(event.currentTarget.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				rightSectionWidth={query ? 40 : 40}
				radius='md'
				w={500}
				rightSection={
					<Group>
						{query && (
							<ActionIcon
								size={32}
								radius='xl'
								variant='subtle'
								color='gray'
								onClick={handleClear}
								aria-label='Очистить'
							>
								<IconX size={16} />
							</ActionIcon>
						)}
					</Group>
				}
				styles={{
					input: {
						borderWidth: 2,
						borderColor: 'var(--mantine-color-indigo-filled)',
					},
				}}
				rightSectionPointerEvents='all'
			/>
			<Button onClick={handleSearch}>Найти</Button>
		</Group>
	);
};

export const useSearch = ({
	initialValue = '',
	onSearch,
}: UseSearchOptions = {}) => {
	const [query, setQuery] = useState(initialValue);

	const handleSearch = () => {
		if (query.trim()) {
			onSearch?.(query.trim());
		}
	};

	const handleClear = () => {
		setQuery('');
		onSearch?.('');
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSearch();
		}
	};

	return {
		query,
		setQuery,
		handleSearch,
		handleClear,
		handleKeyDown,
	};
};
