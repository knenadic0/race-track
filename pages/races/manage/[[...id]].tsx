import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../../_app';
import { ReactElement, useState, useEffect, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { FiArrowLeft, FiPlusCircle, FiSave, FiTrash2, FiXCircle } from 'react-icons/fi';
import { app } from '@adapters/firebase';
import { Race, RaceForm, raceFormFields } from '@datatypes/Race';
import Layout from '@components/Layout';
import Error from '@components/Error';
import Loader, { LoaderContainer } from '@components/Loader';
import Button, { ButtonColor } from '@components/Button';
import RichTextEditor from '@components/RichTextEditor';
import { useAddRace, useGetDisciplines, useGetRace, useRemoveRace, useUpdateRace } from '@adapters/firestore';
import Card from '@components/Card';
import FormErrorMessage from '@components/FormErrorMessage';
import { racesRoute } from '@constants/routes';
import toast from 'react-hot-toast';
import { wait } from '@helpers/wait';
import ConfirmModal from '@components/ConfirmModal';
import { toastPromise } from '@helpers/toast';
import Tooltip from '@components/Tooltip';

const now = new Date(Date.now());
const minStartDate = new Date(now.setDate(now.getDate() + 7)).toISOString().substring(0, 16);

const ManageRace: NextPageWithLayout = () => {
	const auth = getAuth(app);
	const router = useRouter();
	const [raceData, setRaceData] = useState<Race>();
	const selectedDisciplineRef = useRef<number>();
	const areDisciplinesSetRef = useRef<boolean>(false);
	const isNew = !router.query['id'];
	const {
		register,
		setValue,
		handleSubmit,
		trigger,
		control,
		formState: { errors },
	} = useForm<RaceForm>({ defaultValues: { disciplines: [{ title: '', length: undefined, id: undefined }] } });
	const {
		fields: disciplines,
		append,
		remove,
	} = useFieldArray({
		control,
		name: 'disciplines',
		rules: {
			maxLength: { value: 5, message: 'Maximum of five disciplines is allowed per race.' },
			required: 'At least one discipline is required for a race.',
		},
	});

	const { raceData: race, error: notFound, isLoading } = useGetRace(router.query['id']);
	const { disciplines: disciplinesData } = useGetDisciplines(router.query['id']);

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

	useEffect(() => {
		if (disciplinesData && !areDisciplinesSetRef.current) {
			areDisciplinesSetRef.current = true;
			disciplinesData.forEach((discipline, index) => {
				if (index > 0) {
					disciplines.push({ title: '', length: undefined, id: index.toString() });
				}
				setValue(`disciplines.${index}.title`, discipline.title);
				setValue(`disciplines.${index}.length`, discipline.length);
				setValue(`disciplines.${index}.id`, discipline.id);
			});
		}
	}, [disciplinesData]);

	const onFormSubmit = async (formData: RaceForm) => {
		if (raceData) {
			await toastPromise(useUpdateRace(raceData.id, formData), {
				loading: 'Saving changes...',
				success: 'Race updated.',
				error: 'An error occurred.',
			});
			toast('You will be redirected back to race', {
				duration: 4000,
			});
			await wait(4000);
			router.push(`${racesRoute}/${raceData.id}`);
		} else if (auth.currentUser) {
			await toastPromise(useAddRace(formData, auth.currentUser.uid), {
				loading: 'Saving race...',
				success: 'Race added.',
				error: 'An error occurred.',
			});
			toast('You will be redirected back to races', {
				duration: 4000,
			});
			await wait(4000);
			router.push(racesRoute);
		}
	};

	const deleteRace = async () => {
		if (raceData) {
			await toastPromise(useRemoveRace(raceData.id), {
				loading: 'Canceling race...',
				success: 'Race cancelled.',
				error: 'An error occurred.',
			});
			router.push(racesRoute);
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
			{(!notFound || isNew) && (
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
						{!isNew && isLoading && <Loader container={LoaderContainer.Component} />}
						{(!isLoading || isNew) && (
							<form className="w-full">
								<div className="input-container input-container-wide mb-8">
									<div className="label-container">
										<label htmlFor="title">Title:</label>
									</div>
									<input
										type="text"
										id="title"
										{...register('title', {
											required: 'Title is required.',
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
											required: 'Starting date is required.',
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
											required: 'Applies open until date is required.',
											min: { value: minStartDate, message: 'Applies open until date cannot be sooner than 7 days.' },
											validate: (value, formValues) =>
												value >= formValues.dateTime
													? 'Applies open until date cannot be after starting date & time.'
													: true,
										})}
										className="rt-input md:w-96"
									/>
								</div>
								<div className="input-container input-container-wide mb-8">
									<div className="flex items-start pt-2 sm:justify-start md:justify-end">
										<label htmlFor="disciplines">Disciplines:</label>
									</div>
									<div className="col-span-2">
										<ul className="mb-2 flex flex-col gap-3">
											{disciplines.map((discipline, index) => (
												<li
													key={discipline.id}
													className="flex flex-col justify-start gap-x-3 gap-y-1 last:mb-1 sm:flex-row"
												>
													<input
														{...register(`disciplines.${index}.title` as const, {
															required: 'Discipline title is required.',
															maxLength: { value: 100, message: 'Maximum title length is 100.' },
															minLength: { value: 5, message: 'Minimum title length is 5.' },
														})}
														className="rt-input md:w-96"
														placeholder="Discipline title"
													/>
													<input
														{...register(`disciplines.${index}.length` as const, {
															required: 'Discipline length is required.',
															valueAsNumber: true,
															min: { value: 0, message: 'Discipline length cannot be less than 0.' },
															max: {
																value: 100,
																message: 'Discipline length cannot be greater than 100.',
															},
														})}
														className="rt-input md:w-96"
														placeholder="Discipline length (km)"
														step={0.1}
														type="number"
													/>
													<Tooltip content="Remove discipline" placement="left" delayed>
														<div className="flex h-full">
															<ConfirmModal
																onConfirm={() => remove(selectedDisciplineRef.current)}
																text="Are you sure you want to delete this discipline?"
																type="warning"
																buttonProps={{
																	type: 'button',
																	onClick: () => (selectedDisciplineRef.current = index),
																	className: 'text-rt-red hover:text-rt-dark-red',
																	children: <FiXCircle className="h-6 w-6" />,
																}}
															/>
														</div>
													</Tooltip>
												</li>
											))}
										</ul>
										<Tooltip content="Add discipline" placement="right" delayed>
											<div className="flex h-full">
												<button
													type="button"
													onClick={() => append({ title: '', length: undefined })}
													className="text-rt-blue hover:text-rt-dark-blue"
												>
													<FiPlusCircle className="h-6 w-6" />
												</button>
											</div>
										</Tooltip>
									</div>
								</div>
								<div className="input-container input-container-wide">
									<div className="flex items-start pt-3 md:justify-end">
										<label htmlFor="description">Description:</label>
									</div>
									<Controller
										name="description"
										control={control}
										rules={{
											required: 'Description is required.',
											minLength: { value: 5, message: 'Minimum description length is 5.' },
										}}
										defaultValue={raceData?.description || ''}
										render={({ field: { onChange, value } }) => (
											<RichTextEditor value={value} onChange={onChange} className="rt-input quill" />
										)}
									/>
								</div>
								<div className="input-container input-container-wide mt-8">
									{raceFormFields.map((field) => (
										<ErrorMessage
											errors={errors}
											name={field as keyof RaceForm}
											key={field}
											render={({ message }) => (
												<FormErrorMessage message={message} className="md:col-span-2 md:col-start-2" />
											)}
										/>
									))}
								</div>
								<div className="mt-8 flex justify-center gap-x-2 sm:gap-x-5">
									<Button onClick={handleSubmit(onFormSubmit)} text="Save" color={ButtonColor.Blue}>
										<FiSave />
									</Button>
									{!isNew && (
										<ConfirmModal
											onConfirm={deleteRace}
											text="Are you sure you want to cancel and delete this race?"
											type="warning"
											buttonComponentProps={{ text: 'Cancel race', color: ButtonColor.Red, children: <FiTrash2 /> }}
										/>
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

ManageRace.getLayout = (page: ReactElement) => {
	const metaData = {
		title: 'Manage race',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default ManageRace;
