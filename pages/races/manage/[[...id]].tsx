import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../../_app';
import { ReactElement, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { FiSave, FiTrash2 } from 'react-icons/fi';
import { app } from '@adapters/firebase';
import { Race } from '@datatypes/Race';
import Layout from '@components/Layout';
import Error from '@components/Error';
import Loader, { LoaderContainer } from '@components/Loader';
import Button, { ButtonColor } from '@components/Button';
import RichTextEditor from '@components/RichTextEditor';
import { useGetRace } from '@adapters/firestore';
import Card from '@components/Card';

const ManageRace: NextPageWithLayout = () => {
	getAuth(app);
	const router = useRouter();
	const [raceData, setRaceData] = useState<Race | undefined>();
	const isNew = !router.query['id'];
	const {
		register,
		// handleSubmit,
		// formState: { errors },
	} = useForm();

	const { raceData: race, error: notFound, isLoading } = useGetRace(router.query['id']);
	useEffect(() => {
		setRaceData(race);
	}, [race]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setRaceData((prevState) => {
			if (!prevState) {
				return { [name]: value } as unknown as Race;
			}

			return {
				...prevState,
				[name]: value,
			};
		});
	};

	return (
		<div className="main-container">
			{isLoading && <Loader container={LoaderContainer.Page} />}
			{!isNew && notFound && (
				<Error
					title="Race not found"
					message="Sorry, we couldn’t find the race you’re looking for."
					redirectTitle="Races"
					redirectUrl="/races"
				/>
			)}
			{!notFound && !isLoading && (
				<>
					<Card size="big" className="justify-between lg:px-8 lg:py-7">
						<h1 className="flex h-10 items-center text-xl font-bold">{isNew ? 'Add race' : `Edit ${raceData?.title}`}</h1>
					</Card>
					<Card size="big" className="items-center">
						<form className="w-full">
							<div className="input-container input-container-wide mb-8">
								<div className="label-container">
									<label htmlFor="title">Title:</label>
								</div>
								<input
									type="text"
									id="title"
									{...register('title', { required: true, maxLength: 100 })}
									// value={raceData?.title}
									// onChange={handleInputChange}
									className="rt-input md:w-96"
								/>
							</div>
							<div className="input-container input-container-wide mb-8">
								<div className="label-container">
									<label htmlFor="dateTime">Starting date & time:</label>
								</div>
								<input
									type="datetime-local"
									id="dateTime"
									{...register('dateTime', { required: true })}
									// value={raceData?.dateTime.toDate().toISOString()}
									// onChange={handleInputChange}
									className="rt-input md:w-96"
								/>
							</div>
							<div className="input-container input-container-wide mb-8">
								<div className="label-container">
									<label htmlFor="applyUntil">Applies open until:</label>
								</div>
								<input
									type="datetime-local"
									id="applyUntil"
									// value={userData.birthDate}
									// onChange={handleInputChange}
									{...register('applyUntil', { required: true })}
									className="rt-input md:w-96"
								/>
							</div>
							<div className="input-container input-container-wide">
								<div className="flex items-start pt-3 md:justify-end">
									<label htmlFor="description">Description:</label>
								</div>
								<RichTextEditor className="rt-input quill" />
							</div>
							<div className="mt-12 flex justify-center gap-x-2 sm:gap-x-5">
								<Button onClick={() => 0} text="Save" color={ButtonColor.Blue}>
									<FiSave />
								</Button>
								{!isNew && (
									<Button onClick={() => 0} text="Delete race" color={ButtonColor.Red}>
										<FiTrash2 />
									</Button>
								)}
							</div>
						</form>
					</Card>
				</>
			)}
		</div>
	);
};

ManageRace.getLayout = function getLayout(page: ReactElement) {
	const metaData = {
		title: 'Manage race',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default ManageRace;
