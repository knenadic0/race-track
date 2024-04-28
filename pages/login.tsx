import { FaGoogle } from 'react-icons/fa';
import { NextPageWithLayout } from './_app';
import Metatags from '@components/Metatags';
import Card from '@components/Card';
import { AuthProvider, useAuth } from '@contexts/auth';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

const Login: NextPageWithLayout = () => {
	const { login, user } = useAuth();
	const router = useRouter();

	if (user) {
		router.replace('/');
	}

	return (
		<>
			<Metatags title="Login" />
			<div className="main-container min-h-screen">
				<div className="flex w-full flex-1 flex-col items-center justify-center px-5 text-center">
					<Card size="small" className="items-center justify-center md:w-min">
						<div className="bg-race-flag bg-cover bg-bt-100 bg-no-repeat px-4 py-6 sm:w-80 sm:p-8">
							<h1 className="mb-6 text-2xl font-bold sm:text-3xl">RaceTrack</h1>
							<button
								onClick={login}
								className="mx-auto flex items-center gap-x-3 rounded-md bg-rt-blue px-4 py-2 text-rt-white hover:bg-rt-dark-blue"
							>
								<FaGoogle />
								<span className="border-l-2 pl-3">Sign in with Google</span>
							</button>
						</div>
					</Card>
				</div>
			</div>
		</>
	);
};

Login.getLayout = (page: ReactElement) => {
	return <AuthProvider>{page}</AuthProvider>;
};

export default Login;
