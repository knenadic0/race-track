import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { rtBlue } from '@constants/tailwind';
import '/src/styles/globals.css';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);
	return getLayout(
		<>
			<NextNProgress height={4} startPosition={0.2} color={rtBlue} stopDelayMs={1} options={{ showSpinner: false }} />
			<Component {...pageProps} />
		</>,
	);
}
