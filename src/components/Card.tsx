import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export type CardProps = {
	size: 'big' | 'small';
	className?: string;
};

const Card = ({ size, children, className }: PropsWithChildren<CardProps>) => {
	return <div className={classNames('card', `card-${size}`, className)}>{children}</div>;
};

export default Card;
