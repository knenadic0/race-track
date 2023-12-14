import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '@adapters/firebase';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { FaGoogle } from 'react-icons/fa';
import { NextPageWithLayout } from './_app';
import Metatags from '@components/Metatags';

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
			<div className="flex min-h-screen flex-col items-center justify-center py-2">
				<div className="flex w-full flex-1 flex-col items-center justify-center px-5 text-center">
					<div className="flex items-center justify-center rounded bg-white shadow-xl">
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
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
