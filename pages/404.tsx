import { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';
import Layout from '@components/Layout';
import Error from '@components/Error';

const NotFound: NextPageWithLayout = () => {
	return <Error title="Page not found" message="Sorry, we couldn’t find the page you’re looking for." />;
};

NotFound.getLayout = function getLayout(page: ReactElement) {
	const metaData = {
		title: 'Not found',
	};
	return <Layout metaData={metaData}>{page}</Layout>;
};

export default NotFound;
