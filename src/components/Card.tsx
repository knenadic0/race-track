import { PropsWithStyle } from '@datatypes/StyleProps';
import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export type CardProps = {
	size: 'big' | 'small';
};

const Card = ({ size, children, className }: PropsWithChildren<PropsWithStyle<CardProps>>) => {
	const sizeVariants = {
		big: 'card-big',
		small: 'card-small',
	};
	return <div className={classNames('card', sizeVariants[size], className)}>{children}</div>;
};

export default Card;
