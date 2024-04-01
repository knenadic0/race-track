import classNames from 'classnames';
import { CustomFlowbiteTheme, Tooltip as FlowbiteTooltip, TooltipProps as FlowbiteTooltipProps } from 'flowbite-react';

export type TooltipProps = FlowbiteTooltipProps & {
	delayed?: boolean;
};

const darkTooltipTheme: CustomFlowbiteTheme['tooltip'] = {
	style: {
		dark: 'bg-rt-dark-gray text-white dark:bg-rt-dark-gray',
	},
	arrow: {
		style: {
			dark: 'bg-rt-dark-gray dark:bg-rt-dark-gray',
		},
	},
};

const Tooltip = ({ content, className, placement, children, delayed = false }: TooltipProps) => {
	return (
		<FlowbiteTooltip
			content={content}
			placement={placement}
			theme={darkTooltipTheme}
			className={classNames(className, { 'delay-200': delayed })}
		>
			{children}
		</FlowbiteTooltip>
	);
};

export default Tooltip;
