import classNames from 'classnames';

export enum PillColor {
	Green,
	Red,
}

export type PillProps = {
	text: string;
	color: PillColor;
};

const Pill = ({ text, color }: PillProps) => {
	const colorName = PillColor[color].toLowerCase();
	const colorClass = `bg-${colorName}-200 text-${colorName}-900`;

	return <span className={classNames('rounded px-2.5 py-0.5 text-sm', colorClass)}>{text}</span>;
};

export default Pill;
