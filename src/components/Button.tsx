import classNames from 'classnames';
import { MouseEventHandler, PropsWithChildren } from 'react';

export enum ButtonColor {
	Blue,
	Red,
}

export type ButtonProps = {
	text: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	color: ButtonColor;
};

const Button = ({ text, onClick, children, color }: PropsWithChildren<ButtonProps>) => {
	let colorClass = '';
	switch (color) {
		case ButtonColor.Blue:
			colorClass = 'bg-rt-blue hover:bg-rt-dark-blue';
			break;
		case ButtonColor.Red:
			colorClass = 'bg-rt-red hover:bg-rt-dark-red';
			break;
	}
	return (
		<button
			onClick={onClick}
			className={classNames(
				'flex w-max items-center gap-x-3 rounded py-2 pl-5 pr-6 text-sm text-rt-white focus:outline-none sm:text-base',
				colorClass,
			)}
		>
			{children}
			<span>{text}</span>
		</button>
	);
};

export default Button;
