import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../../_app';
import { ReactElement, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { FiArrowLeft, FiSave, FiTrash2 } from 'react-icons/fi';
import { app } from '@adapters/firebase';
import { Race, RaceForm, raceFormFields } from '@datatypes/Race';
import Layout from '@components/Layout';
import Error from '@components/Error';
import Loader, { LoaderContainer } from '@components/Loader';
import Button, { ButtonColor } from '@components/Button';
import RichTextEditor from '@components/RichTextEditor';
import { useGetRace, useSetRace } from '@adapters/firestore';
import Card from '@components/Card';
import FormErrorMessage from '@components/FormErrorMessage';
import { racesRoute } from '@constants/routes';
import toast from 'react-hot-toast';
import { Tooltip } from 'flowbite-react';
import { wait } from '@helpers/wait';

const now = new Date(Date.now());
const minStartDate = new Date(now.setDate(now.getDate() + 7)).toISOString().substring(0, 16);
const errorMessageClass = 'col-span-2 col-start-2';

const ManageRace: NextPageWithLayout = () => {
	getAuth(app);
	const router = useRouter();
	const [raceData, setRaceData] = useState<Race>();
	const isNew = !router.query['id'];
	const {
		register,
		setValue,
		handleSubmit,
		trigger,
		formState: { errors, isValid },
	} = useForm<RaceForm>();

	const { raceData: race, error: notFound, isLoading } = useGetRace(router.query['id']);
	useEffect(() => {
		if (!raceData) {
			setRaceData(race);
			if (race) {
				setValue('title', race.title);
				setValue('dateTime', race.dateTime.toISOString().substring(0, 16));
				setValue('applyUntil', race.applyUntil.toISOString().substring(0, 16));
				setValue('description', race.description);
				trigger();
			}
		}
	}, [race]);

	const onFormSubmit = async (formData: RaceForm) => {
		if (raceData) {
			toast
				.promise(
					useSetRace(raceData.id, formData),
					{
						loading: 'Saving changes...',
						success: 'Race updated.',
						error: 'An error occurred.',
					},
					{
						success: {
							duration: 4000,
						},
						error: {
							duration: 4000,
						},
					},
				)
				.then(async function () {
					await wait(4000);
					router.push(`${racesRoute}/${raceData.id}`);
				});
		}
	};

	const handleRichTextValueChange = (value: string) => {
		setValue('description', value);
		if (raceData) {
			raceData.description = value;
		}
	};

	return (
		<div className="main-container">
			{!isNew && notFound && (
				<Error
					title="Race not found"
					message="Sorry, we couldn’t find the race you’re looking for."
					redirectTitle="Races"
					redirectUrl={racesRoute}
				/>
			)}
			{!notFound && (
				<>
					<Card size="big" className="justify-between lg:px-8 lg:py-7">
						<h1 className="flex h-10 items-center text-xl font-bold">
							{isNew ? 'Add race' : `Edit ${raceData ? raceData.title : ''}`}
						</h1>
						<Tooltip content="Discarding changes">
							{!isNew ? (
								<Button color={ButtonColor.Blue} href={`${racesRoute}/${raceData?.id}`} text="Back to race">
									<FiArrowLeft />
								</Button>
							) : (
								<Button color={ButtonColor.Blue} href={racesRoute} text="Back to races">
									<FiArrowLeft />
								</Button>
							)}
						</Tooltip>
					</Card>
					<Card size="big" className="items-center">
						{isLoading && <Loader container={LoaderContainer.Component} />}
						{!isLoading && (
							<form className="w-full">
								<div className="input-container input-container-wide mb-8">
									<div className="label-container">
										<label htmlFor="title">Title:</label>
									</div>
									<input
										type="text"
										id="title"
										{...register('title', {
											required: true,
											maxLength: { value: 100, message: 'Maximum title length is 100.' },
											minLength: { value: 5, message: 'Minimum title length is 5.' },
										})}
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
										min={minStartDate}
										{...register('dateTime', {
											required: true,
											min: { value: minStartDate, message: 'Starting date cannot be sooner than 7 days.' },
										})}
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
										min={minStartDate}
										{...register('applyUntil', {
											required: true,
											min: { value: minStartDate, message: 'Applies open until cannot be sooner than 7 days.' },
										})}
										className="rt-input md:w-96"
									/>
								</div>
								<div className="input-container input-container-wide">
									<div className="flex items-start pt-3 md:justify-end">
										<label htmlFor="description">Description:</label>
									</div>
									<RichTextEditor
										{...register('description', { required: true })}
										value={raceData?.description || ''}
										className="rt-input quill"
										onChange={(value: string) => handleRichTextValueChange(value)}
									/>
								</div>
								{!isValid && (
									<div className="input-container input-container-wide mt-8">
										{raceFormFields.map((field) => (
											<ErrorMessage
												errors={errors}
												name={field as keyof RaceForm}
												key={field}
												render={({ message }) => (
													<FormErrorMessage message={message} className={errorMessageClass} />
												)}
											/>
										))}
									</div>
								)}
								<div className="mt-12 flex justify-center gap-x-2 sm:gap-x-5">
									<Button onClick={handleSubmit(onFormSubmit)} text="Save" color={ButtonColor.Blue}>
										<FiSave />
									</Button>
									{!isNew && (
										<Button onClick={() => 0} text="Delete race" color={ButtonColor.Red}>
											<FiTrash2 />
										</Button>
									)}
								</div>
							</form>
						)}
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
