import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { app, firestore } from '@adapters/firebase';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { NextPageWithLayout } from './_app';
import { ReactElement, useState, useEffect } from 'react';
import Layout from '@components/Layout';
import { FiSave, FiLogOut } from 'react-icons/fi';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { User } from '@datatypes/User';
import Loader from '@components/Loader';
import Button, { ButtonColor } from '@components/Button';

const Profile: NextPageWithLayout = () => {
	const auth = getAuth(app);
	const [user] = useAuthState(auth);
	const router = useRouter();

	const [userData, setUserData] = useState<User>({
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
		<div className="main-container">
			<div className="flex flex-1 flex-col items-center justify-center px-5 text-center sm:my-8">
				{!user || userData.fullName === '' ? (
					<Loader />
				) : (
					<div className="card card-small p-6 text-left text-lg ">
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
									className="col-span-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-rt-gray focus:ring-2 focus:ring-inset focus:ring-rt-blue"
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
									className="col-span-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-rt-gray focus:ring-2 focus:ring-inset focus:ring-rt-blue"
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
											className="h-4 w-4 border-rt-gray text-rt-blue focus:ring-rt-blue"
										/>
										<label htmlFor="male" className="block">
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
											className="w-4border-rt-gray h-4 text-rt-blue focus:ring-rt-blue"
										/>
										<label htmlFor="female" className="block">
											Female
										</label>
									</div>
								</div>
							</fieldset>
							<div className="mt-12 flex justify-center gap-x-2 sm:gap-x-5">
								<Button onClick={saveChanges} color={ButtonColor.Blue} text="Save">
									<FiSave />
								</Button>
								<Button onClick={logOut} color={ButtonColor.Red} text="Sign out">
									<FiLogOut />
								</Button>
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
};

Profile.getLayout = function getLayout(page: ReactElement) {
	const metaData = {
		title: 'Profile',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default Profile;
