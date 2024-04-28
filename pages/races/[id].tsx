import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';
import { ReactElement } from 'react';
import Layout from '@components/Layout';
import { LuCheckSquare, LuPenSquare, LuInfo, LuList } from 'react-icons/lu';
import Info from '@components/Info';
import Error from '@components/Error';
import Button, { ButtonColor } from '@components/Button';
import { useGetDisciplines, useGetRaceLive } from '@adapters/firestore';
import Card from '@components/Card';
import { manageRacesRoute, racesRoute } from '@constants/routes';
import Apply from '@components/Apply';
import Tooltip from '@components/Tooltip';
import UnderlineTabs, { Tab } from '@components/UnderlineTabs';
import { Tabs } from 'flowbite-react';
import Applied from '@components/Applied';
import classNames from 'classnames';
import { useAuth } from '@contexts/auth';

const Race: NextPageWithLayout = () => {
	const { user } = useAuth();
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
			name: 'Apply',
			icon: LuCheckSquare,
			component: <Apply raceData={raceData} disciplines={disciplines} />,
		},
		{
			name: 'Applied',
			icon: LuList,
			component: <Applied raceData={raceData} disciplines={disciplines} />,
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
					<Card
						size="big"
						className={classNames('items-center justify-between lg:px-8', {
							'lg:py-7': raceData && raceData.createdBy.id === user?.uid,
							'lg:py-8': !raceData || raceData.createdBy.id !== user?.uid,
						})}
					>
						<h1 className="flex h-8 items-center text-xl font-bold">{raceData && raceData.title}</h1>
						{raceData &&
							raceData.createdBy.id === user?.uid &&
							(new Date() <= raceData.dateTime && !raceData.applied ? (
								<Button href={`${manageRacesRoute}/${raceData.id}`} color={ButtonColor.Blue} text="Manage race">
									<LuPenSquare />
								</Button>
							) : (
								<Tooltip content="Race cannot be managed (Someone applied)">
									<Button color={ButtonColor.Disabled} text="Manage race">
										<LuPenSquare />
									</Button>
								</Tooltip>
							))}
					</Card>
					<Card size="big" className="flex-col sm:pt-4 lg:pt-4">
						<UnderlineTabs style="underline">
							{tabs.map(({ name, icon, component }) => (
								<Tabs.Item title={name} icon={icon} key={name}>
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

Race.getLayout = (page: ReactElement) => {
	const metaData = {
		title: 'Races',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default Race;
