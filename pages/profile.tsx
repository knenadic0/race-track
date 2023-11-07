import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { app } from "../services/firebase";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { NextPageWithLayout } from "./_app";
import { ReactElement, useState } from "react";
import Layout from "../components/layout";
import { Puff } from "react-loader-spinner";
import tailwindTheme from "../services/tailwind";
import { FiSave, FiLogOut } from "react-icons/fi";

const Profile: NextPageWithLayout = () => {
	const auth = getAuth(app);
	const [user] = useAuthState(auth);
	const router = useRouter();

	const waveColor = tailwindTheme.theme?.colors
		? tailwindTheme.theme?.colors["rt-blue"].toString()
		: "#4fa94d";

	const [userData, setUserData] = useState({
		displayName: "",
		birthDate: "",
		gender: "",
	});

	const logOut = () => {
		auth.signOut();
		Cookies.remove("user");
		router.push("/login");
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setUserData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const saveChanges = () => {};

	return (
		<div className="flex  flex-col items-center justify-center py-2">
			<Head>
				<title>RaceTrack</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="mt-16 flex flex-1 flex-col items-center justify-center px-5 text-center">
				{!user ? (
					<div>
						<Puff
							height="60"
							width="60"
							radius={1}
							color={waveColor}
							ariaLabel="puff-loading"
							wrapperStyle={{}}
							wrapperClass=""
							visible={true}
						/>
					</div>
				) : (
					<div className="flex w-128 flex-col rounded bg-white p-6 text-left text-lg shadow-xl">
						<form>
							<h1 className="mt-3 mb-5 text-center text-3xl font-bold">
								Manage profile
							</h1>
							<hr />
							<div className="my-6 grid grid-cols-3">
								<label
									htmlFor="gender"
									className="flex items-center font-semibold"
								>
									Display Name:
								</label>
								<input
									type="text"
									id="gender"
									name="gender"
									// value={userData.displayName}
									// onChange={handleInputChange}
									className="col-span-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-rt-blue"
								/>
							</div>
							<div className="mb-4 grid grid-cols-3">
								<label
									htmlFor="birthDate"
									className="flex items-center font-semibold"
								>
									Birth Date:
								</label>
								<input
									type="date"
									id="birthDate"
									name="birthDate"
									// value={userData.birthDate}
									// onChange={handleInputChange}
									className="col-span-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-rt-blue"
								/>
							</div>
							<fieldset className="mb-4 grid h-10 grid-cols-3">
								<p className="flex items-center font-semibold">
									Gender:
								</p>
								<div className="flex space-x-8">
									<div className="flex items-center gap-x-2">
										<input
											id="male"
											name="gender"
											type="radio"
											className="h-4 w-4 border-gray-300 text-rt-blue focus:ring-rt-blue"
										/>
										<label
											htmlFor="male"
											className="block text-gray-900"
										>
											Male
										</label>
									</div>
									<div className="flex items-center gap-x-2">
										<input
											id="female"
											name="gender"
											type="radio"
											className="h-4 w-4 border-gray-300 text-rt-blue focus:ring-rt-blue"
										/>
										<label
											htmlFor="female"
											className="block text-gray-900"
										>
											Female
										</label>
									</div>
								</div>
							</fieldset>
							<div className="mt-10 flex justify-center gap-x-5">
								<button
									onClick={saveChanges}
									className="flex w-max items-center gap-x-3 rounded bg-blue-500 py-2 pl-5 pr-6 text-white hover:bg-blue-600 focus:outline-none"
								>
									<FiSave />
									<span>Save</span>
								</button>
								<button
									onClick={logOut}
									className="flex w-max items-center gap-x-3 rounded-md bg-red-500 py-2 pl-5 pr-6 text-white hover:bg-red-600"
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