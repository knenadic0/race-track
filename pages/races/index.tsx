import Link from 'next/link';
import { NextPageWithLayout } from '../_app';
import { ReactElement } from 'react';
import Layout from '@components/Layout';
import { LuPlusSquare } from 'react-icons/lu';
import { Race } from '@datatypes/Race';
import dateFormat from 'dateformat';
import Loader, { LoaderType } from '@components/Loader';
import Pill from '@components/Pill';
import Button, { ButtonColor } from '@components/Button';
import { useGetRaces } from '@adapters/firestore';
import DataTable from '@components/DataTable';
import Card from '@components/Card';
import { manageRacesRoute, racesRoute } from '@constants/routes';
import { TableNode } from '@table-library/react-table-library';
import classNames from 'classnames';
import { useAuth } from '@contexts/auth';

const Races: NextPageWithLayout = () => {
	const { user } = useAuth();
	const { races } = useGetRaces();

	const columns = [
		{
			label: 'Title',
			renderCell: (item: Race) => <Link href={`${racesRoute}/${item.id}`}>{item.title}</Link>,
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
			label: 'Applied',
			renderCell: (item: Race) => item.applied || 0,
			sort: { sortKey: 'applied' },
		},
		{
			label: 'Applying',
			renderCell: (item: Race) =>
				new Date() <= item.applyUntil ? <Pill color="green" text="Open" /> : <Pill color="red" text="Closed" />,
			sort: { sortKey: 'applying' },
		},
	];

	const sortFns = {
		title: (array: TableNode[]) => array.sort((a, b) => a.title.localeCompare(b.title)),
		dateTime: (array: TableNode[]) => array.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
		applied: (array: TableNode[]) => array.sort((a, b) => a.applied - b.applied),
		applying: (array: TableNode[]) => array.sort((a, b) => a.applyUntil.getTime() - b.applyUntil.getTime()),
	};

	return (
		<div className="main-container">
			<Card size="big" className={classNames('items-center justify-between', { 'lg:px-8': !user, 'lg:py-7': user })}>
				<h1 className="flex h-8 items-center text-xl font-bold">Upcoming races</h1>
				{user && (
					<Button color={ButtonColor.Blue} text="Add race" href={manageRacesRoute}>
						<LuPlusSquare />
					</Button>
				)}
			</Card>
			<Card size="big" className="flex-col">
				{!races && <Loader type={LoaderType.Skeleton} count={5} height={48} className="mt-12" />}
				{races && !races.length && <div className="my-5">No races yet.</div>}
				{races && races.length > 0 && (
					<DataTable
						columns={columns}
						data={races}
						pageSize={10}
						sortFns={sortFns}
						searchableFields={['title']}
						defaultSortKey="dateTime"
						templateColumns="minmax(220px, 3fr) minmax(200px, 2fr) repeat(3, minmax(110px, 1fr))"
						fixedHeader
						searchPhrase="Search races..."
					/>
				)}
			</Card>
		</div>
	);
};

Races.getLayout = (page: ReactElement) => {
	const metaData = {
		title: 'Races',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default Races;
