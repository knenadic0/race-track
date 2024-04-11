import { CustomFlowbiteTheme, TabsProps, Tabs as FlowbiteTabs } from 'flowbite-react';
import { IconType } from 'react-icons';

export type Tab = {
	name: string;
	icon: IconType;
	component: JSX.Element;
	active?: boolean;
};

const underlineTabsTheme: CustomFlowbiteTheme['tabs'] = {
	tablist: {
		styles: {
			underline: '-mb-px flex-wrap border-b border-rt-gray dark:border-rt-gray space-x-2',
		},
		tabitem: {
			base: 'flex items-center justify-center p-4 font-medium first:ml-0 focus:outline-none focus:ring-1 focus:ring-rt-blue disabled:cursor-not-allowed disabled:text-rt-gray disabled:dark:text-rt-gray',
			styles: {
				underline: {
					base: 'rounded-t-sm',
					active: {
						on: 'active border-b-2 border-rt-blue dark:border-rt-blue',
						off: 'border-b-2 border-transparent hover:border-rt-dark-gray',
					},
				},
			},
		},
	},
};

const UnderlineTabs = ({ children }: TabsProps) => {
	return (
		<FlowbiteTabs style="underline" theme={underlineTabsTheme}>
			{children}
		</FlowbiteTabs>
	);
};

export default UnderlineTabs;
