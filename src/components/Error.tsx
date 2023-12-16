import Link from 'next/link';

type ErrorProps = {
	title: string;
	message: string;
	redirectUrl?: string;
	redirectTitle?: string;
};

const Error = ({ title, message, redirectUrl = '/', redirectTitle = 'Home' }: ErrorProps) => {
	return (
		<div className="main-container">
			<div className="card card-small sm:mt-16">
				<div className="h-80 w-full bg-race-flag bg-cover bg-bt-180 bg-no-repeat p-4">
					<h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
					<p className="mt-6 text-base">{message}</p>
					<div className="mt-6">
						<Link
							href={redirectUrl}
							className="mx-auto flex w-min items-center gap-x-3 rounded-md bg-rt-blue px-4 py-2 text-white hover:bg-rt-dark-blue"
						>
							{redirectTitle}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Error;
