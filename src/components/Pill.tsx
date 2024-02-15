import { Badge } from 'flowbite-react';

export type PillProps = {
	text: string;
	color: 'green' | 'red';
};

const Pill = ({ text, color }: PillProps) => {
	return (
		<Badge color={color} className="w-min">
			{text}
		</Badge>
	);
};

export default Pill;
