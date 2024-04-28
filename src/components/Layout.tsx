import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import { Toaster } from 'react-hot-toast';
import Metatags, { MetaTagsProps } from './Metatags';
import { AuthProvider } from '@contexts/auth';

type LayoutProps = {
	children: ReactNode;
	metaData: MetaTagsProps;
};

const Layout = ({ children, metaData }: LayoutProps) => (
	<AuthProvider>
		<Metatags {...metaData} />
		<style global jsx>{`
			body {
				overflow-y: scroll;
			}
		`}</style>
		<div>
			<Toaster
				position="bottom-right"
				reverseOrder={false}
				toastOptions={{
					style: {
						borderRadius: '10px',
						background: '#333',
						color: '#fff',
					},
				}}
			/>
		</div>
		<Header />
		<main className="full-h-layout">{children}</main>
		<Footer />
	</AuthProvider>
);

export default Layout;
