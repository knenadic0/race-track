import Head from 'next/head';
import Link from 'next/link';
import { NextPageWithLayout } from '../_app';
import { ReactElement, useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { app, firestore } from '@adapters/firebase';
import Layout from '@components/Layout';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { usePagination } from '@table-library/react-table-library/pagination';
import { Race, RaceNode } from '@datatypes/Race';
import * as TYPES from '@table-library/react-table-library/types/table';
import { getAuth } from 'firebase/auth';
import { Puff } from 'react-loader-spinner';
import { waveColor } from '@constants/tailwind';
import dateFormat from 'dateformat';

const Races: NextPageWithLayout = () => {
	let races: Race[] = [];
	const [data, setData] = useState<TYPES.Data<RaceNode>>({
		pageInfo: null,
		nodes: [],
	});
	getAuth(app);

	useEffect(() => {
		const fetchData = async () => {
			const racesQuery = query(collection(firestore, 'races'), where('dateTime', '>', new Date()), orderBy('dateTime', 'asc'));
			const racesSnapshot = await getDocs(racesQuery);

			races = await Promise.all(
				racesSnapshot.docs.map(async (raceDoc) => {
					const raceDisciplinesSnapshot = await getDocs(collection(raceDoc.ref, 'disciplines'));
					const raceAppliersSnapshot = await getDocs(collection(raceDoc.ref, 'applied'));

					return {
						id: raceDoc.id,
						title: raceDoc.data().title,
						dateTime: raceDoc.data().dateTime,
						applyUntil: raceDoc.data().applyUntil,
						disciplines: raceDisciplinesSnapshot.docs.map((discipline) => ({
							id: discipline.id,
							title: discipline.data().title,
							raceLength: discipline.data()['length'],
						})),
						description: raceDoc.data().description,
						applied: raceAppliersSnapshot.size,
					};
				}),
			);

			setData({
				nodes: races.map((race) => ({
					...race,
					nodes: null,
				})),
			});
		};

		if (!data.nodes.length) {
			fetchData();
		}
	}, []);

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
			renderCell: (item: RaceNode) => item.disciplines.length,
		},
		{
			label: 'Applied',
			renderCell: (item: RaceNode) => item.applied,
		},
		{
			label: 'Applying',
			renderCell: (item: RaceNode) =>
				new Date() <= item.applyUntil.toDate() ? (
					<span className="rounded bg-green-200 px-2.5 py-0.5 text-sm text-green-900">Open</span>
				) : (
					<span className="rounded bg-red-200 px-2.5 py-0.5 text-sm text-red-900">Closed</span>
				),
		},
	];

	return (
		<div className="flex flex-col items-center justify-center py-5">
			<Head>
				<title>RaceTrack</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{!data.nodes.length ? (
				<div className="absolute top-1/3">
					<Puff height="60" width="60" radius={1} color={waveColor} ariaLabel="puff-loading" visible={true} />
				</div>
			) : (
				<div className="mx-auto w-full max-w-7xl rounded bg-white px-4 shadow-xl sm:px-6 lg:px-8">
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
				</div>
			)}
		</div>
	);
};

Races.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Races;
