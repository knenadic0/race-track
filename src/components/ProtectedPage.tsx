import { loginRoute } from '@constants/routes';
import { useAuth } from '@contexts/auth';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect } from 'react';

const ProtectedPage = ({ children }: PropsWithChildren) => {
	const { user, isAuthenticating } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user && !isAuthenticating) {
			router.replace(loginRoute);
		}
	}, [user, isAuthenticating]);

	return <>{children}</>;
};

export default ProtectedPage;
