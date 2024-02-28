import Link from 'next/link';
import { NextPageWithLayout } from '../_app';
import { ReactElement, useState, useEffect } from 'react';
import { app } from '@adapters/firebase';
import Layout from '@components/Layout';
import { FiPlusCircle } from 'react-icons/fi';
import { RaceNode } from '@datatypes/Race';
import * as TYPES from '@table-library/react-table-library/types/table';
import { getAuth } from 'firebase/auth';
import dateFormat from 'dateformat';
import Loader, { LoaderContainer } from '@components/Loader';
import Pill from '@components/Pill';
import Button, { ButtonColor } from '@components/Button';
import { useGetRaces } from '@adapters/firestore';
import PaginatedTable from '@components/Paging';
import Card from '@components/Card';
import { manageRacesRoute, racesRoute } from '@constants/routes';

const Races: NextPageWithLayout = () => {
	const [data, setData] = useState<TYPES.Data<RaceNode>>({
		pageInfo: null,
		nodes: [],
	});
	getAuth(app);
	const { races } = useGetRaces();

	useEffect(() => {
		if (races) {
			setData({
				nodes: races.map((race) => ({
					...race,
					nodes: null,
				})),
			});
		}
	}, [races]);

	const columns = [
		{
			label: 'Title',
			renderCell: (item: RaceNode) => <Link href={`${racesRoute}/${item.id}`}>{item.title}</Link>,
		},
		{
			label: 'Date and time',
			renderCell: (item: RaceNode) => dateFormat(item.dateTime, 'dd.mm.yyyy. HH:MM'),
		},
		{
			label: 'Disciplines',
			renderCell: (item: RaceNode) => item.disciplines?.length || 0,
		},
		{
			label: 'Applied',
			renderCell: (item: RaceNode) => item.applied,
		},
		{
			label: 'Applying',
			renderCell: (item: RaceNode) =>
				new Date() <= item.applyUntil ? <Pill color="green" text="Open" /> : <Pill color="red" text="Closed" />,
		},
	];

	return (
		<div className="main-container">
			<Card size="big" className="justify-between lg:px-8 lg:py-7">
				<h1 className="flex items-center text-xl font-bold">Upcoming races</h1>
				<Button color={ButtonColor.Blue} text="Add race" href={manageRacesRoute}>
					<FiPlusCircle />
				</Button>
			</Card>
			<Card size="big" className="flex-col">
				{!data.nodes.length ? (
					<Loader container={LoaderContainer.Component} />
				) : (
					<PaginatedTable columns={columns} data={data} pageSize={10} templateColumns="40% 18% repeat(3, minmax(0, 1fr))" />
				)}
			</Card>
		</div>
	);
};

Races.getLayout = function getLayout(page: ReactElement) {
	const metaData = {
		title: 'Races',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default Races;
