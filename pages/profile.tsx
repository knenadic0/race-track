import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { app } from '@adapters/firebase';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { NextPageWithLayout } from './_app';
import { ReactElement, useState, useEffect } from 'react';
import Layout from '@components/Layout';
import { FiSave, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { User } from '@datatypes/User';
import Loader, { LoaderContainer } from '@components/Loader';
import Button, { ButtonColor } from '@components/Button';
import { useGetUser, useSetUser } from '@adapters/firestore';
import Card from '@components/Card';

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

	const { userInfo, error, isLoading } = useGetUser(user?.uid);

	useEffect(() => {
		if (userInfo) {
			setUserData({
				birthDate: userInfo.birthDate,
				fullName: userInfo.fullName,
				gender: userInfo.gender,
			});
		}
		if (!userInfo && error && !isLoading) {
			setUserData((prevData) => ({
				...prevData,
				fullName: user?.displayName || '',
			}));
		}
	}, [userInfo, error, isLoading]);

	const saveChanges = async (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();

		if (user) {
			toast.promise(useSetUser(user.uid, userData), {
				loading: 'Saving changes...',
				success: 'Changes saved.',
				error: 'An error occurred.',
			});
		}
	};

	return (
		<div className="main-container">
			<div className="flex flex-1 flex-col items-center justify-center px-5 text-center sm:my-8">
				{isLoading || !user ? (
					<Loader container={LoaderContainer.Page} />
				) : (
					<Card size="small" className="p-6 text-left text-lg ">
						<form>
							<h1 className="mt-3 mb-6 text-center text-2xl font-bold">Manage profile</h1>
							<hr />
							<div className="input-container my-8">
								<div className="label-container">
									<label htmlFor="fullName">Full Name:</label>
								</div>
								<input
									type="text"
									id="fullName"
									name="fullName"
									value={userData.fullName}
									onChange={handleInputChange}
									className="rt-input"
								/>
							</div>
							<div className="input-container mb-8">
								<div className="label-container">
									<label htmlFor="birthDate">Birth Date:</label>
								</div>
								<input
									type="date"
									id="birthDate"
									name="birthDate"
									value={userData.birthDate}
									max={new Date().toISOString().split('T')[0]}
									onChange={handleInputChange}
									className="rt-input"
								/>
							</div>
							<fieldset className="input-container h-10">
								<div className="label-container">Gender:</div>
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
					</Card>
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
