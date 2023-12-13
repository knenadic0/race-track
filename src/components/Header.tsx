import React, { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { HiBars3, HiOutlineUserCircle, HiXMark } from 'react-icons/hi2';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navigationLinks = [
	{ name: 'Races', href: '/races', current: false, main: true },
	{ name: 'Results', href: '/results', current: false, main: true },
	{ name: 'Championship', href: '/championship', current: false, main: true },
	{ name: 'Your profile', href: '/profile', current: false, main: false },
];

const Header = () => {
	const pathname = usePathname();
	const [navigation, setNavigation] = useState(navigationLinks);

	useEffect(() => {
		if (pathname) {
			setNavigation(
				navigationLinks.map((item) => {
					return {
						...item,
						current: pathname.startsWith(item.href),
					};
				}),
			);
		}
	}, [pathname]);

	return (
		<Disclosure as="nav" className="bg-white">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">
							<div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
								<Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rt-white">
									<span className="absolute -inset-0.5" />
									<span className="sr-only">Open main menu</span>
									{open ? (
										<HiXMark className="block h-6 w-6" aria-hidden="true" />
									) : (
										<HiBars3 className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
							<div className="flex h-full flex-1 items-center justify-start">
								<div className="flex flex-shrink-0 items-center">
									<Link href="/races">
										<Image src="/assets/images/logo.jpg" alt="Race flag" height={32} width={32} />
									</Link>
								</div>
								<div className="hidden h-full sm:ml-6 sm:block">
									<div className="flex h-full space-x-4">
										{navigation
											.filter((x) => x.main)
											.map((item) => (
												<Link
													key={item.name}
													href={item.href}
													className={classNames(
														item.current ? 'border-b-rt-blue' : ' border-b-rt-white hover:border-b-rt-gray',
														'flex items-center border-b-3 px-3 py-2 font-bold',
													)}
													aria-current={item.current ? 'page' : undefined}
												>
													{item.name}
												</Link>
											))}
									</div>
								</div>
							</div>
							<div className="hidden items-center sm:static sm:inset-auto sm:ml-6 sm:flex sm:pr-0">
								{navigation
									.filter((x) => !x.main)
									.map((item) => (
										<div key={item.name}>
											<Link
												className={classNames(
													'relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rt-white focus:ring-offset-2 focus:ring-offset-rt-black',
												)}
												href={item.href}
											>
												<span className="absolute -inset-1.5" />
												<HiOutlineUserCircle
													className={classNames('h-8 w-8', item.current ? 'stroke-rt-blue' : 'stroke-rt-black')}
												/>
											</Link>
										</div>
									))}
							</div>
						</div>
					</div>

					<Disclosure.Panel className="absolute z-40 w-full bg-white shadow-xl sm:hidden">
						<div className="pb-1">
							<hr />
							{navigation
								.filter((x) => x.main)
								.map((item) => (
									<Disclosure.Button
										key={item.name}
										as={Link}
										href={item.href}
										className={classNames(
											item.current ? 'border-l-rt-blue bg-rt-light-blue' : 'border-l-rt-white',
											'block border-l-4 px-4 py-3 text-base font-medium',
										)}
										aria-current={item.current ? 'page' : undefined}
									>
										{item.name}
									</Disclosure.Button>
								))}
							<hr />
							{navigation
								.filter((x) => !x.main)
								.map((item) => (
									<Disclosure.Button
										key={item.name}
										as={Link}
										href={item.href}
										className={classNames(
											item.current ? 'border-l-rt-blue bg-rt-light-blue' : 'border-l-rt-white',
											'block border-l-4 px-4 py-3 text-base font-medium',
										)}
										aria-current={item.current ? 'page' : undefined}
									>
										{item.name}
									</Disclosure.Button>
								))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
};

export default Header;
