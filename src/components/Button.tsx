import { ExclusiveOr } from '@datatypes/ExclusiveOr';
import classNames from 'classnames';
import Link from 'next/link';
import { MouseEventHandler, PropsWithChildren } from 'react';

export enum ButtonColor {
	Blue,
	Red,
	Disabled,
}

export type ButtonProps = {
	text: string;
	color: ButtonColor;
} & ExclusiveOr<
	{
		onClick?: MouseEventHandler<HTMLButtonElement>;
	},
	{
		href?: string;
	}
>;

const Button = ({ text, onClick, href, children, color }: PropsWithChildren<ButtonProps>) => {
	let colorClass = '';
	switch (color) {
		case ButtonColor.Blue:
			colorClass = 'bg-rt-blue hover:bg-rt-dark-blue';
			break;
		case ButtonColor.Red:
			colorClass = 'bg-rt-red hover:bg-rt-dark-red';
			break;
		case ButtonColor.Disabled:
			colorClass = 'bg-rt-gray cursor-not-allowed';
			href = undefined;
			onClick = undefined;
			break;
	}

	const className = classNames(
		'flex w-max items-center gap-x-3 rounded py-2 pl-5 pr-6 text-sm text-rt-white focus:outline-none sm:text-base',
		colorClass,
	);
	return onClick ? (
		<button onClick={onClick} className={className}>
			{children}
			<span>{text}</span>
		</button>
	) : href ? (
		<Link href={href} className={className}>
			{children}
			<span>{text}</span>
		</Link>
	) : (
		<button className={className}>
			{children}
			<span>{text}</span>
		</button>
	);
};

export default Button;
