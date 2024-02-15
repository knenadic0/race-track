import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '@adapters/firebase';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { FaGoogle } from 'react-icons/fa';
import { NextPageWithLayout } from './_app';
import Metatags from '@components/Metatags';
import Card from '@components/Card';

const Login: NextPageWithLayout = () => {
	const provider = new GoogleAuthProvider();
	const auth = getAuth(app);
	const router = useRouter();

	const signInWithGoogle = () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				if (credential) {
					Cookies.set('user', JSON.stringify(credential));
					router.push('/');
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<>
			<Metatags title="Login" />
			<div className="main-container min-h-screen">
				<div className="flex w-full flex-1 flex-col items-center justify-center px-5 text-center">
					<Card size="small" className="items-center justify-center md:w-min">
						<div className="bg-race-flag bg-cover bg-bt-100 bg-no-repeat px-4 py-6 sm:w-80 sm:p-8">
							<h1 className="mb-6 text-2xl font-bold sm:text-3xl">RaceTrack</h1>
							<button
								onClick={signInWithGoogle}
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

export default Login;
