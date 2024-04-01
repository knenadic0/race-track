import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { app } from '@adapters/firebase';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { NextPageWithLayout } from './_app';
import { ReactElement, useState, useEffect } from 'react';
import Layout from '@components/Layout';
import { FiSave, FiLogOut } from 'react-icons/fi';
import { User, userFormFields } from '@datatypes/User';
import Loader, { LoaderContainer } from '@components/Loader';
import Button, { ButtonColor } from '@components/Button';
import { useGetUser, useSetUser } from '@adapters/firestore';
import Card from '@components/Card';
import { loginRoute } from '@constants/routes';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import FormErrorMessage from '@components/FormErrorMessage';
import { toastPromise } from '@helpers/toast';
import { DocumentData } from '@tatsuokaniwa/swr-firestore';

const Profile: NextPageWithLayout = () => {
	const auth = getAuth(app);
	const [user] = useAuthState(auth);
	const router = useRouter();
	const [userData, setUserData] = useState<DocumentData<User>>();
	const {
		register,
		setValue,
		handleSubmit,
		trigger,
		formState: { errors },
	} = useForm<User>();

	const logOut = async () => {
		await auth.signOut();
		Cookies.remove('user');
		router.push(loginRoute);
	};

	const { userInfo, error } = useGetUser(user?.uid);

	useEffect(() => {
		if (!userData && userInfo && !error) {
			setUserData(userInfo);
			setValue('fullName', userInfo.fullName);
			setValue('birthDate', userInfo.birthDate);
			setValue('gender', userInfo.gender);
			trigger();
		}
	}, [userInfo, error]);

	useEffect(() => {
		if (user && !userData) {
			setValue('fullName', user.displayName || '');
		}
	}, [user]);

	const onFormSubmit = async (formData: User) => {
		if (user) {
			await toastPromise(useSetUser(user.uid, formData), {
				loading: 'Updating profile...',
				success: 'Profile updated.',
				error: 'An error occurred.',
			});
		}
	};

	return (
		<div className="main-container">
			<div className="flex w-full flex-1 flex-col items-center justify-center px-5 text-center sm:my-8 sm:w-auto">
				{!userInfo && !error && !user ? (
					<Loader container={LoaderContainer.Page} />
				) : (
					<Card size="small" className="w-full p-6 text-left text-lg sm:w-auto">
						<form className="w-full sm:w-auto">
							<h1 className="mt-3 mb-6 text-center text-2xl font-bold">Manage profile</h1>
							<hr />
							<div className="input-container my-8">
								<div className="label-container">
									<label htmlFor="fullName">Full Name:</label>
								</div>
								<input
									type="text"
									id="fullName"
									{...register('fullName', {
										required: 'Name is required.',
										maxLength: { value: 100, message: 'Maximum name length is 100.' },
									})}
									className="rt-input"
								/>
							</div>
							<div className="input-container my-8">
								<div className="label-container">
									<label htmlFor="email">Email:</label>
								</div>
								<input
									type="text"
									id="email"
									name="email"
									value={user?.email || undefined}
									disabled
									readOnly
									className="rt-input text-rt-dark-gray"
								/>
							</div>
							<div className="input-container mb-8">
								<div className="label-container">
									<label htmlFor="birthDate">Birth Date:</label>
								</div>
								<input
									type="date"
									id="birthDate"
									{...register('birthDate', {
										required: 'Birth date is required.',
										max: {
											value: new Date().toISOString().split('T')[0],
											message: 'Birth date cannot be in future.',
										},
									})}
									max={new Date().toISOString().split('T')[0]}
									className="rt-input"
								/>
							</div>
							<fieldset className="input-container h-10">
								<div className="label-container">Gender:</div>
								<div className="flex space-x-8">
									<div className="flex items-center gap-x-2">
										<input
											id="male"
											type="radio"
											{...register('gender', {
												required: 'Gender is requied.',
											})}
											value="male"
											className="h-4 w-4 border-rt-gray text-rt-blue focus:ring-rt-blue"
										/>
										<label htmlFor="male" className="block">
											Male
										</label>
									</div>
									<div className="flex items-center gap-x-2">
										<input
											id="female"
											type="radio"
											value="female"
											{...register('gender', {
												required: 'Gender is requied.',
											})}
											className="w-4border-rt-gray h-4 text-rt-blue focus:ring-rt-blue"
										/>
										<label htmlFor="female" className="block">
											Female
										</label>
									</div>
								</div>
							</fieldset>
							<div className="input-container mt-8">
								{userFormFields.map((field) => (
									<ErrorMessage
										errors={errors}
										name={field as keyof User}
										key={field}
										render={({ message }) => (
											<FormErrorMessage message={message} className="sm:col-span-2 sm:col-start-2" />
										)}
									/>
								))}
							</div>
							<div className="mt-8 flex justify-center gap-x-2 sm:gap-x-5">
								<Button onClick={handleSubmit(onFormSubmit)} color={ButtonColor.Blue} text="Save">
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

Profile.getLayout = (page: ReactElement) => {
	const metaData = {
		title: 'Profile',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default Profile;
