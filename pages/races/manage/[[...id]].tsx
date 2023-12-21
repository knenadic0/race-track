import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../../_app';
import { ReactElement, useState, useEffect } from 'react';
import { getDoc, doc, getDocs, collection, query, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { FiSave, FiTrash2 } from 'react-icons/fi';
import { app, firestore } from '@adapters/firebase';
import { Race } from '@datatypes/Race';
import Layout from '@components/Layout';
import Error from '@components/Error';
import Loader from '@components/Loader';
import Button, { ButtonColor } from '@components/Button';
import RichTextEditor from '@components/RichTextEditor';

const ManageRace: NextPageWithLayout = () => {
	getAuth(app);
	const router = useRouter();
	const [raceData, setRaceData] = useState<Race>();
	const [notFound, setNotFound] = useState<boolean>(false);
	const [isNew, setIsNew] = useState<boolean>(true);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		setIsNew(!router.query['id']);

		const fetchData = async () => {
			if (router.query['id']) {
				const raceDoc = doc(firestore, 'races', router.query['id'].toString());
				const docSnapshot = await getDoc(raceDoc);

				if (docSnapshot.exists()) {
					const raceDisciplinesSnapshot = await getDocs(
						query(collection(docSnapshot.ref, 'disciplines'), orderBy('length', 'asc')),
					);
					const data = docSnapshot.data();
					setRaceData({
						id: router.query['id']!.toString(),
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
					console.error('No race found with given id: ', router.query['id']);
					setNotFound(true);
				}
			}
		};

		if (!raceData) {
			fetchData();
		}
	}, [router.isReady]);

	return (
		<div className="main-container">
			{!raceData && !notFound && !isNew && <Loader />}
			{notFound && (
				<Error
					title="Race not found"
					message="Sorry, we couldn’t find the race you’re looking for."
					redirectTitle="Races"
					redirectUrl="/races"
				/>
			)}
			{!notFound && router.isReady && (isNew || (!isNew && raceData)) && (
				<>
					<div className="card card-big">
						<h1 className="text-xl font-bold">{isNew ? 'Add race' : `Edit ${raceData!.title}`}</h1>
					</div>
					<div className="card card-big items-center">
						<form className="w-full">
							<div className="input-container input-container-wide mb-8">
								<div className="label-container">
									<label htmlFor="title">Title:</label>
								</div>
								<input
									type="text"
									id="title"
									{...register('title', { required: true, maxLength: 100 })}
									// value={userData.fullName}
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
									// value={userData.birthDate}
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
					</div>
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
