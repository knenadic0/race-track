import { Data, TableNode } from '@table-library/react-table-library';
import { CompactTable } from '@table-library/react-table-library/compact';
import { usePagination } from '@table-library/react-table-library/pagination';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import classNames from 'classnames';

export type ColumnProps<T extends TableNode> = {
	label: string;
	renderCell: (item: T) => unknown;
};

export type PagingatedTableProps<T extends TableNode> = {
	pageSize: number;
	columns: ColumnProps<T>[];
	templateColumns: string;
	data: Data<T>;
};

const PaginatedTable = <T extends TableNode>({ pageSize, columns, templateColumns, data }: PagingatedTableProps<T>) => {
	const pagination = usePagination(data, {
		state: {
			page: 0,
			size: pageSize,
		},
	});

	const theme = useTheme([
		getTheme(),
		{
			Table: `
			--data-table-library_grid-template-columns: ${templateColumns};
		  `,
		},
	]);

	return (
		<>
			<CompactTable columns={columns} data={data} theme={theme} pagination={pagination} layout={{ custom: true }} />
			<div className="mt-6 flex justify-between px-3">
				<span>Total Pages: {pagination.state.getTotalPages(data.nodes)}</span>
				<span>
					Page:{' '}
					{pagination.state.getPages(data.nodes).map((_: never, index: number) => (
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

export default PaginatedTable;
