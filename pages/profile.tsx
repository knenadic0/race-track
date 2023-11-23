import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { app, firestore } from '../services/firebase';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { NextPageWithLayout } from './_app';
import { ReactElement, useState, useEffect } from 'react';
import Layout from '../components/layout';
import { Puff } from 'react-loader-spinner';
import { FiSave, FiLogOut } from 'react-icons/fi';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import IUser from '../types/IUser';
import { waveColor } from '../helpers/constants';

const Profile: NextPageWithLayout = () => {
	const auth = getAuth(app);
	const [user] = useAuthState(auth);
	const router = useRouter();

	const [userData, setUserData] = useState<IUser>({
		fullName: '',
		birthDate: '',
		gender: '',
	});

	const logOut = () => {
		auth.signOut();
		Cookies.remove('user');
		router.push('/login');
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setUserData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	useEffect(() => {
		if (user) {
			const userDocRef = doc(firestore, 'users', user.uid);
			getDoc(userDocRef)
				.then((docSnapshot) => {
					if (docSnapshot.exists()) {
						const data = docSnapshot.data();
						setUserData({
							fullName: data.fullName,
							birthDate: data.birthDate,
							gender: data.gender,
						});
					} else {
						setUserData((prevData) => ({
							...prevData,
							fullName: user.displayName! ? user.displayName : '',
						}));
					}
				})
				.catch((error) => {
					console.error('Error fetching user data: ', error);
				});
		}
	}, [user]);

	const saveChanges = async (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();

		if (user) {
			const userDocRef = doc(firestore, 'users', user.uid);
			toast.promise(setDoc(userDocRef, userData, { merge: true }), {
				loading: 'Saving changes...',
				success: 'Changes saved.',
				error: 'An error occurred.',
			});
		}
	};

	return (
		<div className="flex flex-col items-center justify-center py-2">
			<Head>
				<title>Profile | RaceTrack</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="mt-16 flex flex-1 flex-col items-center justify-center px-5 text-center">
				{!user || userData.fullName === '' ? (
					<div className="absolute top-1/3">
						<Puff height="60" width="60" radius={1} color={waveColor} ariaLabel="puff-loading" visible={true} />
					</div>
				) : (
					<div className="flex flex-col rounded bg-white p-6 text-left text-lg shadow-xl md:w-128">
						<form>
							<h1 className="mt-3 mb-6 text-center text-2xl font-bold">Manage profile</h1>
							<hr />
							<div className="my-8 grid grid-cols-1 sm:grid-cols-3">
								<label htmlFor="fullName" className="flex items-center">
									Full Name:
								</label>
								<input
									type="text"
									id="fullName"
									name="fullName"
									value={userData.fullName}
									onChange={handleInputChange}
									className="col-span-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-rt-blue"
								/>
							</div>
							<div className="mb-8 grid grid-cols-1 sm:grid-cols-3">
								<label htmlFor="birthDate" className="flex items-center">
									Birth Date:
								</label>
								<input
									type="date"
									id="birthDate"
									name="birthDate"
									value={userData.birthDate}
									max={new Date().toISOString().split('T')[0]}
									onChange={handleInputChange}
									className="col-span-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-rt-blue"
								/>
							</div>
							<fieldset className="grid h-10 grid-cols-1 sm:grid-cols-3">
								<p className="flex items-center">Gender:</p>
								<div className="flex space-x-8">
									<div className="flex items-center gap-x-2">
										<input
											id="male"
											name="gender"
											type="radio"
											value="male"
											onChange={handleInputChange}
											checked={userData.gender === 'male'}
											className="h-4 w-4 border-gray-300 text-rt-blue focus:ring-rt-blue"
										/>
										<label htmlFor="male" className="block text-gray-900">
											Male
										</label>
									</div>
									<div className="flex items-center gap-x-2">
										<input
											id="female"
											name="gender"
											type="radio"
											value="female"
											onChange={handleInputChange}
											checked={userData.gender === 'female'}
											className="h-4 w-4 border-gray-300 text-rt-blue focus:ring-rt-blue"
										/>
										<label htmlFor="female" className="block text-gray-900">
											Female
										</label>
									</div>
								</div>
							</fieldset>
							<div className="mt-12 flex justify-center gap-x-2 sm:gap-x-5">
								<button
									onClick={saveChanges}
									className="flex w-max items-center gap-x-3 rounded bg-blue-500 py-2 pl-5 pr-6 text-sm text-white hover:bg-blue-600 focus:outline-none sm:text-base"
								>
									<FiSave />
									<span>Save</span>
								</button>
								<button
									onClick={logOut}
									className="flex w-max items-center gap-x-3 rounded-md bg-red-500 py-2 pl-5 pr-6 text-sm text-white hover:bg-red-600 sm:text-base"
								>
									<FiLogOut />
									<span>Sign out</span>
								</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
};

Profile.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Profile;
