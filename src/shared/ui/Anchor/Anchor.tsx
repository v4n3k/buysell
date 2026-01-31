import {
	Anchor as MantineAnchor,
	AnchorProps as MantineAnchorProps,
} from '@mantine/core';
import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { ComponentPropsWithoutRef } from 'react';
import styles from './Anchor.module.css';

type AnchorProps = Omit<MantineAnchorProps, 'href'> &
	LinkProps &
	ComponentPropsWithoutRef<'a'> & {
		href: string;
	};

export const Anchor = ({
	className,
	variant = 'subtle',
	c = 'indigo',
	href,
	...props
}: AnchorProps) => {
	return (
		<MantineAnchor
			className={clsx(styles.anchor, className)}
			variant={variant}
			c={c}
			component={Link}
			href={href}
			fw='600'
			{...props}
		/>
	);
};
