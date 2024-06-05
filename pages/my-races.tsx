import Link from 'next/link';
import { ReactElement } from 'react';
import Layout from '@components/Layout';
import dateFormat from 'dateformat';
import Loader, { LoaderType } from '@components/Loader';
import { useGetMyRaces } from '@adapters/firestore';
import DataTable from '@components/DataTable';
import Card from '@components/Card';
import { resultsRoute } from '@constants/routes';
import { TableNode } from '@table-library/react-table-library';
import { NextPageWithLayout } from './_app';
import { ResultRace } from '@datatypes/Result';
import { DNFPill, DNSPill } from '@components/Pill';
import { useAuth } from '@contexts/auth';

const MyRaces: NextPageWithLayout = () => {
	const { user } = useAuth();
	const { results } = useGetMyRaces(user?.uid);

	const columns = [
		{
			label: 'Race',
			renderCell: (item: ResultRace) => (
				<Link href={`${resultsRoute}/${item.raceId}?discipline=${item.disciplineId}`}>{item.race}</Link>
			),
			sort: { sortKey: 'race' },
		},
		{
			label: 'Discipline',
			renderCell: (item: ResultRace) => item.discipline,
			sort: { sortKey: 'discipline' },
		},
		{
			label: 'Date & time',
			renderCell: (item: ResultRace) => dateFormat(item.dateTime, 'dd.mm.yyyy. HH:MM'),
			sort: { sortKey: 'dateTime' },
		},
		{
			label: 'Gender #',
			renderCell: (item: ResultRace) => item.genderPosition || (item.started ? <DNFPill /> : <DNSPill />),
			sort: { sortKey: 'genderPosition' },
		},
		{
			label: 'Total #',
			renderCell: (item: ResultRace) => item.position || (item.started ? <DNFPill /> : <DNSPill />),
			sort: { sortKey: 'position' },
		},
		{
			label: 'Applied',
			renderCell: (item: ResultRace) => item.applied,
			sort: { sortKey: 'applied' },
		},
	];

	const sortFns = {
		race: (array: TableNode[]) => array.sort((a, b) => a.race.localeCompare(b.race)),
		discipline: (array: TableNode[]) => array.sort((a, b) => a.discipline.localeCompare(b.discipline)),
		dateTime: (array: TableNode[]) => array.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
		genderPosition: (array: TableNode[]) => array.sort((a, b) => a.genderPosition - b.genderPosition),
		position: (array: TableNode[]) => array.sort((a, b) => a.position - b.position),
		applied: (array: TableNode[]) => array.sort((a, b) => a.applied - b.applied),
	};

	return (
		<div className="main-container">
			<Card size="big" className="lg:px-8 lg:py-8">
				<h1 className="flex h-8 items-center text-xl font-bold">My races</h1>
			</Card>
			<Card size="big" className="flex-col">
				{!results && <Loader type={LoaderType.Skeleton} count={5} height={48} className="mt-12" />}
				{results && !results.length && <div className="my-5">No races yet.</div>}
				{results && results.length > 0 && (
					<DataTable
						columns={columns}
						data={results}
						pageSize={10}
						sortFns={sortFns}
						searchableFields={['race', 'discipline', 'position']}
						defaultSortKey="dateTime"
						defaultSortReversed
						templateColumns="minmax(220px, 3fr) minmax(220px, 3fr) minmax(200px, 2fr) repeat(3, minmax(110px, 1fr))"
						fixedHeader
						searchPhrase="Search races..."
					/>
				)}
			</Card>
		</div>
	);
};

MyRaces.getLayout = (page: ReactElement) => {
	const metaData = {
		title: 'My Races',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

MyRaces.isProtected = true;

export default MyRaces;
