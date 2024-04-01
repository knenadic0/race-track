import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';
import { ReactElement } from 'react';
import { app } from '@adapters/firebase';
import Layout from '@components/Layout';
import { getAuth } from 'firebase/auth';
import { FiEdit } from 'react-icons/fi';
import Info from '@components/Info';
import Error from '@components/Error';
import Button, { ButtonColor } from '@components/Button';
import { useGetDisciplines, useGetRaceLive } from '@adapters/firestore';
import Card from '@components/Card';
import { manageRacesRoute, racesRoute } from '@constants/routes';
import Apply from '@components/Apply';
import Tooltip from '@components/Tooltip';
import UnderlineTabs from '@components/UnderlineTabs';
import { Tabs } from 'flowbite-react';

const Race: NextPageWithLayout = () => {
	const auth = getAuth(app);
	const router = useRouter();
	const { raceData, error } = useGetRaceLive(router.query['id']);
	const { disciplines } = useGetDisciplines(router.query['id']);
	const tabs = {
		Info: <Info raceData={raceData} disciplines={disciplines} />,
		Apply: <Apply raceData={raceData} disciplines={disciplines} />,
		Applied: null,
	};

	return (
		<div className="main-container">
			{error && (
				<Error
					title="Race not found"
					message="Sorry, we couldn’t find the race you’re looking for."
					redirectTitle="Races"
					redirectUrl={racesRoute}
				/>
			)}
			{!error && (
				<>
					<Card size="big" className="justify-between lg:px-8 lg:py-7">
						<h1 className="flex h-10 items-center text-xl font-bold">{raceData && raceData.title}</h1>
						{raceData &&
							raceData.createdBy.id === auth.currentUser?.uid &&
							(new Date() <= raceData.dateTime && !raceData.applied ? (
								<Button href={`${manageRacesRoute}/${raceData.id}`} color={ButtonColor.Blue} text="Manage race">
									<FiEdit />
								</Button>
							) : (
								<Tooltip content="Race cannot be managed (Someone applied)">
									<Button color={ButtonColor.Disabled} text="Manage race">
										<FiEdit />
									</Button>
								</Tooltip>
							))}
					</Card>
					<Card size="big" className="flex-col sm:pt-4 lg:pt-4">
						<UnderlineTabs style="underline">
							{Object.entries(tabs).map(([key, value]) => (
								<Tabs.Item title={key}>{value}</Tabs.Item>
							))}
						</UnderlineTabs>
					</Card>
				</>
			)}
		</div>
	);
};

Race.getLayout = (page: ReactElement) => {
	const metaData = {
		title: 'Races',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default Race;
