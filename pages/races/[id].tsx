import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';
import { ReactElement, useState, useEffect } from 'react';
import { getDoc, doc, getDocs, collection, query, orderBy } from 'firebase/firestore';
import { app, firestore } from '@adapters/firebase';
import Layout from '@components/Layout';
import { getAuth } from 'firebase/auth';
import { Race } from '@datatypes/Race';
import { FiEdit } from 'react-icons/fi';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import Info from '@components/Info';
import Error from '@components/Error';
import Loader from '@components/Loader';
import Button, { ButtonColor } from '@components/Button';

const Race: NextPageWithLayout = () => {
	const auth = getAuth(app);
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
						createdBy: data.createdBy,
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
		<div className="main-container">
			{!raceData && !error && <Loader />}
			{error && (
				<Error
					title="Race not found"
					message="Sorry, we couldn’t find the race you’re looking for."
					redirectTitle="Races"
					redirectUrl="/races"
				/>
			)}
			{raceData && !error && (
				<>
					<div className="card card-big justify-between lg:px-8 lg:py-7">
						<h1 className="flex items-center text-xl font-bold">{raceData.title}</h1>
						{raceData.createdBy.id === auth.currentUser?.uid && (
							<Button href={`/races/manage/${raceData.id}`} color={ButtonColor.Blue} text="Edit race">
								<FiEdit />
							</Button>
						)}
					</div>
					<div className="card card-big flex-col sm:pt-4 lg:pt-4">
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
	const metaData = {
		title: 'Races',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default Race;