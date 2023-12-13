import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';
import { ReactElement, useState, useEffect } from 'react';
import { getDoc, doc, getDocs, collection, query, orderBy } from 'firebase/firestore';
import { app, firestore } from '@adapters/firebase';
import Layout from '@components/Layout';
import { getAuth } from 'firebase/auth';
import { Race } from '@datatypes/Race';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import Info from '@components/Info';
import Error from '@components/Error';
import Loader from '@components/Loader';

const Race: NextPageWithLayout = () => {
	getAuth(app);
	const router = useRouter();
	const [raceData, setRaceData] = useState<Race>();
	const [error, setError] = useState<boolean>(false);
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
					setError(true);
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
			{!raceData && !error && <Loader />}
			{error && (
				<Error
					title="Race not found"
					statusMessage="Not found"
					message="Sorry, we couldn’t find the race you’re looking for."
					redirectTitle="Races"
					redirectUrl="/races"
				/>
			)}
			{raceData && !error && (
				<>
					<div className="mx-auto mb-5 w-full max-w-7xl rounded bg-rt-white p-4 shadow-xl sm:p-6 lg:p-8">
						<h1 className="text-xl font-bold">{raceData.title}</h1>
					</div>
					<div className="mx-auto w-full max-w-7xl rounded bg-rt-white p-4 shadow-xl sm:p-6 sm:pt-4 lg:p-8 lg:pt-4">
						<Tab.Group>
							<Tab.List className="flex space-x-3 border-b-2 border-rt-light-gray text-center font-medium">
								{Object.keys(tabs).map((category) => (
									<Tab
										key={category}
										className={({ selected }) =>
											classNames(
												'focus-visible:outline-slate-300 -mb-px inline-block border-b-3 px-3 py-3',
												selected ? 'border-rt-blue' : 'border-transparent hover:border-rt-gray',
											)
										}
									>
										{category}
									</Tab>
								))}
							</Tab.List>
							<Tab.Panels className="mt-2">
								{Object.values(tabs).map((component, idx) => (
									<Tab.Panel key={idx} className="rounded-xl bg-rt-white py-4">
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
