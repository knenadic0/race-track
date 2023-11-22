import Head from 'next/head';
import { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';
import Link from 'next/link';
import Layout from '../components/layout';

const Error: NextPageWithLayout = () => {
	return (
		// <div className="flex flex-col items-center justify-center py-2">
		<div className="mx-6 flex flex-col items-center justify-center py-2">
			<Head>
				<title>Error | RaceTrack</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="mt-16 flex flex-1 flex-col items-center justify-center bg-white text-center shadow-lg md:w-128">
				<div className="h-80 w-full bg-race-flag bg-cover bg-bt-180 bg-no-repeat p-4">
					<h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Page not found</h1>
					<p className="mt-6 text-base">Sorry, we couldn’t find the page you’re looking for.</p>
					<div className="mt-6">
						<Link
							href="/"
							className="mx-auto flex w-min items-center gap-x-3 rounded-md bg-rt-blue px-4 py-2 text-white hover:bg-rt-dark-blue"
						>
							Home
						</Link>
					</div>
				</div>
			</div>
		</div>
		// </div>
	);
};

Error.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default Error;
