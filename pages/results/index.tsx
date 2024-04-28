import Link from 'next/link';
import { NextPageWithLayout } from '../_app';
import { ReactElement } from 'react';
import Layout from '@components/Layout';
import dateFormat from 'dateformat';
import Loader, { LoaderType } from '@components/Loader';
import { useGetRaces } from '@adapters/firestore';
import DataTable from '@components/DataTable';
import Card from '@components/Card';
import { resultsRoute } from '@constants/routes';
import { TableNode } from '@table-library/react-table-library';
import { Race } from '@datatypes/Race';

const Results: NextPageWithLayout = () => {
	const { races } = useGetRaces(false);

	const columns = [
		{
			label: 'Title',
			renderCell: (item: Race) => <Link href={`${resultsRoute}/${item.id}`}>{item.title}</Link>,
			sort: { sortKey: 'title' },
		},
		{
			label: 'Date & time',
			renderCell: (item: Race) => dateFormat(item.dateTime, 'dd.mm.yyyy. HH:MM'),
			sort: { sortKey: 'dateTime' },
		},
		{
			label: 'Disciplines',
			renderCell: (item: Race) => item.disciplinesCount || 0,
		},
		{
			label: 'Finished',
			renderCell: (item: Race) => `${item.finished || 0}/${item.applied || 0}`,
		},
	];

	const sortFns = {
		title: (array: TableNode[]) => array.sort((a, b) => a.title.localeCompare(b.title)),
		dateTime: (array: TableNode[]) => array.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
	};

	return (
		<div className="main-container">
			<Card size="big" className="lg:px-8 lg:py-8">
				<h1 className="flex h-8 items-center text-xl font-bold">Past races</h1>
			</Card>
			<Card size="big" className="flex-col">
				{!races && <Loader type={LoaderType.Skeleton} count={5} height={48} className="mt-12" />}
				{races && !races.length && <div className="my-5">No past races.</div>}
				{races && races.length > 0 && (
					<DataTable
						columns={columns}
						data={races}
						pageSize={10}
						sortFns={sortFns}
						searchableFields={['title']}
						defaultSortKey="dateTime"
						defaultSortReversed
						templateColumns="minmax(220px, 3fr) minmax(200px, 2fr) repeat(2, minmax(110px, 1fr))"
						fixedHeader
						searchPhrase="Search races..."
					/>
				)}
			</Card>
		</div>
	);
};

Results.getLayout = (page: ReactElement) => {
	const metaData = {
		title: 'Past races',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default Results;
