import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';
import { ReactElement, useState, useEffect } from 'react';
import { getDoc, doc, getDocs, collection, query, orderBy } from 'firebase/firestore';
import { app, firestore } from '../../services/firebase';
import Layout from '../../components/Layout';
import { getAuth } from 'firebase/auth';
import { Puff } from 'react-loader-spinner';
import { waveColor } from '../../helpers/constants';
import IRace from '../../types/IRace';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import Info from '../../components/Info';

const Race: NextPageWithLayout = () => {
	getAuth(app);
	const router = useRouter();
	const [raceData, setRaceData] = useState<IRace>();
	const tabs = { Info: <Info raceData={raceData} />, Apply: null, Applied: null };

	useEffect(() => {
		const fetchData = async () => {
			if (router.query.id) {
				const raceDoc = doc(firestore, 'races', router.query.id.toString());
				const docSnapshot = await getDoc(raceDoc);

				if (docSnapshot.exists()) {
					const raceDisciplinesSnapshot = await getDocs(
						query(collection(docSnapshot.ref, 'disciplines'), orderBy('length', 'asc')),
					);
					const data = docSnapshot.data();
					setRaceData({
						id: router.query.id!.toString(),
						title: data.title,
						dateTime: data.dateTime,
						applyUntil: data.applyUntil,
						disciplines: raceDisciplinesSnapshot.docs.map((discipline) => ({
							id: discipline.id,
							title: discipline.data().title,
							raceLength: discipline.data()['length'],
						})),
						description: data.description,
						applied: data.applied,
					});
				} else {
					console.error('No race found with given id: ', router.query.id);
				}
			}
		};

		if (!raceData) {
			fetchData();
		}
	}, [router.query]);

	return (
		<div className="flex flex-col items-center justify-center py-5">
			<Head>
				<title>RaceTrack</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{!raceData ? (
				<div className="absolute top-1/3">
					<Puff height="60" width="60" radius={1} color={waveColor} ariaLabel="puff-loading" visible={true} />
				</div>
			) : (
				<>
					<div className="mx-auto mb-5 w-full max-w-7xl rounded bg-white p-4 shadow-xl sm:p-6 lg:p-8">
						<h1 className="text-xl font-bold">{raceData.title}</h1>
					</div>
					<div className="mx-auto w-full max-w-7xl rounded bg-white p-4 shadow-xl sm:p-6 sm:pt-4 lg:p-8 lg:pt-4">
						<Tab.Group>
							<Tab.List className="flex space-x-3 border-b-2 border-gray-200 text-center font-medium">
								{Object.keys(tabs).map((category) => (
									<Tab
										key={category}
										className={({ selected }) =>
											classNames(
												'-mb-px inline-block border-b-3 px-3 py-3 focus-visible:outline-slate-300',
												selected ? 'border-rt-blue' : 'border-transparent hover:border-gray-400',
											)
										}
									>
										{category}
									</Tab>
								))}
							</Tab.List>
							<Tab.Panels className="mt-2">
								{Object.values(tabs).map((component, idx) => (
									<Tab.Panel key={idx} className="rounded-xl bg-white py-4">
										<div>{component}</div>
									</Tab.Panel>
								))}
							</Tab.Panels>
						</Tab.Group>
					</div>
					{/* <div className="mx-auto w-full max-w-7xl rounded bg-white p-4 shadow-xl sm:p-6 lg:p-8"> */}
				</>
			)}
		</div>
	);
};

Race.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Race;
