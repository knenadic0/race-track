import { app } from '@adapters/firebase';
import { loginRoute } from '@constants/routes';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, User, getAuth, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/router';
import { createContext, useContext, PropsWithChildren } from 'react';

type AuthContextType = {
	user?: User | null;
	isAuthenticating: boolean;
	login: () => Promise<void>;
	logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
	user: null,
	isAuthenticating: true,
	login: async () => {},
	logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const auth = getAuth(app);
	const [user, loading] = useAuthState(auth);
	const router = useRouter();
	const provider = new GoogleAuthProvider();

	const login = async () => {
		signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				if (credential) {
					router.push('/');
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const logout = async () => {
		await auth.signOut();
		router.push(loginRoute);
	};

	return <AuthContext.Provider value={{ user, isAuthenticating: loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
