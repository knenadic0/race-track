import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { app } from '../services/firebase';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';
import Layout from '../components/layout';

const Home: NextPageWithLayout = () => {
	const auth = getAuth(app);
	const [user] = useAuthState(auth);
	const router = useRouter();

	const logOut = () => {
		auth.signOut();
		Cookies.remove('user');
		router.push('/login');
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center py-2">
			<Head>
				<title>RaceTrack</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="flex w-full flex-1 flex-col items-center justify-center px-5 text-center">
				<div className="flex items-center justify-center rounded bg-white shadow-lg">
					<div className="bg-race-flag bg-cover bg-bt-100 bg-no-repeat p-8 sm:w-80">
						<h1 className="mb-6 text-4xl font-bold">RaceTrack</h1>
						<p>You are already logged in as {user && user.displayName}.</p>
						<button onClick={logOut} className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600">
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Home;
