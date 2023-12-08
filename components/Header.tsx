import React, { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
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
	{ name: 'Sign out', href: '/signout', current: false, main: false },
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
								{/* Mobile menu button*/}
								<Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
														item.current ? 'border-b-rt-blue' : ' border-b-white hover:border-b-gray-400',
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
								{/* Profile dropdown */}
								<Menu as="div" className="relative ml-3">
									<div>
										<Menu.Button className="relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
											<span className="absolute -inset-1.5" />
											<span className="sr-only">Open user menu</span>
											<HiOutlineUserCircle className="h-8 w-8" />
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											{navigation
												.filter((x) => !x.main)
												.map((item) => (
													<Menu.Item key={item.name}>
														<Link
															href={item.href}
															className={classNames(item.current ? 'bg-gray-100' : '', 'block px-4 py-2 ')}
														>
															{item.name}
														</Link>
													</Menu.Item>
												))}
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>

					<Disclosure.Panel className="absolute w-full bg-white shadow-xl sm:hidden">
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
											item.current ? 'border-l-rt-blue bg-blue-50' : 'border-l-white',
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
											item.current ? 'border-l-rt-blue bg-blue-50' : 'border-l-white',
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
	// <header className="flex h-16 items-center justify-center bg-white text-lg"></header>;
};

export default Header;
