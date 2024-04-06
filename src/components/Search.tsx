import classNames from 'classnames';
import { CustomFlowbiteTheme, TextInput, TextInputProps } from 'flowbite-react';
import { RefAttributes } from 'react';
import { LuSearch } from 'react-icons/lu';

const searchTheme: CustomFlowbiteTheme['textInput'] = {
	field: {
		input: {
			base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50 h-9',
			withAddon: {
				off: 'rounded-md',
			},
			colors: {
				gray: 'rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-rt-gray focus:ring-2 focus:ring-inset focus:ring-rt-blue',
			},
			sizes: {
				md: 'py-1.5',
			},
		},
	},
};

const Search = ({ onChange, className, searchPhrase }: TextInputProps & RefAttributes<HTMLInputElement> & { searchPhrase?: string }) => (
	<TextInput
		type="search"
		rightIcon={LuSearch}
		className={classNames('w-full sm:w-64', className)}
		placeholder={searchPhrase || 'Search'}
		onChange={onChange}
		theme={searchTheme}
	/>
);

export default Search;
