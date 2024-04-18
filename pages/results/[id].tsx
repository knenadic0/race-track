import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';
import { ReactElement } from 'react';
import Layout from '@components/Layout';
import { LuInfo, LuListOrdered } from 'react-icons/lu';
import Info from '@components/Info';
import Error from '@components/Error';
import { useGetDisciplines, useGetRaceLive } from '@adapters/firestore';
import Card from '@components/Card';
import { racesRoute } from '@constants/routes';
import UnderlineTabs, { Tab } from '@components/UnderlineTabs';
import { Tabs } from 'flowbite-react';
import Results from '@components/Results';
import { app } from '@adapters/firebase';
import { getAuth } from 'firebase/auth';

const PastRace: NextPageWithLayout = () => {
	getAuth(app);
	const router = useRouter();
	const { raceData, error } = useGetRaceLive(router.query['id']?.toString());
	const { disciplines } = useGetDisciplines(router.query['id']?.toString());
	const tabs: Tab[] = [
		{
			name: 'Info',
			icon: LuInfo,
			component: <Info raceData={raceData} disciplines={disciplines} />,
		},
		{
			name: 'Results',
			icon: LuListOrdered,
			component: (
				<Results raceData={raceData} disciplines={disciplines} selectedDiscipline={router.query['discipline']?.toString()} />
			),
			active: true,
		},
	];

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
					<Card size="big" className="items-center justify-between lg:px-8 lg:py-7">
						<h1 className="flex h-8 items-center text-xl font-bold">{raceData && raceData.title}</h1>
					</Card>
					<Card size="big" className="flex-col sm:pt-4 lg:pt-4">
						<UnderlineTabs style="underline">
							{tabs.map(({ name, icon, component, active }) => (
								<Tabs.Item title={name} icon={icon} key={name} active={active}>
									{component}
								</Tabs.Item>
							))}
						</UnderlineTabs>
					</Card>
				</>
			)}
		</div>
	);
};

PastRace.getLayout = (page: ReactElement) => {
	const metaData = {
		title: 'Results',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default PastRace;
