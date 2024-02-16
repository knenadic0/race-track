import { PropsWithStyle } from '@datatypes/StyleProps';
import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export type CardProps = {
	size: 'big' | 'small';
};

const Card = ({ size, children, className }: PropsWithChildren<PropsWithStyle<CardProps>>) => {
	return <div className={classNames('card', 'card-' + size, className)}>{children}</div>;
};

export default Card;
