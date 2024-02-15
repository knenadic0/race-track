import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';
import { ReactElement } from 'react';
import { app } from '@adapters/firebase';
import Layout from '@components/Layout';
import { getAuth } from 'firebase/auth';
import { FiEdit } from 'react-icons/fi';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import Info from '@components/Info';
import Error from '@components/Error';
import Button, { ButtonColor } from '@components/Button';
import { useGetRace } from '@adapters/firestore';
import Card from '@components/Card';

const Race: NextPageWithLayout = () => {
	const auth = getAuth(app);
	const router = useRouter();
	const { raceData, error } = useGetRace(router.query['id']);
	const tabs = { Info: <Info raceData={raceData} />, Apply: null, Applied: null };

	return (
		<div className="main-container">
			{error && (
				<Error
					title="Race not found"
					message="Sorry, we couldn’t find the race you’re looking for."
					redirectTitle="Races"
					redirectUrl="/races"
				/>
			)}
			{!error && (
				<>
					<Card size="big" className="justify-between lg:px-8 lg:py-7">
						<h1 className="flex h-10 items-center text-xl font-bold">{raceData && raceData.title}</h1>
						{raceData &&
							raceData.createdBy.id === auth.currentUser?.uid &&
							// (new Date() <= raceData.applyUntil.toDate() && raceData.applied === 0 ? (
							(new Date() <= raceData.applyUntil.toDate() ? (
								<Button href={`/races/manage/${raceData.id}`} color={ButtonColor.Blue} text="Edit race">
									<FiEdit />
								</Button>
							) : (
								<Button color={ButtonColor.Disabled} text="Edit race">
									<FiEdit />
								</Button>
							))}
					</Card>
					<Card size="big" className="flex-col sm:pt-4 lg:pt-4">
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
					</Card>
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
