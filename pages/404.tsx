import { NextPageWithLayout } from './_app';
import { ReactElement } from 'react';
import Layout from '../components/Layout';
import Error from '../components/Error';

const NotFound: NextPageWithLayout = () => {
	return <Error title="Page not found" statusMessage="Not found" message="Sorry, we couldn’t find the page you’re looking for." />;
};

NotFound.getLayout = function getLayout(page: ReactElement) {
	return <Layout>{page}</Layout>;
};

export default NotFound;
