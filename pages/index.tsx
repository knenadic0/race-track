import Head from 'next/head';
import { NextPageWithLayout } from './_app';
import { ReactElement, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { app, firestore } from '../services/firebase';
import Layout from '../components/layout';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { usePagination } from '@table-library/react-table-library/pagination';
import IRace, { RaceNode } from '../types/IRace';
import * as TYPES from '@table-library/react-table-library/types/table';
import { getAuth } from 'firebase/auth';
import { Puff } from 'react-loader-spinner';
import { waveColor } from '../helpers/constants';

const Home: NextPageWithLayout = () => {
	// const [races, setRaces] = useState<IRace[]>([]);
	let races: IRace[] = [];
	const [data, setData] = useState<TYPES.Data<RaceNode>>({
		pageInfo: null,
		nodes: [],
	});
	getAuth(app);

	useEffect(() => {
		const fetchRaces = async () => {
			const racesCollection = collection(firestore, 'races');
			const racesSnapshot = await getDocs(racesCollection);

			races = racesSnapshot.docs.map((doc) => ({
				id: doc.id,
				title: doc.data().title,
				dateTime: doc.data().dateTime,
			}));

			setData({
				nodes: races.map((race) => ({
					...race,
					id: race.id,
					nodes: null,
				})),
			});
		};

		fetchRaces();
	}, []);

	const theme = useTheme(getTheme());
	const pagination = usePagination(data, {
		state: {
			page: 0,
			size: 10,
		},
	});

	const COLUMNS = [
		{ label: 'Title', renderCell: (item: RaceNode) => item.title },
		{
			label: 'Date',
			renderCell: (item: RaceNode) => item.dateTime.toDate().toLocaleDateString('hr-HR'),
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
				<div className="mx-auto w-full max-w-7xl bg-white px-4 sm:px-6 lg:px-8">
					<CompactTable columns={COLUMNS} data={data} theme={theme} pagination={pagination} />

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

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Home;
