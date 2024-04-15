import { Data, TableNode } from '@table-library/react-table-library';
import { Column, CompactTable } from '@table-library/react-table-library/compact';
import { usePagination } from '@table-library/react-table-library/pagination';
import { useTheme } from '@table-library/react-table-library/theme';
import { SortFn, SortToggleType, useSort } from '@table-library/react-table-library/sort';
import { getTheme } from '@table-library/react-table-library/mantine';
import classNames from 'classnames';
import { LuChevronDown, LuChevronUp, LuChevronsUpDown } from 'react-icons/lu';
import { ChangeEvent, useState } from 'react';
import Search from './Search';
import { rtGray } from '@constants/tailwind';

type DataTableProps<T> = {
	pageSize: number;
	columns: Column<TableNode & T>[];
	templateColumns: string;
	data: T[];
	fixedHeader?: boolean;
	sortFns?: Record<string, SortFn>;
	defaultSortKey?: string;
	defaultSortReversed?: boolean;
	searchableFields?: (keyof T)[];
	searchPhrase?: string;
};

const DataTable = <T extends Record<string, unknown>>({
	pageSize,
	columns,
	templateColumns,
	data,
	sortFns,
	defaultSortKey,
	searchableFields,
	searchPhrase,
	defaultSortReversed = false,
	fixedHeader = false,
}: DataTableProps<T>) => {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const resizableColumns = columns.map((column) => ({
		...column,
		resize: { resizerHighlight: rtGray, resizerWidth: 6, minWidth: 50 },
	}));

	const tableData: Data<TableNode & T> = {
		nodes:
			!searchableFields || !searchableFields.length || !searchQuery || !searchQuery.length
				? (data as unknown[] as (TableNode & T)[])
				: (data.filter((item) =>
						searchableFields.some(
							(field: keyof T) => item[field] && (item[field] as object).toString().toLowerCase().includes(searchQuery),
						),
				  ) as unknown[] as (TableNode & T)[]),
	};

	const pagination = usePagination(tableData, {
		state: {
			page: 0,
			size: pageSize,
		},
	});

	const sort = sortFns
		? useSort(
				tableData,
				{
					state: {
						sortKey: defaultSortKey,
						reverse: defaultSortReversed,
					},
				},
				{
					sortIcon: {
						iconDefault: <LuChevronsUpDown />,
						iconUp: <LuChevronUp />,
						iconDown: <LuChevronDown />,
					},
					sortToggleType: SortToggleType.AlternateWithReset,
					sortFns: sortFns,
				},
		  )
		: null;

	const theme = useTheme([
		getTheme({ highlightOnHover: true }),
		useTheme({
			Table: `
			--data-table-library_grid-template-columns: ${templateColumns};
		  `,
			Row: `font-size: 16px`,
			HeaderRow: `font-size: 16px;`,
		}),
	]);

	const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value.toLowerCase());
		pagination.fns.onSetPage(0);
	};

	return (
		<>
			{searchableFields && (
				<div className="mb-3 flex justify-end">
					<Search onChange={(e: ChangeEvent<HTMLInputElement>) => onSearch(e)} searchPhrase={searchPhrase} />
				</div>
			)}
			<CompactTable
				columns={resizableColumns}
				data={tableData}
				theme={theme}
				pagination={pagination}
				sort={sort}
				layout={{ custom: true, fixedHeader: fixedHeader }}
			/>
			<div className="mt-6 flex justify-between px-3">
				<span>Total Pages: {pagination.state.getTotalPages(tableData.nodes)}</span>
				<span>
					Page:{' '}
					{pagination.state.getPages(tableData.nodes).map((_: never, index: number) => (
						<button
							key={index}
							type="button"
							className={classNames('px-1', pagination.state.page === index ? 'text-black' : 'text-rt-gray')}
							onClick={() => pagination.fns.onSetPage(index)}
						>
							{index + 1}
						</button>
					))}
				</span>
			</div>
		</>
	);
};

export default DataTable;
