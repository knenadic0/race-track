import Head from 'next/head';

export type MetaTagsProps = {
	title: string;
};

const Metatags = ({ title }: MetaTagsProps) => {
	const pageTitle = `${title} | RaceTrack`;
	return (
		<Head>
			<title>{pageTitle}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, shrink-to-fit=no" />
		</Head>
	);
};

export default Metatags;
