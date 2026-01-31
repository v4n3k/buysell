import {
	Button as MantineButton,
	ButtonProps as MantineButtonProps,
} from '@mantine/core';
import { ComponentPropsWithoutRef } from 'react';

type ButtonProps = MantineButtonProps & ComponentPropsWithoutRef<'button'>;

export const Button = ({
	color = 'indigo',
	radius = 'md',
	...props
}: ButtonProps) => {
	return <MantineButton color={color} radius={radius} {...props} />;
};
