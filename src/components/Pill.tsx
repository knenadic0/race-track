import { Badge } from 'flowbite-react';
import Tooltip from './Tooltip';

export type PillProps = {
	text: string;
	color: 'green' | 'red' | 'teal';
};

const Pill = ({ text, color }: PillProps) => (
	<Badge color={color} className="w-min">
		{text}
	</Badge>
);

export const DNFPill = () => (
	<Tooltip content="Did not finish" delayed>
		<Pill text="DNF" color="red" />
	</Tooltip>
);

export const DNSPill = () => (
	<Tooltip content="Did not start" delayed>
		<Pill text="DNS" color="red" />
	</Tooltip>
);

export default Pill;
