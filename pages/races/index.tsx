import Link from 'next/link';
import { NextPageWithLayout } from '../_app';
import { ReactElement, useState, useEffect } from 'react';
import { app } from '@adapters/firebase';
import Layout from '@components/Layout';
import { CompactTable } from '@table-library/react-table-library/compact';
import { FiPlusCircle } from 'react-icons/fi';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { usePagination } from '@table-library/react-table-library/pagination';
import { RaceNode } from '@datatypes/Race';
import * as TYPES from '@table-library/react-table-library/types/table';
import { getAuth } from 'firebase/auth';
import dateFormat from 'dateformat';
import Loader, { LoaderContainer } from '@components/Loader';
import Pill, { PillColor } from '@components/Pill';
import Button, { ButtonColor } from '@components/Button';
import { useGetRaces } from '@adapters/firestore';

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

	const theme = useTheme([
		getTheme(),
		{
			Table: `
			--data-table-library_grid-template-columns:  40% 18% repeat(3, minmax(0, 1fr));
		  `,
		},
	]);
	const pagination = usePagination(data, {
		state: {
			page: 0,
			size: 10,
		},
	});

	const COLUMNS = [
		{
			label: 'Title',
			renderCell: (item: RaceNode) => <Link href={`/races/${item.id}`}>{item.title}</Link>,
		},
		{
			label: 'Date and time',
			renderCell: (item: RaceNode) => dateFormat(item.dateTime.toDate(), 'dd.mm.yyyy. HH:MM'),
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
				new Date() <= item.applyUntil.toDate() ? (
					<Pill color={PillColor.Green} text="Open" />
				) : (
					<Pill color={PillColor.Red} text="Closed" />
				),
		},
	];

	return (
		<div className="main-container">
			<div className="card card-big justify-between lg:px-8 lg:py-7">
				<h1 className="flex items-center text-xl font-bold">Upcoming races</h1>
				<Button color={ButtonColor.Blue} text="Add race" href="/races/manage">
					<FiPlusCircle />
				</Button>
			</div>
			<div className="card card-big flex-col">
				{!data.nodes.length ? (
					<Loader container={LoaderContainer.Component} />
				) : (
					<>
						<CompactTable columns={COLUMNS} data={data} theme={theme} pagination={pagination} layout={{ custom: true }} />
						<br />
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span>Total Pages: {pagination.state.getTotalPages(data.nodes)}</span>

							<span>
								Page:{' '}
								{pagination.state.getPages(data.nodes).map((_: RaceNode, index: number) => (
									<button
										key={index}
										type="button"
										style={{
											fontWeight: pagination.state.page === index ? 'bold' : 'normal',
										}}
										onClick={() => pagination.fns.onSetPage(index)}
									>
										{index + 1}
									</button>
								))}
							</span>
						</div>
					</>
				)}
			</div>
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
